from django.urls import include
from django.urls import path
from .views import *
from rest_framework import routers
from django.conf.urls import url,include

app_name = 'gendoc'

html_url = [
            path('download/excel/<str:table_name>', generate_excel_view.as_view(), name="generate_excel_view")
           ]

api_url = [ 

          ]   

urlpatterns = html_url + api_url


