#############################################################################
# IMPORT STATEMENTS                                                         #
#############################################################################

from django.conf.urls import url, include
from django.urls import path
from link.views import *
from rest_framework import routers

#############################################################################
#URL Patterns                                                               #
#############################################################################
app_name = 'link'
snippet_list = TimelineViewSet.as_view({
    'get': 'list',
})

htmlurl = [

]


apiurl = [

    path('', snippet_list, name='snippet-list'),
    path('PostData', PostData.as_view(), name="PostData"),
    path('PostLinkData', PostLinkData.as_view(), name="PostLinkData"),
    path('DeleteData/', DeleteData.as_view(), name="DeleteData"),
    path('UpdateData/', UpdateData.as_view(), name="UpdateData"),
]

urlpatterns = htmlurl+apiurl
