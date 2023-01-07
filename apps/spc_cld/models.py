from django.db import models
from django.db.models.indexes import Index
from django.utils import timezone

class system_business_type_decs(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'System Business Type'
        verbose_name_plural = 'System Business Types'

class tenant_business_type_decs(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Tenant Business Type'
        verbose_name_plural = 'Tenant Business Types'

class datacenter_decs(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    infra = models.CharField(max_length=64,default='')
    region = models.CharField(max_length=64,default='')
    is_used = models.BooleanField(default=False)
    cmp_id = models.CharField(max_length=64, default='')
    cmp_timing = models.CharField(max_length=250, default='')
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Datacenter'
        verbose_name_plural = 'Datacenter'

class application_dr_type_collection_decs(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Application DR Type'
        verbose_name_plural = 'Application DR Type'

class application_ha_type_collection_decs(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Application HR Type'
        verbose_name_plural = 'Application HR Type'

class database_dr_type_collection_decs(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Database DR Type'
        verbose_name_plural = 'Database DR Type'

class notification_subtype(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Notification SubType'
        verbose_name_plural = 'Notification SubType'

class notification_type(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Notification Type'
        verbose_name_plural = 'Notification Type'

class notification_service_status(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Notification Service Status'
        verbose_name_plural = 'Notification Service Status'

class notification_status(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Notification Status'
        verbose_name_plural = 'Notification Status'

class notification_phase(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Notification Phase'
        verbose_name_plural = 'Notification Phase'

class database_ha_type_collection_decs(models.Model):
    code = models.CharField(max_length=64,default='', primary_key=True)
    description = models.CharField(max_length=164,default='')

    class Meta:
        verbose_name = 'Database HR Type'
        verbose_name_plural = 'Database HR Type'

class system(models.Model):
    SID = models.CharField(max_length=40,default='')
    SystemNumber = models.CharField(max_length=18,default='', primary_key=True)
    SystemRole = models.CharField(max_length=30,default='')
    DataCenterID = models.ForeignKey(datacenter_decs, related_name='datacenter_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    LifeCycleStatus = models.CharField(max_length=10,default='')
    NetworkSegmentID = models.CharField(max_length=80,default='')
    LeadingProductPPMS = models.CharField(max_length=20,default='')
    LeadingProductVersionPPMS = models.CharField(max_length=20,default='')
    HasSharedDBTenant = models.BooleanField(default=False)
    IsDbShared = models.BooleanField(default=False)
    ExternalD = models.CharField(max_length=200,default='')
    EUAccess = models.BooleanField(default=False)
    DatabaseHostFQDN = models.CharField(max_length=255,default='')
    DatabaseHost = models.CharField(max_length=65,default='')
    BusinessType = models.ForeignKey(system_business_type_decs, related_name='system_business_type_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    WebdispatcherFarmName = models.CharField(max_length=255,default='')
    ApplicationHost = models.CharField(max_length=64,default='')
    ApplicationHostFQDN = models.CharField(max_length=255,default='')
    LeadingProductName = models.CharField(max_length=120,default='')
    LeadingProductPatchVersion =  models.BigIntegerField(default=0)
    LeadingProductSoftwareType = models.CharField(max_length=12,default='')
    LeadingProductSupportPackage =  models.BigIntegerField(default=0)
    LeadingProductVersionNumber =  models.BigIntegerField(default=0)
    DBSystemID = models.CharField(max_length=40,default='')
    CMPTemplateID = models.CharField(max_length=20,default='')
    CMPTime = models.CharField(max_length=255,default='')
    InfrastructureProvider = models.CharField(max_length=10,default='')
    CustomerID = models.CharField(max_length=10,default='')
    CustomerName = models.CharField(max_length=255,default='')
    InfrastructureType = models.CharField(max_length=20,default='')
    CustomerTenantMainURL = models.CharField(max_length=255,default='')
    DRActiveSystem = models.BooleanField(default=False)
    DRSystemType = models.CharField(max_length=30, default='')
    DRSystemNumber = models.CharField(max_length=18,default='')
    ApplicationDRType = models.ForeignKey(application_dr_type_collection_decs, related_name='application_dr_type_collection_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    DataBaseDRType = models.ForeignKey(database_dr_type_collection_decs, related_name='database_dr_type_collection_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    HAActiveSystem = models.BooleanField(default=False)
    HASystemType = models.CharField(max_length=30, default='')
    HASystemNumber = models.CharField(max_length=18,default='')
    ApplicationHAType = models.ForeignKey(application_ha_type_collection_decs, related_name='application_ha_type_collection_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    DataBaseHAType = models.ForeignKey(database_ha_type_collection_decs, related_name='database_ha_type_collection_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    CreationDateTime = models.DateTimeField(null=True)
    EntityLastChangedOn = models.DateTimeField(null=True)
    updated_on = models.DateTimeField(default=timezone.now, blank=True)

    class Meta:
        indexes = [ models.Index(fields=['SID', ]), models.Index(fields=['DBSystemID', ]),]
        ordering = ['DBSystemID']
        unique_together = (('SystemNumber', 'LifeCycleStatus'),)

class host(models.Model):
    InstanceType = models.CharField(max_length=10,default='')
    InstanceNumber = models.CharField(max_length=2,default='')
    InstanceName = models.CharField(max_length=64,default='')
    HostName = models.CharField(max_length=64,default='')
    SID = models.ForeignKey(system, related_name='SystemDetails', on_delete=models.CASCADE,blank=True, null=True)
    LifeCycleStatus = models.CharField(max_length=10,default='')
    SystemID = models.CharField(max_length=40,default='')
    SystemNumber = models.CharField(max_length=18,default='')
    CPUCount = models.IntegerField(default=0000)
    SystemMemory = models.IntegerField(default=0000)
    SystemOSName = models.CharField(max_length=40,default='')
    SystemOSRelease = models.CharField(max_length=60,default='')
    SystemOSType = models.CharField(max_length=40,default='')
    SystemOSVersion = models.CharField(max_length=256,default='')
    SystemType = models.CharField(max_length=20,default='')
    SystemExternalStatus = models.CharField(max_length=40,default='')
    SystemHypervisor = models.CharField(max_length=100,default='')
    SystemHypervisorServerName = models.CharField(max_length=64,default='')
    ComputerSystemPool = models.CharField(max_length=255,default='')
    ComputerSystemResourcePool = models.CharField(max_length=255,default='')
    ComputerSystemUsageArea = models.CharField(max_length=255,default='')
    ComputerSystemDataCenterID = models.ForeignKey(datacenter_decs, related_name='host_datacenter_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    ComputerSystemCreationDateTime = models.DateTimeField(null=True)
    ComputerSystemLastChangeDateTime = models.DateTimeField(null=True)
    ComputerSystemVMFlavor = models.CharField(max_length=255,default='')
    updated_on = models.DateTimeField(default=timezone.now, blank=True)

    class Meta:
        ordering = ['SID']
        indexes = [ models.Index(fields=['HostName', ]), models.Index(fields=['SID', ]),]

class tenant(models.Model):
    ObjectID = models.CharField(max_length=250,default='')
    SID = models.ForeignKey(system, related_name='SystemDetails_Tenant', on_delete=models.CASCADE,blank=True, null=True)
    SystemNumber = models.CharField(max_length=18,default='')
    TenantID = models.CharField(max_length=18,default='')
    SystemRole = models.CharField(max_length=30,default='')
    TenantBusinessType = models.ForeignKey(tenant_business_type_decs, related_name='tnt_tenant_business_type_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    ExternalID = models.CharField(max_length=200,default='')
    SystemLifeCycleStatus = models.CharField(max_length=10,default='')
    EUDataProtectionIndicator = models.BooleanField(default=False)
    NetworkSegmentID = models.CharField(max_length=80,default='')
    SystemLocation = models.ForeignKey(datacenter_decs, related_name='tnt_datacenter_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    VersionNumber =  models.BigIntegerField(default=0)
    SupportPackage =  models.BigIntegerField(default=0)
    PatchVersion =  models.BigIntegerField(default=0)
    MainURL = models.CharField(max_length=255,default='')
    HasSharedDBTenant = models.BooleanField(default=False)
    CustomerID = models.CharField(max_length=60,default='')
    CustomerName = models.CharField(max_length=255,default='')
    DBSystemID = models.CharField(max_length=64,default='')
    SystemBusinessType = models.ForeignKey(system_business_type_decs, related_name='tnt_system_business_type_decs_re', on_delete=models.CASCADE,blank=True, null=True)
    SystemDBHostFQDN = models.CharField(max_length=255,default='')
    SystemWebdispatcherFarmName = models.CharField(max_length=64,default='')
    SystemCMPTemplateID = models.CharField(max_length=64,default='')
    SystemInfrastructureType = models.CharField(max_length=64,default='')
    updated_on = models.DateTimeField(default=timezone.now, blank=True)
    AllocationLimit = models.CharField(max_length=80, default='')
    memory = models.CharField(max_length=80, default='')
    CPU = models.CharField(max_length=80, default='')
    MaximumConcurrentCPU = models.CharField(max_length=80, default='')

    class Meta:
        indexes = [ models.Index(fields=['SID', ]), models.Index(fields=['DBSystemID', ]),]
        ordering = ['SID']

class dr_systems(models.Model):
    CustomerID = models.CharField(max_length=30,default='',null=True)
    CustomerName = models.TextField(null=True)
    has_prod = models.BooleanField(default=False)
    has_dr = models.BooleanField(default=False)
    PrimaryDC  = models.CharField(max_length=30,default='',null=True)
    SecondaryDC = models.CharField(max_length=30,default='',null=True)
    SID = models.CharField(max_length=10,default='',null=True)
    DBSID = models.CharField(max_length=10,default='',null=True)
    quantity = models.IntegerField(null=True)
    SystemRole = models.CharField(max_length=30,default='')