from apps.roster.models import shift_temp, shift_preferance, shift_type, Holiday, shift_comment, shift
from apps.user_account.models import sub_team_owner
import calendar
import datetime
from dateutil.relativedelta import relativedelta
from apps.user_account.models import User
from django.core.exceptions import PermissionDenied
from .generate_task import gen_task


class shift_plan_admin(object):

    def __init__(self, *args, **kwargs):
        super(shift_plan_admin, self).__init__()
        self.planner_inst = kwargs['shift_planer_info']

    def generate_metadata(self, *args, **kwargs):

        shift_month = datetime.date(kwargs['year'], kwargs['month'], 1)
        
        previous_month = shift_month - datetime.timedelta(days=1)
        
        next_month = shift_month + datetime.timedelta(days=32)
        
        meta_data = {
                        'month': kwargs['month'], 
                        'year': kwargs['year'], 
                        'month_name':datetime.date(kwargs['year'], kwargs['month'], 1).strftime("%B"),
                        'previous_month':{'month': previous_month.month, 'year': previous_month.year},
                        'next_month':{'month': next_month.month, 'year': next_month.year}
                    }
        

        return meta_data

    def gen_date_list(self, *args, **kwargs):

        header_list = []

        days_in_month = calendar.monthrange(kwargs['year'], kwargs['month'])[1]

        days_in_month = [datetime.date(kwargs['year'], kwargs['month'], day) for day in range(1, days_in_month+1)]
        
        holiday_list = Holiday.objects.values_list('date', flat=True).filter(date__month=kwargs['month'], date__year=kwargs['year'], location=kwargs['member'].team.location)
        
        for days in days_in_month:
            
            temp = {'date': days.day, 'day': calendar.day_name[days.weekday()][:3], 'is_holiday': True if (days in holiday_list or days.isoweekday() in [6,7]) else False}

            header_list.append(temp)
        
        return header_list

    def generate(self, *args, **kwargs):

        week_off_shift = shift_type.objects.get(code="W", location__code=self.planner_inst.team.location.code)

        try:
            shift_pref = shift_preferance.objects.get(member=kwargs['member'])
        except shift_preferance.DoesNotExist:
            get_first_shift = shift_type.objects.get(code__in=["S1", "HS1"], location__code=self.planner_inst.team.location.code)
            shift_pref = shift_preferance.objects.create(member=kwargs['member'], shift=get_first_shift, shift_off="6,7")

        days_in_month = calendar.monthrange(kwargs['year'], kwargs['month'])[1]

        days_in_month = [datetime.date(kwargs['year'], kwargs['month'], day) for day in range(1, days_in_month+1)]
        
        shift_off = [0,] if shift_pref.shift_off == None else shift_pref.shift_off.split(",")

        for days in days_in_month:
            
            if str(days.isoweekday()) in shift_off:
                shift_temp.objects.update_or_create(sdate=days, member=kwargs['member'], defaults={'shift': week_off_shift})
            else: 
                shift_temp.objects.update_or_create(sdate=days, member=kwargs['member'], defaults={'shift': shift_pref.shift})

    def shift_lock_unlock(self, *args, **kwargs):
        
        sub_team_owner_inst = sub_team_owner.objects.filter(owner=self.planner_inst)
        
        if kwargs['selected_group'] != None:
            sub_team_owner_inst = sub_team_owner.objects.filter(owner=self.planner_inst, sub_team__in=kwargs['selected_group'].split(';'))
        
        list_of_shift_members = User.objects.values_list('username', flat=True).filter(team__code=self.planner_inst.team.code, role__isInShiftPlan=True, technical_user=False, is_block=False, sub_team__in=sub_team_owner_inst.values_list('sub_team_id', flat=True)).order_by('shift_preferance_info__shift__ordering')
        
        shift_temp.objects.filter(member__username__in=list_of_shift_members,sdate__month=kwargs['month'], sdate__year=kwargs['year']).update(is_shift_locked=kwargs['is_locked'])
        
        return "Sift updated successfully"

    def finalize_sift(self, shift_inst):
        
        for shift_data in shift_inst:
            
            shift.objects.update_or_create(member=User.objects.get(username=shift_data['inumber']), sdate=shift_data['sdate'], defaults={'shift': shift_type.objects.get(code=shift_data["shift"], location__code=self.planner_inst.team.location.code)})

    def get(self, *args, **kwargs):

        shift_plan = []

        sub_team_owner_inst = sub_team_owner.objects.filter(owner=self.planner_inst, sub_team__team__code=self.planner_inst.team.code)
        
        if kwargs['selected_group'] != None:
            sub_team_owner_inst = sub_team_owner.objects.filter(owner=self.planner_inst, sub_team__in=kwargs['selected_group'].split(';'))

        list_of_shift_members = User.objects.filter(team__code=self.planner_inst.team.code, role__isInShiftPlan=True, technical_user=False, is_block=False, sub_team__in=sub_team_owner_inst.values_list('sub_team_id', flat=True)).order_by('shift_preferance_info__shift__ordering')
        
        for user in list_of_shift_members:

            plan = shift_temp.objects.filter(member=user,sdate__month=kwargs['month'], sdate__year=kwargs['year'])

            if len(plan) == 0:
                
                self.generate(month=kwargs['month'], year=kwargs['year'], member=user)

                plan = shift_temp.objects.filter(member=user,sdate__month=kwargs['month'], sdate__year=kwargs['year'])

            temp = {'name': user.first_name,'full_name': user.get_full_name(), 'username': user.username, 'plan': plan.values('sdate','shift__code').order_by('sdate'), 'is_shift_locked': True if plan.filter(is_shift_locked=True).count() > 0 else False, "iscomment": True if shift_comment.objects.filter(member=user, comment_month=kwargs['month']) else False}

            shift_plan.append(temp)

        task_plan_init = gen_task(shift_planer_info=self.planner_inst)
            
        task_plan_init.get(**kwargs)

        get_date_list = self.gen_date_list(month=kwargs['month'], year=kwargs['year'], member=self.planner_inst)

        shift_type_list = shift_type.objects.values('code', 'name').all().order_by('ordering')

        return {'plan':shift_plan, 'header': get_date_list, 'shift_type_list':shift_type_list, 'meta_data': self.generate_metadata(**kwargs)}

        



