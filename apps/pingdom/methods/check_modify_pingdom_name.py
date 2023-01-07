from apps.spc_cld.models import *
from apps.system_configuration.models import api_details
from apps.pingdom.models import *
from django.db.models import F
from django.db.models.functions import Concat
from config.common_functions.pull_request import put_data_pingdom
import datetime
import requests
import json

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/pingdom_name_change.log", __name__)
############### END Initiate logger #############################

class check_modify_pingdom_name(object):

    def __init__(self):
        super(check_modify_pingdom_name, self).__init__()
        self.pingdom_api_detail = api_details.objects.get(unique_id='PINGDOM_API_3')

    def modify_check_name(self,**kwargs):
         
        payload = 'name={0}'.format(kwargs['check_name'])

        response = put_data_pingdom(url=self.pingdom_api_detail.end_point +"/"+kwargs['check_id'], auth=self.pingdom_api_detail.auth.auth, payload=payload)
        
        if response.status_code != 200:
            log.error(json.loads(response.text.encode('utf8'))['error']['errormessage'])
            
            raise Exception(json.loads(response.text.encode('utf8'))['error']['errormessage'])
        else:
            return "Modification of check ID - {0} was successful!".format(kwargs['check_id'])

    
    def check_pingdom_name(self,**kwargs):

        name_change_list = pingdom_status.objects.values('name').exclude(dc_info="NA").exclude(DataCenter=F('system_info__DataCenterID')).annotate(correct_dc=(F('system_info__DataCenterID'))).exclude(correct_dc=None)

        return name_change_list
