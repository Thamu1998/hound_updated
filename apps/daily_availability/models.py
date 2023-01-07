from django.db import models
from django.db.models.indexes import Index
from apps.spc_cld.models import system, tenant, system_business_type_decs

# Create your models here.

class availability(models.Model):
    ObjectID = models.CharField(max_length=255, default='')
    AvailabilityInPercentage = models.FloatField(null=True, blank=True)
    EndDateTime = models.DateTimeField(null=True)
    StartDateTime =  models.DateTimeField(null=True)
    SystemInfo = models.ForeignKey(system, related_name='notification_system_info', on_delete=models.CASCADE,blank=True, null=True)
    TenantInfo = models.ForeignKey(tenant, related_name='notification_tenant_info', on_delete=models.CASCADE,blank=True, null=True)
    BusinessType = models.ForeignKey(system_business_type_decs, related_name='system_business_type_decs_info', on_delete=models.CASCADE,blank=True, null=True)
    SystemNumber =  models.CharField(max_length=20,default='')
    TenantID =  models.CharField(max_length=20,default='')
    LastChangeDateTime =  models.DateTimeField(null=True)
    TotalAvailableMinutes =  models.IntegerField(null=True, blank=True, default=0)
    TotalCommunicatedDowntimesInMinutes =  models.IntegerField(null=True, blank=True, default=0)
    TotalExcludedCommunicatedDowntimesInMinutes =  models.IntegerField(null=True, blank=True, default=0)
    TotalExcludedDowntimesInMinutes =  models.IntegerField(null=True, blank=True, default=0)
    TotalPlannedAvailableMinutes =  models.IntegerField(null=True, blank=True, default=0)
    TotalUnplannedCommunicatedDowntimesInMinutes =  models.IntegerField(null=True, blank=True, default=0)
    SystemRole =  models.CharField(max_length=30,default='')
    SystemLocation =  models.CharField(max_length=30,default='')
    CRMCustomerID =  models.CharField(max_length=30,default='')
    CustomerID =  models.IntegerField(null=True, blank=True, default=0)
    CustomerName =  models.CharField(max_length=255,default='')
    LifecycleStatus =  models.CharField(max_length=40,default='')
    ExternalSystemID =  models.CharField(max_length=30,default='')
    SystemID =  models.CharField(max_length=10,default='')
    EventID = models.CharField(max_length=50,default='',null=True)
    Category = models.CharField(max_length=150,default='',null=True)
    SubCategory = models.CharField(max_length=150,default='',null=True)
    OutageType = models.CharField(max_length=150,default='',null=True)
    RCACategory = models.CharField(max_length=150,default='',null=True)
    StartTime = models.DateTimeField(null=True)
    EndTime =  models.DateTimeField(null=True)
    Reason = models.TextField(null=True)
    Description = models.TextField(null=True)
    ProblemTicket = models.CharField(max_length=500,default='',null=True)

    class Meta:
        indexes = [ models.Index(fields=['StartDateTime', ]), models.Index(fields=['SystemNumber', ]),]
        ordering = ['StartDateTime']