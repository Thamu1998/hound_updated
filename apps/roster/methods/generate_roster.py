from apps.roster.models import shift_preferance, shift_type, Holiday, shift_comment, shift
from apps.user_account.models import sub_team_owner, User, team, subTeam
import calendar
import datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import PermissionDenied


class shift_plan(object):

    def __init__(self, *args, **kwargs):
        super(shift_plan, self).__init__()
        self.shift_memebr = kwargs['shift_memebr']

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
        
        holiday_list = Holiday.objects.values_list('date', flat=True).filter(date__month=kwargs['month'], date__year=kwargs['year'], location=team.objects.get(code=kwargs['team_id']).location)
        
        for days in days_in_month:
            
            temp = {'date': days.day, 'day': calendar.day_name[days.weekday()][:3], 'is_holiday': True if (days in holiday_list or days.isoweekday() in [6,7]) else False}

            header_list.append(temp)
        
        return header_list

    def get(self, *args, **kwargs):

        shift_plan = []

        team_filter = self.shift_memebr.team.code if kwargs['selected_team'] == None else team.objects.get(code=kwargs['selected_team']).code

        group_filter = subTeam.objects.values_list('code', flat=True).filter(team=team_filter) if kwargs['selected_group'] == None else subTeam.objects.values_list('code', flat=True).filter(code__in=kwargs['selected_group'].split(';'))
        
        list_of_shift_members = User.objects.filter(team__code=team_filter, role__isInShiftPlan=True, technical_user=False, is_block=False, sub_team__in=group_filter).order_by('shift_preferance_info__shift__ordering')
            
        for user in list_of_shift_members:

            plan = shift.objects.filter(member=user,sdate__month=kwargs['month'], sdate__year=kwargs['year'])

            if len(plan) != 0:
                
                temp = {'name': user.first_name,'full_name': user.get_full_name(), 'username': user.username, 'plan': plan.values('sdate','shift__code').order_by('sdate'), 'is_shift_locked': True if plan.filter(is_shift_locked=True).count() > 0 else False, "iscomment": True if shift_comment.objects.filter(member=user, comment_month=kwargs['month']) else False}

                shift_plan.append(temp)

        get_date_list = self.gen_date_list(month=kwargs['month'], year=kwargs['year'], team_id=team_filter)

        return {'plan':shift_plan, 'header': get_date_list, 'meta_data': self.generate_metadata(**kwargs)}

        



