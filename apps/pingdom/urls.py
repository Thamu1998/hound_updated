from django.urls import include
from django.urls import path
from .views import *
from rest_framework import routers
from django.conf.urls import url,include

router = routers.DefaultRouter()
router.register(r'mttd/list', acknowledgement_mv)

app_name = 'pingdom'

html_url = [
            path('', dashboard_html.as_view(), name="pingdom_dashboard_html"),
            path('downtime', downtime_scan_html.as_view(), name="downtime_scan_html"),
            path('acknowledgement/data', acknowledgement_html.as_view(), name="acknowledgement_html"),
            path('history', check_history_html.as_view(), name="check_history")
           ]

api_url = [ 
            path('sync/status', sync_pingdom_status.as_view(), name="sync_pingdom_status"),
            path('sync/time/series', generate_time_series_view.as_view(), name="generate_time_series_view"),
            path('check/status', check_status.as_view(), name="check_status"),
            path('update/check/name', pingdom_check_name_change.as_view(), name="update_pingdom_check"),
            path('get/anomaly/data', get_anomaly_data.as_view(), name="get_anomaly_data"),
            path('get/dc/info', get_dc_info.as_view(), name="get_dc_info"),
            path('get/down/dc/info', get_down_dc_info.as_view(), name="get_down_dc_info"),
            path('update/comment', update_comment_view.as_view(), name="update_comment_view"),
            path('view/comment', get_comment.as_view(), name="get_comment"),
            path('acknowledge/downtime/system', acknowledge_downtime.as_view(), name="acknowledge_downtime_system"),
            path('acknowledge/downtime/datacenter', mass_acknowledge_downtime.as_view(), name="mass_acknowledge_downtime"),
            path('api/mttd/data',mttd_acknowledge_data.as_view(),name="mttdDataAPI"),
            path('downtime/scan', downtime_scan_apiview.as_view(),name="downtime_scan_apiview"),
            path('check/history', check_history.as_view(), name="check_history"),
            path('detail', get_pingdom_details.as_view(), name="get_pingdom_details"),
            url('^api/', include(router.urls))
          ]   

urlpatterns = html_url + api_url


