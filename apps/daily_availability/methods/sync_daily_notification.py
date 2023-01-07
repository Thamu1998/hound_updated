from config.common_functions.pull_request import get_data_spc, pull_cloud_reporting_data
from apps.system_configuration.models import api_details
from apps.spc_cld.models import system, tenant, system_business_type_decs
from apps.daily_availability.models import availability
from django.db.models import Q
import datetime
import time
import re
import json
from urllib import parse
from config.settings.base import Team
import pandas as pd

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/daily_notifiation_sync.log", __name__)
############### END Initiate logger #############################

class sync_notification_daily(object):

    def __init__(self, *args, **kwargs):
        super(sync_notification_daily, self).__init__()
        self.days = kwargs.get('days', 1)

    def convert_date(self, *args, **kwargs):
        
        if kwargs["date"] == None:
            return kwargs["date"]
        else: 
            s, ms = divmod(int("".join([dat for dat in re.findall(r'\d+', kwargs["date"])])), 1000)              
            return '%s.%03d' % (time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(s)), ms)

    def sync(self, *args, **kwargs):

        notification_api_detail = api_details.objects.get(unique_id='NOTIFICATION_PER') # Get data API details

        cr_notification_api_detail = api_details.objects.get(unique_id="CR_NOTIFICATION_API")

        if Team == "IBP":
            SYSTEM_TYPE = "IBP"
        else:
            SYSTEM_TYPE = "S4_HANA_MARKETING%2CS4_HANA_CLOUD"
        
        report_date = datetime.datetime.now() - datetime.timedelta(days=self.days)

        report_date = report_date.strftime("%Y%m%d")

        cr_notification_data = pull_cloud_reporting_data(url=cr_notification_api_detail.end_point.format(SYSTEM_TYPE=SYSTEM_TYPE,start_report_date=report_date, end_report_date=report_date), cert=cr_notification_api_detail.auth.auth, key=cr_notification_api_detail.auth.key) # Get total cld count to process
        
        system_role_list = [system_role for system_role in system.objects.exclude(Q(SystemRole__icontains="_SC")|Q(SystemRole__icontains="_HANA")).values_list('SystemRole', flat=True).distinct('SystemRole').order_by('SystemRole')]
        
        for system_role in system_role_list:
            
            report_date = str(datetime.datetime.today().date() - datetime.timedelta(days=self.days))
            
            odata_end_point = str(notification_api_detail.end_point.replace('domain_name', notification_api_detail.auth.http_address)).format(report_date=report_date, system_role=system_role, type='D')
            
            while odata_end_point:

                availability_data = get_data_spc(url=odata_end_point, auth=notification_api_detail.auth.auth)
                
                if not availability_data.status_code == 200:
                    log.error(availability_data.text)
                    raise Exception(availability_data.text)

                odata=json.loads(availability_data.text)

                self.save_data(odata=odata,cr_data=cr_notification_data)
                
                odata_end_point = odata['d'].get('__next', None)
                
                if odata_end_point:
                    hostname = parse.urlparse(odata_end_point).hostname
                    
                    odata_end_point = odata_end_point.replace(hostname, notification_api_detail.auth.http_address) 
                       
    def save_data(self, *args, **kwargs):

        for notification_odata in kwargs['odata']['d']['results']:
            
            cr_data = kwargs["cr_data"].loc[(kwargs["cr_data"]["System"].str.contains(notification_odata["SystemID"])) & (kwargs["cr_data"]["SPC Event Status"]!="Cancelled")]
            
            try:
                system_inst = system.objects.get(SystemNumber=notification_odata["SystemNumber"])
                BusinessType = system_inst.BusinessType.code       
            except Exception as e:
                BusinessType = "NA"

            try:
                tenant_inst = tenant.objects.get(SystemNumber=notification_odata["TenantID"])           
            except Exception as e:
                tenant_inst = None

            try:
                BusinessType = system_business_type_decs.objects.get(code=BusinessType)
            except Exception as e:
                BusinessType = ""
         
            try:
                availability.objects.update_or_create(ObjectID=notification_odata["ObjectID"], defaults={
                'AvailabilityInPercentage' : notification_odata["AvailabilityInPercentage"],
                'EndDateTime' : self.convert_date(date=notification_odata["EndDateTime"]),
                'StartDateTime' :  self.convert_date(date=notification_odata["StartDateTime"]),
                'BusinessType' : BusinessType,
                'SystemNumber' :  notification_odata["SystemNumber"],
                'TenantID' :  notification_odata["TenantID"],
                'LastChangeDateTime' : self.convert_date(date=notification_odata["LastChangeDateTime"]),
                'TotalAvailableMinutes' : notification_odata["TotalAvailableMinutes"],
                'TotalCommunicatedDowntimesInMinutes' : notification_odata["TotalCommunicatedDowntimesInMinutes"],
                'TotalExcludedCommunicatedDowntimesInMinutes' :  notification_odata["TotalExcludedCommunicatedDowntimesInMinutes"],
                'TotalExcludedDowntimesInMinutes' :  notification_odata["TotalExcludedDowntimesInMinutes"],
                'TotalPlannedAvailableMinutes' : notification_odata["TotalPlannedAvailableMinutes"],
                'TotalUnplannedCommunicatedDowntimesInMinutes' :  notification_odata["TotalUnplannedCommunicatedDowntimesInMinutes"],
                'SystemRole' : notification_odata["SystemRole"],
                'SystemLocation' :  notification_odata["SystemLocation"],
                'CRMCustomerID' : notification_odata["CRMCustomerID"], 
                'CustomerID' : 0 if notification_odata["CustomerID"] == '' else notification_odata["CustomerID"],
                'CustomerName' : notification_odata["CustomerName"], 
                'LifecycleStatus' :  notification_odata["LifecycleStatus"],
                'ExternalSystemID' : notification_odata["ExternalSystemID"], 
                'SystemID' :  notification_odata["SystemID"],
                'EventID' : None if len(cr_data) == 0 else cr_data['SPC Event Id'].values[0],
                'Category' : None if len(cr_data) == 0 else cr_data['Category'].values[0],
                'SubCategory' : None if len(cr_data) == 0 else cr_data['Sub-Category'].values[0],
                'OutageType' : None if len(cr_data) == 0 else cr_data['Outage Type'].values[0],
                'RCACategory' : None if len(cr_data) == 0 else cr_data['RCA Category'].values[0],
                'StartTime' : None if len(cr_data) == 0 else pd.to_datetime(cr_data['Start Time (UTC)'].values[0]),
                'EndTime' :  None if len(cr_data) == 0 else pd.to_datetime(cr_data['End Time (UTC)'].values[0]),
                'Reason' : None if len(cr_data) == 0 else cr_data['Reason'].values[0],
                'Description' : None if len(cr_data) == 0 else cr_data['Description'].values[0],
                'ProblemTicket' : None if len(cr_data) == 0 else cr_data['Problem Ticket Id'].values[0],
                })
                
            except Exception as e:
                log.error(str(e))


