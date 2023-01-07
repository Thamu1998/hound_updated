from apps.roster.models import shift_temp, shift_preferance, shift_type, Holiday, shift_comment
from django.utils import timezone
import datetime
import calendar
from dateutil.relativedelta import relativedelta

class user_shift(object):

    def __init__(self, *args, **kwargs):
        super(user_shift, self).__init__()

    def generate(self, *args, **kwargs):

        week_off_shift = shift_type.objects.get(code="W", location__code=kwargs['member'].team.location.code)

        try:
            shift_pref = shift_preferance.objects.get(member=kwargs['member'])
        except shift_preferance.DoesNotExist:
            get_first_shift = shift_type.objects.get(code="S1", location__code=kwargs['member'].team.location.code)
            shift_pref = shift_preferance.objects.create(member=kwargs['member'], shift=get_first_shift, shift_off="6,7")

        days_in_month = calendar.monthrange(kwargs['year'], kwargs['month'])[1]

        days_in_month = [datetime.date(kwargs['year'], kwargs['month'], day) for day in range(1, days_in_month+1)]
        
        shift_off = [0,] if shift_pref.shift_off == None else shift_pref.shift_off.split(",")

        for days in days_in_month:
            
            if str(days.isoweekday()) in shift_off:
                shift_temp.objects.update_or_create(sdate=days, member=kwargs['member'], defaults={'shift': week_off_shift})
            else: 
                shift_temp.objects.update_or_create(sdate=days, member=kwargs['member'], defaults={'shift': shift_pref.shift})

    def get_shift_info(self, *args, **kwargs):

        event_list = []

        shift_month = timezone.now() + relativedelta(months=1)
        
        plan = shift_temp.objects.filter(member=kwargs['member'],sdate__month=shift_month.month, sdate__year=shift_month.year)

        if len(plan) == 0:
                
            self.generate(month=shift_month.month, year=shift_month.year, member=kwargs['member'])

            plan = shift_temp.objects.filter(member=kwargs['member'],sdate__month=shift_month.month, sdate__year=shift_month.year)

        for shift in plan:
            event_list.append({"title": shift.shift.name, "start": shift.sdate, "color": shift.shift.color, "shift": shift.shift.code})

        shift_pref = shift_preferance.objects.get(member=kwargs['member'])

        prefered_shift = {"shift":shift_pref.shift.code, "name": shift_pref.shift.name, "color": shift_pref.shift.color}
        
        return {"events":event_list, "is_shift_locked": True if plan.filter(is_shift_locked=True).count() != 0 else False, 'shift_month':shift_month.replace(day=1).date(), "prefered_shift":prefered_shift}