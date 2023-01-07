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

class action_required_data(object):

    def __init__(self):
        super(action_required_data, self).__init__()
    
    def get_data(self,**kwargs):

        final_data = []

        dc_mismatch_count = pingdom_status.objects.exclude(dc_info="NA").exclude(DataCenter=F('system_info__DataCenterID')).annotate(correct_dc=(F('system_info__DataCenterID'))).exclude(correct_dc=None).count()
        dc_mismatch = {'title': "Datacenter Mismatch", "count": dc_mismatch_count, "icon": '<span class="svg-icon svg-icon-white svg-icon-2hx"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.5 11H6.5C4 11 2 9 2 6.5C2 4 4 2 6.5 2H17.5C20 2 22 4 22 6.5C22 9 20 11 17.5 11ZM15 6.5C15 7.9 16.1 9 17.5 9C18.9 9 20 7.9 20 6.5C20 5.1 18.9 4 17.5 4C16.1 4 15 5.1 15 6.5Z" fill="black"/><path opacity="0.3" d="M17.5 22H6.5C4 22 2 20 2 17.5C2 15 4 13 6.5 13H17.5C20 13 22 15 22 17.5C22 20 20 22 17.5 22ZM4 17.5C4 18.9 5.1 20 6.5 20C7.9 20 9 18.9 9 17.5C9 16.1 7.9 15 6.5 15C5.1 15 4 16.1 4 17.5Z" fill="black"/></svg></span>'}
        if dc_mismatch_count != 0:
            final_data.append(dc_mismatch)

        return final_data
