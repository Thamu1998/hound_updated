from webbrowser import get
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers
from djqscsv import render_to_csv_response

#IMPORT MODEL
from apps.spc_cld import models

#IMPORT COMMON FUNCTIONS
from config.common_functions import query_builder

def set_models(t_name):

    if t_name == "pingdom_time_series_data":
        from apps.pingdom import models
        return models

    elif t_name == "uptime_time_series_data":
        from apps.uptime import models
        return models
        
    else:
        from apps.spc_cld import models
        return models


# Create your views here.
class generate_excel_view(APIView):

    def get(self, request, *args, **kwargs):
        try:

            models = set_models(kwargs["table_name"])

            model_name = getattr(models, kwargs["table_name"])
            
            query_col = self.request.query_params.get('col', None)

            query_col = query_col.split(";")

            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate(query=get_filter_raw)
            
            query_result_set = model_name.objects.values(*query_col).exclude(model_exclude).filter(model_filter)
            
            # return Response(query_result_set)
            return render_to_csv_response(query_result_set)
        except Exception as e:
            return Response({'status': str(e)}, status=406)