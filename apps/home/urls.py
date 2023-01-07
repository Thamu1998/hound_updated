from django.urls import include
from django.urls import path
from .views import *
from rest_framework import routers
from django.conf.urls import url,include

app_name = 'home'

html_url = [
            path('', home_html.as_view(), name="home_html"),
           ]

api_url = [ 

          ]   

urlpatterns = html_url + api_url


