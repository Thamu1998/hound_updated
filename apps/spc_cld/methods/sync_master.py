from config.common_functions.pull_request import get_data_spc
from apps.system_configuration.models import api_details
from config.common_functions.app_parameter import CMPList
from apps.spc_cld import models
from django.db.models import Q, Count, Sum, Max
import math
import time
import re
import json
from urllib import parse
from config.common_functions.common_querys import get_all_system_role

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/spc_master_data.log", __name__)
############### END Initiate logger #############################


class sync_master_data(object):

    def __init__(self, *args, **kwargs):
        super(sync_master_data, self).__init__()

    def sync(self, *args, **kwargs):

        for API_DETAILS in [{'API_NAME':'CLD_SYS_ZHCODE_DESC', 'MODEL_NAME':'system_business_type_decs'}, {'API_NAME':'CLD_TEN_ZHCODE_DESC', 'MODEL_NAME':'tenant_business_type_decs'}, {'API_NAME':'CLD_DC_DESC', 'MODEL_NAME':'datacenter_decs'},{'API_NAME':'CLD_APP_DR', 'MODEL_NAME':'application_dr_type_collection_decs'},{'API_NAME':'CLD_APP_HA','MODEL_NAME':'application_ha_type_collection_decs'},{'API_NAME':'CLD_DB_DR', 'MODEL_NAME':'database_dr_type_collection_decs'},{'API_NAME':'CLD_DB_HA', 'MODEL_NAME':'database_ha_type_collection_decs'}, {'API_NAME':'NOTIFI_SUB_TYPE', 'MODEL_NAME':'notification_subtype'}, {'API_NAME':'NOTIFI_TYPE', 'MODEL_NAME':'notification_type'}, {'API_NAME':'SERVICE_STATUS', 'MODEL_NAME':'notification_service_status'}, {'API_NAME':'NOTIFI_STATUS', 'MODEL_NAME':'notification_status'},{'API_NAME':'NOTIFI_PHASE', 'MODEL_NAME':'notification_phase'}]:
            
            api_detail = api_details.objects.get(unique_id=API_DETAILS['API_NAME']) # Get data API details

            odata_end_point = str(api_detail.end_point)
                
            while odata_end_point:

                response_data = get_data_spc(url=odata_end_point.replace('domain_name', api_detail.auth.http_address), auth=api_detail.auth.auth)

                odata=json.loads(response_data.text)
                
                self.save_data(odata=odata, table_name=API_DETAILS['MODEL_NAME'])
                
                odata_end_point = odata['d'].get('__next', None)
                
                if odata_end_point:
                    hostname = parse.urlparse(odata_end_point).hostname
                    
                    odata_end_point = odata_end_point.replace(hostname, api_detail.auth.http_address) 
                                   
    def save_data(self, *args, **kwargs):

        notification_data = []

        model_name = getattr(models, kwargs["table_name"])
        
        for odata in kwargs['odata']['d']['results']:
         
            try:

                model_name.objects.update_or_create(code=odata["Code"], defaults={'description' : odata["Description"]})
                
            except Exception as e:
                log.error(str(e))

        model_name.objects.update_or_create(code="NA", defaults={'description' : "NA"})

    
    def match_infra_data(self, *args, **kwargs):

        is_s4_system = True if "S4_PC" in get_all_system_role() else False
        
        infra_name = {'CONV_CLOUD': 'Converged Cloud', 'GCP': 'Google Cloud', 'AZURE':'Azure', 'ALI_CLOUD':'Ali Cloud'}

        sys_queryset = models.system.objects.all()

        get_dc_list = sys_queryset.values_list('DataCenterID', flat=True).distinct("DataCenterID").order_by("DataCenterID")

        for dc in get_dc_list:
            
            infra = sys_queryset.filter(DataCenterID=dc).values_list("InfrastructureType", flat=True).exclude(InfrastructureType='').distinct("InfrastructureType").order_by("InfrastructureType")
            
            region_inst = sys_queryset.filter(DataCenterID=dc).exclude(Q(CMPTemplateID__icontains="_CLT")|Q(CMPTemplateID="")).values("CMPTemplateID", "CMPTime").order_by("CMPTemplateID").annotate(count=Count("CMPTemplateID"))
            
            if len(region_inst) > 0:
                region_inst = region_inst.latest('count')
                region = region_inst['CMPTemplateID'].split('_')[-1]
                cmp_id = region_inst['CMPTemplateID']
                cmp_time = region_inst['CMPTime']
            else:
                region = "NA"
                cmp_id = "NA"
                cmp_time = "NA"

            if len(infra) > 0:
                if is_s4_system:
                    models.datacenter_decs.objects.filter(code=dc).update(infra=infra_name.get(infra[0], "Unknown"), is_used=True, region=region, cmp_id=cmp_id, cmp_timing=cmp_time)
                else:
                    models.datacenter_decs.objects.filter(code=dc).update(infra=infra_name.get(infra[0], "Unknown"), is_used=True)

