from django.urls import path
from apps.mail import views

app_name = 'mail'

urlpatterns = [
    path('welcome', views.welcome_email_template.as_view(), name='welcome'),
    path('maintanance', views.maintanance_email_template.as_view(), name='maintanance')
]
