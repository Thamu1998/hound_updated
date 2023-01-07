from apps.roster.models import task_plan, Holiday
from apps.user_account.models import sub_team_owner, User, team, subTeam
import calendar
import datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import PermissionDenied

class gen_task(object):

    def __init__(self, *args, **kwargs):
        super(gen_task, self).__init__()
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

    def generate_task_plan(self, *args, **kwargs):

        days_in_month = calendar.monthrange(kwargs['year'], kwargs['month'])[1]

        days_in_month = [datetime.date(kwargs['year'], kwargs['month'], day) for day in range(1, days_in_month+1)]

        for days in days_in_month:

            task_plan.objects.update_or_create(sdate=days, member=kwargs['member'], defaults={'task': kwargs['member'].sub_team})

    def gen_date_list(self, *args, **kwargs):

        header_list = []

        days_in_month = calendar.monthrange(kwargs['year'], kwargs['month'])[1]

        days_in_month = [datetime.date(kwargs['year'], kwargs['month'], day) for day in range(1, days_in_month+1)]
        
        holiday_list = Holiday.objects.values_list('date', flat=True).filter(date__month=kwargs['month'], date__year=kwargs['year'], location=kwargs['member'].team.location)
        
        for days in days_in_month:
            
            temp = {'date': days.day, 'day': calendar.day_name[days.weekday()][:3], 'is_holiday': True if (days in holiday_list or days.isoweekday() in [6,7]) else False}

            header_list.append(temp)
        
        return header_list

    def create_update_plan(self, *args, **kwargs):

        sub_team_owner_inst = sub_team_owner.objects.filter(owner=self.planner_inst, sub_team__team__code=self.planner_inst.team.code)
        
        if kwargs['selected_group'] != None:
            sub_team_owner_inst = sub_team_owner.objects.filter(owner=self.planner_inst, sub_team__in=kwargs['selected_group'].split(';'))

        list_of_task_members = User.objects.filter(team__code=self.planner_inst.team.code, role__isInShiftPlan=True, technical_user=False, is_block=False, sub_team__in=sub_team_owner_inst.values_list('sub_team_id', flat=True)).order_by('shift_preferance_info__shift__ordering')
        
        for user in list_of_task_members:
            
            plan = task_plan.objects.filter(member=user,sdate__month=kwargs['month'], sdate__year=kwargs['year']).count()
            
            if plan == 0:
                
                self.generate_task_plan(month=kwargs['month'], year=kwargs['year'], member=user)

    def get(self, *args, **kwargs):

        task_plan_data = []

        sub_team_owner_inst = sub_team_owner.objects.filter(owner=self.planner_inst, sub_team__team__code=self.planner_inst.team.code)
        
        if kwargs['selected_group'] != None:
            sub_team_owner_inst = sub_team_owner.objects.filter(owner=self.planner_inst, sub_team__in=kwargs['selected_group'].split(';'))

        list_of_task_members = User.objects.filter(team__code=self.planner_inst.team.code, role__isInShiftPlan=True, technical_user=False, is_block=False, sub_team__in=sub_team_owner_inst.values_list('sub_team_id', flat=True)).order_by('shift_preferance_info__shift__ordering')
        
        for user in list_of_task_members:
            
            plan = task_plan.objects.filter(member=user,sdate__month=kwargs['month'], sdate__year=kwargs['year'])
            
            if len(plan) == 0:
                
                self.generate_task_plan(month=kwargs['month'], year=kwargs['year'], member=user)

                plan = task_plan.objects.filter(member=user,sdate__month=kwargs['month'], sdate__year=kwargs['year'])

            temp = {'name': user.first_name,'full_name': user.get_full_name(), 'username': user.username, 'plan': plan.values('sdate','task').order_by('sdate')}

            task_plan_data.append(temp)

        get_date_list = self.gen_date_list(month=kwargs['month'], year=kwargs['year'], member=self.planner_inst)

        return {'task':task_plan_data, 'header': get_date_list, 'meta_data': self.generate_metadata(**kwargs)}