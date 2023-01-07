from django.db import models
from django.utils import timezone
from apps.spc_cld.models import system, datacenter_decs
from apps.user_account.models import User

# Create your models here.
class uptime_cookies(models.Model):
    cookie_name = models.CharField(max_length=300,null=True)
    cookie_value = models.TextField()

class comment_table(models.Model):
    SID = models.CharField(max_length=3, null=True)
    DC = models.CharField(max_length=3, null=True)
    comment = models.TextField(null=True)
    expry_date = models.DateTimeField(null=True)
    updated_on = models.DateTimeField(default=timezone.now, blank=True)
    comment_by = models.ForeignKey(User, related_name='URLComments_uptime', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        indexes = [ models.Index(fields=['SID'])]
        ordering = ('SID', )
        unique_together = (('SID', 'DC'))

class uptime_status(models.Model):
    id = models.BigIntegerField(primary_key=True)
    SID = models.CharField(max_length=30, default='')
    DataCenter = models.CharField(max_length=50,default='')
    system_info = models.ForeignKey(system, related_name='sid_info_uptime', on_delete=models.CASCADE,blank=True, null=True)
    dc_info = models.ForeignKey(datacenter_decs, related_name='dc_info_uptime', on_delete=models.CASCADE,blank=True, null=True)
    created = models.BigIntegerField(null=True)
    name = models.CharField(max_length=300,null=True)
    hostname = models.CharField(max_length=255,null=True)
    resolution = models.IntegerField(null=True)
    verify_certificate = models.BooleanField(default=False)
    lasterrortime = models.BigIntegerField(null=True)
    lasttesttime = models.BigIntegerField(null=True)
    lastresponsetime = models.IntegerField(null=True)
    client = models.IntegerField(null=True)
    status = models.CharField(max_length=255,null=True)
    LastSyncAt = models.DateTimeField(default=timezone.now, blank=True)

    class Meta:
        verbose_name = "Uptime Status"
        verbose_name_plural = "Uptime Status"
        indexes = [models.Index(fields=['SID',])]
        ordering = ('SID',)

class uptime_status_temp(models.Model):
    id = models.BigIntegerField(primary_key=True)
    SID = models.CharField(max_length=30, default='')
    DataCenter = models.CharField(max_length=50,default='')
    system_info = models.ForeignKey(system, related_name='sid_info_uptime_temp', on_delete=models.CASCADE,blank=True, null=True)
    dc_info = models.ForeignKey(datacenter_decs, related_name='dc_info_uptime_temp', on_delete=models.CASCADE,blank=True, null=True)
    created = models.BigIntegerField(null=True)
    name = models.CharField(max_length=300,null=True)
    hostname = models.CharField(max_length=255,null=True)
    resolution = models.IntegerField(null=True)
    verify_certificate = models.BooleanField(default=False)
    lasterrortime = models.BigIntegerField(null=True)
    lasttesttime = models.BigIntegerField(null=True)
    lastresponsetime = models.IntegerField(null=True)
    client = models.IntegerField(null=True)
    status = models.CharField(max_length=255,null=True)
    LastSyncAt = models.DateTimeField(default=timezone.now, blank=True)

    class Meta:
        verbose_name = "Uptime Status Temp"
        verbose_name_plural = "Uptime Status Temp"
        indexes = [models.Index(fields=['SID',])]
        ordering = ('SID',)

class uptime_status_history(models.Model):
    id = models.BigIntegerField(primary_key=True)
    SID = models.CharField(max_length=30, default='')
    DataCenter = models.CharField(max_length=50,default='')
    system_info = models.ForeignKey(system, related_name='sid_info_uptime_history', on_delete=models.DO_NOTHING,blank=True, null=True)
    dc_info = models.ForeignKey(datacenter_decs, related_name='dc_info_uptime_history', on_delete=models.DO_NOTHING,blank=True, null=True)
    created = models.BigIntegerField(null=True)
    name = models.CharField(max_length=300,null=True)
    hostname = models.CharField(max_length=255,null=True)
    resolution = models.IntegerField(null=True)
    verify_certificate = models.BooleanField(default=False)
    lasterrortime = models.BigIntegerField(null=True)
    lasttesttime = models.BigIntegerField(null=True)
    lastresponsetime = models.IntegerField(null=True)
    client = models.IntegerField(null=True)
    status = models.CharField(max_length=255,null=True)
    LastSyncAt = models.DateTimeField(default=timezone.now, blank=True)

    class Meta:
        verbose_name = "Uptime Status History"
        verbose_name_plural = "Uptime Status History"
        indexes = [models.Index(fields=['SID',])]
        ordering = ('SID',)

class tempMonitor(models.Model):
    checkID = models.BigIntegerField(primary_key=True)
    SID = models.CharField(max_length=20, default='')
    isDelete = models.BooleanField(default=False)
    ExpryDate = models.DateTimeField(null=True)

class uptime_time_series_data(models.Model):
    SID = models.CharField(max_length=3, default='')
    systemNumber = models.CharField(max_length=18,default='')
    DataCenter = models.CharField(max_length=50,default='')
    FromTime = models.DateTimeField(default=None, blank=True)
    ToTime = models.DateTimeField(blank=True,null=True, default=None)
    Status = models.CharField(max_length=30, default='')
    Duration = models.CharField(max_length=80, default='')
    durationInMin = models.BigIntegerField(default=0)
    errorStartTime = models.DateTimeField(default=timezone.now, blank=True)
    acknowledgedAt = models.DateTimeField(null=True)
    IsAcknowledged = models.BooleanField(default=False)
    Product_Area = models.CharField(max_length=30, default='S4_PC')
    acknowledgedBy = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    acknowledgedWithin = models.BigIntegerField(default=0)

    class Meta:
        verbose_name = "Uptime Time Series"
        verbose_name_plural = "Uptime Time Series"
        indexes = [models.Index(fields=['SID',])]
        ordering = ('SID',)