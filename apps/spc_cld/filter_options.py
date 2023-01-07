from .models import system, host, tenant, datacenter_decs

def options_system_cld(**kwargs):

    model_filter = kwargs['model_filter']
    model_exclude = kwargs['model_exclude']

    context = {}

    context["system_status"] = [STATUS[0] for STATUS in system.objects.values_list("LifeCycleStatus").filter(model_filter).exclude(model_exclude).order_by('LifeCycleStatus').distinct("LifeCycleStatus")]
    context["system_role"] = [SystemRole[0] for SystemRole in system.objects.values_list("SystemRole").filter(model_filter).exclude(model_exclude).order_by('SystemRole').distinct("SystemRole")]
    context["business_type"] = [{"code":ZHCODE[0],"description":ZHCODE[1]} for ZHCODE in system.objects.values_list("BusinessType", "BusinessType__description").filter(model_filter).exclude(model_exclude).order_by('BusinessType').distinct("BusinessType") if not ZHCODE[0] == ""]
    context["data_center"] = [{"code":SYSLOC[0],"description":SYSLOC[1]} for SYSLOC in system.objects.values_list("DataCenterID", "DataCenterID__description").filter(model_filter).exclude(model_exclude).order_by('DataCenterID').distinct("DataCenterID") if not SYSLOC[0] == ""]
    context["network_segment"] = [NetworkSegmentID[0] for NetworkSegmentID in system.objects.values_list("NetworkSegmentID").filter(model_filter).exclude(model_exclude).order_by('NetworkSegmentID').distinct("NetworkSegmentID") if not NetworkSegmentID[0] == ""]
    context["product_ppms"] = [LeadingProductPPMS[0] for LeadingProductPPMS in system.objects.values_list("LeadingProductPPMS").filter(model_filter).exclude(model_exclude).order_by('LeadingProductPPMS').distinct("LeadingProductPPMS") if not LeadingProductPPMS[0] == ""]
    context["product_version_ppms"] = [LeadingProductVersionPPMS[0] for LeadingProductVersionPPMS in system.objects.values_list("LeadingProductVersionPPMS").filter(model_filter).exclude(model_exclude).order_by('LeadingProductVersionPPMS').distinct("LeadingProductVersionPPMS") if not LeadingProductVersionPPMS[0] == ""]
    context["webdispatcher"] = [WebdispatcherFarmName[0] for WebdispatcherFarmName in system.objects.values_list("WebdispatcherFarmName").filter(model_filter).exclude(model_exclude).order_by('WebdispatcherFarmName').distinct("WebdispatcherFarmName") if not WebdispatcherFarmName[0] == ""]
    context["product_name"] = [LeadingProductName[0] for LeadingProductName in system.objects.values_list("LeadingProductName").filter(model_filter).exclude(model_exclude).order_by('LeadingProductName').distinct("LeadingProductName") if not LeadingProductName[0] == ""]
    context["patch_version"] = [LeadingProductPatchVersion[0] for LeadingProductPatchVersion in system.objects.values_list("LeadingProductPatchVersion").filter(model_filter).exclude(model_exclude).order_by('LeadingProductPatchVersion').distinct("LeadingProductPatchVersion") if not LeadingProductPatchVersion[0] == ""]
    context["support_package"] = [LeadingProductSupportPackage[0] for LeadingProductSupportPackage in system.objects.values_list("LeadingProductSupportPackage").filter(model_filter).exclude(model_exclude).order_by('LeadingProductSupportPackage').distinct("LeadingProductSupportPackage") if not LeadingProductSupportPackage[0] == ""]
    context["version_number"] = [LeadingProductVersionNumber[0] for LeadingProductVersionNumber in system.objects.values_list("LeadingProductVersionNumber").filter(model_filter).exclude(model_exclude).order_by('LeadingProductVersionNumber').distinct("LeadingProductVersionNumber") if not LeadingProductVersionNumber[0] == ""]
    context["cmp_template"] = [CMPTemplateID[0] for CMPTemplateID in system.objects.values_list("CMPTemplateID").filter(model_filter).exclude(model_exclude).order_by('CMPTemplateID').distinct("CMPTemplateID") if not CMPTemplateID[0] == ""]
    context["infra_type"] = [INFRA[0] for INFRA in system.objects.values_list("InfrastructureType").filter(model_filter).exclude(model_exclude).order_by('InfrastructureType').distinct("InfrastructureType") if not INFRA[0] == ""]
    context['DRSystemType'] = [DRSystemType[0] for DRSystemType in system.objects.values_list("DRSystemType").filter(model_filter).exclude(model_exclude).order_by('DRSystemType').distinct("DRSystemType")]
    context['ApplicationDRType'] = [{"code":ApplicationDRType[0],"description":ApplicationDRType[1]} for ApplicationDRType in system.objects.values_list("ApplicationDRType", "ApplicationDRType__description").filter(model_filter).exclude(model_exclude).order_by('ApplicationDRType').distinct("ApplicationDRType")]
    context['DataBaseDRType'] = [{"code":DataBaseDRType[0],"description":DataBaseDRType[1]} for DataBaseDRType in system.objects.values_list("DataBaseDRType", "DataBaseDRType__description").filter(model_filter).exclude(model_exclude).order_by('DataBaseDRType').distinct("DataBaseDRType")]
    context['HASystemType'] = [HASystemType[0] for HASystemType in system.objects.values_list("HASystemType").filter(model_filter).exclude(model_exclude).order_by('HASystemType').distinct("HASystemType")]
    context['ApplicationHAType'] = [{"code":ApplicationHAType[0],"description":ApplicationHAType[1]} for ApplicationHAType in system.objects.values_list("ApplicationHAType", "ApplicationHAType__description").filter(model_filter).exclude(model_exclude).order_by('ApplicationHAType').distinct("ApplicationHAType")]
    context['DataBaseHAType'] = [{"code":DataBaseHAType[0],"description":DataBaseHAType[1]} for DataBaseHAType in system.objects.values_list("DataBaseHAType", "DataBaseHAType__description").filter(model_filter).exclude(model_exclude).order_by('DataBaseHAType').distinct("DataBaseHAType")]

    return context


def options_tenant_cld(**kwargs):

    model_filter = kwargs['model_filter']
    model_exclude = kwargs['model_exclude']

    context = {}

    context["system_status"] = [STATUS[0] for STATUS in tenant.objects.values_list("SystemLifeCycleStatus").filter(model_filter).exclude(model_exclude).order_by('SystemLifeCycleStatus').distinct("SystemLifeCycleStatus")]
    context["external_id"] = [ExternalID[0] for ExternalID in tenant.objects.values_list("ExternalID").filter(model_filter).exclude(model_exclude).order_by('ExternalID').distinct("ExternalID")]
    context["system_role"] = [SystemRole[0] for SystemRole in tenant.objects.values_list("SystemRole").filter(model_filter).exclude(model_exclude).order_by('SystemRole').distinct("SystemRole")]
    context["business_type"] = [{"code":ZHCODE[0],"description":ZHCODE[1]} for ZHCODE in tenant.objects.values_list("TenantBusinessType", "TenantBusinessType__description").filter(model_filter).exclude(model_exclude).order_by('TenantBusinessType').distinct("TenantBusinessType") if not ZHCODE[0] == ""]
    context["system_business_type"] = [{"code":ZHCODE[0],"description":ZHCODE[1]} for ZHCODE in tenant.objects.values_list("SystemBusinessType", "SystemBusinessType__description").filter(model_filter).exclude(model_exclude).order_by('SystemBusinessType').distinct("SystemBusinessType") if not ZHCODE[0] == ""]
    context["data_center"] = [{"code":SYSLOC[0],"description":SYSLOC[1]} for SYSLOC in tenant.objects.values_list("SystemLocation", "SystemLocation__description").filter(model_filter).exclude(model_exclude).order_by('SystemLocation').distinct("SystemLocation") if not SYSLOC[0] == ""]
    context["network_segment"] = [NetworkSegmentID[0] for NetworkSegmentID in tenant.objects.values_list("NetworkSegmentID").filter(model_filter).exclude(model_exclude).order_by('NetworkSegmentID').distinct("NetworkSegmentID") if not NetworkSegmentID[0] == ""]
    context["webdispatcher"] = [WebdispatcherFarmName[0] for WebdispatcherFarmName in tenant.objects.values_list("SystemWebdispatcherFarmName").filter(model_filter).exclude(model_exclude).order_by('SystemWebdispatcherFarmName').distinct("SystemWebdispatcherFarmName") if not WebdispatcherFarmName[0] == ""]
    context["patch_version"] = [LeadingProductPatchVersion[0] for LeadingProductPatchVersion in tenant.objects.values_list("PatchVersion").filter(model_filter).exclude(model_exclude).order_by('PatchVersion').distinct("PatchVersion") if not LeadingProductPatchVersion[0] == ""]
    context["support_package"] = [LeadingProductSupportPackage[0] for LeadingProductSupportPackage in tenant.objects.values_list("SupportPackage").filter(model_filter).exclude(model_exclude).order_by('SupportPackage').distinct("SupportPackage") if not LeadingProductSupportPackage[0] == ""]
    context["version_number"] = [LeadingProductVersionNumber[0] for LeadingProductVersionNumber in tenant.objects.values_list("VersionNumber").filter(model_filter).exclude(model_exclude).order_by('VersionNumber').distinct("VersionNumber") if not LeadingProductVersionNumber[0] == ""]
    context["cmp_template"] = [CMPTemplateID[0] for CMPTemplateID in tenant.objects.values_list("SystemCMPTemplateID").filter(model_filter).exclude(model_exclude).order_by('SystemCMPTemplateID').distinct("SystemCMPTemplateID") if not CMPTemplateID[0] == ""]
    context["infra_type"] = [INFRA[0] for INFRA in tenant.objects.values_list("SystemInfrastructureType").filter(model_filter).exclude(model_exclude).order_by('SystemInfrastructureType').distinct("SystemInfrastructureType") if not INFRA[0] == ""]

    return context


def options_datacenter_decs(**kwargs):

    model_filter = kwargs['model_filter']
    model_exclude = kwargs['model_exclude']

    context = {}

    context["infra"] = [infra[0] for infra in datacenter_decs.objects.values_list("infra").filter(model_filter).exclude(model_exclude).order_by('infra').distinct("infra")]
    context["region"] = [region[0] for region in datacenter_decs.objects.values_list("region").filter(model_filter).exclude(model_exclude).order_by('region').distinct("region")]
    context["cmp_id"] = [cmp_id[0] for cmp_id in datacenter_decs.objects.values_list("cmp_id").filter(model_filter).exclude(model_exclude).order_by('cmp_id').distinct("cmp_id")]
    context["cmp_timing"] = [cmp_timing[0] for cmp_timing in datacenter_decs.objects.values_list("cmp_timing").filter(model_filter).exclude(model_exclude).order_by('cmp_timing').distinct("cmp_timing")]

    return context


def options_host_cld(**kwargs):

    model_filter = kwargs['model_filter']
    model_exclude = kwargs['model_exclude']

    context = {}

    context["system_status"] = [STATUS[0] for STATUS in host.objects.values_list("SID__LifeCycleStatus").filter(model_filter).exclude(model_exclude).order_by('LifeCycleStatus').distinct("LifeCycleStatus") ]
    context["system_role"] = [SystemRole[0] for SystemRole in host.objects.values_list("SID__SystemRole").filter(model_filter).exclude(model_exclude).order_by('SID__SystemRole').distinct("SID__SystemRole")]
    context["business_type"] = [{"code":ZHCODE[0],"description":ZHCODE[1]} for ZHCODE in host.objects.values_list("SID__BusinessType", "SID__BusinessType__description").filter(model_filter).exclude(model_exclude).order_by('SID__BusinessType').distinct("SID__BusinessType") if not ZHCODE[0] == ""]
    context["data_center"] = [{"code":SYSLOC[0],"description":SYSLOC[1]} for SYSLOC in host.objects.values_list("SID__DataCenterID", "SID__DataCenterID__description").filter(model_filter).exclude(model_exclude).order_by('SID__DataCenterID').distinct("SID__DataCenterID") if not SYSLOC[0] == ""]
    context["network_segment"] = [NetworkSegmentID[0] for NetworkSegmentID in host.objects.values_list("SID__NetworkSegmentID").filter(model_filter).exclude(model_exclude).order_by('SID__NetworkSegmentID').distinct("SID__NetworkSegmentID") if not NetworkSegmentID[0] == ""]
    context["product_ppms"] = [LeadingProductPPMS[0] for LeadingProductPPMS in host.objects.values_list("SID__LeadingProductPPMS").filter(model_filter).exclude(model_exclude).order_by('SID__LeadingProductPPMS').distinct("SID__LeadingProductPPMS") if not LeadingProductPPMS[0] == ""]
    context["product_version_ppms"] = [LeadingProductVersionPPMS[0] for LeadingProductVersionPPMS in host.objects.values_list("SID__LeadingProductVersionPPMS").filter(model_filter).exclude(model_exclude).order_by('SID__LeadingProductVersionPPMS').distinct("SID__LeadingProductVersionPPMS") if not LeadingProductVersionPPMS[0] == ""]
    context["webdispatcher"] = [WebdispatcherFarmName[0] for WebdispatcherFarmName in host.objects.values_list("SID__WebdispatcherFarmName").filter(model_filter).exclude(model_exclude).order_by('SID__WebdispatcherFarmName').distinct("SID__WebdispatcherFarmName") if not WebdispatcherFarmName[0] == ""]
    context["product_name"] = [LeadingProductName[0] for LeadingProductName in host.objects.values_list("SID__LeadingProductName").filter(model_filter).exclude(model_exclude).order_by('SID__LeadingProductName').distinct("SID__LeadingProductName") if not LeadingProductName[0] == ""]
    context["patch_version"] = [LeadingProductPatchVersion[0] for LeadingProductPatchVersion in host.objects.values_list("SID__LeadingProductPatchVersion").filter(model_filter).exclude(model_exclude).order_by('SID__LeadingProductPatchVersion').distinct("SID__LeadingProductPatchVersion") if not LeadingProductPatchVersion[0] == ""]
    context["support_package"] = [LeadingProductSupportPackage[0] for LeadingProductSupportPackage in host.objects.values_list("SID__LeadingProductSupportPackage").filter(model_filter).exclude(model_exclude).order_by('SID__LeadingProductSupportPackage').distinct("SID__LeadingProductSupportPackage") if not LeadingProductSupportPackage[0] == ""]
    context["version_number"] = [LeadingProductVersionNumber[0] for LeadingProductVersionNumber in host.objects.values_list("SID__LeadingProductVersionNumber").filter(model_filter).exclude(model_exclude).order_by('SID__LeadingProductVersionNumber').distinct("SID__LeadingProductVersionNumber") if not LeadingProductVersionNumber[0] == ""]
    context["cmp_template"] = [CMPTemplateID[0] for CMPTemplateID in host.objects.values_list("SID__CMPTemplateID").filter(model_filter).exclude(model_exclude).order_by('SID__CMPTemplateID').distinct("SID__CMPTemplateID") if not CMPTemplateID[0] == ""]
    context["cmp_time"] = [CMPTime[0] for CMPTime in host.objects.values_list("SID__CMPTime").filter(model_filter).exclude(model_exclude).order_by('SID__CMPTime').distinct("SID__CMPTime") if not CMPTime[0] == ""]
    context["infra_type"] = [INFRA[0] for INFRA in host.objects.values_list("SID__InfrastructureType").filter(model_filter).exclude(model_exclude).order_by('SID__InfrastructureType').distinct("SID__InfrastructureType") if not INFRA[0] == ""]
    context["tic_status"] = [TICSTATUS[0] for TICSTATUS in host.objects.values_list("SystemExternalStatus").filter(model_filter).exclude(model_exclude).order_by('SystemExternalStatus').distinct("SystemExternalStatus") if not TICSTATUS[0] == ""]
    context["tic_system_type"] = [SystemType[0] for SystemType in host.objects.values_list("SystemType").filter(model_filter).exclude(model_exclude).order_by('SystemType').distinct("SystemType") if not SystemType[0] == ""]
    context["tic_instance_type"] = [InstanceType[0] for InstanceType in host.objects.values_list("InstanceType").filter(model_filter).exclude(model_exclude).order_by('InstanceType').distinct("InstanceType") if not InstanceType[0] == ""]
    context["tic_instance_number"] = [InstanceNumber[0] for InstanceNumber in host.objects.values_list("InstanceNumber").filter(model_filter).exclude(model_exclude).order_by('InstanceNumber').distinct("InstanceNumber") if not InstanceNumber[0] == ""]
    context["tic_system_hypervisor"] = [SystemHypervisor[0] for SystemHypervisor in host.objects.values_list("SystemHypervisor").filter(model_filter).exclude(model_exclude).order_by('SystemHypervisor').distinct("SystemHypervisor") if not SystemHypervisor[0] == ""]
    context["tic_dc"] = [{"code":ComputerSystemDataCenterID[0],"description":ComputerSystemDataCenterID[1]} for ComputerSystemDataCenterID in host.objects.values_list("ComputerSystemDataCenterID", "ComputerSystemDataCenterID__description").filter(model_filter).exclude(model_exclude).order_by('ComputerSystemDataCenterID').distinct("ComputerSystemDataCenterID") if not ComputerSystemDataCenterID[0] == ""]
    context["tic_cpu_count"] = [CPUCount[0] for CPUCount in host.objects.values_list("CPUCount").filter(model_filter).exclude(model_exclude).order_by('CPUCount').distinct("CPUCount") if not CPUCount[0] == ""]
    context["tic_system_memory"] = [SystemMemory[0] for SystemMemory in host.objects.values_list("SystemMemory").filter(model_filter).exclude(model_exclude).order_by('SystemMemory').distinct("SystemMemory") if not SystemMemory[0] == ""]
    context["tic_os_name"] = [SystemOSName[0] for SystemOSName in host.objects.values_list("SystemOSName").filter(model_filter).exclude(model_exclude).order_by('SystemOSName').distinct("SystemOSName") if not SystemOSName[0] == ""]
    context["tic_os_release"] = [SystemOSRelease[0] for SystemOSRelease in host.objects.values_list("SystemOSRelease").filter(model_filter).exclude(model_exclude).order_by('SystemOSRelease').distinct("SystemOSRelease") if not SystemOSRelease[0] == ""]
    context["tic_os_type"] = [SystemOSType[0] for SystemOSType in host.objects.values_list("SystemOSType").filter(model_filter).exclude(model_exclude).order_by('SystemOSType').distinct("SystemOSType") if not SystemOSType[0] == ""]
    context["tic_os_version"] = [SystemOSVersion[0] for SystemOSVersion in host.objects.values_list("SystemOSVersion").filter(model_filter).exclude(model_exclude).order_by('SystemOSVersion').distinct("SystemOSVersion") if not SystemOSVersion[0] == ""]
    context["tic_system_pool"] = [ComputerSystemPool[0] for ComputerSystemPool in host.objects.values_list("ComputerSystemPool").filter(model_filter).exclude(model_exclude).order_by('ComputerSystemPool').distinct("ComputerSystemPool") if not ComputerSystemPool[0] == ""]
    context["tic_resource_pool"] = [ComputerSystemResourcePool[0] for ComputerSystemResourcePool in host.objects.values_list("ComputerSystemResourcePool").filter(model_filter).exclude(model_exclude).order_by('ComputerSystemResourcePool').distinct("ComputerSystemResourcePool") if not ComputerSystemResourcePool[0] == ""]
    context["tic_usage_area"] = [ComputerSystemUsageArea[0] for ComputerSystemUsageArea in host.objects.values_list("ComputerSystemUsageArea").filter(model_filter).exclude(model_exclude).order_by('ComputerSystemUsageArea').distinct("ComputerSystemUsageArea") if not ComputerSystemUsageArea[0] == ""]
    context["tic_vm_flavor"] = [ComputerSystemVMFlavor[0] for ComputerSystemVMFlavor in host.objects.values_list("ComputerSystemVMFlavor").filter(model_filter).exclude(model_exclude).order_by('ComputerSystemVMFlavor').distinct("ComputerSystemVMFlavor") if not ComputerSystemVMFlavor[0] == ""]

    return context