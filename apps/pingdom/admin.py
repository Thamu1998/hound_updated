from django.contrib import admin
from apps.pingdom.models import pingdom_time_series_data, pingdom_status

# Register your models here.

class pingdom_time_series_data_ADMIN(admin.ModelAdmin):

    list_display = ['SID', 'DataCenter', 'FromTime', 'ToTime', 'Status', 'Duration', 'durationInMin','errorStartTime', 'acknowledgedAt', 'IsAcknowledged', 'Product_Area', 'acknowledgedWithin']
    list_filter = ['Status', 'IsAcknowledged', 'Product_Area','DataCenter']
    search_fields = ['SID']

admin.site.register(pingdom_time_series_data, pingdom_time_series_data_ADMIN)
admin.site.register(pingdom_status)