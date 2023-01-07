import re
from apps.pingdom.models import pingdom_time_series_data
from django.utils import timezone

class acknowledge(object):

    def __init__(self, *args, **kwargs):
        super(acknowledge, self).__init__()

    def system(self, *args, **kwargs):
        try:    

            init_ack = pingdom_time_series_data.objects.get(SID=kwargs['SID'], ToTime=None, IsAcknowledged=False)
            init_ack.IsAcknowledged=True
            init_ack.acknowledgedBy=kwargs['acknowledgedBy']
            init_ack.acknowledgedAt=timezone.now()
            init_ack.acknowledgedWithin = int((timezone.now() - init_ack.errorStartTime).total_seconds())
            init_ack.save()
            return "Acknowledgement Successful"
        
        except Exception as e:

            return str(e)
    
    def database(self, *args, **kwargs):

        pingdom_time_series_data.objects.filter(DataCenter=kwargs['DC'], ToTime=None, IsAcknowledged=False).update(IsAcknowledged=True, acknowledgedBy=kwargs['acknowledgedBy'], acknowledgedAt=timezone.now())

    def check_system(self, *args, **kwargs):

        try: 
            get_sid_inst = pingdom_time_series_data.objects.get(SID=kwargs['SID'], ToTime=None, Status="down")

            return get_sid_inst.IsAcknowledged
        except Exception as e:
            return "UNKNOWN"
