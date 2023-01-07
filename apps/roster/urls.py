from django.urls import include
from django.urls import path
from .views import *
from rest_framework import routers
from django.conf.urls import url,include

from rest_framework import routers

app_name = 'roster'

router = routers.DefaultRouter()
router.register(r'shifttype', shift_type_mv)



html_url = [
              path('shift/admin/plan', admin_shift_planner.as_view(), name='admin_shift_planner'),
              path('shift/admin', admin_page.as_view(), name='admin_page'),
              path('shift/plan', shift_plan_HTML.as_view(), name='shift_plan_HTML'),
              path('', daily_shift_HTML.as_view(), name='daily_shift_HTML'),
              path('work/plan', my_workday_plan_html.as_view(), name='my_workday_plan_html'),
              path('member/plan', shift_plan_member_html.as_view(), name = "shift_plan_member_html"),
              path('shifttype', shift_type_html.as_view(), name = "shift_type_html"),
           ]

api_url = [ 
              path('get/admin/plan', get_shift_plan_admin.as_view(), name='get_shift_plan_admin'),
              path('get/plan', get_shift_plan.as_view(), name='get_shift_plan'),
              path('get/task', get_task_plan.as_view(), name='get_task_plan'),
              path('get/today/shift', today_shift_planer_info.as_view(), name='today_shift_planer_info'),
              path('save/temp/shift', save_temp_shift.as_view(), name="save_temp_shift"),
              path('get/member/info', get_member_info.as_view(), name='get_member_info'),
              path('get/admin/group/list', admin_owner_group.as_view(), name='admin_owner_group'),
              path('get/group/list', group_list.as_view(), name='group_list'),
              path('get/team/list', team_list.as_view(), name='team_list'),
              path('update/lock/unlock', lock_unlock_shift.as_view(), name='lock_unlock_shift'),
              path('shift/type/info', shift_type_info.as_view(), name='shift_type_info'),
              path('status/type/info', shift_status_info.as_view(), name='shift_status_info'),
              path('finalize/shift', finalize_sift.as_view(), name='finalize_sift'),
              path('holiday/list/month', holiday_view.as_view(), name='holiday_view'),
              path('holiday/today', holiday_today_view.as_view(), name='holiday_today_view'),
              path('work/plan/data', my_workday_plan_data.as_view(), name='my_workday_plan_data'),
              path('member/shift/info', member_shift_info.as_view(), name='member_shift_info'),
              path('member/shift/info/swap', get_member_info_swap_request.as_view(), name='get_member_info_swap_request'),
              path('get/shift/change/request', get_change_request.as_view(), name='get_change_request'),
              path('create/shift/change/request', create_shift_change_request.as_view(), name='craete_change_request'),              
              path('update/shift/change/request/comment', update_change_request_comment.as_view(), name='update_change_request_comment'),
              path('get/status/change/request', get_status_change_request.as_view(), name='get_status_change_request'),
              path('create/status/change/request', create_status_change_request.as_view(), name='create_status_change_request'),
              path('update/status/change/request/comment', update_status_change_request_comment.as_view(), name='update_status_change_request_comment'),
              path('swap/request/t1', swap_request_list.as_view(), name="swap_request_list"),
              path('swap/request/view', view_swap_request.as_view(), name="view_swap_request"),
              path('swap/request/t1/sm/approve', approve_sm_swap_request.as_view(), name='approve_sm_swap_request'),
              path('swap/request/t1/sm/reject', reject_sm_swap_request.as_view(), name='reject_sm_swap_request'),
              path('swap/request/t2', my_swap_request_list.as_view(), name="my_swap_request_list"),
              path('swap/request/t2/delete', delete_swap_request.as_view(), name="delete_swap_request"),
              path('swap/request/create', create_swap_request.as_view(), name="create_swap_request"),
              path('summary', shift_summary.as_view(), name='shift_summary'),
              path('user/shift/info', user_shift_plan_next_month.as_view(), name="user_shift_plan_next_month"),
              path('user/shift/pref', member_shift_preferences.as_view(), name='member_shift_preferences'),
              path('admin/change/request/list', admin_view_change_request.as_view(), name="admin_view_change_request"),
              path('admin/leave/request/list', admin_view_leave_request.as_view(), name="admin_view_leave_request"),
              path('admin/change/request', get_change_request_with_id.as_view(), name="get_change_request_with_id"),
              path('admin/change/request/action', admin_action_request.as_view(), name="admin_action_request"),
              path('admin/swap/request', admin_swap_request_list.as_view(), name="admin_swap_request_list"),
              path('admin/swap/request/action', admin_swap_action_request.as_view(), name="admin_swap_action_request"),
              path('leave/update', update_shift_member_leave.as_view(), name="update_shift_member_leave"),
              path('claim/member', get_shift_claim_member.as_view(), name="get_shift_claim_member"),
              path('claim/team', get_shift_claim_team.as_view(), name="get_shift_claim_team"),
              url(r'api/', include(router.urls))
          ]   

urlpatterns = html_url + api_url


