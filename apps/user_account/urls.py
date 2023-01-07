from django.conf.urls import url,include
from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views
from rest_framework import routers

app_name = 'user_account'

router = routers.DefaultRouter()
router.register(r'users', user_mv)
router.register(r'workgroup/request', work_group_request_mv)
router.register(r'my/workgroup/request', work_group_request_my_mv)
router.register(r'subteam/owner', sub_team_owner_mv)

html_url = [
            path('login', login_html.as_view(), name="login_html"),
            path('users', users_html.as_view(), name="users_html"),
            path('team/details', team_details_html.as_view(), name="team_details_html"),
            path('workgroup/owner', team_owner_html.as_view(), name="team_owner_html"),
           ]

api_url = [ 
           path('auth/test', auth_test.as_view(), name="auth_test"),
           path('update/group', update_user_group.as_view(), name="update_user_group"),
           path('logout', auth_views.LogoutView.as_view(),{'next_page': '/'},name="logout"),
           path('approve/workgroup/request', approve_work_group_request.as_view(), name="approve_work_group_request"),
           path('reject/workgroup/request', reject_work_group_request.as_view(), name="reject_work_group_request"),
           path('create/workgroup/request', create_work_group_request.as_view(), name="create_work_group_request"),
           path('subteam/list', sub_team_data.as_view(), name="sub_team_data"),
           url(r'api/', include(router.urls))
          ]   

urlpatterns = html_url + api_url


