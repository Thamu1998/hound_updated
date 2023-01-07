from apps.notification.models import notification_events_stage, notification_events
import datetime
import json
from django.utils import timezone
import pandas as pd

class event_symmary(object):

    def __init__(self, *args, **kwargs):
        super(event_symmary, self).__init__()

    def rca_info(self, stage_inst, resolution_date):
        try:
            rca_data = {}

            intermediate_rca = stage_inst.get(NotificationSubType=4)

            final_rca = self.final_rca_info(stage_inst, resolution_date)

            time_diff_from_resolution = intermediate_rca.SentToCustomerOn - resolution_date

            time_diff_from_resolution = time_diff_from_resolution.total_seconds()

            rca_data["IsInterRcaSloExpired"] = True if int(time_diff_from_resolution) > 432000 else False

            rca_data["IsInterRcaSlaExpired"] = True if int(time_diff_from_resolution) > 864000 else False

            rca_data["IsInterRcaSend"] = True

            rca_data["IsFinalRcaSloExpired"] = final_rca["is_slo_breached"]

            rca_data["IsFinalRcaSlaExpired"] = final_rca["is_sla_breached"]

            rca_data["IsFinalRcaSend"] = final_rca["is_rca_send"]

            return rca_data

        except Exception as e:
            
            rca_data = {}

            final_rca = self.final_rca_info(stage_inst, resolution_date)

            time_diff_from_resolution = timezone.now() - resolution_date

            time_diff_from_resolution = time_diff_from_resolution.total_seconds()

            rca_data["IsInterRcaSloExpired"] = True if int(time_diff_from_resolution) > 432000 else False

            rca_data["IsInterRcaSlaExpired"] = True if int(time_diff_from_resolution) > 864000 else False

            rca_data["IsInterRcaSend"] = False

            rca_data["intermediate__rca_time_diff_from_resolution"] = datetime.timedelta(seconds=time_diff_from_resolution)

            rca_data["IsFinalRcaSloExpired"] = final_rca["is_slo_breached"]

            rca_data["IsFinalRcaSlaExpired"] = final_rca["is_sla_breached"]

            rca_data["IsFinalRcaSend"] = final_rca["is_rca_send"]

            rca_data["final__rca_time_diff_from_resolution"] = final_rca["time_diff_from_resolution"]

            if final_rca["is_rca_send"] == True:

                rca_data["IsInterRcaSloExpired"] = final_rca["is_slo_breached"]

                rca_data["IsInterRcaSlaExpired"] = final_rca["is_sla_breached"]

                rca_data["IsInterRcaSend"] = True

            return rca_data
    
    def final_rca_info(self, stage_inst, resolution_date):
        try:
            frca = {'is_slo_breached':False,'is_sla_breached':False, 'time_diff_from_resolution': 0}

            intermediate_rca = stage_inst.get(NotificationSubType=5)

            time_diff_from_resolution = intermediate_rca.SentToCustomerOn - resolution_date

            time_diff_from_resolution = time_diff_from_resolution.total_seconds()

            frca["is_slo_breached"] = True if int(time_diff_from_resolution) > 864000 else False

            frca["is_sla_breached"] = True if int(time_diff_from_resolution) > 1728000 else False

            frca["is_rca_send"] = True

            frca["time_diff_from_resolution"] = datetime.timedelta(seconds=time_diff_from_resolution)

            return frca

        except Exception as e:
            
            frca = {'is_slo_breached':False,'is_sla_breached':False, 'time_diff_from_resolution': 0}

            time_diff_from_resolution = timezone.now() - resolution_date

            time_diff_from_resolution = time_diff_from_resolution.total_seconds()

            frca["is_slo_breached"] = True if int(time_diff_from_resolution) > 864000 else False

            frca["is_sla_breached"] = True if int(time_diff_from_resolution) > 1728000 else False

            frca["is_rca_send"] = False

            frca["time_diff_from_resolution"] = datetime.timedelta(seconds=time_diff_from_resolution)

            return frca

    def chart_data_intermediate(self, *args, **kwargs):

        not_triggered_outside_sla = []

        not_triggered_with_in_sla = []

        triggered_outside_sla = []

        triggered_with_in_sla = []

        not_triggered_outside_slo = []

        not_triggered_with_in_slo = []

        triggered_outside_slo = []

        triggered_with_in_slo = []
        
        month_dict = [i for i in notification_events.objects.values_list('EndDateTime__month', 'EndDateTime').filter(EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt'])).distinct('EndDateTime__month')]
        
        month_dict = [{"month":i[1].strftime("%-m"), "year":i[1].strftime("%Y"),"name":i[1].strftime("%b")} for i in month_dict]
        
        notification_inst = notification_events.objects.filter(EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt'])).filter(kwargs["model_filter"])
        
        slo_data = []

        sla_data = []

        month_list = []
        
        for month in month_dict:

            month_list.append(month['name'])
            
            not_triggered_outside_sla.append(notification_inst.filter(IsInterRcaSend=False, IsInterRcaSlaExpired=True, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())
            
            not_triggered_with_in_sla.append(notification_inst.filter(IsInterRcaSend=False, IsInterRcaSlaExpired=False, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())
            
            triggered_outside_sla.append(notification_inst.filter(IsInterRcaSend=True, IsInterRcaSlaExpired=True, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            triggered_with_in_sla.append(notification_inst.filter(IsInterRcaSend=True, IsInterRcaSlaExpired=False, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            not_triggered_outside_slo.append(notification_inst.filter(IsInterRcaSend=False, IsInterRcaSloExpired=True, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            not_triggered_with_in_slo.append(notification_inst.filter(IsInterRcaSend=False, IsInterRcaSloExpired=False, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            triggered_outside_slo.append(notification_inst.filter(IsInterRcaSend=True, IsInterRcaSloExpired=True, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            triggered_with_in_slo.append(notification_inst.filter(IsInterRcaSend=True, IsInterRcaSloExpired=False, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())
    
        slo_data = [
                        {"name": "SLO BREACHED","data": triggered_outside_slo, "type": 'bar',"stacked": "true"},
                        {"name": "SLO MET","data": triggered_with_in_slo, "type": 'bar',"stacked": "true"},
                        {"name": "MAIL-NOT-SEND:SLO BREACHED","data": not_triggered_outside_slo, "type": 'bar',"stacked": "true"},
                        {"name": "MAIL-NOT-SEND:WITH-IN SLO","data": not_triggered_with_in_slo, "type": 'bar',"stacked": "true"},
                    ]
        
        sla_data = [
                        {"name": "SLA BREACHED","data": triggered_outside_sla, "type": 'bar',"stacked": "true"},
                        {"name": "SLA MET","data": triggered_with_in_sla, "type": 'bar',"stacked": "true"},
                        {"name": "MAIL-NOT-SEND:SLA BREACHED","data": not_triggered_outside_sla, "type": 'bar',"stacked": "true"},
                        {"name": "MAIL-NOT-SEND:WITH-IN SLA","data":  not_triggered_with_in_sla, "type": 'bar',"stacked": "true"},
                    ]

        slo_max = max(not_triggered_outside_slo+not_triggered_with_in_slo+triggered_outside_slo+triggered_with_in_slo)+20

        sla_max = max(not_triggered_outside_sla+not_triggered_with_in_sla+triggered_outside_sla+triggered_with_in_sla)+20

        return {'slo':slo_data,'sla':sla_data, 'label':month_list, 'slo_max':slo_max, 'sla_max':sla_max}

    def chart_data_final(self, *args, **kwargs):

        starttime = datetime.datetime.now() - datetime.timedelta(days=90)

        endtime = datetime.datetime.now()

        not_triggered_outside_sla = []

        not_triggered_with_in_sla = []

        triggered_outside_sla = []

        triggered_with_in_sla = []

        not_triggered_outside_slo = []

        not_triggered_with_in_slo = []

        triggered_outside_slo = []

        triggered_with_in_slo = []

        month_dict = [i for i in notification_events.objects.values_list('EndDateTime__month', 'EndDateTime').filter(EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt'])).distinct('EndDateTime__month')]
        
        month_dict = [{"month":i[1].strftime("%-m"), "year":i[1].strftime("%Y"),"name":i[1].strftime("%b")} for i in month_dict]

        notification_inst = notification_events.objects.filter(EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt'])).filter(kwargs["model_filter"])

        slo_data = []

        sla_data = []

        month_list = []
        
        for month in month_dict:

            month_list.append(month['name'])
            
            not_triggered_outside_sla.append(notification_inst.filter(IsFinalRcaSend=False, IsFinalRcaSlaExpired=True, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())
            
            not_triggered_with_in_sla.append(notification_inst.filter(IsFinalRcaSend=False, IsFinalRcaSlaExpired=False, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())
            
            triggered_outside_sla.append(notification_inst.filter(IsFinalRcaSend=True, IsFinalRcaSlaExpired=True, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            triggered_with_in_sla.append(notification_inst.filter(IsFinalRcaSend=True, IsFinalRcaSlaExpired=False, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            not_triggered_outside_slo.append(notification_inst.filter(IsFinalRcaSend=False, IsFinalRcaSloExpired=True, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            not_triggered_with_in_slo.append(notification_inst.filter(IsFinalRcaSend=False, IsFinalRcaSloExpired=False, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            triggered_outside_slo.append(notification_inst.filter(IsFinalRcaSend=True, IsFinalRcaSloExpired=True, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

            triggered_with_in_slo.append(notification_inst.filter(IsFinalRcaSend=True, IsFinalRcaSloExpired=False, EndDateTime__range=(kwargs['EndDateTime_gt'], kwargs['EndDateTime_lt']), EndDateTime__month=month['month'], EndDateTime__year=month['year']).count())

        
        slo_data = [
                        {"name": "SLO BREACHED","data": triggered_outside_slo, "type": 'bar',"stacked": "true"},
                        {"name": "SLO MET","data": triggered_with_in_slo, "type": 'bar',"stacked": "true"},
                        {"name": "MAIL-NOT-SEND:SLO BREACHED","data": not_triggered_outside_slo, "type": 'bar',"stacked": "true"},
                        {"name": "MAIL-NOT-SEND:WITH-IN SLO","data": not_triggered_with_in_slo, "type": 'bar',"stacked": "true"},
                    ]
        
        sla_data = [
                        {"name": "SLA BREACHED","data": triggered_outside_sla, "type": 'bar',"stacked": "true"},
                        {"name": "SLA MET","data": triggered_with_in_sla, "type": 'bar',"stacked": "true"},
                        {"name": "MAIL-NOT-SEND:SLA BREACHED","data": not_triggered_outside_sla, "type": 'bar',"stacked": "true"},
                        {"name": "MAIL-NOT-SEND:WITH-IN SLA","data":  not_triggered_with_in_sla, "type": 'bar',"stacked": "true"},
                    ]

        slo_max = max(not_triggered_outside_slo+not_triggered_with_in_slo+triggered_outside_slo+triggered_with_in_slo)+20

        sla_max = max(not_triggered_outside_sla+not_triggered_with_in_sla+triggered_outside_sla+triggered_with_in_sla)+20

        return {'slo':slo_data,'sla':sla_data, 'label':month_list, 'slo_max':slo_max, 'sla_max':sla_max}

    def process_data(self, *args, **kwargs):

        event_id_list = notification_events_stage.objects.values_list("ParentObjectID__EventID").filter(isNotificationProcessed=False).distinct("ParentObjectID__EventID").order_by("ParentObjectID__EventID")

        for event in event_id_list:
            
            stage_inst = notification_events_stage.objects.filter(ParentObjectID__EventID=event[0]).exclude(SentToCustomerOn=None)

            try:
                resolution_date = stage_inst.get(NotificationSubType__in=[3,9]).SentToCustomerOn

                rca_data_inst = self.rca_info(stage_inst, resolution_date)
            
                notification_events.objects.filter(EventID=event[0]).update(IsInterRcaSloExpired=rca_data_inst["IsInterRcaSloExpired"],IsInterRcaSlaExpired=rca_data_inst["IsInterRcaSlaExpired"],IsFinalRcaSloExpired=rca_data_inst["IsFinalRcaSloExpired"],IsFinalRcaSlaExpired=rca_data_inst["IsFinalRcaSlaExpired"],IsInterRcaSend=rca_data_inst["IsInterRcaSend"],IsFinalRcaSend=rca_data_inst["IsFinalRcaSend"])
            
                notification_events_stage.objects.filter(ParentObjectID__EventID=event[0]).update(isNotificationProcessed=True)
            except Exception as e:
                pass

        return "RCA Symmary created successfully"