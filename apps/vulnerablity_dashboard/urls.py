
from django.urls import include
from django.urls import path
from apps.shiftpasstool.views import *
# from apps.shiftpasstool.methods import *
# from NotesAndCounts import *
from rest_framework import routers
from django.conf.urls import url, include
from .views import *
router = routers.DefaultRouter()


app_name = 'vulnerablity_dashboard'

chart_url = [
    
]
api_url=[
    path('vulnerablity_API_view/',vulnerablity_API_view.as_view(),name="vulnerablity_API_view")
]

html_url = [

    path('', dashboard_html.as_view(), name='dashboard')
]


urlpatterns = html_url + api_url + chart_url
