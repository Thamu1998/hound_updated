from .models import system, host, tenant, datacenter_decs, dr_systems
from rest_framework import serializers
# from rest_framework.pagination import PaginationSerializer

class dr_systems_serializer(serializers.ModelSerializer):

    class Meta:
        model = dr_systems
        fields = '__all__'

class system_serializer(serializers.ModelSerializer):
   
    class Meta:
        model = system
        fields = '__all__'

class datacenter_decs_serializer(serializers.ModelSerializer):

    class Meta:
        model = datacenter_decs
        fields = '__all__'

class tenant_serializer(serializers.ModelSerializer):

    SID = serializers.SerializerMethodField()
    
    class Meta:
        model = tenant
        fields = '__all__'

    def get_SID(self, obj):
        if obj.SID == None:
            return "NA"
        return obj.SID.SID

class host_serializer(serializers.ModelSerializer):
    
    SID = serializers.SerializerMethodField()
    DBSystemID = serializers.SerializerMethodField()
    BusinessType = serializers.SerializerMethodField()
    DataCenterID = serializers.SerializerMethodField()
    SystemRole = serializers.SerializerMethodField()
    EUAccess = serializers.SerializerMethodField()
    HasSharedDBTenant = serializers.SerializerMethodField()
    CustomerTenantMainURL = serializers.SerializerMethodField()
    CustomerName = serializers.SerializerMethodField()
    LeadingProductPatchVersion = serializers.SerializerMethodField()
    CMPTime = serializers.SerializerMethodField()
    InfrastructureType = serializers.SerializerMethodField()
    ApplicationHostFQDN = serializers.SerializerMethodField()
    DatabaseHostFQDN = serializers.SerializerMethodField() 
    CMPTemplateID = serializers.SerializerMethodField()
    NetworkSegmentID = serializers.SerializerMethodField()

    class Meta:
        model = host
        fields = ('SystemNumber','SID', 'DBSystemID', 'BusinessType','LifeCycleStatus', 'CustomerTenantMainURL', 'CustomerName','HostName','InstanceType','InstanceNumber','InstanceName', 'DataCenterID', 'SystemRole', 'EUAccess', 'HasSharedDBTenant', 'LeadingProductPatchVersion','CPUCount','SystemMemory','SystemOSName','SystemOSRelease','SystemOSType','SystemOSVersion','SystemType','SystemExternalStatus','SystemHypervisor','SystemHypervisorServerName','CMPTime','InfrastructureType','ApplicationHostFQDN','DatabaseHostFQDN','CMPTemplateID','NetworkSegmentID', 'ComputerSystemPool', 'ComputerSystemResourcePool', 'ComputerSystemUsageArea', 'ComputerSystemDataCenterID', 'ComputerSystemCreationDateTime', 'ComputerSystemLastChangeDateTime', 'ComputerSystemVMFlavor')

    def get_SID(self, obj):
        return obj.SID.SID

    def get_DBSystemID(self, obj):
        return obj.SID.DBSystemID

    def get_BusinessType(self, obj):
        return obj.SID.BusinessType.code

    def get_DataCenterID(self, obj):
        return obj.SID.DataCenterID.code

    def get_SystemRole(self, obj):
        return obj.SID.SystemRole   

    def get_EUAccess(self, obj):
        return obj.SID.EUAccess

    def get_HasSharedDBTenant(self, obj):
        return obj.SID.HasSharedDBTenant

    def get_CustomerTenantMainURL(self, obj):
        return obj.SID.CustomerTenantMainURL

    def get_CustomerName(self, obj):
        return obj.SID.CustomerName

    def get_LeadingProductPatchVersion(self, obj):
        return obj.SID.LeadingProductPatchVersion

    def get_CMPTime(self, obj):
        return obj.SID.CMPTime  

    def get_InfrastructureType(self, obj):
        return obj.SID.InfrastructureType

    def get_ApplicationHostFQDN(self, obj):
        return obj.SID.ApplicationHostFQDN

    def get_DatabaseHostFQDN(self, obj):
        return obj.SID.DatabaseHostFQDN

    def get_CMPTemplateID(self, obj):
        return obj.SID.CMPTemplateID  

    def get_NetworkSegmentID(self, obj):
        return obj.SID.NetworkSegmentID