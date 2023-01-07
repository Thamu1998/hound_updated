from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.views.generic import FormView, TemplateView
from django.db.models import Q, Count, Sum, Max, Avg
import json
import datetime
from background_task import background

##MODEL-IMPORT
from .models import availability

##SERIALIZER IMPORT
from .serializers import availability_serializer

#IMPORT COMMON FUNCTIONS
from config.common_functions import query_builder

# Create your views here.
class dashboard_html(TemplateView):

    template_name = 'daily_availability/dashboard.html'

class availability_html(TemplateView):

    template_name = 'daily_availability/availability.html'

    def get_context_data(self, **kwargs):

        get_filter_raw = self.request.GET

        default_query_filter_excel = "&".join(query+"="+get_filter_raw[query] for query in get_filter_raw)

        default_query_filter = "&".join(query+"_flt"+"="+get_filter_raw[query] for query in get_filter_raw)
        
        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)
        
        queryset = availability.objects.filter(model_filter).order_by('StartDateTime')
        
        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = {}
        context['page_title'] = "Daily Availability"
        context['card_title'] = "Daily Availability"
        context['tabel_name'] = "availability"
        context['availability_persentage'] = str(list(queryset.aggregate(avg=Avg('AvailabilityInPercentage')).values())[0])[:5]
        context['total_no_system'] = queryset.distinct('SystemNumber').order_by('SystemNumber').count()
        context['total_no_system_down'] = queryset.exclude(AvailabilityInPercentage=100).count()
        context['total_downtime_min'] = queryset.aggregate(total=Sum('TotalUnplannedCommunicatedDowntimesInMinutes'))['total']
        context['default_query_filter'] = "&"+default_query_filter_excel   
        context['query_api_url'] = "/availability/api/daily/list?format=datatables"+"&"+default_query_filter
        return context

class availability_mv(ModelViewSet):

    queryset = availability.objects.all()

    serializer_class = availability_serializer

    def get_queryset(self):
        try:
            get_filter_raw = self.request.query_params
            
            if get_filter_raw.get('StartDateTime__date__range_flt', None):
                
                model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)

                queryset = availability.objects.filter(model_filter).exclude(model_exclude).order_by('StartDateTime')
            else:
                report_date = datetime.datetime.today().date() - datetime.timedelta(days=1)
                queryset = availability.objects.filter(StartDateTime__date=str(report_date)).exclude(AvailabilityInPercentage=100).order_by('StartDateTime')
                
            return queryset
        except Exception as e:
            return Response(str(e), status=500)

class sync_notification_cld(APIView):

    def get(self, request):

        days = request.GET.get('days', 1)

        sync_data_notification_daily(days)

        return Response({"message": "scheduled"})

@background(queue="cld_sync", schedule=10)
def sync_data_notification_daily(days):
    try:

        from .methods.sync_daily_notification import sync_notification_daily

        sync_notification_init = sync_notification_daily(days=int(days))

        sync_notification_init.sync()

    except Exception as e:
        print(str(2))
 