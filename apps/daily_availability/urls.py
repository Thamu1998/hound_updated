from unicodedata import name
from django.urls import include
from django.urls import path
from apps.daily_availability.views import *
from apps.daily_availability.charts import *
from rest_framework import routers
from django.conf.urls import url,include

router = routers.DefaultRouter()
router.register(r'daily/list', availability_mv)

app_name = 'daily_notification'

chart_url = [
               
            ]

html_url = [
             path('report', availability_html.as_view(), name='availability_html'),
             path('', dashboard_html.as_view(), name='dashboard')
           ]

api_url = [ 
               
            path('sync/notification', sync_notification_cld.as_view(), name="sync_notification_cld"),
            path('cht/prod/daily', calculate_availability_prod.as_view(), name="calculate_availability_prod"),
            path('cht/nonprod/daily', calculate_availability_nonprod.as_view(), name="calculate_availability_nonprod"),
            path('cht/last/availability', yesterday_availability.as_view(), name="yesterday_availability"),
            url('^api/', include(router.urls))
          ]   

urlpatterns = html_url + api_url + chart_url


