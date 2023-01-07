from apps.roster.models import shift, shift_type, Holiday
import datetime
from collections import defaultdict
from apps.user_account.models import subTeam, team

class shift_claim(object):

    def __init__(self, *args, **kwargs):
        super(shift_claim, self).__init__()

    def member(self, *args, **kwargs):

        data = []

        total = 0

        month = {	'1':'Janauary',
                    '2':'February',
                    '3':'March',
                    '4':'April',
                    '5':'May',
                    '6':'June',
                    '7':'July',
                    '8':'August',
                    '9':'September',
                    '10':'October',
                    '11':'November',
                    '12':'December'		}
        
        shifts = shift.objects.filter(member=kwargs['member'], sdate__month=kwargs['month'], sdate__year=kwargs['year']).exclude(shift__normal_claim="0").order_by('sdate')

        holiday_list = Holiday.objects.values_list('date', flat=True).filter(date__month=kwargs['month'], date__year=kwargs['year'], location=kwargs['member'].team.location)

        for shift_info in shifts:

            claim = shift_info.shift.normal_claim

            is_holiday = False

            if (shift_info.sdate in holiday_list or shift_info.sdate.isoweekday() in [6,7]):
                claim = shift_info.shift.holiday_claim
                is_holiday = True

            total += claim
            
            data.append({"date":shift_info.sdate.strftime("%d %b, %Y"), "day":shift_info.sdate.strftime("%A"), "name":shift_info.shift.name, "is_holiday":is_holiday, "claim":claim})
        
        shift_month = datetime.date(kwargs['year'], kwargs['month'], 1)
        
        previous_month = shift_month - datetime.timedelta(days=1)
        
        next_month = shift_month + datetime.timedelta(days=32)

        return {"data":data, "total":total, "month":kwargs['month'], "year":kwargs['year'], "month_name":month[str(kwargs['month'])],"next":{"month":next_month.month, "year":next_month.year}, "prev":{"month": previous_month.month, "year": previous_month.year}}
    
    def team(self, *args, **kwargs):

        month = {	'1':'Janauary',
                    '2':'February',
                    '3':'March',
                    '4':'April',
                    '5':'May',
                    '6':'June',
                    '7':'July',
                    '8':'August',
                    '9':'September',
                    '10':'October',
                    '11':'November',
                    '12':'December'		}

        data = {}

        shifts = shift.objects.filter(member__team=kwargs['owner'].team, sdate__month=kwargs['month'], sdate__year=kwargs['year']).exclude(shift__normal_claim="0")
        
        holiday_list = Holiday.objects.values_list('date', flat=True).filter(date__month=kwargs['month'], date__year=kwargs['year'], location=kwargs['owner'].team.location)

        for shift_info in shifts:

            claim = shift_info.shift.normal_claim

            if (shift_info.sdate in holiday_list or shift_info.sdate.isoweekday() in [6,7]):
                claim = shift_info.shift.holiday_claim
            
            if shift_info.member.username in data:
                data[shift_info.member.username]["claim"] += claim
            else:
                data[shift_info.member.username] = {'name': shift_info.member.get_full_name(), "email": shift_info.member.email, "username": shift_info.member.username, "task": shift_info.member.sub_team.name, "claim": claim}

        shift_month = datetime.date(kwargs['year'], kwargs['month'], 1)
        
        previous_month = shift_month - datetime.timedelta(days=1)
        
        next_month = shift_month + datetime.timedelta(days=32)
        
        return {"data":data, "month":kwargs['month'], "year":kwargs['year'], "month_name":month[str(kwargs['month'])],"next":{"month":next_month.month, "year":next_month.year}, "prev":{"month": previous_month.month, "year": previous_month.year}}