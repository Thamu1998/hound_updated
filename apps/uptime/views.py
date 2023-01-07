from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.views.generic import FormView, TemplateView
from rest_framework import viewsets,status,generics
from django.db.models import F, Count
import json
import time
import datetime


from .methods.uptime_status import sync_status
from .methods.check_status import status
from .methods.create_time_series import create_time_series
from config.common_functions.query_builder import generate
from .models import uptime_status, comment_table, uptime_time_series_data
from .methods.update_comment import update_comment
from apps.spc_cld.models import tenant, system, datacenter_decs
from .methods.mttd_acknowledge import acknowledge
from .methods.downtime_time_series import downtime_time_series
from .methods.action_required import action_required_data
from .methods import tempChecks
from apps.spc_cld.models import system, tenant
from .serializers import mttd_SERIALIZER_DATE_NAME
from config.common_functions.common_querys import get_all_system_role, get_application_system_role, get_database_system_role
from config.common_functions import query_builder
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny

# Create your views here.
class dashboard_html(TemplateView):

    template_name = "uptime/dashboard.html"

    permission_classes = [AllowAny]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class downtime_scan_html(TemplateView):

    template_name = "uptime/downtime_scan.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['SID'] = system.objects.values_list('SID', flat=True).filter(SystemRole__in=get_application_system_role(), LifeCycleStatus__in=['L','UPG','PIP'])
        return context

class sync_uptime_status(APIView):

    def get(self, request):
        try:
            start = time.time()

            sync_status_init = sync_status()

            res = sync_status_init.sync()

            create_time_series_inst = create_time_series()

            create_time_series_inst.generate_time_series()

            duration = (time.time() - start)
            
            return Response({"duration":duration})

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

class get_dc_info(APIView):

    def get(self, request):
        try:
            get_filter_raw = self.request.query_params

            model_filter, model_exclude = generate(query=get_filter_raw)
            
            paused_systems = uptime_status.objects.values('SID', 'hostname').filter(status="paused").exclude(model_exclude).filter(model_filter).annotate(DBSystemID=F('system_info__DBSystemID'), BusinessType=F('system_info__BusinessType'), CustomerName=F('system_info__CustomerName'), LifeCycleStatus=F('system_info__LifeCycleStatus'))

            system_type_details = uptime_status.objects.exclude(model_exclude).exclude(system_info__SystemRole=None).filter(model_filter).values('system_info__SystemRole').annotate(total=Count('system_info__SystemRole')).order_by('system_info__SystemRole')
            
            return Response({"paused_systems":paused_systems, "system_type_details":system_type_details})

        except Exception as e:
            return Response(str(e),status=500)

class get_down_dc_info(APIView):

    def get(self, request):
        try:
            final_data = []

            dc = self.request.query_params.get('dc', None)

            dc_info = datacenter_decs.objects.get(code=dc)

            data = uptime_status.objects.all()

            down_db_sids = set(uptime_status.objects.values_list('system_info__DBSystemID', flat=True).filter(DataCenter=dc, status='down').exclude(dc_info="NA"))
            
            for sid in down_db_sids:

                up = ",".join(sid for sid in data.values_list("SID", flat=True).exclude(dc_info="NA").filter(status='up', system_info__DBSystemID=sid).distinct("SID").order_by("SID"))

                down = ",".join(sid for sid in data.values_list("SID",flat=True).exclude(dc_info="NA").filter(status='down', system_info__DBSystemID=sid).distinct("SID").order_by("SID"))
                
                final_data.append({'up':up, 'down':down, "db":sid})

            return Response({'data': final_data, 'details': {'name': dc_info.description, 'cmp_id': dc_info.cmp_id, 'cmp_time': dc_info.cmp_timing , 'infra':dc_info.infra}})
        except Exception as e:
            return Response(str(e),status=500)

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

    queryset = uptime_time_series_data.objects.filter(Status='down')

    serializer_class = mttd_SERIALIZER_DATE_NAME

    def get_queryset(self):
        try:
            
            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)
            
            queryset = uptime_time_series_data.objects.filter(model_filter).exclude(model_exclude).order_by('-FromTime')
        
            return queryset
        except Exception as e:
            return Response(str(e), status=500)

class acknowledgement_html(TemplateView):

    template_name = "uptime/ack_view.html"

    def get_context_data(self, **kwargs):
        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = {}
        context['page_title'] = "Acknowledgement"
        context['card_title'] = "Acknowledgement"
        context['tabel_name'] = "uptime_time_series_data"
        context['default_query_filter'] = "&"+default_query_filter_excel
        context['query_api_url'] = "/uptime/api/mttd/list/?format=datatables"+"&"+default_query_filter
        return context

class chech_and_add_monitoring(APIView):

    def post(self, request, *args, **kwargs):
        try:
            
            sid = self.request.data.get('SID', None)

            exp_date = self.request.data.get('expire_date',None)

            if (exp_date == None):
                return Response({'detail': "Expiry date missing."}, status=406)

            if sid == None:
                return Response({'detail':"SID parameter is required"}, status=406)

            get_sid_details = tenant.objects.filter(SID__SID=sid,SystemRole__in=get_application_system_role(),SystemLifeCycleStatus__in=['L','UPG','PIP'], ExternalID=100).values('SID__SID','SystemNumber', 'SID__BusinessType','SID__CustomerName', 'MainURL', 'SID__DataCenterID','SID__SystemRole').distinct()
            
            if len(get_sid_details) == 0:
                return Response({'detail':"SID details not found in System"}, status=406)
            
            inittempChecks = tempChecks.update_temp_check()

            checkid = inittempChecks.check_if_exist(SID=get_sid_details[0]['SID__SID'])
            
            if checkid[0] == False:
                checkid = inittempChecks.create_check(exp_date=exp_date, system_number=get_sid_details[0]['SystemNumber'], SID=get_sid_details[0]['SID__SID'], DC=get_sid_details[0]['SID__DataCenterID'], url=get_sid_details[0]['MainURL'], product_name=get_sid_details[0]['SID__SystemRole'])
                return Response({'detail':checkid})
                
            return Response({'detail':"Monitoring set successfully"})
        except Exception as e:
            return Response({'detail':str(e)}, status=406)

