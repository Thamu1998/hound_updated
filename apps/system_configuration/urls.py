from django.urls import include
from django.urls import path
from .views import *

app_name = 'system_configuration'

html_url = [
           ]

api_url = [ 
           path('get/menu', menuOptions.as_view(), name="menuOptions")
          ]   

urlpatterns = html_url + api_url


