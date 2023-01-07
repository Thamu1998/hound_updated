from config.common_functions.pull_request import pull_cloud_reporting_data
from apps.system_configuration.models import api_details
from apps.spc_cld.models import tenant
from config.settings.base import Team

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/tenant_allocation_sync.log", __name__)
############### END Initiate logger #############################

class sync_tenant_allocation_data(object):

    def __init__(self, *args, **kwargs):
        super(sync_tenant_allocation_data, self).__init__()

    def run(self, *args, **kwargs):

        tenant_allocation_api_detail = api_details.objects.get(unique_id="TENANT_AL_LIMIT") # Get count API details

        if Team == "IBP":
            SYSTEM_TYPE = "IBP_OD"
        else:
            SYSTEM_TYPE = "S4HANA%20OD"
        
        tenant_allocation_data = pull_cloud_reporting_data(url=tenant_allocation_api_detail.end_point.format(SYSTEM_TYPE=SYSTEM_TYPE), cert=tenant_allocation_api_detail.auth.auth, key=tenant_allocation_api_detail.auth.key) # Get total cld count to process
        
        self.update_allocation_data(data=tenant_allocation_data)

    def update_allocation_data(self, *args, **kwargs):

        for index, row in kwargs['data'].iterrows():
            
            try:
                tenant_inst = tenant.objects.get(TenantID=row["Tenant ID"], ExternalID="000")
                tenant_inst.AllocationLimit = row["Tenant System Allocation Limit  [GB]"]
                tenant_inst.memory = row["Memory [GB]"]
                tenant_inst.CPU = row["CPU"]
                tenant_inst.MaximumConcurrentCPU = row["Maximum Concurrent CPU"]
                tenant_inst.save()    
            except Exception as e:
                print(str(e))
