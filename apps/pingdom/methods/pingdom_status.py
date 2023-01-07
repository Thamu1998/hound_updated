from config.common_functions.pull_request import get_data_pingdom
from apps.system_configuration.models import api_details
from apps.pingdom.models import pingdom_status, pingdom_status_temp
from apps.spc_cld.models import system, datacenter_decs
from config.common_functions.common_querys import get_all_system_role, get_application_system_role, get_database_system_role
import json
import time

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/pingdom_status.log", __name__)
############### END Initiate logger #############################


class sync_status(object):

    def __init__(self, *args, **kwargs):
        super(sync_status, self).__init__()

    def sync(self, *args, **kwargs):

        pingdom_api_detail = api_details.objects.get(unique_id='PINGDOM_API_3') # Get API details

        response = get_data_pingdom(url=pingdom_api_detail.end_point, auth=pingdom_api_detail.auth.auth) # Get status from Pingdom API
        
        if not response.status_code == 200:
            log.error(response.text)
            raise Exception(response.text) # On error exit 

        self.save_data_temp(data=json.loads(response.text)) # Save pingdom status
        
        self.drop_data() # drop all the data from pingdom_status table

        self.save_data(data=json.loads(response.text)) # Save pingdom status
        
        self.drop_data_temp() # drop all the data from pingdom_status_temp table

    def save_data(self, *args, **kwargs):

        check_list = pingdom_status_temp.objects.all()

        pingdom_status.objects.bulk_create(check_list, batch_size=500)

    def save_data_temp(self, *args, **kwargs):
        
        PingdomStatusData= []

        PingdomStatusHistoryData= []

        for CheckStatus in kwargs['data']['checks']:
            try:
                
                if any(True if SystemRol in CheckStatus['name'] else False for SystemRol in get_application_system_role()):

                    sid = CheckStatus.get("name","NA|NA|NA|NA|NA|NA").split("|")[4]
                    db  = CheckStatus.get("name","NA|NA|NA|NA|NA|NA").split("|")[1]
                    client = CheckStatus.get("name","NA|NA|NA|NA|NA|NA").split("|")[5]

                    try:
                        system_inst = system.objects.get(SID=sid, SystemRole__in=get_application_system_role(), LifeCycleStatus__in=['L', 'UPG'])
                    except Exception as e:
                        system_inst = None

                    try:
                        dc_inst = datacenter_decs.objects.get(code=db)
                    except Exception as e:
                        dc_inst = datacenter_decs.objects.get(code="NA")
                    
                    pingdomstatus = pingdom_status_temp()
                    pingdomstatus.id = CheckStatus["id"]
                    pingdomstatus.created = CheckStatus.get("created","NA")
                    pingdomstatus.name = CheckStatus.get("name","NA")
                    pingdomstatus.hostname = CheckStatus.get("hostname","NA")
                    pingdomstatus.resolution = CheckStatus.get("resolution",0)
                    pingdomstatus.system_info = system_inst
                    pingdomstatus.dc_info = dc_inst
                    pingdomstatus.SID = sid
                    pingdomstatus.DataCenter = db
                    pingdomstatus.client = client
                    pingdomstatus.verify_certificate = CheckStatus.get("verify_certificate",False)
                    pingdomstatus.lasterrortime = CheckStatus.get("lasterrortime",0)
                    pingdomstatus.lasttesttime = CheckStatus.get("lasttesttime",0)
                    pingdomstatus.lastresponsetime = CheckStatus.get("lastresponsetime",0)
                    pingdomstatus.status = CheckStatus.get("status","NA")
                    PingdomStatusData.append(pingdomstatus)
        
            except Exception as error:
                print(str(error))
        
        pingdom_status_temp.objects.bulk_create(PingdomStatusData, batch_size=500)

    def drop_data(self, *args,):

        pingdom_status.objects.all().delete()

    def drop_data_temp(self, *args,):

        pingdom_status_temp.objects.all().delete()