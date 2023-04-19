
from django.urls import include
from django.urls import path
from apps.shiftpasstool.views import *
from rest_framework import routers
from django.conf.urls import url, include

router = routers.DefaultRouter()


app_name = 'shiftpasstool'

chart_url = [

]

html_url = [

    path('', dashboard_html.as_view(), name='dashboard'),
    path('shift/admin', admin_page.as_view(), name='admin_page')
]

api_url = [

    url('^api/', include(router.urls)),
    path('post_tracking/', post_tracking.as_view(), name='post_tracking'),
    path('update_tracking/', update_tracking.as_view(), name='update_tracking'),
    path('post_api/', post_api.as_view(), name='post_api'),
    path('outage_get_api/', outage_get_api.as_view(), name='outage_get_api'),
    path('Outage_Get_Id/', Outage_Get_Id.as_view(), name='Outage_Get_Id'),
    path('ticket_comment/', ticket_comment.as_view(), name="ticket_comment"),
    path('set_Ticket_count/', set_Ticket_count.as_view(), name="set_Ticket_count"),
    path('Activity_db/', Activity_db.as_view(), name="Activity_db"),
    path('Get_all_activity/', Get_all_activity.as_view(), name="Get_all_activity"),
    path('Get_sm_infra_activate/', Get_sm_infra_activate.as_view(),
         name='Get_sm_infra_activate'),
    path('sm_infra_activate_obj/', sm_infra_activate_obj.as_view(),
         name='sm_infra_activate_obj'),
    path('today_shift_planer_info_for_tickets/', today_shift_planer_info_for_tickets.as_view(),
         name='today_shift_planer_info_for_tickets'),
    path('MailAPI/', MailAPI_view.as_view(), name="MailAPI")
]

urlpatterns = html_url + api_url + chart_url
