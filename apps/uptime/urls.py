from django.urls import include
from django.urls import path
from .views import *
from rest_framework import routers
from django.conf.urls import url,include

router = routers.DefaultRouter()
router.register(r'mttd/list', acknowledgement_mv)

app_name = 'uptime'

html_url = [
            path('', dashboard_html.as_view(), name="uptime_dashboard_html"),
            path('downtime', downtime_scan_html.as_view(), name="downtime_scan_html"),
            path('acknowledgement/data', acknowledgement_html.as_view(), name="acknowledgement_html")
           ]

api_url = [ 
            path('sync/status', sync_uptime_status.as_view(), name="sync_uptime_status"),
            path('check/status', check_status.as_view(), name="check_status"),            
            path('view/comment', get_comment.as_view(), name="get_comment"),
            path('update/comment', update_comment_view.as_view(), name="update_comment_view"),
            path('get/anomaly/data', get_anomaly_data.as_view(), name="get_anomaly_data"),
            path('get/dc/info', get_dc_info.as_view(), name="get_dc_info"),
            path('get/down/dc/info', get_down_dc_info.as_view(), name="get_down_dc_info"),
            path('acknowledge/downtime/system', acknowledge_downtime.as_view(), name="acknowledge_downtime_system"),
            path('acknowledge/downtime/datacenter', mass_acknowledge_downtime.as_view(), name="mass_acknowledge_downtime"),
            path('set/monitoring',chech_and_add_monitoring.as_view(),name="chech_and_add_monitoring"),
            path('downtime/scan', downtime_scan_apiview.as_view(),name="downtime_scan_apiview"),
            url('^api/', include(router.urls))
          ]   

urlpatterns = html_url + api_url


