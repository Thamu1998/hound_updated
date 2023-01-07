from config.common_functions.pull_request import get_data_spc
from apps.system_configuration.models import api_details
from config.common_functions.app_parameter import CMPList
from apps.spc_cld.models import system, host, tenant, system_business_type_decs, tenant_business_type_decs, datacenter_decs, application_dr_type_collection_decs, application_ha_type_collection_decs, database_dr_type_collection_decs, database_ha_type_collection_decs
import math
import time
import re
import json

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/spc_cld.log", __name__)
############### END Initiate logger #############################

class sync_cld_data(object):

    def __init__(self, *args, **kwargs):
        super(sync_cld_data, self).__init__()

    def run(self, *args, **kwargs):

        spc_cld_count_api_detail = api_details.objects.get(unique_id=kwargs['cld_type']+'_COUNT') # Get count API details

        cld_count_response = get_data_spc(url=spc_cld_count_api_detail.end_point.replace('domain_name', spc_cld_count_api_detail.auth.http_address), auth=spc_cld_count_api_detail.auth.auth) # Get total cld count to process
        
        if not cld_count_response.status_code == 200:

            raise Exception(cld_count_response.text)
        
        self.wipe_out_data(kwargs['cld_type']) # Delete CLD data from Database 

        loop_count = int(math.ceil(int(cld_count_response.text)/1000)) # Divide the total count by 1000 and round up the value to get the loop count

        spc_cld_data_api_detail = api_details.objects.get(unique_id=kwargs['cld_type']+'_DATA') # Get data API details

        for skip_count in range(0, loop_count): # Loop the loop_count to get the complete data.
            
            odata_end_point = str(spc_cld_data_api_detail.end_point.replace('domain_name', spc_cld_count_api_detail.auth.http_address)).format(skip_count*1000)

            cld_data_response = get_data_spc(url=odata_end_point, auth=spc_cld_data_api_detail.auth.auth) # Get odata from spc
            
            if not cld_data_response.status_code == 200:
                log.error(cld_data_response.text)
                raise Exception(cld_data_response.text)

            if kwargs['cld_type'] == "CLD_SYSTEM":
                
                self.save_data_system(odata=json.loads(cld_data_response.text)) # Send system odata to save to DB

            if kwargs['cld_type'] == "CLD_HOST":
                
                self.save_data_host(odata=json.loads(cld_data_response.text)) # Send host odata to save to DB

            if kwargs['cld_type'] == "CLD_TENANT":
                
                self.save_data_tenant(odata=json.loads(cld_data_response.text)) # Send tenant odata to save to DB

    def convert_date(self, *args, **kwargs):
        
        if kwargs["date"] == None:
            return kwargs["date"]
        else: 
            s, ms = divmod(int("".join([dat for dat in re.findall(r'\d+', kwargs["date"])])), 1000)              
            return '%s.%03d' % (time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(s)), ms)             

    def save_data_system(self, *args, **kwargs):

        system_cld_data = []

        for cld_odata in kwargs['odata']['d']['results']:
            try:
                LeadingProductVersionNumber = 0 if re.search('[a-zA-Z]', cld_odata["LeadingProductVersionNumber"]) else cld_odata["LeadingProductVersionNumber"]
                LeadingProductSupportPackage = 0 if re.search('[a-zA-Z]', cld_odata["LeadingProductSupportPackage"]) else cld_odata["LeadingProductSupportPackage"]
                LeadingProductPatchVersion = 0 if re.search('[a-zA-Z]', cld_odata["LeadingProductPatchVersion"]) else cld_odata["LeadingProductPatchVersion"]
                
                cld_spc_system = system()
                cld_spc_system.SID	= cld_odata["ID"]
                cld_spc_system.SystemNumber	= cld_odata["SystemNumber"]
                cld_spc_system.SystemRole	= cld_odata["SystemRole"]
                cld_spc_system.DataCenterID	= self.get_datacenter(cld_odata["DataCenterID"])
                cld_spc_system.LifeCycleStatus	= cld_odata["LifeCycleStatus"]
                cld_spc_system.NetworkSegmentID	= cld_odata["NetworkSegmentID"]
                cld_spc_system.LeadingProductPPMS	= cld_odata["LeadingProductPPMS"]
                cld_spc_system.LeadingProductVersionPPMS	= cld_odata["LeadingProductVersionPPMS"]
                cld_spc_system.HasSharedDBTenant	= cld_odata["HasSharedDBTenant"]
                cld_spc_system.ExternalD	= cld_odata["ExternalD"]
                cld_spc_system.EUAccess	= cld_odata["EUAccess"]
                cld_spc_system.DatabaseHostFQDN	= cld_odata["DatabaseHostFQDN"]
                cld_spc_system.DatabaseHost	= cld_odata["DatabaseHost"]
                cld_spc_system.BusinessType	= self.get_system_business_type(cld_odata["BusinessType"])
                cld_spc_system.WebdispatcherFarmName	= cld_odata["WebdispatcherFarmName"]
                cld_spc_system.ApplicationHost	= cld_odata["ApplicationHost"]
                cld_spc_system.ApplicationHostFQDN	= cld_odata["ApplicationHostFQDN"]
                cld_spc_system.LeadingProductName	= cld_odata["LeadingProductName"]
                cld_spc_system.LeadingProductPatchVersion	= 0 if LeadingProductVersionNumber == '' else LeadingProductVersionNumber.replace(".","")+LeadingProductSupportPackage.replace(".","")+LeadingProductPatchVersion
                cld_spc_system.LeadingProductSoftwareType	= cld_odata["LeadingProductSoftwareType"]
                cld_spc_system.LeadingProductSupportPackage	= 0 if LeadingProductVersionNumber == '' else LeadingProductVersionNumber.replace(".","")+LeadingProductSupportPackage
                cld_spc_system.LeadingProductVersionNumber	= 0 if LeadingProductVersionNumber == '' else LeadingProductVersionNumber.replace(".","")
                cld_spc_system.DBSystemID	= cld_odata["ID"] if "HANA" in cld_odata["SystemRole"] else cld_odata["DBSystemID"]
                cld_spc_system.CMPTemplateID	= cld_odata["CMPTemplateID"]
                cld_spc_system.CMPTime = CMPList.get(cld_odata["CMPTemplateID"],"NA")
                cld_spc_system.InfrastructureProvider	= cld_odata["InfrastructureProvider"]
                cld_spc_system.CustomerID	= "11110000" if cld_odata["BusinessType"] == 'ZH005' else cld_odata["CustomerID"]
                cld_spc_system.CustomerName	= "Upgrade Test System" if cld_odata["BusinessType"] == 'ZH005' else cld_odata["CustomerName"]
                cld_spc_system.InfrastructureType = cld_odata["InfrastructureType"]
                cld_spc_system.CustomerTenantMainURL = cld_odata["CustomerTenantMainURL"]
                cld_spc_system.DRActiveSystem = cld_odata["DRActiveSystem"]
                cld_spc_system.DRSystemType = cld_odata["DRSystemType"]
                cld_spc_system.DRSystemNumber = cld_odata["DRSystemNumber"]
                cld_spc_system.ApplicationDRType = self.get_application_dr_type_collection(cld_odata["ApplicationDRType"])
                cld_spc_system.DataBaseDRType = self.get_database_dr_type_collection(cld_odata["DataBaseDRType"])
                cld_spc_system.HAActiveSystem = cld_odata["HAActiveSystem"]
                cld_spc_system.HASystemType = cld_odata["HASystemType"]
                cld_spc_system.HASystemNumber = cld_odata["HASystemNumber"]
                cld_spc_system.ApplicationHAType = self.get_application_ha_type_collection(cld_odata["ApplicationHAType"])
                cld_spc_system.DataBaseHAType = self.get_database_ha_type_collection(cld_odata["DataBaseHAType"])
                cld_spc_system.CreationDateTime = self.convert_date(date=cld_odata["CreationDateTime"])
                cld_spc_system.EntityLastChangedOn	= self.convert_date(date=cld_odata["EntityLastChangedOn"])
                system_cld_data.append(cld_spc_system)
            except Exception as e:
                log.error(cld_odata)
                log.error(str(e))

        #Bulk insert CLD data
        system.objects.bulk_create(system_cld_data, batch_size=500)

    def save_data_tenant(self, *args, **kwargs):

        host_cld_data = []

        for cld_odata in kwargs['odata']['d']['results']:
            
            try:
                system_inst = system.objects.get(SystemNumber=cld_odata["SystemNumber"])           
            except Exception as e:
                system_inst = None

            try:
                PatchVersion = 0 if re.search('[a-zA-Z]', cld_odata["PatchVersion"]) else cld_odata["PatchVersion"]
                SupportPackage = 0 if re.search('[a-zA-Z]', cld_odata["SupportPackage"]) else cld_odata["SupportPackage"]
                VersionNumber = 0 if re.search('[a-zA-Z]', cld_odata["VersionNumber"]) else cld_odata["VersionNumber"]

                cld_spc_tenant = tenant()
                cld_spc_tenant.ObjectID = cld_odata["ObjectID"]
                cld_spc_tenant.SID = system_inst
                cld_spc_tenant.SystemNumber = cld_odata["SystemNumber"]
                cld_spc_tenant.TenantID = cld_odata["TenantID"]
                cld_spc_tenant.SystemRole = cld_odata["SystemRole"]
                cld_spc_tenant.TenantBusinessType = self.get_tenant_business_type(cld_odata["TenantBusinessType"])
                cld_spc_tenant.ExternalID = cld_odata["ExternalID"]
                cld_spc_tenant.SystemLifeCycleStatus = cld_odata["SystemLifeCycleStatus"]
                cld_spc_tenant.EUDataProtectionIndicator = cld_odata["EUDataProtectionIndicator"]
                cld_spc_tenant.NetworkSegmentID = cld_odata["NetworkSegmentID"]
                cld_spc_tenant.SystemLocation = self.get_datacenter(cld_odata["SystemLocation"])
                cld_spc_tenant.VersionNumber = 0 if PatchVersion == '' else PatchVersion.replace(".","")+SupportPackage.replace(".","")+VersionNumber.replace(".","")
                cld_spc_tenant.SupportPackage = 0 if PatchVersion == '' else PatchVersion.replace(".","")+SupportPackage.replace(".","")
                cld_spc_tenant.PatchVersion = 0 if PatchVersion == '' else PatchVersion.replace(".","")
                cld_spc_tenant.MainURL = cld_odata["MainURL"]
                cld_spc_tenant.HasSharedDBTenant = cld_odata["HasSharedDBTenant"]
                cld_spc_tenant.CustomerID = cld_odata["CustomerID"]
                cld_spc_tenant.CustomerName = cld_odata["CustomerName"]
                cld_spc_tenant.DBSystemID = cld_odata["DBSystemID"]
                cld_spc_tenant.SystemBusinessType = self.get_system_business_type(cld_odata["SystemBusinessType"])
                cld_spc_tenant.SystemDBHostFQDN = cld_odata["SystemDBHostFQDN"]
                cld_spc_tenant.SystemWebdispatcherFarmName = cld_odata["SystemWebdispatcherFarmName"]
                cld_spc_tenant.SystemCMPTemplateID = cld_odata["SystemCMPTemplateID"]
                cld_spc_tenant.SystemInfrastructureType = cld_odata["SystemInfrastructureType"]
                host_cld_data.append(cld_spc_tenant)
            except Exception as e:
                log.error(str(e))
        
        #Bulk insert CLD data
        tenant.objects.bulk_create(host_cld_data, batch_size=500)

    def save_data_host(self, *args, **kwargs):

        host_cld_data = []

        for cld_odata in kwargs['odata']['d']['results']:
            
            try:
                system_inst = system.objects.get(SystemNumber=cld_odata["SystemNumber"])    
                LifeCycleStatus = system_inst.LifeCycleStatus       
            except Exception as e:
                system_inst = None
                LifeCycleStatus = "D"

            try:
                cld_spc_host = host()
                cld_spc_host.InstanceType = cld_odata["InstanceType"]
                cld_spc_host.InstanceNumber = cld_odata["InstanceNumber"]
                cld_spc_host.InstanceName = cld_odata["InstanceName"]
                cld_spc_host.HostName = cld_odata["ComputerSystem"]
                cld_spc_host.SID = system_inst
                cld_spc_host.LifeCycleStatus = LifeCycleStatus
                cld_spc_host.SystemID = cld_odata["SystemID"]
                cld_spc_host.SystemNumber = cld_odata["SystemNumber"]
                cld_spc_host.CPUCount = cld_odata["ComputerSystemCPUCount"]
                cld_spc_host.SystemMemory = cld_odata["ComputerSystemMemory"]
                cld_spc_host.SystemOSName = cld_odata["ComputerSystemOSName"]
                cld_spc_host.SystemOSRelease = cld_odata["ComputerSystemOSRelease"]
                cld_spc_host.SystemOSType = cld_odata["ComputerSystemOSType"]
                cld_spc_host.SystemOSVersion = cld_odata["ComputerSystemOSVersion"]
                cld_spc_host.SystemType = cld_odata["ComputerSystemType"]
                cld_spc_host.SystemExternalStatus = cld_odata["ComputerSystemExternalStatus"]
                cld_spc_host.SystemHypervisor = cld_odata["ComputerSystemHypervisor"]
                cld_spc_host.SystemHypervisorServerName = cld_odata["ComputerSystemHypervisorServerName"]
                cld_spc_host.ComputerSystemPool = cld_odata["ComputerSystemPool"]
                cld_spc_host.ComputerSystemResourcePool = cld_odata["ComputerSystemResourcePool"]
                cld_spc_host.ComputerSystemUsageArea = cld_odata["ComputerSystemUsageArea"]
                cld_spc_host.ComputerSystemDataCenterID = self.get_datacenter(cld_odata["ComputerSystemDataCenterID"])
                cld_spc_host.ComputerSystemCreationDateTime = self.convert_date(date=cld_odata["ComputerSystemCreationDateTime"])
                cld_spc_host.ComputerSystemLastChangeDateTime = self.convert_date(date=cld_odata["ComputerSystemLastChangeDateTime"])
                cld_spc_host.ComputerSystemVMFlavor = cld_odata.get("ComputerSystemVMFlavor", "NA")
                host_cld_data.append(cld_spc_host)
            except Exception as e:
                log.error(str(e))

        #Bulk insert CLD data
        host.objects.bulk_create(host_cld_data, batch_size=500)

    def wipe_out_data(self, cld_type):

        if cld_type == "CLD_SYSTEM":
            host.objects.all().delete()
            tenant.objects.all().delete()
            system.objects.all().delete()
        
        if cld_type == "CLD_HOST":
            host.objects.all().delete()

        if cld_type == "CLD_TENANT":
            tenant.objects.all().delete()
    
    def get_system_business_type(self, code):
        try:
            get_instance = system_business_type_decs.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = system_business_type_decs.objects.get(code="NA")
            return get_instance

    def get_tenant_business_type(self, code):
        try:
            get_instance = tenant_business_type_decs.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = tenant_business_type_decs.objects.get(code="NA")
            return get_instance

    def get_datacenter(self, code):
        try:
            get_instance = datacenter_decs.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = datacenter_decs.objects.get(code="NA")
            return get_instance

    def get_application_dr_type_collection(self, code):
        try:
            get_instance = application_dr_type_collection_decs.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = application_dr_type_collection_decs.objects.get(code="NA")
            return get_instance

    def get_application_ha_type_collection(self, code):
        try:
            get_instance = application_ha_type_collection_decs.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = application_ha_type_collection_decs.objects.get(code="NA")
            return get_instance
    
    def get_database_dr_type_collection(self, code):
        try:
            get_instance = database_dr_type_collection_decs.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = database_dr_type_collection_decs.objects.get(code="NA")
            return get_instance

    def get_database_ha_type_collection(self, code):
        try:
            get_instance = database_ha_type_collection_decs.objects.get(code=code)
            return get_instance
        except Exception as e:
            get_instance = database_ha_type_collection_decs.objects.get(code="NA")
            return get_instance
