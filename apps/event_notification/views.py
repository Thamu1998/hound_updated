from django.shortcuts import render
# Create your views here.
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from requests.auth import HTTPBasicAuth
import json
import dateutil.parser as parser
from datetime import datetime


class EventNotification(APIView):
    def get(self,request):
        try:
            # print(request.query_params)
            if request.method == 'GET':
                # print(request.GET)
                # DateTimeRange = request.GET["datetime"]
                DateTimeRange = "2022-03-31 10:00 AM - 2022-04-10 10:00 PM"

                print(DateTimeRange)
                x = DateTimeRange.split(" - ")
                start,end = x[0], x[1]
                startdate = parser.parse(start)
                enddate = parser.parse(end)
                StartDateTime = startdate.strftime('%Y-%m-%dT%H:%M:%SZ')
                EndDateTime = enddate.strftime('%Y-%m-%dT%H:%M:%SZ')
                print(StartDateTime)
                print(EndDateTime)

                # StartTime = "2022-01-31T19:30:00.00Z"
                # EndTime = "2022-02-01T11:30:00.00Z"
                url = "https://spc.ondemand.com/sap/spc/odata/v1/notification_events/NTDBMailLogTenantsCollection?$format=json&$filter=(NotifcationEvent/CreationDateTime%20ge%20%27"+StartDateTime+"%27%20and%20NotifcationEvent/CreationDateTime%20le%20%27"+EndDateTime+"%27)%20and%20(BLDSystemRoleCode%20eq%20%27HMC%27%20or%20BLDSystemRoleCode%20eq%20%27S4_PC%27%20or%20BLDSystemRoleCode%20eq%20%27S4_1C%27%20or%20BLDSystemRoleCode%20eq%20%27S4_1P%27)%20and%20(NotifcationEvent/ServiceStatus%20eq%20%271%27or%20NotifcationEvent/ServiceStatus%20eq%20%272%27)&$expand=NotifcationEvent"
                response = requests.get(url, auth=HTTPBasicAuth('SPC_S4OPS', 'qN=N4bJeUZVTqka'))
                data = json.loads(response.text)

                datalist = [ ]
                for i in data['d']['results']:
                    datalist.append({'EventID': i['NotifcationEvent']['EventID'], 'TenantID': i['TenantID'], 'CustomerID': i['CustomerID'], 'SystemRole': i['BLDSystemRoleCode'], 'DataCenter': i['DataCenterID'], 'TenantRole': i['TenantRole'], 'Status' :i['Status']
                                    , 'ServiceStatus': i['NotifcationEvent']['ServiceStatus'], 'CurrentTemplateName': i['NotifcationEvent']['CurrentTemplateName'], 'EventName': i['NotifcationEvent']['EventName'],'JiraTicket': i['NotifcationEvent']['JiraTicket']
                                    , 'NTDBEmailStatus': i['NotifcationEvent']['NTDBEmailStatus'], 'BundleID': i['NotifcationEvent']['BundleID'], 'CreatedBy': i['NotifcationEvent']['CreatedBy'], 'StartDateTime': i['NotifcationEvent']['StartDateTime'],
                                    'EndDateTime': i['NotifcationEvent']['EndDateTime'], 'CreationDateTime': i['NotifcationEvent']['CreationDateTime'], 'EndDate': i['NotifcationEvent']['EndDate'],'EndTime': i['NotifcationEvent']['EndTime'],'Phase': i['NotifcationEvent']['Phase'],
                                    'StartDate': i['NotifcationEvent']['StartDate'],'StartTime': i['NotifcationEvent']['StartTime'],'TestMode': i['NotifcationEvent']['TestMode'],'NotificationType': i['NotifcationEvent']['NotificationType'],'IsSLARelevant': i['NotifcationEvent']['IsSLARelevant']})
                print(datalist)
                return Response(datalist)

        except Exception as e:
            return Response(str(e), status=406)


    # def post(self,request):
    #     if request.method == 'POST':
    #         print(request.POST)


class CustomerEventNotification(APIView):
    def get(self,request, *args, **kwargs):
        try:
            return render(request, "event_notification/event_details.html")
        except Exception as e:
            return Response(str(e), status=406)



# API to return customer event notification details upon passing DateTimeRange - Abhishek - I507692

class FilterEventNotification(APIView):
    def get(self,request,DateTimeRange):
        try:
            print(type(DateTimeRange))
            # y = DateTimeRange.split("-")
            # Start , End = float(y[0])/1000 , float(y[1])/1000
            # print(Start)
            # print(type(Start))
            # StartDateTimeRange = datetime.datetime.fromtimestamp(Start).strftime('%Y-%m-%dT%H:%M:%SZ')
            # EndDateTimeRange = datetime.datetime.fromtimestamp(End).strftime('%Y-%m-%dT%H:%M:%SZ')
            # print(StartDateTimeRange)
            # print(EndDateTimeRange)
            

            # print(datetime)
            datetime = "2022-03-31 10:00 AM - 2022-04-12 10:00 PM"
            # StartTime = "2022-01-31T19:30:00.00Z"
            # EndTime = "2022-02-01T11:30:00.00Z"
            x = datetime.split(" - ")
            start,end = x[0], x[1]
            startdate = parser.parse(start)
            enddate = parser.parse(end)
            StartDateTime = startdate.strftime('%Y-%m-%dT%H:%M:%SZ')
            EndDateTime = enddate.strftime('%Y-%m-%dT%H:%M:%SZ')
            # print(StartDateTime)
            # print(EndDateTime)

            url = "https://spc.ondemand.com/sap/spc/odata/v1/notification_events/NTDBMailLogTenantsCollection?$format=json&$filter=(NotifcationEvent/CreationDateTime%20ge%20%27"+StartDateTime+"%27%20and%20NotifcationEvent/CreationDateTime%20le%20%27"+EndDateTime+"%27)%20and%20(BLDSystemRoleCode%20eq%20%27HMC%27%20or%20BLDSystemRoleCode%20eq%20%27S4_PC%27%20or%20BLDSystemRoleCode%20eq%20%27S4_1C%27%20or%20BLDSystemRoleCode%20eq%20%27S4_1P%27)%20and%20(NotifcationEvent/ServiceStatus%20eq%20%271%27or%20NotifcationEvent/ServiceStatus%20eq%20%272%27)&$expand=NotifcationEvent"
            response = requests.get(url, auth=HTTPBasicAuth('SPC_S4OPS', 'qN=N4bJeUZVTqka'))
            data = json.loads(response.text)

            datalist = [ ]
            for i in data['d']['results']:
                datalist.append({'EventID': i['NotifcationEvent']['EventID'], 'TenantID': i['TenantID'], 'CustomerID': i['CustomerID'], 'SystemRole': i['BLDSystemRoleCode'], 'DataCenter': i['DataCenterID'], 'TenantRole': i['TenantRole'], 'Status' :i['Status']
                                    , 'ServiceStatus': i['NotifcationEvent']['ServiceStatus'], 'CurrentTemplateName': i['NotifcationEvent']['CurrentTemplateName'], 'EventName': i['NotifcationEvent']['EventName'],'JiraTicket': i['NotifcationEvent']['JiraTicket']
                                    , 'NTDBEmailStatus': i['NotifcationEvent']['NTDBEmailStatus'], 'BundleID': i['NotifcationEvent']['BundleID'], 'CreatedBy': i['NotifcationEvent']['CreatedBy'], 'StartDateTime': i['NotifcationEvent']['StartDateTime'],
                                    'EndDateTime': i['NotifcationEvent']['EndDateTime'], 'CreationDateTime': i['NotifcationEvent']['CreationDateTime'], 'EndDate': i['NotifcationEvent']['EndDate'],'EndTime': i['NotifcationEvent']['EndTime'],'Phase': i['NotifcationEvent']['Phase'],
                                    'StartDate': i['NotifcationEvent']['StartDate'],'StartTime': i['NotifcationEvent']['StartTime'],'TestMode': i['NotifcationEvent']['TestMode'],'NotificationType': i['NotifcationEvent']['NotificationType'],'IsSLARelevant': i['NotifcationEvent']['IsSLARelevant']})
            # print(data)
            return Response(datalist)

        except Exception as e:
            return Response(str(e), status= 406)

class CustomerEventRCA(APIView):
    def get(self,request):
        try:
         return render(request, "event_notification/event_rca.html")
        except Exception as e:
            return Response(str(e), status=406)


class EventRCA(APIView):
    def get(self,request,DateTimeRange):
        try:
            print(DateTimeRange)
            import datetime
            y = DateTimeRange.split("-")
            Start = (float(y[0])/1000)
            End =  (float(y[1])/1000)
            StartDateTime = datetime.datetime.fromtimestamp(Start).strftime('%Y-%m-%dT%H:%M:%SZ')
            EndDateTime = datetime.datetime.fromtimestamp(End).strftime('%Y-%m-%dT%H:%M:%SZ')
           
            url = "https://spc.ondemand.com/sap/spc/odata/v1/notification_events/NTDBMailLogTenantsCollection?$format=json&$filter=(NotifcationEvent/CreationDateTime%20ge%20%27"+StartDateTime+"%27%20and%20NotifcationEvent/CreationDateTime%20le%20%27"+EndDateTime+"%27)%20and%20(BLDSystemRoleCode%20eq%20%27HMC%27%20or%20BLDSystemRoleCode%20eq%20%27S4_PC%27%20or%20BLDSystemRoleCode%20eq%20%27S4_1C%27%20or%20BLDSystemRoleCode%20eq%20%27S4_1P%27)%20and%20(NotifcationEvent/ServiceStatus%20eq%20%272%27%20or%20NotifcationEvent/ServiceStatus%20eq%20%271%27)&$expand=NotifcationEvent"
            # url = "https://spc.ondemand.com/sap/spc/odata/v1/notification_events/NTDBMailLogTenantsCollection?$format=json&$filter=(NotifcationEvent/CreationDateTime%20ge%20%27"+StartDateTime+"%27%20and%20NotifcationEvent/CreationDateTime%20le%20%27"+EndDateTime+"%27)%20and%20(BLDSystemRoleCode%20eq%20%27HMC%27%20or%20BLDSystemRoleCode%20eq%20%27S4_PC%27%20or%20BLDSystemRoleCode%20eq%20%27S4_1C%27%20or%20BLDSystemRoleCode%20eq%20%27S4_1P%27)&$expand=NotifcationEvent"
            response = requests.get(url, auth=HTTPBasicAuth('SPC_S4OPS', 'qN=N4bJeUZVTqka'))
            data = json.loads(response.text)

            datalist = [ ]
            for i in data['d']['results']:
                datalist.append({'EventID': i['NotifcationEvent']['EventID'], 'TenantID': i['TenantID'], 'CustomerID': i['CustomerID'], 'SystemRole': i['BLDSystemRoleCode'], 'DataCenter': i['DataCenterID'], 'TenantRole': i['TenantRole'], 'Status' :i['Status']
                                    , 'ServiceStatus': i['NotifcationEvent']['ServiceStatus'], 'CurrentTemplateName': i['NotifcationEvent']['CurrentTemplateName'], 'EventName': i['NotifcationEvent']['EventName'],'JiraTicket': i['NotifcationEvent']['JiraTicket']
                                    , 'NTDBEmailStatus': i['NotifcationEvent']['NTDBEmailStatus'], 'BundleID': i['NotifcationEvent']['BundleID'], 'CreatedBy': i['NotifcationEvent']['CreatedBy'], 'StartDateTime': i['NotifcationEvent']['StartDateTime'],
                                    'EndDateTime': i['NotifcationEvent']['EndDateTime'], 'CreationDateTime': i['NotifcationEvent']['CreationDateTime'], 'EndDate': i['NotifcationEvent']['EndDate'],'EndTime': i['NotifcationEvent']['EndTime'],'Phase': i['NotifcationEvent']['Phase'],
                                    'StartDate': i['NotifcationEvent']['StartDate'],'StartTime': i['NotifcationEvent']['StartTime'],'TestMode': i['NotifcationEvent']['TestMode'],'NotificationType': i['NotifcationEvent']['NotificationType'],'IsSLARelevant': i['NotifcationEvent']['IsSLARelevant']})
            # print(datalist)
            return Response(datalist)

        except Exception as e:
            return Response(str(e), status= 406)


class CustomerEventRCATEST(APIView):
    def get(self,request):
        try:
         return render(request, "event_notification/test.html")
        except Exception as e:
            return Response(str(e), status=406)