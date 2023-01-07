from django import template
from django.db.models import Q
from apps.spc_cld.models import system
from django.utils import timezone
import datetime
import calendar
from dateutil.relativedelta import relativedelta

register = template.Library()

# filter the url and give only the number
@register.filter(name='sync_time')
def sync_time(value):
    try:
        get_sync_time = system.objects.all().latest('updated_on')
        return get_sync_time.updated_on
    except Exception as e:
        print(str(e))

@register.filter(name='next_month')
def next_month(value):
    try:
        shift_month = timezone.now() + relativedelta(months=1)
        return shift_month.strftime("%B")
    except Exception as e:
        print(str(e))