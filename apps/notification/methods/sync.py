from config.common_functions.pull_request import get_data_spc
from config.common_functions.common_querys import get_application_system_role
from apps.system_configuration.models import api_details
from apps.notification.models import notification_events, notification_tenant, notification_events_stage
from apps.spc_cld.models import system, tenant, notification_type, notification_subtype, notification_service_status, notification_status, notification_phase, tenant_business_type_decs
import math
import time
import re
import json
import datetime
from urllib import parse

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/spc_notification.log", __name__)
############### END Initiate logger #############################

class sync_notification(object):

    def __init__(self, *args, **kwargs):
        super(sync_notification, self).__init__()

    def convert_date(self, *args, **kwargs):
        
        if kwargs["date"] == None:
            return kwargs["date"]
        else: 
            s, ms = divmod(int("".join([dat for dat in re.findall(r'\d+', kwargs["date"])])), 1000)              
            return '%s.%03d' % (time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(s)), ms) 

    def run(self, *args, **kwargs):

        notification_api_detail = api_details.objects.get(unique_id='NOTIFICATION_API') # Get count API details

        starttime = datetime.datetime.now() - datetime.timedelta(days=kwargs["days"])

        endtime = datetime.datetime.now()

        starttime = starttime.strftime('%Y-%m-%dT%H:%M:%SZ')

        endtime = endtime.strftime('%Y-%m-%dT%H:%M:%SZ')

        systemRole = "%20or%20".join([f'substringof(%27{sys_role}%27,NotifcationEvent/SystemRoles)' for sys_role in get_application_system_role()])
        
        endpoint = notification_api_detail.end_point.format(systemroles=systemRole,starttime=starttime, endtime=endtime)

        while endpoint:

            response = get_data_spc(url=endpoint, auth=notification_api_detail.auth.auth)

            if response.status_code != 200:
                log.error(response.text)
                raise Exception(response.text)

            odata = json.loads(response.text)

            self.save_data(odata=odata)

            endpoint = odata['d'].get('__next', None)

            if endpoint:
                hostname = parse.urlparse(endpoint).hostname
                    
                endpoint = endpoint.replace(hostname, notification_api_detail.auth.http_address)

        return endpoint

    def save_data(self, *args, **kwargs):

        for data in kwargs['odata']['d']['results']:
            
            notification_events_inst = notification_events.objects.update_or_create(ObjectID=data['NotifcationEvent']['ObjectID'], defaults={
                                            'CreatedViaAPI' : data["NotifcationEvent"]["CreatedViaAPI"],
                                            'CurrentTemplateName' : data["NotifcationEvent"]["CurrentTemplateName"],
                                            'EventID' : data["NotifcationEvent"]["EventID"],
                                            'EndDate' : self.convert_date(date=data["NotifcationEvent"]["EndDate"]),
                                            'EndTime' : data["NotifcationEvent"]["EndTime"],
                                            'EventName' : data["NotifcationEvent"]["EventName"],
                                            'JiraTicket' : data["NotifcationEvent"]["JiraTicket"],
                                            'NTDBEmailStatus' : data["NotifcationEvent"]["NTDBEmailStatus"],
                                            'Phase' : self.get_notification_phase_inst(data["NotifcationEvent"]["Phase"]),
                                            'StartDate' : self.convert_date(date=data["NotifcationEvent"]["StartDate"]),
                                            'StartTime' : data["NotifcationEvent"]["StartTime"],
                                            'TestMode' : data["NotifcationEvent"]["TestMode"],
                                            'BundleID' : data["NotifcationEvent"]["BundleID"],
                                            'CreatedBy' : data["NotifcationEvent"]["CreatedBy"],
                                            'StartDateTime' : self.convert_date(date=data["NotifcationEvent"]["StartDateTime"]),
                                            'EndDateTime' : self.convert_date(date=data["NotifcationEvent"]["EndDateTime"]),
                                            'NotificationType' : self.get_notification_type_inst(data["NotifcationEvent"]["NotificationType"]),
                                            'Status' : self.get_notification_status_inst(data["NotifcationEvent"]["Status"]),
                                            'SystemRoles' : data["NotifcationEvent"]["SystemRoles"],
                                            'ServiceStatus' : self.get_notification_service_status_inst(data["NotifcationEvent"]["ServiceStatus"]),
                                            'CreationDateTime' : self.convert_date(date=data["NotifcationEvent"]["CreationDateTime"]),
                                            'DataCenters' : data["NotifcationEvent"]["DataCenters"],
                                            'IsStartTimeRevised' : data["NotifcationEvent"]["IsStartTimeRevised"],
                                            'IsSLARelevant' : data["NotifcationEvent"]["IsSLARelevant"],
                                            'IsServiceStatusRevised' : data["NotifcationEvent"]["IsServiceStatusRevised"],
                                            'IsEndTimeRevised' : data["NotifcationEvent"]["IsEndTimeRevised"],
                                        })

            event_tenant_type_list = []

            for tenant_data in data["NotifcationEvent"]["NTDBMailLogTenants"]:
                
                try:
                    tenant_inst = tenant.objects.get(TenantID=tenant_data["TenantID"])
                    CustomerName = tenant_inst.CustomerName
                    SystemNumber = tenant_inst.SystemNumber
                    SID = tenant_inst.SID.SID
                    DBSystemID = tenant_inst.DBSystemID
                    LifeCycleStatus = tenant_inst.SystemLifeCycleStatus
                    BusinessType = self.get_tenant_business_type(tenant_inst.SystemBusinessType)
                    SystemCMPTemplateID = tenant_inst.SystemCMPTemplateID
                    event_tenant_type_list.append(tenant_inst.SystemBusinessType.code)
                except Exception as e:
                    CustomerName = "UNKNOWN"
                    SystemNumber = "UNKNOWN"
                    SID = "UNKNOWN"
                    DBSystemID = "UNKNOWN"
                    LifeCycleStatus = "UNKNOWN"
                    BusinessType = None
                    SystemCMPTemplateID = "UNKNOWN"


                
                notification_tenant.objects.update_or_create(ParentObjectID=notification_events_inst[0], TenantID=tenant_data["TenantID"], defaults={
                                                            'CustomerID':tenant_data["CustomerID"],
                                                            'CustomerName':CustomerName,
                                                            'SystemNumber':SystemNumber,
                                                            'SID':SID,
                                                            'DBSystemID': DBSystemID,
                                                            'LifeCycleStatus':LifeCycleStatus,
                                                            'BusinessType':BusinessType,                                                        
                                                            'BLDSystemRoleCode':tenant_data["BLDSystemRoleCode"], 
                                                            'Status':tenant_data["Status"], 
                                                            'DataCenterID':tenant_data["DataCenterID"],
                                                            'SystemCMPTemplateID':SystemCMPTemplateID,
                                                            'TenantRole':tenant_data["TenantRole"]
                                                            })

            notification_events_stage.objects.update_or_create(ParentObjectID=notification_events_inst[0], NotificationID=data["NotificationID"], NotificationSubType=self.get_notification_subtype_inst(data["NotificationSubType"]), defaults={'SentToCustomerOn' : self.convert_date(date=data["SentToCustomerOn"]), 'EntityLastChangedOn' : self.convert_date(date=data["EntityLastChangedOn"])})

            isProd = bool(set(["ZH001", "ZH006"]).intersection(event_tenant_type_list))

            notification_events.objects.filter(ObjectID=data['NotifcationEvent']['ObjectID']).update(isProd=isProd)

    def get_notification_type_inst(self, code):
        try:
            get_instance = notification_type.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = notification_type.objects.get(code="NA")
            return get_instance

    def get_notification_subtype_inst(self, code):
        try:
            get_instance = notification_subtype.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = notification_subtype.objects.get(code="NA")
            return get_instance
    
    def get_notification_phase_inst(self, code):
        try:
            get_instance = notification_phase.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = notification_phase.objects.get(code="NA")
            return get_instance

    def get_notification_service_status_inst(self, code):
        try:
            get_instance = notification_service_status.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = notification_service_status.objects.get(code="NA")
            return get_instance

    def get_notification_status_inst(self, code):
        try:
            get_instance = notification_status.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = notification_status.objects.get(code="NA")
            return get_instance

    def get_tenant_business_type(self, code):
        try:
            get_instance = tenant_business_type_decs.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = tenant_business_type_decs.objects.get(code="NA")
            return get_instance