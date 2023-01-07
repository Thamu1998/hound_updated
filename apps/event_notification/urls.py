#############################################################################
# IMPORT STATEMENTS                                                         #
#############################################################################

from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path, re_path
from rest_framework import routers
from django.conf.urls import url
from django.urls import include
from . import views
from event_notification.views import *


#############################################################################
#URL Patterns                                                               #
#############################################################################
app_name = 'event'
htmlurls = [
    path('',CustomerEventNotification.as_view(), name="CustomerEventNotification"),
    # re_path(r'/$', FilterEventNotification.as_view(), name = "FilterEventNotification"),
    path('rca/',CustomerEventRCA.as_view(), name = "CustomerEventRCA"),
    path('test/',CustomerEventRCATEST.as_view(), name = "CustomerEventRCATEST"),

]

apiurls = [
    path('api/',EventNotification.as_view(), name = "EventNotification"),
    path('api/new/<str:DateTimeRange>',FilterEventNotification.as_view(), name = "FilterEventNotification"),
    path('rca/api/<str:DateTimeRange>',EventRCA.as_view(), name = "EventRCA"),
]
urlpatterns = htmlurls + apiurls