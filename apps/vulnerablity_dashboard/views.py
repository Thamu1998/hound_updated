from django.shortcuts import render

from apps.vulnerablity_dashboard.methods.excel_file import analyse_vulnerablity_excel
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from apps.vulnerablity_dashboard.serializers import analyse_vulnerablity_serializer
# Create your views here.
from django.views.generic import FormView, TemplateView

class dashboard_html(TemplateView):
    template_name = 'vulnerablity/vulnerablity_dashboard.html'


class vulnerablity_API_view(APIView):

    def post(self,request):
        # print(self.request.data)
        # print(self.request.data['shiftpasschartjs']['sm_infra_data'])
        excel_file=self.request.FILES['excel']
        print(excel_file)
        vulerablity_obj=analyse_vulnerablity_excel()
        res=vulerablity_obj.read_excel(excel_file=excel_file)
        # print(res)

        return Response(res)
        
    def get(self,request):
        query=vulnerablity_analyse_data.objects.all().order_by('-id')
        print(query)
        serialize=analyse_vulnerablity_serializer(instance=query)
        return Response(query.values())