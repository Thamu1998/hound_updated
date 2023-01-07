from django.urls import include
from django.urls import path
from .views import *
from rest_framework import routers
from django.conf.urls import url,include

routers = routers.DefaultRouter()
routers.register('notification_events', notification_events_stage_mv)

app_name = 'notification'

html_url = [
             path('event/view', notification_events_html.as_view(), name="notification_events_html"),
             path('sync', sync_notification_data.as_view(), name="sync_notification_data")
           ]

api_url = [ 
            path('event/data', notification_event_data.as_view(), name="notification_event_data"),
            path('event/chart/intermediate', event_symmary_intermediate_chart.as_view(),name="event_symmary_intermediate_chart"),
            path('event/chart/final', event_symmary_final_chart.as_view(),name="event_symmary_final_chart"),
            url('^api/', include(routers.urls))
          ]   

urlpatterns = html_url + api_url


