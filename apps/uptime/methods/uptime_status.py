from config.common_functions.pull_request import get_data_uptime
from apps.system_configuration.models import api_details
from apps.uptime.models import uptime_status, uptime_cookies, uptime_status_temp
from apps.spc_cld.models import system, datacenter_decs
from config.common_functions.common_querys import get_all_system_role, get_application_system_role, get_database_system_role
import json
import requests

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/uptime_status.log", __name__)
############### END Initiate logger #############################

class sync_status(object):

    def __init__(self):
        super(sync_status, self).__init__()
        self.status = {'OK': 'up', 'FAILED':'down', 'FAILED_NO_RESPONSE': 'down', 'OFF':'paused'}
        self.cookies = '; '.join([cookie.cookie_name+'='+cookie.cookie_value for cookie in uptime_cookies.objects.all()])

    def sync(self, *args, **kwargs):

        uptime_api_detail = api_details.objects.get(unique_id='UPTIME_API') # Get API details

        response = get_data_uptime(url=uptime_api_detail.end_point, auth=uptime_api_detail.auth.auth, cookies=self.cookies) # Get status from Uptime API
        
        if not response.status_code == 200:
            log.error(response.text)
            raise Exception(response.text) # On error exit 
        
        self.save_data_temp(data=json.loads(response.text)) # Save uptime status
        
        self.drop_data() # drop all the data from uptime_status table

        self.save_data(data=json.loads(response.text)) # Save uptime status
        
        self.drop_data_temp() # drop all the data from uptime_status_temp table

    def save_data(self, *args, **kwargs):
        
        check_list = uptime_status_temp.objects.all()

        uptime_status.objects.bulk_create(check_list, batch_size=500)
    
    def save_data_temp(self, *args, **kwargs):
        
        UptimeStatusData= []

        UptimeStatusHistoryData= []

        for CheckStatus in kwargs['data']:
            try:
                
                if any(True if SystemRol in CheckStatus['monitor']['name'] else False for SystemRol in get_application_system_role()):

                    sid = CheckStatus['monitor'].get("name","NA|NA|NA|NA|NA|NA").split("|")[4]
                    db  = CheckStatus['monitor'].get("name","NA|NA|NA|NA|NA|NA").split("|")[1]
                    client = 100 if not CheckStatus['monitor'].get("name","NA|NA|NA|NA|NA|NA").split("|")[-1].isdigit() else CheckStatus['monitor'].get("name","NA|NA|NA|NA|NA|NA").split("|")[-1]
                    
                    try:
                        system_inst = system.objects.get(SID=sid, SystemRole__in=get_application_system_role(), LifeCycleStatus__in=['L', 'UPG'])
                    except Exception as e:
                        system_inst = None

                    try:
                        dc_inst = datacenter_decs.objects.get(code=db)
                    except Exception as e:
                        dc_inst = datacenter_decs.objects.get(code="NA")
         
                    pingdomstatus = uptime_status_temp()
                    pingdomstatus.id = CheckStatus['monitor']["id"]
                    pingdomstatus.created = CheckStatus['monitor'].get("createdAt","NA")
                    pingdomstatus.name = CheckStatus['monitor'].get("name","NA")
                    pingdomstatus.hostname = CheckStatus['monitor'].get("url","NA")
                    pingdomstatus.resolution = CheckStatus['monitor'].get("ioTimeout",0)
                    pingdomstatus.system_info = system_inst
                    pingdomstatus.dc_info = dc_inst
                    pingdomstatus.SID = sid
                    pingdomstatus.DataCenter = db
                    pingdomstatus.client = client
                    pingdomstatus.verify_certificate = CheckStatus['monitor'].get("insecureSSL",False)
                    pingdomstatus.lasterrortime = CheckStatus['uptime'].get("time",0)
                    pingdomstatus.lasttesttime = CheckStatus['uptime'].get("time",0)
                    pingdomstatus.lastresponsetime = CheckStatus['uptime'].get("averageResponseTime",0)
                    pingdomstatus.status = self.status.get(CheckStatus.get("currentStatus","NA"), "Unknown")
                    UptimeStatusData.append(pingdomstatus)
        
            except Exception as error:
                print(str(error))
        
        uptime_status_temp.objects.bulk_create(UptimeStatusData, batch_size=500)

    def drop_data(self, *args,):

        uptime_status.objects.all().delete()

    def drop_data_temp(self, *args,):

        uptime_status_temp.objects.all().delete()



        
