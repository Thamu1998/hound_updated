"""configs URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.conf.urls import include
from config.exceptionhandler import handler404_view,handler500_view
from swagger.views import get_swagger_view
from rest_framework_simplejwt import views as jwt_views
from django.contrib.staticfiles.urls import static
from django.conf.urls import handler404, handler500
from django.conf import settings
from django.shortcuts import redirect

def dinamic_landing_page(request):
    try:
        return redirect('/cld')
    except Exception as e:
        raise

applicationurls = [
    # Uncomment the next line to enable the admin:
    path('', dinamic_landing_page, name='dinamic_url'),
    path('ua/', include('apps.user_account.urls')),
    path('sy/', include('apps.system_configuration.urls')),
    path('cld/', include('apps.spc_cld.urls')),
    path('gen/', include('apps.gendoc.urls')),
    path('home/', include('apps.home.urls')),
    path('event/', include('event_notification.urls')),                                      #endpoint to connect event_notification app - I507692 - Abhishek Jha
    path('availability/', include('apps.daily_availability.urls')),
	path('link/', include('apps.link.urls')),
    path('pingdom/', include('apps.pingdom.urls')),
    path('uptime/', include('apps.uptime.urls')),
    path('roster/', include('apps.roster.urls')),
    path('notification/', include('apps.notification.urls')),
    path('shiftpasstool/',include('shiftpasstool.urls')),
    path('vulnerablity_dashboard/',include('apps.vulnerablity_dashboard.urls'))
    # path('mail/',include('mail.urls'))
]

schema_view = get_swagger_view(title=getattr(settings,'SWAGGER_SETTINGS',"Hound API Docs")["title"], patterns=applicationurls)

urlpatterns = applicationurls + [
    
    path('admin/', admin.site.urls),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    # url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # url(r'^api/v1/docs/', schema_view, name="docs"),

]

if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

handler404 = handler404_view
handler500 = handler500_view
