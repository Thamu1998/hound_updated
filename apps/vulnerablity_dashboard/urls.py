
from django.urls import include
from django.urls import path
from apps.shiftpasstool.views import *
# from apps.shiftpasstool.methods import *
# from NotesAndCounts import *
from rest_framework import routers
from django.conf.urls import url, include
from .views import *
router = routers.DefaultRouter()

router.register(r'upload_excel',upload_excel)
app_name = 'vulnerablity_dashboard'

chart_url = [
    
]
api_url=[
    path('vulnerablity_API_view/',vulnerablity_API_view.as_view(),name="vulnerablity_API_view")
]

html_url = [
    path('api/',include(router.urls)),
    path('', dashboard_html.as_view(), name='dashboard'),
    # path('upload_excel/',upload_excel.as_view(),name='upload_excel')
]


urlpatterns = html_url + api_url + chart_url
