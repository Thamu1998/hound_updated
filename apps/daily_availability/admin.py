from django.contrib import admin
from .models import availability

# Register your models here.

class availability_admin(admin.ModelAdmin):
    list_display = ['SystemID','AvailabilityInPercentage', 'StartDateTime', 'EndDateTime',  'SystemNumber', 'TenantID', 'LastChangeDateTime', 'TotalAvailableMinutes', 'TotalCommunicatedDowntimesInMinutes', 'TotalExcludedCommunicatedDowntimesInMinutes', 'TotalExcludedDowntimesInMinutes', 'TotalPlannedAvailableMinutes', 'TotalUnplannedCommunicatedDowntimesInMinutes', 'SystemRole', 'SystemLocation', 'CRMCustomerID', 'CustomerID', 'CustomerName', 'LifecycleStatus', 'ExternalSystemID']
    list_filter = ['StartDateTime', 'SystemRole']
    search_fields = ['SystemID','AvailabilityInPercentage', 'StartDateTime', 'EndDateTime',  'SystemNumber', 'TenantID', 'LastChangeDateTime', 'TotalAvailableMinutes', 'TotalCommunicatedDowntimesInMinutes', 'TotalExcludedCommunicatedDowntimesInMinutes', 'TotalExcludedDowntimesInMinutes', 'TotalPlannedAvailableMinutes', 'TotalUnplannedCommunicatedDowntimesInMinutes', 'SystemRole', 'SystemLocation', 'CRMCustomerID', 'CustomerID', 'CustomerName', 'LifecycleStatus', 'ExternalSystemID']

admin.site.register(availability, availability_admin)