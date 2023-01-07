from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.views.generic import FormView, TemplateView
from rest_framework import viewsets,status,generics
from django.db.models import F, Count
import json
from .methods.pingdom_status import sync_status
from .methods.check_status import status
from .methods.check_modify_pingdom_name import check_modify_pingdom_name
from .methods.mttd_acknowledge import acknowledge
from .methods.action_required import action_required_data
from .models import pingdom_status, comment_table, pingdom_time_series_data
from config.common_functions.query_builder import generate
from .methods.update_comment import update_comment
from .methods.create_time_series import create_time_series
from apps.user_account.models import User
from apps.spc_cld.models import tenant, system, datacenter_decs
import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from .serializers import mttd_SERIALIZER, mttd_SERIALIZER_DATE_NAME
from url_filter.integrations.drf import DjangoFilterBackend
import time
from .methods.downtime_time_series import downtime_time_series
from config.common_functions import query_builder
from .methods.pingdom_history import pingdom_check_history
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny

# Create your views here.
class dashboard_html(TemplateView):

    template_name = "pingdom/dashboard.html"

    permission_classes = [AllowAny]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class downtime_scan_html(TemplateView):

    template_name = "pingdom/downtime_scan.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class downtime_scan_apiview(APIView):

    def get(self, request):
        try:
            scan_dates = self.request.query_params.get('scan_dates', None)
            
            scan_dates = scan_dates.split('to')

            start_datetime = datetime.datetime.strptime(scan_dates[0], '%Y-%m-%d.%H:%M')
            
            end_datetime = datetime.datetime.strptime(scan_dates[1], '%Y-%m-%d.%H:%M')

            downtime_time_series_init = downtime_time_series()
            
            data = downtime_time_series_init.scan(startdate=start_datetime, enddate=end_datetime)

            return Response(data)
        except Exception as e:
            return Response(str(e),status=500)

class pingdom_check_name_change(APIView):

    def put(self,request):
        try:
            check_id = self.request.data.get('check_id', None)

            check_name = self.request.data.get('check_name', None)

            if check_id == None:
                return Response({"detail":"parameter checkid missing"},status=406)

            if check_name == None:
                return Response({"detail": "parameter check_name missing"}, status=406)

            modify_check_name_init = check_modify_pingdom_name()

            GetStatus = modify_check_name_init.modify_check_name(check_id=check_id, check_name=check_name,UserInst=self.request.user)
            
            return Response({'detail':GetStatus})
        except Exception as e:
            return Response({'detail':str(e)},status=500)
    
    def get(self, request):

        try:
            check_list_inst = check_modify_pingdom_name()

            check_list = check_list_inst.check_pingdom_name()

            return Response(check_list)
        except Exception as e:
            return Response({'detail':str(e)},status=500)

class sync_pingdom_status(APIView):

    def get(self, request):
        try:
            start = time.time()

            sync_status_init = sync_status()

            sync_status_init.sync()

            create_time_series_inst = create_time_series()

            create_time_series_inst.generate_time_series()

            duration = (time.time() - start)
            
            return Response({'detail': duration})

        except Exception as e:
            return Response(str(e),status=500)

class get_anomaly_data(APIView):

    def get(self, request):
        try:
            check_anomaly_inst = action_required_data()

            data = check_anomaly_inst.get_data()

            return Response(data)
        except Exception as e:
            return Response(str(e),status=500)

class check_status(APIView):

    permission_classes = (AllowAny,)

    def get(self, request):
        try:

            status_inst = status()
            
            result = status_inst.check()

            return Response(result)

        except Exception as e:
            return Response(str(e),status=500)

class update_comment_view(APIView):

    def post(self, request):
        try:
            update_data = self.request.data
            
            update_data['comment_by'] = request.user
            
            update_comment_init = update_comment()
            
            get_res = update_comment_init.update(**update_data)

            return Response(get_res)
        except Exception as e:
            return Response(str(e),status=500)

class get_dc_info(APIView):

    def get(self, request):
        try:
            get_filter_raw = self.request.query_params

            model_filter, model_exclude = generate(query=get_filter_raw)
            
            paused_systems = pingdom_status.objects.values('SID', 'hostname').filter(status="paused").exclude(model_exclude).filter(model_filter).annotate(DBSystemID=F('system_info__DBSystemID'), BusinessType=F('system_info__BusinessType'), CustomerName=F('system_info__CustomerName'), LifeCycleStatus=F('system_info__LifeCycleStatus'))

            system_type_details = pingdom_status.objects.exclude(model_exclude).exclude(system_info__SystemRole=None).filter(model_filter).values('system_info__SystemRole').annotate(total=Count('system_info__SystemRole')).order_by('system_info__SystemRole')
            
            return Response({"paused_systems":paused_systems, "system_type_details":system_type_details})

        except Exception as e:
            return Response(str(e),status=500)

class get_comment(APIView):

    def get(self, request):
        try:
            url_query_filter = self.request.query_params

            query_filter = {}

            now_date = datetime.datetime.now()
            
            for field in url_query_filter:
                query_filter[field] = url_query_filter[field]
            
            comments = comment_table.objects.filter(expry_date__gt=now_date).filter(**query_filter).values("SID","DC", "comment", "expry_date", "updated_on", "comment_by_id__first_name", "comment_by_id__last_name")
            
            return Response(comments)
        except Exception as e:
            return Response(str(e),status=500)

class acknowledge_downtime(APIView):

    def post(self, request):
        try:
            acknowledge_data = self.request.data

            acknowledge_data['acknowledgedBy'] = request.user

            acknowledge_init = acknowledge()

            res = acknowledge_init.system(**acknowledge_data)

            return Response({'detail':res})
        except Exception as e:
            return Response(str(e),status=500)

    def get(self, request):
        try:
            SID = self.request.query_params.get('SID', None)

            acknowledge_init = acknowledge()

            is_acknowledged = acknowledge_init.check_system(SID=SID)

            return Response({'SID':SID,'is_acknowledged':is_acknowledged})
        except Exception as e:
            return Response(str(e),status=500)

class mttd_acknowledge_data(generics.ListAPIView):
    
    queryset = pingdom_time_series_data.objects.filter(Status='down')

    serializer_class = mttd_SERIALIZER

    filter_backends = [DjangoFilterBackend]

    filter_fields = ['SID','IsAcknowledged','errorStartTime','acknowledgedAt','acknowledgedWithin','Product_Area']

class generate_time_series_view(APIView):

    def get(self, request):
        try:
            create_time_series_inst = create_time_series()

            res = create_time_series_inst.generate_time_series()
            
            return Response(res)
        except Exception as e:
            return Response(str(e),status=500)

class get_down_dc_info(APIView):

    def get(self, request):
        try:
            final_data = []

            dc = self.request.query_params.get('dc', None)

            dc_info = datacenter_decs.objects.get(code=dc)

            data = pingdom_status.objects.all()

            down_db_sids = set(pingdom_status.objects.values_list('system_info__DBSystemID', flat=True).filter(DataCenter=dc, status='down').exclude(dc_info="NA"))
            
            for sid in down_db_sids:

                up = ",".join(sid for sid in data.values_list("SID", flat=True).exclude(dc_info="NA").filter(status='up', system_info__DBSystemID=sid).distinct("SID").order_by("SID"))

                down = ",".join(sid for sid in data.values_list("SID",flat=True).exclude(dc_info="NA").filter(status='down', system_info__DBSystemID=sid).distinct("SID").order_by("SID"))
                
                final_data.append({'up':up, 'down':down, "db":sid})

            return Response({'data': final_data, 'details': {'name': dc_info.description, 'cmp_id': dc_info.cmp_id, 'cmp_time': dc_info.cmp_timing , 'infra':dc_info.infra}})
        except Exception as e:
            return Response(str(e),status=500)

class mass_acknowledge_downtime(APIView):

    def post(self, request):
        try:
            acknowledge_data = self.request.data

            acknowledge_data['acknowledgedBy'] = request.user

            acknowledge_init = acknowledge()

            res = acknowledge_init.database(**acknowledge_data)

            return Response({'detail':res})
        except Exception as e:
            return Response(str(e),status=500)

class acknowledgement_mv(ModelViewSet):

    queryset = pingdom_time_series_data.objects.filter(Status='down')

    serializer_class = mttd_SERIALIZER_DATE_NAME

    def get_queryset(self):
        try:
            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)
            
            queryset = pingdom_time_series_data.objects.filter(model_filter).exclude(model_exclude).order_by('-FromTime')
        
            return queryset
        except Exception as e:
            return Response(str(e), status=500)

class acknowledgement_html(TemplateView):

    template_name = "pingdom/ack_view.html"

    def get_context_data(self, **kwargs):
        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = {}
        context['page_title'] = "Acknowledgement"
        context['card_title'] = "Acknowledgement"
        context['tabel_name'] = "pingdom_time_series_data"
        context['default_query_filter'] = "&"+default_query_filter_excel
        context['query_api_url'] = "/pingdom/api/mttd/list/?format=datatables"+"&"+default_query_filter
        return context

class check_history_html(TemplateView):
    template_name = "pingdom/history.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pingdom_info'] = pingdom_status.objects.values("id", "SID").exclude(dc_info="NA")
        return context

class check_history(APIView):

    def get(self, request):
        try:
            check_id = self.request.query_params.get('check_id', None)

            SID = self.request.query_params.get('sid', None)

            start_time = self.request.query_params.get('start_time', None)
            
            end_time = self.request.query_params.get('end_time', None)

            start_time = start_time if start_time != None else datetime.datetime.now() - datetime.timedelta(days=3)

            end_time = end_time if end_time != None else datetime.datetime.now()

            pingdom_check_history_init = pingdom_check_history()

            result = pingdom_check_history_init.get_history(check_id=check_id, start_time=start_time, end_time=end_time, SID=SID)

            return Response(result)
        except Exception as e:
            return Response({'detail':str(e)},status=500)

class get_pingdom_details(APIView):

    def get(self, request):
        try:
            get_details = pingdom_status.objects.values("id", "SID").all()

            return Response(get_details)
        except Exception as e:
            return Response({'detail':str(e)},status=500)