from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.views.generic import FormView, TemplateView
from django.db.models import Q, Count, Sum, Max
import json
import datetime

from .methods.sync import sync_notification
from .methods.process_event_summary import event_symmary
from .serializers import notification_events_stage_serializer
# Custom model.
from .models import notification_events_stage, notification_events
from config.common_functions import query_builder
from .filter_options import options_notification_data
from config.common_functions import query_builder


class sync_notification_data(APIView):

    def get(self,request):
        try:
            sync_notification_init = sync_notification()
            res = sync_notification_init.run(days=1)
            event_data_init = event_symmary()
            response = event_data_init.process_data()

            return Response("res")
        except Exception as e:
            return Response(str(e), status=500)

class notification_events_html(TemplateView):

    template_name = "notification/notification.html" 

    def get_context_data(self, **kwargs):
        
        context = options_notification_data()
        context['page_title'] = "Event List"
        context['card_title'] = "Event List"
        context['query_api_url'] = "/notification/api/notification_events/?format=datatables"+"&"
        return context

class notification_events_stage_mv(ModelViewSet):

    queryset = notification_events_stage.objects.all()

    serializer_class = notification_events_stage_serializer

    def get_queryset(self):
        try:
            EndDateTime_gt = self.request.query_params.get('EndDateTime_gt', None)

            EndDateTime_lt = self.request.query_params.get('EndDateTime_lt', None)

            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)

            start_time = datetime.datetime.strptime(EndDateTime_gt, '%Y-%m-%d.%H:%M')
            
            end_time = datetime.datetime.strptime(EndDateTime_lt, '%Y-%m-%d.%H:%M')
            
            queryset = notification_events_stage.objects.filter(ParentObjectID__EndDateTime__range=(start_time,end_time)).filter(model_filter).exclude(SentToCustomerOn=None)

            return queryset
        except Exception as e:
            return Response(str(e), status=500)

class notification_event_data(APIView):

    def get(self, request):
        try:
            event_data_init = event_symmary()
            response = event_data_init.process_data()

            return Response(response)
        except Exception as e:
            return Response(str(e), status=500)

class event_symmary_intermediate_chart(APIView):

    def get(self, request):
        try:
            EndDateTime_gt = self.request.query_params.get('EndDateTime_gt', None)

            EndDateTime_lt = self.request.query_params.get('EndDateTime_lt', None)

            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)

            EndDateTime_gt = datetime.datetime.strptime(EndDateTime_gt, '%Y-%m-%d.%H:%M')
            
            EndDateTime_lt = datetime.datetime.strptime(EndDateTime_lt, '%Y-%m-%d.%H:%M')

            event_symmary_info = event_symmary()
            
            response = event_symmary_info.chart_data_intermediate(EndDateTime_gt=EndDateTime_gt,EndDateTime_lt=EndDateTime_lt,model_filter=model_filter)

            return Response(response)
        except Exception as e:
            return Response(str(e), status=500)

class event_symmary_final_chart(APIView):

    def get(self, request):
        try:
            
            EndDateTime_gt = self.request.query_params.get('EndDateTime_gt', None)

            EndDateTime_lt = self.request.query_params.get('EndDateTime_lt', None)

            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)

            EndDateTime_gt = datetime.datetime.strptime(EndDateTime_gt, '%Y-%m-%d.%H:%M')
            
            EndDateTime_lt = datetime.datetime.strptime(EndDateTime_lt, '%Y-%m-%d.%H:%M')

            event_symmary_info = event_symmary()

            response = event_symmary_info.chart_data_final(EndDateTime_gt=EndDateTime_gt,EndDateTime_lt=EndDateTime_lt,model_filter=model_filter)

            return Response(response)
        except Exception as e:
            return Response(str(e), status=500)