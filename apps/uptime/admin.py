from django.contrib import admin
from apps.uptime.models import uptime_time_series_data, uptime_cookies, comment_table

# Register your models here.

class uptime_time_series_data_ADMIN(admin.ModelAdmin):

    list_display = ['SID', 'DataCenter', 'FromTime', 'ToTime', 'Status', 'Duration', 'durationInMin','errorStartTime', 'acknowledgedAt', 'IsAcknowledged', 'Product_Area', 'acknowledgedWithin']
    list_filter = ['Status', 'IsAcknowledged', 'Product_Area','DataCenter']
    search_fields = ['SID']

class uptime_cookies_ADMIN(admin.ModelAdmin):
    list_display = ['cookie_name', 'cookie_value']

admin.site.register(uptime_time_series_data, uptime_time_series_data_ADMIN)
admin.site.register(uptime_cookies,uptime_cookies_ADMIN)
admin.site.register(comment_table)