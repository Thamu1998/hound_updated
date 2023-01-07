from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.views.generic import FormView, TemplateView
from django.db.models import Q, Count, Sum, Max, Avg
import json
import datetime
import dateutil.relativedelta
import calendar
from django.utils import timezone
from .methods.generate_roster_admin import shift_plan_admin
from .methods.generate_roster import shift_plan
from .methods.generate_task import gen_task
from .methods.today_shift import today_plan
from .methods.my_work_plan import work_plan
from .methods.user_shifts import user_shift
from .methods.shift_claim import shift_claim
from .serializers import shift_type_serializers
from .models import shift_temp, planned_leave_calander, shift_comment, shift_preferance, Holiday, shift_type, shift, task_plan, shift_status, change_request, change_request_comment, status_change_request, status_change_request_comment, swap_request_comment, swap_request
from apps.user_account.models import User, sub_team_owner, subTeam, team

class get_shift_plan_admin(APIView):

    def get(self, request):
        try:
            shift_month = int(request.GET.get('m', datetime.datetime.now().month))

            shift_year = int(request.GET.get('y', datetime.datetime.now().year))

            selected_group = request.GET.get('sg', None)

            shift_plan_init = shift_plan_admin(shift_planer_info=request.user)

            plan = shift_plan_init.get(month=shift_month, year=shift_year, selected_group=selected_group)

            return Response(plan)
        except Exception as e:
            return Response(str(e), status=500)

class get_shift_plan(APIView):

    def get(self, request):
        try:
            shift_month = int(request.GET.get('m', datetime.datetime.now().month))

            shift_year = int(request.GET.get('y', datetime.datetime.now().year))

            selected_group = request.GET.get('sg', None)

            selected_team = request.GET.get('tm', None)

            shift_plan_init = shift_plan(shift_memebr=request.user)
            
            plan = shift_plan_init.get(month=shift_month, year=shift_year, selected_group=selected_group, selected_team=selected_team)

            return Response(plan)
        except Exception as e:
            return Response(str(e), status=500)

class get_task_plan(APIView):

    def get(self, request):
        try:
            task_month = int(request.GET.get('m', datetime.datetime.now().month))

            task_year = int(request.GET.get('y', datetime.datetime.now().year))

            selected_group = request.GET.get('sg', None)

            selected_team = request.GET.get('tm', None)

            task_plan_init = gen_task(shift_planer_info=request.user)
            
            plan = task_plan_init.get(month=task_month, year=task_year, selected_group=selected_group, selected_team=selected_team)

            return Response(plan)
        except Exception as e:
            return Response(str(e), status=500)

class today_shift_planer_info(APIView):

    def get(self, request):
        try:
            team_id = request.GET.get('tm', None)

            today_plan_init = today_plan(user_info=request.user)
            shift = today_plan_init.plan(team_id=team_id)
            
            return Response(shift)
        except Exception as e:
            return Response(str(e), status=500)

class lock_unlock_shift(APIView):

    def post(self, request):
        try:
            
            shift_month = int(request.data.get('m', datetime.datetime.now().month))

            shift_year = int(request.data.get('y', datetime.datetime.now().year))

            selected_group = request.data.get('sg', None)

            is_locked = request.data.get('is_locked', True)

            shift_plan_init = shift_plan_admin(shift_planer_info=request.user)

            plan = shift_plan_init.shift_lock_unlock(month=shift_month, year=shift_year, selected_group=selected_group, is_locked=is_locked)

            return Response(plan)
        except Exception as e:
            print(str(e))
            return Response(str(e), status=500)

class admin_shift_planner(TemplateView):

    template_name = 'roster/admin/shift.html'

class shift_plan_HTML(TemplateView):

    template_name = 'roster/shift.html'

class daily_shift_HTML(TemplateView):

    template_name = 'roster/daily_shift.html'

    def get_context_data(self, **kwargs):
        
        context = {}
        context["user_list"] = [{"id":user[0], "name":user[1]+" "+user[2], "username":user[3]} for user in User.objects.values_list("id", "first_name", "last_name", "username").filter(team__location__code=self.request.user.team.location.code)]
        return context

class my_workday_plan_html(TemplateView):

    template_name = 'roster/my_workday_plan.html'

class shift_plan_member_html(TemplateView):

    template_name = 'roster/shift_plan_member.html'

class my_workday_plan_data(APIView):

    def get(self, request):
        try:
            my_workday_plan_init = work_plan(member=self.request.user)

            plan = my_workday_plan_init.get_plan()

            return Response(plan)
        except Exception as e:
            return Response(str(e), status=500)

class admin_page(TemplateView):

    template_name = 'roster/admin/admin.html'

    def get_context_data(self, **kwargs):

        sub_team_id = sub_team_owner.objects.values_list('sub_team_id', flat=True).filter(owner=self.request.user, sub_team__team__code=self.request.user.team.code)
        
        context = {}
        context["sub_team"] = [{"code":team[0], "name":team[1]} for team in subTeam.objects.values_list("code", "name").filter(code__in=sub_team_id).order_by('code').distinct("code")]
        context["user_list"] = [{"id":user[0], "name":user[1]+" "+user[2], "username":user[3]} for user in User.objects.values_list("id", "first_name", "last_name", "username").filter(team__location__code=self.request.user.team.location.code).exclude(sub_team__code__in=sub_team_id)]
        return context

class member_shift_info(APIView):

    def get(self, request):
        try:

            shift_date = self.request.GET.get('sdate', None)

            cshift = self.request.GET.get('cshift', None)

            shift_info = shift.objects.values('member__username', 'member__first_name', 'member__last_name', 'member__email').filter(sdate=shift_date, shift__code=cshift, member__team__code=self.request.user.team.code)

            for sft in shift_info:

                sft['task'] = task_plan.objects.get(sdate=shift_date, member__username=sft['member__username']).task.name

            return Response({'shift_info':shift_info, 'date':datetime.datetime.strptime(shift_date, '%Y-%m-%d').strftime('%B %d, %Y')})

        except Exception as e:
            return Response(str(e), status=500)

class admin_owner_group(APIView):

    def get(self, request):
        try:
            
            admin_owner_group = sub_team_owner.objects.values('sub_team_id', 'sub_team__name').filter(owner=request.user, sub_team__team__code=request.user.team.code)

            return Response(admin_owner_group)

        except Exception as e:
            return Response(str(e), status=500)

class group_list(APIView):

    def get(self, request):
        try:

            team_id = request.GET.get('tm', None)
            
            if team_id == None:
            
                group_list = subTeam.objects.values('code', 'name').filter(team__code=request.user.team.code)

            else:

                group_list = subTeam.objects.values('code', 'name').filter(team__code=team_id)

            return Response(group_list)

        except Exception as e:
            return Response(str(e), status=500)

class team_list(APIView):

    def get(self, request):
        try:
            
            team_list = team.objects.values('code', 'name').all()

            return Response(team_list)

        except Exception as e:
            return Response(str(e), status=500)

class save_temp_shift(APIView):

    def post(self, request):
        try:
            shift_data = self.request.data
            
            member = User.objects.get(username=shift_data.get('member'))

            shift_temp.objects.filter(member=member, sdate=shift_data.get('sdate')).update(shift=shift_type.objects.get(code=shift_data.get('shift'), location__code=request.user.team.location.code))

            return Response(shift_data)

        except Exception as e:
            return Response(str(e), status=500)

class shift_type_info(APIView):

    def get(self, request):
        try:
            shift_type_list = shift_type.objects.values().filter(location__code=request.user.team.location.code).order_by('ordering')
            return Response(shift_type_list)
        except Exception as e:
            return Response(str(e), status=500)

class shift_status_info(APIView):

    def get(self, request):
        try:
            shift_status_list = shift_status.objects.values().filter(is_allow_use_by_members=True)

            return Response(shift_status_list)
        except Exception as e:
            return Response(str(e), status=500)

class finalize_sift(APIView):

    def post(self, request):
        try:
            shift_data = self.request.data
            
            shift_plan_init = shift_plan_admin(shift_planer_info=request.user)
            shift_plan_init.finalize_sift(shift_data)

            return Response("shift_plan")
        except Exception as e:
            print(str(e))
            return Response(str(e), status=500)

class get_change_request(APIView):

    def get(self, request):
        try:
            change_request_get = change_request.objects.get(sdate=self.request.GET.get('sdate', datetime.datetime.now()), member=self.request.user)
            
            change_request_comment_list = []

            change_request_comment = change_request_get.change_request_comment.values('comment_by', 'comment', 'comment_on', 'is_seen').order_by('comment_on')
            
            for cmd in change_request_comment:

                if cmd['comment_by'] == self.request.user.id:
                    comment_by = {'username': self.request.user.username,'name':"You"}
                else:
                    user_info = User.objects.get(id=cmd['comment_by'])
                    comment_by = {'username': user_info.username,'name':user_info.get_full_name()}

                change_request_comment_list.append({'comment_by': comment_by, 'comment': cmd['comment'], 'comment_on': cmd['comment_on'].strftime('%B %d, %Y %H:%M'), 'is_seen':cmd['is_seen']})
            
            change_request_get = {
                 'request_id':change_request_get.id,
                 'name': change_request_get.member.get_full_name(),
                 'change_to': change_request_get.change_to.name,
                 'change_from': change_request_get.change_from.name,
                 'status': change_request_get.status.name,
                 'is_seen': change_request_get.is_seen,
                 'request_type': change_request_get.request_type,
                 'approver_id': None if change_request_get.approver == None else change_request_get.approver.get_full_name(),
                 'request_on': change_request_get.request_on.strftime('%B %d, %Y %H:%M'),
                 'request_approved_on': "" if change_request_get.request_approved_on == None else change_request_get.request_approved_on.strftime('%B %d, %Y %H:%M'),
                 'comments': change_request_comment_list,
            }

            return Response(change_request_get)
        except Exception as e:
            return Response(str(e), status=500)

class update_change_request_comment(APIView):

    def post(self, request):
        try:
            change_request_id = request.data.get('change_request_id', None)

            comment = request.data.get('comment', None)

            if change_request_id == None:
                raise Exception('Parameter change_request_id missing')

            change_request_id = change_request.objects.get(id=change_request_id)

            change_request_comment.objects.create(comment_for=change_request_id, comment_by=self.request.user, comment=comment)

            return Response("Comment added successful")
        except Exception as e:
            return Response(str(e), status=500)

class create_shift_change_request(APIView):

    def post(self, request):
        try:
            sdate = request.data.get('sdate', None)

            change_to = request.data.get('change_to', None)

            request_type = request.data.get('request_type', None)

            change_from = shift.objects.get(member=self.request.user, sdate=sdate).shift

            status = shift_status.objects.get(code="WAITING")

            change_to = shift_type.objects.get(code=change_to, location__code=request.user.team.location.code)

            change_request.objects.update_or_create(sdate=sdate, member=self.request.user, defaults={
                'change_to': change_to,
                'change_from': change_from,
                'request_type': request_type,
                'status': status
            })

            return Response("Request Created successful")
        except Exception as e:
            print(str(e))
            return Response(str(e), status=500)

class get_status_change_request(APIView):

    def get(self, request):
        try:
            status_change_request_get = status_change_request.objects.get(sdate=self.request.GET.get('sdate', datetime.datetime.now()), member=self.request.user)
            
            status_change_request_comment_list = []

            status_change_request_comment = status_change_request_get.status_change_request_comment.values('comment_by', 'comment', 'comment_on', 'is_seen').order_by('comment_on')
            
            for cmd in status_change_request_comment:

                if cmd['comment_by'] == self.request.user.id:
                    comment_by = {'username': self.request.user.username,'name':"You"}
                else:
                    user_info = User.objects.get(id=cmd['comment_by'])
                    comment_by = {'username': user_info.username,'name':user_info.get_full_name()}

                status_change_request_comment_list.append({'comment_by': comment_by, 'comment': cmd['comment'], 'comment_on': cmd['comment_on'].strftime('%B %d, %Y %H:%M'), 'is_seen':cmd['is_seen']})
            
            status_change_request_get = {
                 'request_id':status_change_request_get.id,
                 'name': status_change_request_get.member.get_full_name(),
                 'shift_status_to': status_change_request_get.shift_status_to.name,
                 'status': status_change_request_get.status.name,
                 'approver_id': None if status_change_request_get.approver == None else status_change_request_get.approver.get_full_name(),
                 'request_on': status_change_request_get.request_on.strftime('%B %d, %Y %H:%M'),
                 'request_approved_on': "" if status_change_request_get.request_approved_on == None else status_change_request_get.request_approved_on.strftime('%B %d, %Y %H:%M'),
                 'comments': status_change_request_comment_list,
            }

            return Response(status_change_request_get)
        except Exception as e:
            return Response(str(e), status=500)

class shift_summary(APIView):

    def get(self, request):
        try:
            datetime_now = datetime.datetime.now()

            shift_info = shift.objects.filter(sdate__month=datetime_now.month, member=self.request.user)

            shift_count = shift_info.values('shift__name').annotate(count=Count('shift__name'))
            
            shift_count = list(shift_count)

            week_off = 0

            holidays = 0

            total_working_days = 0

            days_in_month = calendar.monthrange(datetime_now.year, datetime_now.month)[1]

            days_in_month = [datetime.date(datetime_now.year, datetime_now.month, day) for day in range(1, days_in_month+1)]
            
            holiday_list = Holiday.objects.values_list('date', flat=True).filter(date__month=datetime_now.month, date__year=datetime_now.year, location=self.request.user.team.location)
            
            for days in days_in_month:

                if days.isoweekday() in [6,7]:
                    week_off += 1
                elif days in holiday_list:
                    holidays += 0
                else:
                    total_working_days += 1
            
            shift_count.append({'shift__name': 'Total Week Off', 'count': week_off})

            shift_count.append({'shift__name': 'Holidays', 'count': holidays})

            shift_count.append({'shift__name': 'Total Working Days', 'count': total_working_days})

            return Response({'summary':shift_count, 'month': datetime.date(datetime_now.year, datetime_now.month, 1).strftime("%B")})
        except Exception as e:
            return Response(str(e), status=500)

class update_status_change_request_comment(APIView):

    def post(self, request):
        try:
            status_change_request_id = request.data.get('status_change_request_id', None)

            comment = request.data.get('comment', None)

            if status_change_request_id == None:
                raise Exception('Parameter status_change_request_id missing')

            status_change_request_id = status_change_request.objects.get(id=status_change_request_id)

            status_change_request_comment.objects.create(comment_for=status_change_request_id, comment_by=self.request.user, comment=comment)

            return Response("Comment added successful")
        except Exception as e:
            return Response(str(e), status=500)

class create_status_change_request(APIView):

    def post(self, request):
        try:
            sdate = request.data.get('sdate', None)

            shift_status_to = request.data.get('shift_status_to', None)

            status = shift_status.objects.get(code="WAITING")

            shift_status_to = shift_status.objects.get(code=shift_status_to)

            status_change_request.objects.update_or_create(sdate=sdate, member=self.request.user, defaults={
                'shift_status_to': shift_status_to,
                'status': status
            })

            return Response("Request Created successful")
        except Exception as e:
            print(str(e))
            return Response(str(e), status=500)

class swap_request_list(APIView):

    def get(self, request):
        try:
            data_set = []

            swap_request_list =  swap_request.objects.filter(swap_date_to__month=datetime.datetime.now().month, requested_to=self.request.user).exclude(Q(status__code="APPROVED")|Q(sm_status__code="REJECTED"))

            for req in swap_request_list:
                data_set.append({'requested_by':{"username":req.requested_from.username, "name":req.requested_from.get_full_name(), "task":req.requested_from.sub_team.name, "email":req.requested_from.email}, "date_from":req.swap_date_from.strftime("%a, %d-%B, %Y"), "shift_from": req.swap_shift_from.name, "date_to":req.swap_date_to.strftime("%a, %d-%B, %Y"), "shift_to": req.swap_shift_to.name, "request_id":req.id, "sm_status": req.sm_status.name})

            return Response(data_set, status=200)
        except Exception as e:
            return Response(str(e), status=500)

class my_swap_request_list(APIView):

    def get(self, request):
        try:
            data_set = []

            swap_request_list =  swap_request.objects.filter(swap_date_to__month=datetime.datetime.now().month, requested_from=self.request.user).exclude(status__code="APPROVED")

            for req in swap_request_list:
                data_set.append({'requested_to':{"username":req.requested_to.username, "name":req.requested_to.get_full_name(), "task":req.requested_to.sub_team.name, "email":req.requested_to.email}, "date_from":req.swap_date_from.strftime("%a, %d-%B, %Y"), "shift_from": req.swap_shift_from.name, "date_to":req.swap_date_to.strftime("%a, %d-%B, %Y"), "shift_to": req.swap_shift_to.name, "request_id":req.id, "sm_status": req.sm_status.name})

            return Response(data_set, status=200)
        except Exception as e:
            return Response(str(e), status=500)

class view_swap_request(APIView):

    def get(self, request):
        try:
            swap_request_inst = swap_request.objects.get(id=self.request.GET.get('swap_request_id', None))

            request_info = {'id': swap_request_inst.id,"requester_name":swap_request_inst.requested_from.get_full_name(), "request_to_name":swap_request_inst.requested_to.get_full_name(), "is_sm_approved": True if swap_request_inst.sm_status.code == "APPROVED" else False,"sm_status":swap_request_inst.sm_status.name, "sm_approved_on":"" if swap_request_inst.sm_approved_on == None else swap_request_inst.sm_approved_on.strftime("%a, %d-%B, %Y"),"approver":swap_request_inst.approver.get_full_name() if swap_request_inst.approver != None else "", "is_request_completed": True if swap_request_inst.sm_status.code in ["APPROVED", "REJECTED"] else False,"status":swap_request_inst.status.name,"approved_on":"" if swap_request_inst.request_approved_on == None else swap_request_inst.request_approved_on.strftime("%a, %d-%B, %Y"),'requested_on': swap_request_inst.request_on.strftime("%a, %d-%B, %Y %H:%M"),"from":{"date":swap_request_inst.swap_date_from.strftime("%a, %d-%B, %Y"),"shift_id":swap_request_inst.swap_shift_from.code, "shift_name":swap_request_inst.swap_shift_from.name}, "to":{"date":swap_request_inst.swap_date_to.strftime("%a, %d-%B, %Y"), "shift_id":swap_request_inst.swap_shift_to.code, "shift_name":swap_request_inst.swap_shift_to.name}}

            requested_from_shift_info = shift.objects.values('member__username', 'member__first_name', 'member__last_name', 'member__email').filter(sdate=swap_request_inst.swap_date_from, shift=swap_request_inst.swap_shift_from)

            for sft in requested_from_shift_info:
                
                sft['mark'] = True if sft["member__username"] == swap_request_inst.requested_from.username else False

                sft['task'] = task_plan.objects.get(sdate=swap_request_inst.swap_date_from, member__username=sft['member__username']).task.name

            requested_to_shift_info = shift.objects.values('member__username', 'member__first_name', 'member__last_name', 'member__email').filter(sdate=swap_request_inst.swap_date_to, shift=swap_request_inst.swap_shift_to)

            for sft in requested_to_shift_info:
                
                sft['mark'] = True if sft["member__username"] == swap_request_inst.requested_to.username else False

                sft['task'] = task_plan.objects.get(sdate=swap_request_inst.swap_date_to, member__username=sft['member__username']).task.name

            return Response({"request_info":request_info,'requested_from_shift_info':requested_from_shift_info, 'requested_to_shift_info':requested_to_shift_info})

        except Exception as e:
            return Response(str(e), status=500)

class approve_sm_swap_request(APIView):

    def post(self, request):
        try:
            request_id = self.request.data.get('request_id', None)

            swap_request_inst = swap_request.objects.get(id=request_id)
            if swap_request_inst.requested_to != self.request.user:
                raise("Permission denied, Only requested to member can approve this request.")
            swap_request_inst.sm_status = shift_status.objects.get(code="APPROVED")
            swap_request_inst.status = shift_status.objects.get(code="WAITING")
            swap_request_inst.sm_approved_on = timezone.now()
            swap_request_inst.save()

            return Response("Swap request approved")

        except Exception as e:
            print(str(e))
            return Response(str(e), status=500)

class get_shift_claim_member(APIView):

    def get(self, request):
        try:
            month = self.request.query_params.get('month', (datetime.datetime.now() - dateutil.relativedelta.relativedelta(months=1)).month)
            year = self.request.query_params.get('year', (datetime.datetime.now() - dateutil.relativedelta.relativedelta(months=1)).year)
            shift_claim_init = shift_claim()
            claim = shift_claim_init.member(member=self.request.user, month=int(month), year=int(year))

            return Response(claim)
        except Exception as e:
            return Response(str(e), status=500)

class get_shift_claim_team(APIView):

    def get(self, request):
        try:
            month = self.request.query_params.get('month', (datetime.datetime.now() - dateutil.relativedelta.relativedelta(months=1)).month)
            year = self.request.query_params.get('year', (datetime.datetime.now() - dateutil.relativedelta.relativedelta(months=1)).year)        
            shift_claim_init = shift_claim()
            claim = shift_claim_init.team(owner=self.request.user, month=int(month), year=int(year))

            return Response(claim)
        except Exception as e:
            return Response(str(e), status=500)

class update_shift_member_leave(APIView):

    def post(self, request):
        try:
            username = self.request.data.get('username', None)
            leave_data = self.request.data.get('leave_data', datetime.datetime.now())
            leave_type = self.request.data.get('leave_type', datetime.datetime.now())
            
            shift_temp.objects.filter(member__username=username, sdate=leave_data).update(shift=shift_type.objects.get(code=leave_type, location__code=request.user.team.location.code))
            shift.objects.filter(member__username=username, sdate=leave_data).update(shift=shift_type.objects.get(code=leave_type, location__code=request.user.team.location.code))
            task_plan.objects.filter(member__username=username, sdate=leave_data).update(task=subTeam.objects.get(code="NOT_ASSIGN"))

            return Response({"detail": "leave updated successfully"})
        except Exception as e:
            return Response(str(e), status=500)

class reject_sm_swap_request(APIView):

    def post(self, request):
        try:
            request_id = self.request.data.get('request_id', None)

            swap_request_inst = swap_request.objects.get(id=request_id)
            if swap_request_inst.requested_to != self.request.user:
                raise("Permission denied, Only requested to member can approve this request.")
            swap_request_inst.sm_status = shift_status.objects.get(code="REJECTED")
            swap_request_inst.status = shift_status.objects.get(code="REJECTED")
            swap_request_inst.sm_approved_on = timezone.now()
            swap_request_inst.save()

            return Response("Swap request rejected")
            
        except Exception as e:
            return Response(str(e), status=500)

class delete_swap_request(APIView):

    def delete(self, request):
        try:
            request_id = self.request.data.get('request_id', None)

            swap_request_inst = swap_request.objects.get(id=request_id)
            if swap_request_inst.requested_from != self.request.user:
                raise("Permission denied, Only requester can approve this request.")
            swap_request_inst.delete()

            return Response("Swap request deleted")
            
        except Exception as e:
            return Response(str(e), status=500)

class holiday_view(APIView):

    def get(self, request):
        try:
            shift_month = int(request.GET.get('m', datetime.datetime.now().month))

            shift_year = int(request.GET.get('y', datetime.datetime.now().year))

            location_id = team.objects.get(code=request.GET.get('tm', self.request.user.team.code)).location

            get_holiday_list = []

            get_holiday_list_query = Holiday.objects.filter(date__month=shift_month, date__year=shift_year,location=location_id).order_by('date')

            for holiday in get_holiday_list_query:
                get_holiday_list.append({'name':holiday.name, 'date':holiday.date.strftime('%d %B, %Y'), 'img':holiday.img})

            return Response(get_holiday_list)
        except Exception as e:
            return Response(str(e), status=500)

class holiday_today_view(APIView):

    def get(self, request):
        try:
            location_id = team.objects.get(code=request.GET.get('tm', self.request.user.team.code)).location
            
            get_holiday = Holiday.objects.get(date=datetime.datetime.today(),location=location_id)

            get_holiday = {'name':get_holiday.name, 'date':get_holiday.date.strftime('%d %B, %Y'), 'img':get_holiday.img}

            return Response(get_holiday)
        except Exception as e:
            return Response(str(e), status=500)

class get_member_info(APIView):

    def get(self, request):
        try:
            wdays = {'1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday'}

            member_details = self.request.GET

            user_inst = User.objects.get(username=member_details['inumber'])

            holiday_list = Holiday.objects.values_list('date', flat=True).filter(date__month=member_details['pm'], date__year=member_details['py'], location=user_inst.team.location)

            shift_details = shift_temp.objects.values('sdate', 'shift').filter(member=user_inst,sdate__month=member_details['pm'], sdate__year=member_details['py']).order_by("-sdate")[:7]
            
            lmonth = shift_details[0]['sdate'].strftime('%B')

            lyear = shift_details[0]['sdate'].strftime('%Y')
            
            shift_details = [{'date': shift_detail['sdate'].day, 'day': calendar.day_name[shift_detail['sdate'].weekday()][:3], 'shift': shift_detail['shift'], 'is_holiday': True if (shift_detail['sdate'] in holiday_list or shift_detail['sdate'].isoweekday() in [6,7]) else False} for shift_detail in reversed(shift_details)]
            
            planned_leaves = [pl_date.strftime("%d %b %Y") for pl_date in planned_leave_calander.objects.values_list('sdate', flat=True).filter(member=user_inst, sdate__month=member_details['m'], sdate__year=member_details['y'])]

            shift_preferance_user = shift_preferance.objects.get(member=user_inst)

            shift_pref = shift_preferance_user.shift.code

            week_off_pref = ["6","7"] if shift_preferance_user.shift_off == None else shift_preferance_user.shift_off.split(',')

            week_off_pref = " and ".join(wdays.get(weekoff, 7) for weekoff in week_off_pref)

            try:
                shift_cmd = shift_comment.objects.get(member=user_inst, comment_month=member_details['m']).comment
            except:
                shift_cmd = "No Comments"

            return Response({'full_name': user_inst.get_full_name(), 'work_group':user_inst.sub_team.name,'lshift':shift_details, 'planned_leaves':planned_leaves, "shift_cmd":shift_cmd, "shift_pref":shift_pref, "weekoff":week_off_pref, 'lmonth':lmonth, 'lyear':lyear})
        except Exception as e:
            return Response(str(e), status=500)

class create_swap_request(APIView):

    def post(self, request):
        try:
            parameter = self.request.data

            swap_shift_from = shift.objects.get(sdate=parameter['swap_date_from'], member=self.request.user).shift
            
            swap_shift_to = shift.objects.get(sdate=parameter['swap_date_to'], member__username=parameter['requested_to']).shift

            swap_request.objects.create(swap_date_from=parameter['swap_date_from'], swap_shift_from=swap_shift_from, swap_date_to=parameter['swap_date_to'], swap_shift_to=swap_shift_to, requested_from=self.request.user, requested_to=User.objects.get(username=parameter['requested_to']), sm_status=shift_status.objects.get(code="WAITING"), status=shift_status.objects.get(code="WAITING_SM"))

            return Response("Swap request created", status=200)
        except Exception as e:
            return Response(str(e), status=500)

class get_member_info_swap_request(APIView):

    def get(self, request):
        try:
            wdays = {'1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday'}
            
            member_details = self.request.GET

            start_date = datetime.datetime.strptime(member_details['swap_date'], '%Y-%m-%d') - datetime.timedelta(days=6)

            end_date = datetime.datetime.strptime(member_details['swap_date'], '%Y-%m-%d') + datetime.timedelta(days=6)
            
            user_inst = User.objects.get(username=member_details['inumber'])

            holiday_list = Holiday.objects.values_list('date', flat=True).filter(date__range=(start_date, end_date), location=user_inst.team.location)

            shift_details = shift.objects.values('sdate', 'shift', 'shift__code').filter(member=user_inst,sdate__range=(start_date, end_date)).order_by("-sdate")
            
            shift_details = [{'date': shift_detail['sdate'].day, 'day': calendar.day_name[shift_detail['sdate'].weekday()][:3], 'shift': shift_detail['shift__code'], 'is_holiday': True if (shift_detail['sdate'] in holiday_list or shift_detail['sdate'].isoweekday() in [6,7]) else False} for shift_detail in reversed(shift_details)]

            is_swap_request_available = False if swap_request.objects.filter(Q(swap_date_from=member_details['swap_date'])|Q(swap_date_to=member_details['swap_date'])).filter(Q(requested_from=user_inst)|Q(requested_to=user_inst)).count() == 0 else True

            return Response({'lshift':shift_details, 'is_swap_request_available':is_swap_request_available})
        except Exception as e:
            return Response(str(e), status=500)

class member_shift_preferences(APIView):

    def get(self, request):
        try:
            wdays = {'1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday'}

            shift_preferance_user = shift_preferance.objects.get(member=self.request.user)

            shift_pref = shift_preferance_user.shift.code

            week_off_pref = shift_preferance_user.shift_off

            return Response({'shift':shift_pref, 'week_off':week_off_pref})

        except Exception as e:
            wdays = {'1': 'Monday', '2': 'Tuesday', '3': 'Wednesday', '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday'}
            
            get_first_shift = shift_type.objects.get(code="S1", location__code=request.user.team.location.code)

            shift_preferance_user = shift_preferance.objects.create(member=self.request.user, shift=get_first_shift, shift_off="6,7")

            shift_pref = shift_preferance_user.shift.code

            week_off_pref = shift_preferance_user.shift_off

            return Response({'shift':shift_pref, 'week_off':week_off_pref})
    
    def post(self, request):
        try:
            shift = self.request.data.get('shift', None)

            week_off = self.request.data.get('week_off', None)

            shift_preferance.objects.filter(member=self.request.user).update(shift=shift_type.objects.get(code=shift, location__code=request.user.team.location.code), shift_off=week_off)

            return Response("Preferance updated")
        except Exception as e:
            return Response(str(e), status=500)

class admin_view_change_request(APIView):

    def get(self, request):
        try:

            sub_team_id = sub_team_owner.objects.values_list('sub_team_id', flat=True).filter(owner=request.user, sub_team__team__code=request.user.team.code)

            change_request_list = change_request.objects.values('id','sdate', 'member__username', 'member__first_name', 'member__last_name', 'change_to__code', 'change_to__name', 'change_from__code', 'change_from__name', 'request_type').filter(member__sub_team__in=sub_team_id, status__code__in=["WAITING", "WAITING_SM"], request_type="SHIFT_CHANGE", sdate__month=datetime.datetime.now().month).exclude(member=self.request.user)

            for cr in change_request_list:

                member_task = task_plan.objects.get(sdate=cr["sdate"], member__username=cr["member__username"]).task.name

                cr['task'] = member_task

                cr['sdatef'] = cr['sdate'].strftime('%A %B %d, %Y')
            
            return Response(change_request_list)

        except Exception as e:
            return Response(str(e), status=500)

class admin_view_leave_request(APIView):

    def get(self, request):
        try:
            final_data = []

            sub_team_id = sub_team_owner.objects.values_list('sub_team_id', flat=True).filter(owner=request.user, sub_team__team__code=request.user.team.code)

            change_request_list = change_request.objects.values('id','sdate', 'member__username', 'member__first_name', 'member__last_name', 'change_to__code', 'change_to__name', 'change_from__code', 'change_from__name', 'request_type').filter(member__sub_team__in=sub_team_id, status__code__in=["WAITING", "WAITING_SM"], request_type="LEAVE_REQUEST", sdate__month=datetime.datetime.now().month).exclude(member=self.request.user)

            for cr in change_request_list:

                member_task = task_plan.objects.get(sdate=cr["sdate"], member__username=cr["member__username"]).task.name

                cr['task'] = member_task

                cr['sdatef'] = cr['sdate'].strftime('%A %B %d, %Y')
            
            return Response(change_request_list)

        except Exception as e:
            return Response(str(e), status=500)

class get_change_request_with_id(APIView):

    def get(self, request):
        try:
            change_request_get = change_request.objects.get(id=self.request.GET.get('id', None))
            
            change_request_comment_list = []

            change_request_comment = change_request_get.change_request_comment.values('comment_by', 'comment', 'comment_on', 'is_seen').order_by('comment_on')
            
            for cmd in change_request_comment:

                if cmd['comment_by'] == self.request.user.id:
                    comment_by = {'username': self.request.user.username,'name':"You"}
                else:
                    user_info = User.objects.get(id=cmd['comment_by'])
                    comment_by = {'username': user_info.username,'name':user_info.get_full_name()}

                change_request_comment_list.append({'comment_by': comment_by, 'comment': cmd['comment'], 'comment_on': cmd['comment_on'].strftime('%B %d, %Y %H:%M'), 'is_seen':cmd['is_seen']})
            
            change_request_get = {
                 'request_id':change_request_get.id,
                 'name': change_request_get.member.get_full_name(),
                 'change_to': change_request_get.change_to.name,
                 'change_from': change_request_get.change_from.name,
                 'status': change_request_get.status.name,
                 'is_seen': change_request_get.is_seen,
                 'request_type': change_request_get.request_type,
                 'approver_id': None if change_request_get.approver == None else change_request_get.approver.get_full_name(),
                 'request_on': change_request_get.request_on.strftime('%B %d, %Y %H:%M'),
                 'request_approved_on': "" if change_request_get.request_approved_on == None else change_request_get.request_approved_on.strftime('%B %d, %Y %H:%M'),
                 'comments': change_request_comment_list,
            }

            return Response(change_request_get)
        except Exception as e:
            return Response(str(e), status=500)

class admin_action_request(APIView):

    def post(self, request):
        try:
            request_id = self.request.data.get('request_id', None)

            action = self.request.data.get('action_type', None)

            change_request_init = change_request.objects.get(id=request_id)

            if action == "APPROVED":
                shift_temp.objects.filter(sdate=change_request_init.sdate, member=change_request_init.member).update(shift=change_request_init.change_to)
                shift.objects.filter(sdate=change_request_init.sdate, member=change_request_init.member).update(shift=change_request_init.change_to)
            
            change_request.objects.update_or_create(id=request_id, defaults={"status": shift_status.objects.get(code=action),})

            return Response("Action updated successful")

        except Exception as e:
            print(str(e))
            return Response(str(e), status=500)

class admin_swap_request_list(APIView):

    def get(self, request):
        try:
            sub_team_id = sub_team_owner.objects.values_list('sub_team_id', flat=True).filter(owner=request.user, sub_team__team__code=request.user.team.code)

            swap_request_list = swap_request.objects.values('id', 'swap_date_from', 'swap_date_to', 'requested_from__username', 'requested_from__first_name', 'requested_from__last_name', 'requested_from__email', 'requested_to__username', 'requested_to__first_name', 'requested_to__last_name', 'requested_to__email','swap_shift_to__code', 'swap_shift_to__name', 'swap_shift_from__code', 'swap_shift_from__name').filter(Q(requested_from__sub_team__in=sub_team_id)|Q(requested_to__sub_team__in=sub_team_id), status__code="WAITING").filter(Q(swap_date_from__month=datetime.datetime.now().month)|Q(swap_date_to__month=datetime.datetime.now().month)).exclude(Q(requested_from=self.request.user)|Q(requested_to=self.request.user))

            for sw in swap_request_list:

                member_task_from = task_plan.objects.get(sdate=sw["swap_date_from"], member__username=sw["requested_from__username"]).task.name
                member_task_to = task_plan.objects.get(sdate=sw["swap_date_to"], member__username=sw["requested_to__username"]).task.name

                sw['requested_from_task'] = member_task_from
                sw['requested_to_task'] = member_task_to

                sw['swap_date_fromf'] = sw['swap_date_from'].strftime('%A %B %d, %Y')
                sw['swap_date_tof'] = sw['swap_date_to'].strftime('%A %B %d, %Y')

            return Response(swap_request_list)
        except Exception as e:
            return Response(str(e), status=500)

class admin_swap_action_request(APIView):

    def post(self, request):
        try:
            request_id = self.request.data.get('request_id', None)

            action = self.request.data.get('action_type', None)

            swap_request_init = swap_request.objects.get(id=request_id)

            if action == "APPROVED":
                shift_temp.objects.filter(sdate=swap_request_init.swap_date_from, member=swap_request_init.requested_from).update(sdate=swap_request_init.swap_date_to,shift=swap_request_init.swap_shift_to)
                shift_temp.objects.filter(sdate=swap_request_init.swap_date_to, member=swap_request_init.requested_to).update(sdate=swap_request_init.swap_date_from,shift=swap_request_init.swap_shift_from)
                shift.objects.filter(sdate=swap_request_init.swap_date_from, member=swap_request_init.requested_from).update(sdate=swap_request_init.swap_date_to,shift=swap_request_init.swap_shift_to)
                shift.objects.filter(sdate=swap_request_init.swap_date_to, member=swap_request_init.requested_to).update(sdate=swap_request_init.swap_date_from,shift=swap_request_init.swap_shift_from)
            
            swap_request.objects.update_or_create(id=request_id, defaults={"status": shift_status.objects.get(code=action), "approver": self.request.user})

            return Response("Action updated successful")

        except Exception as e:
            print(str(e))
            return Response(str(e), status=500)

class shift_type_html(TemplateView):

    template_name = 'roster/admin/shift_type.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['admin_location'] = self.request.user.team.location.code
        return context

class shift_type_mv(ModelViewSet):

    serializer_class = shift_type_serializers
    queryset = shift_type.objects.all()

    def get_queryset(self):
        try:
            queryset = shift_type.objects.filter(location=self.request.user.team.location)

            return queryset
        except Exception as e:
            return Response(str(e),status=500)

class user_shift_plan_next_month(APIView):

    def get(self, request):
        try:
            user_shift_init = user_shift()

            res = user_shift_init.get_shift_info(member=request.user)

            return Response(res)
        except Exception as e:
            return Response(str(e), status=500)

    def post(self, request):
        try:
            shift = self.request.data.get('shift', None)
            sdate = self.request.data.get('sdate', None)
            
            sdate = datetime.datetime.strptime(sdate, '%d-%m-%Y')

            shift_temp.objects.filter(sdate=sdate, member=request.user).update(shift=shift_type.objects.get(code=shift, location__code=request.user.team.location.code))

            return Response("Update Success successful")

        except Exception as e:
            return Response(str(e), status=500)