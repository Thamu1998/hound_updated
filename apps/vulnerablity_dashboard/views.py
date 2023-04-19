from django.shortcuts import render

from apps.vulnerablity_dashboard.methods.excel_file import analyse_vulnerability_excel
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from apps.vulnerablity_dashboard.serializers import (
    analyse_vulnerablity_serializer,
    vulnerablity_excel_serializer,
)

# Create your views here.
from django.views.generic import FormView, TemplateView
from rest_framework import viewsets


class dashboard_html(TemplateView):
    template_name = "vulnerablity/vulnerablity_dashboard.html"


class vulnerablity_API_view(APIView):
    def post(self, request):
                
        serializer=vulnerablity_excel_serializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            vulerablity_obj = analyse_vulnerability_excel()
            res = vulerablity_obj.read_excel(excel_file=serializer.data['excel_sheet'])
            return Response(res)
        else:
            return Response(serializer.errors)


    def get(self, request):
        query = vulnerablity_data.objects.all().order_by("-id").first()
        print(query)
        serialize = vulnerablity_excel_serializer(instance=query)
        # print(serialize.data['excel_sheet'])  
        excel_file=serialize.data['excel_sheet']
        vulerablity_obj = analyse_vulnerability_excel()
        res = vulerablity_obj.read_excel(excel_file=excel_file)
        return Response(res)


class upload_excel(viewsets.ModelViewSet):
    queryset = vulnerablity_data.objects.all()
    serializer_class = vulnerablity_excel_serializer
