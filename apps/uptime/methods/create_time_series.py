from apps.uptime.models import uptime_time_series_data, uptime_status
from django.db.models import Q
import math
import time
import re
import json

class create_time_series(object):

    def __init__(self, *args, **kwargs):
        super(create_time_series, self).__init__()

    def convert_date(self, *args, **kwargs):
        
        if kwargs["date"] == None:
            return kwargs["date"]
        else: 
            s, ms = divmod(int("".join([dat for dat in re.findall(r'\d+', kwargs["date"])])), 1000)              
            return '%s.%03d' % (time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(s)), ms)

    def generate_time_series(self):

        uptime_status.objects.filter(status='unconfirmed_down').update(status='up')

        uptime_status_inst = uptime_status.objects.exclude(Q(status='paused')|Q(system_info=None))
    
        for check in uptime_status_inst:

            try:
                
                current_time_series = uptime_time_series_data.objects.get(SID=check.SID, ToTime=None)
            
                if current_time_series.Status != check.status:

                    duration = check.LastSyncAt - current_time_series.FromTime

                    current_time_series.ToTime = check.LastSyncAt

                    current_time_series.Duration = duration

                    current_time_series.durationInMin = int((check.LastSyncAt - current_time_series.FromTime).total_seconds()//60)

                    current_time_series.save()

                    new_time_series = uptime_time_series_data()

                    new_time_series.systemNumber=check.system_info.SystemNumber

                    new_time_series.FromTime = check.LastSyncAt

                    new_time_series.errorStartTime=check.LastSyncAt

                    new_time_series.DataCenter=check.DataCenter

                    new_time_series.Product_Area=check.system_info.SystemRole

                    new_time_series.Status =  check.status

                    new_time_series.SID = check.SID

                    new_time_series.save()

            except Exception as e:

                uptime_time_series_data.objects.create(SID=check.SID, DataCenter=check.DataCenter, FromTime=check.LastSyncAt, errorStartTime=check.LastSyncAt, Status=check.status, Product_Area=check.system_info.SystemRole, systemNumber=check.system_info.SystemNumber)

        return len(uptime_status_inst)