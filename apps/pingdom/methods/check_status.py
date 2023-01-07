from apps.pingdom.models import pingdom_status, pingdom_time_series_data
from apps.spc_cld.models import datacenter_decs
from collections import defaultdict
from django.db.models import Q
from django.db.models import Sum
from django.db.models import Count
import pandas as pd
import datetime

class status(object):

    def __init__(self, *args, **kwargs):
        super(status, self).__init__()
    
    def check(self, *args, **kwargs):

        is_data_loaded = pingdom_status.objects.all().count()

        if is_data_loaded == 0:
            return {"status":"UNKNOWN"}

        isDown = pingdom_status.objects.filter(status="down").count()

        available_service = ['ADS', 'DOC', 'IAS']

        service_def = {'ADS':" Adobe Services", 'DOC':"Doc Service", 'IAS':"Auth Services"}

        data = pingdom_status.objects.all()

        last_sync = datetime.datetime.strftime(data.latest("LastSyncAt").LastSyncAt,"%d-%B %H:%M")
        
        dc_details = datacenter_decs.objects.all()
        
        if isDown == 0:

            customer_list = []

            service_list = []

            dc_list = pingdom_status.objects.values_list("DataCenter", flat=True).distinct("DataCenter").order_by("DataCenter").all()
            
            customer_list.append({'up':data.filter(status="up").exclude(dc_info="NA").count(), "code": 'ALL', "name": '.', 'infra':' ', 'paused':data.filter(status="paused").count()})

            for dc in dc_list:

                total = data.filter(DataCenter=dc, status="up").count()

                pause_total = data.filter(DataCenter=dc, status="paused").count()

                if dc in available_service:
                    
                    temp = {'up':total, "code":dc, 'name':service_def.get(dc, "Unknown"), 'infra': 'Neo', 'paused': pause_total}

                    service_list.append(temp)

                else:

                    temp = {'up':total, "code":dc, 'name':dc_details.filter(code=dc).values()[0]['description'], 'infra':dc_details.filter(code=dc).values()[0]['infra'], 'paused': pause_total}

                    customer_list.append(temp)

            return {"data":{"system":customer_list,"service":service_list}, "status":"UP", 'last_sync':last_sync}
        
        else:
            final_data = {}

            dc_list = pingdom_status.objects.values_list("DataCenter", flat=True).distinct("DataCenter").order_by("DataCenter").filter(status="down")

            data_down_inst = data.filter(status="down")
            
            for dc in dc_list:

                data_inst = data_down_inst.filter(DataCenter=dc)
                
                system_details = []

                for sid_detail in data_inst.distinct("SID").order_by("SID").values_list("SID", "system_info__ApplicationHAType", "DataCenter", "system_info__SystemNumber", "system_info__DBSystemID",):

                    get_total_client = data.filter(SID=sid_detail[0], DataCenter=sid_detail[2]).values_list("client", flat=True)

                    get_down_client = data.filter(SID=sid_detail[0], DataCenter=sid_detail[2], status="down").values_list("client", flat=True)

                    client_list = "" if set(get_total_client) == set(get_down_client) else ",".join(str(client) for client in get_down_client)

                    high_vailability = False if sid_detail[1] in [None, "NA"] else True

                    is_acknowledged = self.get_acknowledgement_status(SID=sid_detail[0])

                    sid_details_temp = {"SID": sid_detail[0], "system_number":sid_detail[3],"db_sid": sid_detail[4],'high_vailability' :high_vailability, 'client_list':client_list, 'is_acknowledged':is_acknowledged }

                    system_details.append(sid_details_temp)

                region = "SCP" if dc in available_service else data_inst.values_list("dc_info__region", flat=True).latest('dc_info')
                
                infra = "Neo" if dc in available_service else dc_details.filter(code=dc).values()[0]['infra']

                name = service_def.get(dc, "Unknown") if dc in available_service else dc_details.filter(code=dc).values()[0]['description']

                temp = {'name':name, 'infra': infra,"code": dc, "systems": system_details, 'up': data.filter(DataCenter=dc, status="up").distinct("SID").order_by("SID").count(), "down":data_inst.distinct("SID").order_by("SID").count()}

                final_data.setdefault(region, []).append(temp)

            return {"data":final_data, "status":"DOWN", "last_sync":last_sync}

    def get_acknowledgement_status(self, *args, **kwargs):
        
        try:

            get_sid_inst = pingdom_time_series_data.objects.get(SID=kwargs['SID'], ToTime=None, Status="down")

            return get_sid_inst.IsAcknowledged

        except Exception as e:
            return True

