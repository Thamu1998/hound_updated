from django.http.request import QueryDict
from functools import partial
from re import A
from telnetlib import STATUS
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.views.generic import FormView, TemplateView
from django.db.models import Q, Count, Sum, Max, Avg
import json
import datetime
from background_task import background
from .serializers import master_tracking_serializer, outage_history_, outage_history_tickets_serializer, tracking_serializer, outage_master_tickets_serializer, tickets_notes_serializer, tickets_counts_serializer, Activity_table, sm_infra_activate_serializer
from .models import outage_master_tickets, outage_tracking_history, tracking_history, master_tickets
from rest_framework.decorators import api_view
import pandas as pd
# IMPORT COMMON FUNCTIONS
# from config.common_functions import query_builder
from config.common_functions import query_builder, pull_request
# from apps.shiftpasstool import serializers
from django.shortcuts import render, redirect
from django.utils import timezone
import time
# from apps.shiftpasstool. import
from apps.shiftpasstool.methods.generate_date import Histories, JSON_convert, New_ticket1, datetime_converter, select_date_time
from apps.shiftpasstool.models import tickets_notes, tickets_count_table, ActivityDB, sm_infra_activate
# from

# Create your views here.


class dashboard_html(TemplateView):
    template_name = 'shiftpasstool/shiftpasstool.html'


'''
POST tracking for each ticket id

In this function it will store once in master table and once in history table.


'''


class post_tracking(APIView):
    def post(self, request):

        self.request.data['shift'] = self.request.data['shift'].lower()
        # print(self.request.data)
        shift = select_date_time()
        self.request.data['hour'] = shift.f1(
            hours=self.request.data['start_time'])
        # print(self.request.data['hour']['shift'],"/////////////////////////////////////////")
        self.request.data['hour'] = self.request.data['hour']['shift']
        master_serializer = master_tracking_serializer(data=self.request.data)
        if master_serializer.is_valid():
            master_serializer.save()
        else:
            print(master_serializer.errors)
        serializer = tracking_serializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("Tracking data saved successfully")
        else:
            # print(serializer.errors)
            return Response(serializer.error_messages)

    # def get(self, request):

    #     arr_query = []
    #     if len(self.request.GET) > 0:
    #         shift = self.request.GET['shift'].lower()
    #         date = self.request.GET['created_date']
    #         get_shift = self.request.GET['shift']

    #         # #print(type(date),convert_date)
    #         # query=tracking_history.objects.filter()
    #         # query=tracking_history.objects.filter(shift=shift,start_time__date=get_date,start_time__hour=get_hour)
    #         convert_date = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M')
    #         get_date = datetime.datetime.strftime(convert_date, '%Y-%m-%d')
    #         get_hour = datetime.datetime.strftime(convert_date, '%H')

    #         # get_date1,get_hour1=utc_format(convert_date)
    #         # #print(get_hour,"........................",get_hour1,"get date from outage")

    #         query = tracking_history.objects.all()
    #         for i in query.values():

    #             if i['end_time'] != None:
    #                 # print(i['start_time'],type(i['start_time']),"................................")
    #                 start_date = i['start_time']
    #                 end_date = i['end_time']
    #                 # #print(convert_date.date() , start_date.date() , convert_date.date() , end_date.date())
    #                 # #print(convert_date.date() >= start_date.date() , convert_date.date() <= end_date.date())
    #                 shift = select_date_time()
    #                 shift = shift.f(hours=convert_date.time().hour)
    #                 if (start_date.date() <= convert_date.date()) and (convert_date.date() <= end_date.date()):
    #                     # if  (convert_date.date()>=start_date.date() and convert_date.date() <= end_date.date()):
    #                     #     arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
    #                     # ['end_time']})
    #                     # break
    #                     # #print(convert_date.time().hour,"HOURSSSSSSSSSSSSSSS")

    #                     if shift.lower() == 'morning':
    #                         # #print("morning")
    #                         # #print(i)
    #                         arr_query.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
    #                                           "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i['end_time']
    #                                           })
    #                         # break
    #                     elif shift.lower() == 'afternoon':
    #                         arr_query.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
    #                                           "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i['end_time']
    #                                           })
    #                         # break
    #                     else:
    #                         arr_query.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
    #                                           "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i['end_time']
    #                                           })

    #             else:
    #                 if convert_date.date() >= start_date.date():
    #                     arr_query.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
    #                                       "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i['end_time']
    #                                       })

    #                 # #print(len(query.values()))
    #     else:
    #         query = tracking_history.objects.all()
    #         for i in query.values():

    #             # #print(i['Status'],"STATUS")
    #             arr_query.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
    #                               "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i['end_time']})

    #     # print(query,"get_tracking")
    #     serializer = tracking_serializer(instance=query, many=True)
    #     df = pd.DataFrame(arr_query)
    #     # print(df)
    #     new_arr = []
    #     arr = []
    #     if len(df) > 0:

    #         for i in df['Ticket_ID'].unique():
    #             if len(self.request.GET) > 0:
    #                 df_filter = df[(df['Ticket_ID'] == i) &
    #                                (df['shift'] == self.request.GET['shift'].lower())]
    #                 # #print(df_filter,"df_filter")
    #             else:
    #                 df_filter = df[(df['Ticket_ID'] == i)]

    #             if len(df_filter) > 0:
    #                 df1 = df_filter.sort_values(by=['ID'], ascending=False)
    #                 # print(df1['start_date'],"SPA")

    #                 for k, v in df1.iterrows():
    #                     # #print(v)
    #                     new_arr.append({"Ticket_ID": v['Ticket_ID'], 'status': v['Status'],
    #                                     "start_date": v['start_date'], "end_date": v['end_date']})

    #                 for k, i in df1.iterrows():
    #                     arr.append({'ID': i['ID'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
    #                                 "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_date'], "end_date": i['end_date']
    #                                 })
    #                     break
    #             else:
    #                 df_filter = df[(df['Ticket_ID'] == i)]
    #                 df1 = df_filter.sort_values(by=['ID'], ascending=False)
    #                 # print(df1['start_date'],"SPA")

    #                 for k, v in df1.iterrows():
    #                     # #print(v)
    #                     new_arr.append({"Ticket_ID": v['Ticket_ID'], 'status': v['Status'],
    #                                     "start_date": v['start_date'], "end_date": v['end_date']})

    #                 for k, i in df1.iterrows():
    #                     arr.append({'ID': i['ID'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
    #                                 "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_date'], "end_date": i['end_date']
    #                                 })
    #                     break
    #         # print(new_arr)
    #         new_data1 = arr + new_arr
    #         if len(self.request.GET) > 0 and len(arr) > 0:
    #             data = New_ticket1()
    #             arr = data.generate_tickets1(
    #                 df1=arr, new_params=self.request.GET['shift'].lower())
    #         arr1 = []
    #         # #print(arr,'arrrrrrrrrrrrrrrrrrrrd')
    #         arr = pd.DataFrame(arr)
    #         for k, i in arr.iterrows():
    #             # if i['Ticket_ID'] in new_arr:
    #             # #print(new_arr['Ticket_ID'].index(i['Ticket_ID']),"outageeeeeeeeeeeeee")
    #             arr1.append({'ID': i['ID'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
    #                          "created_date": i['created_date'], "date": i['date'], "shift": i['shift']})

    #         return Response({"new_data1": arr1, "new_data2": new_arr})
    #     else:
    #         return Response([])
    def get(self, request):
        arr_query = []
        query_all = tracking_history.objects.all()
        if len(self.request.GET) > 0:
            req_date = parse(self.request.GET['created_date'])
            quer=query_all.values()
            data=[]
            for j in range(len(quer)):
                # print(j['planned_end_date'],"j['planned_end_date']")
                start_date = quer[j]['start_time']
                end_date = quer[j]['end_time']
                if end_date != None:
                    
                    if (start_date.date() <= req_date.date()) and (req_date.date() <= end_date.date()):

                        if end_date.date() >= req_date.date():
                            if self.request.GET['shift'].lower() == "morning":
                                if quer[j]['shift'].lower() == "morning":
                                    data.append(quer[j])
                                    # break 
                            elif self.request.GET['shift'].lower() == "afternoon":
                                if quer[j]['shift'].lower() in ["morning","afternoon"]:
                                    data.append(quer[j])
                                    # break
                            elif self.request.GET['shift'].lower() == "night":
                                if quer[j]['shift'].lower() in ["morning","afternoon","night"]:
                                    data.append(quer[j])
                                    # break
                else:
                    if req_date.date() >= start_date.date():
                        data.append(quer[j])
        else:
            quer=query_all.values()
            data=[]
            for i in quer:
                data.append(i)
        unique_data=pd.DataFrame(data)
        new_arr=[]
        print(data)
        if len(unique_data)>0:
            for j in unique_data['Ticket_ID'].unique():
                unique_data_=unique_data[unique_data['Ticket_ID']==j]
                unique_data_['shift']=unique_data_['shift'].apply(lambda x:x.lower())
                if len(self.request.GET) >0:
                    
                    new_unique_data=unique_data_[unique_data['shift'] == self.request.GET['shift'].lower()]
                else:
                    new_unique_data=unique_data_
                if len(new_unique_data)>0:
                    dec=new_unique_data.sort_values(by=['id'], ascending=False)
                    
                    for k,i in dec.iterrows():
                            new_arr.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
                                    "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i['end_time']
                                    })
                            break
                else:
                    dec=unique_data_.sort_values(by=['id'], ascending=False)
                    
                    for k,i in dec.iterrows():
                            new_arr.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
                                    "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['end_time'], "end_date": i['end_time']
                                    })
                            break
            final_arr=[]
            res=New_ticket1()
            print(new_arr,"new_arr")
            if len(self.request.GET)>0:
                re=res.generate_tickets2(df1=new_arr,new_params=self.request.GET['shift'],req_date=req_date)
            else:
                create_shift=select_date_time()
                createshift=create_shift.f(hours=datetime.datetime.now().hour)
                re=res.generate_tickets2(df1=new_arr,new_params=createshift,req_date=datetime.datetime.now())
            final_res={}
            re=pd.DataFrame(re)
            for k,i in re.iterrows():
                final_arr.append({'ID': i['ID'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'], "Action_Required": i['Action_Required'], "Status": i['Status'],
                                    "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_date'], "end_date": i['end_date']
                                    })
            # final_res['report'] = final_arr
            # final_res['timezones'] = final_arr
            return Response({"new_data1": final_arr, "new_data2": final_arr})
        else:
            return Response([])


'''
In this function it will get all data in history of tracking data's and also get particular datas using (shift, date)

'''


@api_view(['GET'])
def get_tracking(request):
    try:
        if len(request.GET) > 0:
            query = tracking_history.objects.filter(
                start_time__gt=request.GET['created_date'])
        else:
            query = tracking_history.objects.all()
        # #print(query,"get_tracking")
        serializer = tracking_serializer(instance=query, many=True)
        df = pd.DataFrame(serializer.data)
        # #print(df)
        if len(df) > 0:
            arr = []
            for i in df['Ticket_ID'].unique():
                df_filter = df[df['Ticket_ID'] == i]

                df1 = df_filter.sort_values(by=['id'], ascending=False)
                # #print(df1,"SPA")
                # df1=df1.reset_index(drop=True)
                # df1=pd.DataFrame(df1)
                # #print(df1)
                for k, i in df1.iterrows():
                    arr.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "Action_Taken": i['Action_Taken'],
                                "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift']})
                    break
            return Response(arr)
        else:
            return Response([])
    except Exception as e:
        # print(e,"errror")
        return Response([])


'''
In this function get all data's in master table
'''


@api_view(['GET'])
def master_data(request):

    if request.method == 'GET' and len(request.GET) == 0:
        query = master_tickets.objects.all()
        serializer = master_tracking_serializer(instance=query, many=True)
        return Response(serializer.data)


'''
In this function if someone update the ticket in open into inprogress or inprogress into resolved.

And same thing it will post in history table also
'''


class update_tracking(APIView):
    def put(self, request):
        if master_tickets.objects.filter(Ticket_ID=self.request.data['Ticket_ID']).exists():
            query = master_tickets.objects.filter(
                Ticket_ID=self.request.data['Ticket_ID']).values()
            history = tracking_history.objects.filter(
                Ticket_ID=self.request.data['Ticket_ID']).values()
            self.request.data['start_time'] = parse(self.request.data['created_date'])
            if len(history) > 1:
                new_history = history[len(history)-1]
                query = tracking_history.objects.filter(
                    **new_history).update(end_time=self.request.data['start_time'])
            else:
                new_history = history
                # print(new_history,"new_history")
                tracking_history.objects.filter(Ticket_ID=self.request.data['Ticket_ID']).update(
                    end_time=self.request.data['start_time'])

            # if self.request.data['Status'].lower().replace(" ","") == 'inprogress' or self.request.data['Status'].lower().replace(" ","") == 'waiting' or  self.request.data['Status'].lower().replace(" ","") == 'resolved':

            shift = datetime.datetime.now().hour
            shift_1 = select_date_time()
            get_shift = shift_1.f(hours=shift)
            if self.request.data['Status'].lower().replace(" ", "") == 'resolved':
                self.request.data['end_time'] = self.request.data['start_time']

            master_tickets.objects.filter(Ticket_ID=self.request.data['Ticket_ID']).update(
                Status=self.request.data['Status'], date=self.request.data['start_time'], shift=get_shift)
            # self.request.data['shift'] = get_shift
            his = Histories()
            his.make_history(data=self.request.data)

            return Response("Tracking history updated successfully")
            # else:
            #     return Response(f"{query[0]['Ticket_ID']} already update into inprogress")
        else:
            return Response(f"{request.data['Ticket_ID']} Ticket ID does not exist")


# create history table
# create a ticket in master table
# create history table in every day
'''
trigger function is to trigger in cronjob.....
'''
from dateutil.parser import parse


class post_api(APIView):

    def post(self, request):

        self.request.data['shift'] = self.request.data['shift'].lower()

        # self.request.data['start_time']=timezone.now()

        serializer = outage_master_tickets_serializer(data=self.request.data)

        if serializer.is_valid():

            serializer.save()

            his = Histories()

            his.make_outage_history(data=self.request.data)

            return Response('created')
        else:
            print(serializer.errors, 'serializer.errors.................')
            return Response(serializer.errors)

    def put(self, request):
        query1 = outage_master_tickets.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).first()
        query = outage_master_tickets.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).values()
        print(query, "len(query)")
        history = outage_tracking_history.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).values()
        
        self.request.data['start_time'] = parse(self.request.data['created_date'])
        # self.request.data['start_time']=datetime.datetime.strptime('2022-11-15T12:00','%Y-%m-%dT%H:%M')

        if len(history) > 1:
            new_history = history[len(history)-1]
            print(new_history, "............new_history")
            outage_tracking_history.objects.filter(
                **new_history).update(end_time=self.request.data['start_time'])
        else:
            new_history = history
            # print(new_history,"new_history")
            outage_tracking_history.objects.filter(Ticket_ID=self.request.data['Ticket_ID']).update(
                end_time=self.request.data['start_time'])

        if self.request.data['Status'].lower().replace(" ", "") == 'resolved':
            self.request.data['end_time'] = self.request.data['start_time']
            # self.request.data['end_time']=datetime.datetime.strptime('2022-11-15T12:00','%Y-%m-%dT%H:%M')

        if query[0]['Status'].lower().replace(" ", "") == 'resolved' or query[0]['Status'].lower().replace(" ", "") == 'inprogress' or query[0]['Status'].lower().replace(" ", "") == 'waiting' or query[0]['Status'].lower().replace(" ", "") == 'new':
            # request.data['date']=[datetime.datetime.date()]

            query_dict_1 = QueryDict('', mutable=True)
            query_dict_1.update(self.request.data)

            # print(query_dict_1)

            serializer = outage_master_tickets_serializer(
                query1, data=query_dict_1, partial=True)
            if serializer.is_valid():
                serializer.save()
                #print(serializer.data,"BEFORE HISTORY ")
                shift = datetime.datetime.now().hour
                shift_1 = select_date_time()
                get_shift = shift_1.f(hours=shift)
                # get_shift=f(shift)
                # self.request.data['shift'] = get_shift
                his = Histories()

                history = his.make_outage_history(data=self.request.data)
                # print(history,"hihstory")
                return Response("updated")
            else:
                print(serializer.errors, "/.................................")
                return Response(serializer.errors)

    def get(self, request):
        # query=outage_master_tickets.objects.all().values('id')
        # #print(query)
        serializer = outage_master_tickets_serializer(
            outage_master_tickets.objects.all(), many=True)
        return Response(serializer.data)

# def new_tickets(df1,new_params):
#     df1=pd.DataFrame(df1)

#     df1['new_end_date'] = pd.to_datetime(df1['end_date'], infer_datetime_format=True)
#     equal_shift=f(df1.new_end_date.dt.hour.values[0])
#     #print(new_params,"OTSAGE")
#     if new_params == equal_shift:
#         df1=df1[df1['Status'].isin(['Resolved','Waiting','InProgress','New'])]
#     else:
#         df1=df1[df1['Status'].isin(['Waiting','InProgress','New'])]
#     return df1


class Outage_Get_Id(APIView):
    def get(self, request):
        query = outage_tracking_history.objects.filter(
            id=self.request.GET['id'])
        serializer = outage_history_tickets_serializer(query, many=True)
        return Response(serializer.data)


class SPC_Get_Id(APIView):
    def get(self, request):
        query = outage_tracking_history.objects.filter(
            id=self.request.GET['id'])
        serializer = outage_history_tickets_serializer(query, many=True)
        return Response(serializer.data)


# class outage_get_api(APIView):
#     def get(self, request):
#         arr = []
#         arr_query = []
#         if len(self.request.GET) > 0:
#             shift = self.request.GET['shift'].lower()
#             # datetime.datetime.strptime(date_string, format)

#             date = self.request.GET['created_date']

#             convert_date = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M')
#             get_date = datetime.datetime.strftime(convert_date, '%Y-%m-%d')
#             get_hour = datetime.datetime.strftime(convert_date, '%H')

#             # get_date1,get_hour1=utc_format(convert_date)
#             # #print(get_hour,"........................",get_hour1,"get date from outage")

#             query = outage_tracking_history.objects.all()
#             for i in query.values():
#                 start_date = i['start_time']
#                 end_date = i['end_time']
#                 if i['end_time'] != None:
#                     # #print(i['start_time'],type(i['start_time']),"................................")

#                     # #print(convert_date.date() , start_date.date() , convert_date.date() , end_date.date())
#                     #print(convert_date.date() >= start_date.date() , convert_date.date() <= end_date.date())
#                     if (start_date.date() <= convert_date.date()) and (convert_date.date() <= end_date.date()):
#                         # if  (convert_date.date()>=start_date.date() and convert_date.date() <= end_date.date()):
#                         #     arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
#                         # ['end_time']})
#                         # break
#                         # #print(convert_date.time().hour,"HOURSSSSSSSSSSSSSSS")
#                         shift = select_date_time()
#                         get_shift = shift.f(hours=convert_date.time().hour)

#                         # if get_shift.lower() == 'morning':
#                         #     # #print("morning")
#                         #     #print(i)
#                         #     arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
#                         #     ['end_time']})
#                         #     # break
#                         # elif get_shift.lower() == 'afternoon':
#                         #     arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
#                         #     ['end_time']})
#                         #     # break
#                         # else:
#                         arr_query.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i
#                                           ['end_time']})
#                 else:
#                     if convert_date.date() >= start_date.date():
#                         arr_query.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i
#                                           ['end_time']})

#         else:
#             query = outage_tracking_history.objects.all()
#             for i in query.values():

#                 # #print(i['Status'],"STATUS")
#                 arr_query.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_date": i
#                                   ['end_time']})

#         # #print(query.values()[0]['start_time'],".................",convert_date,"status")

#         serializer = outage_history_(query, many=True)
#         print(arr_query)
#         df = pd.DataFrame(arr_query)

#         new_arr = []
#         final_res = {}

#         if len(df) > 0:

#             for i in df['Ticket_ID'].unique():
#                 if len(self.request.GET) > 0:
#                     df_filter = df[(df['Ticket_ID'] == i) &
#                                    (df['shift'] == self.request.GET['shift'].lower())]
#                     # #print(df_filter,"df_filter")
#                 else:
#                     df_filter = df[(df['Ticket_ID'] == i)]
#                 if len(df_filter) > 0:
#                     df1 = df_filter.sort_values(by=['ID'], ascending=False)
#                     # #print(df1,"OUTAGE DF")
#                     for k, v in df1.iterrows():
#                         new_arr.append({"Ticket_ID": v['Ticket_ID'], 'status': v['Status'],
#                                         "start_date": v['start_date'], "end_date": v['end_date']})

#                     for k, i in df1.iterrows():
#                         arr.append({'ID': i['ID'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'],
#                                     "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_date'], "end_date": i['end_date']})
#                         break
#                 else:
#                     # pass
#                     df_filter = df[(df['Ticket_ID'] == i)]
#                     df1 = df_filter.sort_values(by=['ID'], ascending=False)
#                     # #print(df1,"OUTAGE DF")
#                     for k, v in df1.iterrows():
#                         new_arr.append({"Ticket_ID": v['Ticket_ID'], 'status': v['Status'],
#                                         "start_date": v['start_date'], "end_date": v['end_date']})

#                     for k, i in df1.iterrows():
#                         arr.append({'ID': i['ID'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'],
#                                     "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_date'], "end_date": i['end_date']})
#                         break

#             print(arr, "ARR")
#             if len(self.request.GET) > 0 and len(arr) > 0:
#                 data = New_ticket1()
#                 arr = data.generate_tickets1(
#                     df1=arr, new_params=self.request.GET['shift'].lower())
#                 # arr=new_tickets(arr,shift)
#             arr1 = []
#             arr = pd.DataFrame(arr)
#             for k, i in arr.iterrows():

#                 arr1.append({'ID': i['ID'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'],
#                              "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_date'], "end_date": i['end_date']})

#             final_res['report'] = arr1
#             final_res['timezones'] = new_arr

#             return Response(final_res)
#         else:
#             return Response([])

class outage_get_api(APIView):
    def get(self, request):
        # arr_query = []
        all_results = outage_tracking_history.objects.all()
        if len(self.request.GET) > 0:
            req_date = parse(self.request.GET['created_date'])
            all_result_values=all_results.values()
            data=[]
            for row in range(len(all_result_values)):
                # print(j['planned_end_date'],"j['planned_end_date']")
                start_date = all_result_values[row]['start_time']
                end_date = all_result_values[row]['end_time']
                # org_end_date=quer[j]['date']
                # print(start_date,end_date)
                def get_shift_time_range(shift_in_words):
                    if shift_in_words == 'morning':
                        return (6,14)
                    elif shift_in_words == 'afternoon':
                        return (14,23)
                    elif shift_in_words == 'night':
                        return (23,6)
                if end_date != None:


                    '''
                    ticket 1
                    start  => 2022-12-22, morning enddate => 2022-12-22 New

                    ticket 2
                    start => 2022-12-22, afternoon enddate => 2023-01-04 inprogress

                    ticket 3
                    start => 2023-01-04, Night enddate => 2023-01-06 waiting
                    
                    ticket 4
                    start => 2023-01-06, morning enddate => 2023-01-06 resolved
                                        after
                    
                    tic []
                    '''
                    shift_time_range=get_shift_time_range(all_result_values[row]['shift'].lower())

                    if start_date.date() <= req_date.date() <= end_date.date():
                    
                        if end_date.date() == req_date.date() and all_result_values[row]['shift'].lower() == self.request.GET['shift'].lower() and all_result_values[row]['Status'] == 'Resolved':
                            data.append(all_result_values[row])

                        else:
                            
                            if all_result_values[row]['Status'] in ['New','Waiting','Inprogress']:

                                result_resolved = [d for d in all_results if d['Status'] == 'Resolved' and d['Ticket_ID'] == all_result_values[row]['Ticket_ID']]

                                if len(result_resolved)>0 and result_resolved[0]['end_time'].date() == req_date.date():

                                    if result_resolved[0]['Status'] == 'Resolved' and result_resolved[0]['shift'].lower() == 'morning':

                                        if self.request.GET['shift'].lower() in ['afternoon','night']:
                                            pass
                                        else: 
                                            data.append(all_result_values[row])
                                    elif result_resolved[0]['Status'] == 'Resolved' and result_resolved[0]['shift'].lower() == 'afternoon':
                                        if self.request.GET['shift'].lower() in ['night']:
                                            pass
                                        else:
                                            data.append(all_result_values[row])

                                    else:
                                        data.append(all_result_values[row])

                                else:
                                    data.append(all_result_values[row])
                             
    #                 if (start_date.date() <= req_date.date()) and (req_date.date() <= end_date.date()):
    #                     print(end_date.date() >= req_date.date(),"------------------",end_date.date(), req_date.date(),quer[j]['Status'])
    #                     if end_date.date() >= req_date.date():
                            

    #                         # data.append(quer[j])
    # #                         if ticket_date.date() == now.date():
                            
    #                                     # return True

    #                         # If the ticket is not for today or the shift has already passed, return False
    #                         # return False

    #                         if self.request.GET['shift'].lower() == "morning":
                                
    #                             if quer[j]['shift'].lower() == "morning":
    #                                 data.append(quer[j])
    #                                 # break
    #                             # elif quer[j]['shift'].lower() == "afternoon":
    #                             #         data.append(quer[j])
    #                             # elif quer[j]['shift'].lower() == "night":
    #                             #         data.append(quer[j])
    #                         elif self.request.GET['shift'].lower() == "afternoon":
    #                             if quer[j]['shift'].lower() in ["morning","afternoon"]:
    #                                 data.append(quer[j])
    #                                 # break
    #                         elif self.request.GET['shift'].lower() == "night":
    #                             if quer[j]['shift'].lower() in ["morning","afternoon","night"]:
    #                                 data.append(quer[j])

                                
                else:
                    if req_date.date() >= start_date.date():
                        data.append(all_result_values[row])

                    # else:
                        # print(quer[j])
                        # if req_date.date() >= start_date.date():
                        #     if self.request.GET['shift'].lower() == "morning":
                        #         if quer[j]['shift'].lower() == "morning":
                        #             data.append(quer[j])
                        #         # break
                        #     elif self.request.GET['shift'].lower() == "afternoon":
                        #         # print(quer[j]['shift'].lower() in ["morning","afternoon"])
                        #         if quer[j]['shift'].lower() in ["morning","afternoon"]:
                        #             data.append(quer[j])
                        #             # break
                        #     elif self.request.GET['shift'].lower() == "night":
                        #         if quer[j]['shift'].lower() in ["morning","afternoon","night"]:
                        #             data.append(quer[j])
        else:
            all_result_values=all_results.values()
            data=[]
            for values in all_result_values:
                data.append(values)
        print(data,"LENNNNNNNN")
        
        
        final_result=[]
        # print(unique_data['end_time'],"UNIQUQQQQQQQQQQQQQQQQ")
        res=New_ticket1()
        # if len(self.request.GET)>0:
        #         re=res.generate_tickets2(df1=data,new_params=self.request.GET['shift'],req_date=req_date)
        # else:
        #     create_shift=select_date_time()
        #     createshift=create_shift.f(hours=datetime.datetime.now().hour)
        #     re=res.generate_tickets2(df1=data,new_params=createshift,req_date=datetime.datetime.now())

        all_filtered_dataframes=pd.DataFrame(data)
        # print(re,"LENNNNNNNN")
        if len(all_filtered_dataframes)>0:
            '''start => 2022-12-22, afternoon enddate => 2023-01-04 inprogress

                    ticket 3
                    start => 2023-01-04, Night enddate => 2023-01-06 waiting'''
            for filtered_dataframe in all_filtered_dataframes['Ticket_ID'].unique():

                unique_data_frame=all_filtered_dataframes[all_filtered_dataframes['Ticket_ID']==filtered_dataframe]

                unique_data_frame['shift']=unique_data_frame['shift'].apply(lambda x:x.lower())
                print(unique_data_frame['shift'])
                if len(self.request.GET) >0:
                    # new_unique_data=unique_data_
                    new_unique_data=unique_data_frame[unique_data_frame['shift'] == self.request.GET['shift'].lower()]
                    print(new_unique_data,".............new_unique_data")
                else:
                    new_unique_data=unique_data_frame
                if len(new_unique_data)>0:

                    dec=new_unique_data.sort_values(by=['id'], ascending=False)[0].to_list()
                    final_result.append(dec)
                    # for k,i in dec.iterrows():
                    #     new_arr.append({'id': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_time": i
                    #                     ['end_time']})
                        # break
                else:
                    dec=unique_data_.sort_values(by=['id'], ascending=False)[0].to_list()
                    final_result.append(dec)
                    # for k,i in dec.iterrows():
                    #     final_result.append({'id': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_time": i
                    #                     ['end_time']})
                    #     break
            # final_arr=[]

            # if len(self.request.GET)>0:
            #     re=res.generate_tickets2(df1=new_arr,new_params=self.request.GET['shift'],req_date=req_date)
            # else:
            #     create_shift=select_date_time()
            #     createshift=create_shift.f(hours=datetime.datetime.now().hour)
            #     re=res.generate_tickets2(df1=new_arr,new_params=createshift,req_date=datetime.datetime.now())
            final_res={}
            # re=pd.DataFrame(re)
            # for k,i in re.iterrows():
            #     final_arr.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_date'], "end_date": i
            #                               ['end_time']})
            final_res['report'] = final_result
            final_res['timezones'] = final_result
            return Response(final_res)
        else:
            final_arr=[]
            final_res={}
            final_res['report'] = final_arr
            final_res['timezones'] = final_arr
            return Response(final_res)

# ----------------------------------------------------------------------------------------------=-----------------------

# from django.http import QueryDict,HttpResponse
# from django.shortcuts import render, redirect


# from rest_framework.views import APIView
# import datetime
# from rest_framework.response import Response
# import time
# import re
# from django.db.models import Q,Count
# import xlwt
# import pandas as pd
# def JSON_query(data):
#     # data['date']=datetime.datetime.now()
#     query_dict_1 = QueryDict('', mutable=True)
#     query_dict_1.update(data)
#     return query_dict_1


# def DateTimeConvert(date):
#     try:
#         convert_date=datetime.datetime.strptime(date,'%Y-%m-%dT%H:%M')
#         get_date=datetime.datetime.strftime(convert_date,'%Y-%m-%d')
#         get_hour=datetime.datetime.strftime(convert_date,'%H')

#     except:
#         print(type(date),'date')
#         # if type(date) == "<class 'datetime.datetime'>":

#         try:
#             convert_date=datetime.datetime.strptime(date,'%Y-%m-%dT%H:%M:%S.%fZ')
#         except:
#             convert_date=datetime.datetime.strptime(date,'%Y-%m-%dT%H:%M:%SZ')
#         get_date=datetime.datetime.strftime(convert_date,'%Y-%m-%d')
#         get_hour=datetime.datetime.strftime(convert_date,'%H')

#     # x=int(x)
#     return get_date,get_hour,convert_date

# def f(x):
#     if (x >= 6) and (x < 14):
#         return 'Morning'
#     elif (x >= 14) and (x < 23):
#         return'Afternoon'
#     elif (x >= 23 and 6 < x) or ((x >= 0) and (x<=6)):
#         return'Night'


class ticket_comment(APIView):

    # def post(self,request):

    #     serializer_query=JSON_query(self.request.data)

    #     serializer=tickets_notes_serializer(data=serializer_query)

    #     if serializer.is_valid():
    #         serializer.save()

    #     else:
    #         print(serializer.errors)
    #         print(serializer.error_messages)
    #     return Response("Tickets Notes created")

    def post(self, request):
        date = self.request.data['date']

        shift = self.request.data['shift']
        convertFormat = datetime_converter()

        converted_date = convertFormat.DateTimeConvert(date=date)
        # converted_date=DateTimeConvert(date)

        if tickets_notes.objects.filter(date__date=converted_date[0], date__hour=converted_date[1], shift=shift).exists():
            json_query = JSON_convert()
            json = json_query.JSON_query(data=self.request.data)
            json_query = json
            print(json_query)

            update_query = tickets_notes.objects.filter(
                **self.request.data).first()

            serializer = tickets_notes_serializer(
                instance=update_query, data=json_query, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response("tickets notes updates")
            else:
                print(serializer.error_messages)
                print(serializer.errors)
        else:
            json_query = JSON_convert()
            json = json_query.JSON_query(data=self.request.data)
            serializer_query = json

            serializer = tickets_notes_serializer(data=serializer_query)

            if serializer.is_valid():
                serializer.save()

            else:
                print(serializer.errors)
                print(serializer.error_messages)
            return Response("Tickets Notes created")

    def get(self, request):
        print("len(self.request.GET)", len(
            self.request.GET), "........................")
        if len(self.request.GET) > 0:
            # shift=self.request.GET['shift']
            date = self.request.GET['created_date']
            convertFormat = datetime_converter()

            get_date, get_hour, get_datetime = convertFormat.DateTimeConvert(
                date=date)

            query = tickets_notes.objects.filter(
                date__date=get_date,shift=self.request.GET['shift']).order_by('-id')
            print(query)
            if len(query) ==0:
                query = tickets_notes.objects.filter(
                date__date=get_date).order_by('-id')
            if len(query) > 0:
                serializer = tickets_notes_serializer(query, many=True)

                return Response(serializer.data[0])
            else:
                return Response([])

        else:
            latest_date = datetime.datetime.now().date()
            hour = datetime.datetime.now().hour

            SHIFT = select_date_time()
            shift = SHIFT.f(hours=hour)
            print(latest_date, hour, shift)
            # query=tickets_notes.objects.filter(date__date=latest_date,shift=SHIFT).order_by('-id')
            query = tickets_notes.objects.filter(
                date__date=latest_date).order_by('-id')
        if len(query) > 0:
            serializer = tickets_notes_serializer(instance=query, many=True)

            return Response(serializer.data[0])
        else:
            return Response([])


class set_Ticket_count(APIView):

    def post(self, request):
        # json_data=JSON_query(self.request.data)
        json_query = JSON_convert()
        json_data = json_query.JSON_query(data=self.request.data)
        serializer = tickets_counts_serializer(data=json_data)
        if serializer.is_valid():
            serializer.save()
            return Response("Ticket count created")
        else:
            print(serializer.error_messages)
            print(serializer.errors)

    def put(self, request):
        # json_data=JSON_query(self.request.data)
        date = self.request.data['date']

        shift = self.request.data['shift']
        convertFormat = datetime_converter()

        converted_date = convertFormat.DateTimeConvert(date=date)
        # converted_date=DateTimeConvert(date)
        print(tickets_count_table.objects.filter(
            date__date=converted_date[0], date__hour=converted_date[1], shift=shift).exists(), "OUTSIDE")
        if tickets_count_table.objects.filter(date__date=converted_date[0], date__hour=converted_date[1], shift=shift).exists():

            update_query = tickets_count_table.objects.filter(
                **self.request.data).first()
            self.request.data['date'] = datetime.datetime.now()
            json_query = JSON_convert()
            json_query = json_query.JSON_query(data=self.request.data)

            serializer = tickets_counts_serializer(
                instance=update_query, data=json_query, partial=True)
            print(serializer.is_valid(), "INSIDE")
            if serializer.is_valid():
                serializer.save()
                return Response("Updated successfully")
            else:
                print(serializer.error_messages)
                print(serializer.errors)
                return Response(serializer.error_messages)
        else:
            self.post(self.request.data)
            # print("ELSEEEE")
            pass

    def get(self, request):
        #
        # response = shift_status_info.as_view()(request._request)
        # print(response.data,"response")
        if len(self.request.GET) > 0:
            print(self.request.GET)
            date = self.request.GET['created_date']
            convertFormat = datetime_converter()
            shift=self.request.GET['shift']

            get_date, get_hour, get_datetime = convertFormat.DateTimeConvert(
                date=date)
            query = tickets_count_table.objects.filter(
            date__date=get_date,shift=shift).order_by('-id')
            if len(query) == 0:
                query = tickets_count_table.objects.filter(
            date__date=get_date).order_by('-id')
            # get_date,get_hour=DateTimeConvert(date)
        else:
            date = datetime.datetime.now()
            get_date = date.date()
            get_hour = date.hour
            
            query = tickets_count_table.objects.all().order_by('-id')
        print(query)
        if len(query) > 0:
            serializer = tickets_counts_serializer(query, many=True)
            return Response(serializer.data[0])
        else:
            return Response("No data")
            # pass


class sm_infra_activate_obj(APIView):

    def post(self, request):
        # self.request.data['planned_start_date'] =
        # self.request.GET['created_date'] = parse(self.request.GET['created_date'])
        json_query = JSON_convert()
        json_query = json_query.JSON_query(data=self.request.data)
        # json_query=JSON_query(self.request.data)
        print(json_query, "......"
        )
        if sm_infra_activate.objects.filter(ticket_id=json_query['ticket_id']).exists():
            # json_query['planned_start_date'] = self.request.GET['created_date']
            query1 = sm_infra_activate.objects.filter(
                ticket_id=json_query['ticket_id']).values()
            if len(query1) > 1:

                sm_infra_activate.objects.filter(
                    **query1[len(query1)-1]).update(planned_end_date=self.request.data['planned_start_date'])
            else:
                print(query1[0])
                sm_infra_activate.objects.filter(
                    **query1[0]).update(planned_end_date=self.request.data['planned_start_date'])
                # SHIFT = select_date_time()
                # shift = SHIFT.f(
                #     hours=json_query['planned_start_date'].time().hour)
                # json_query['shift'] = self.request.GET['shift']
        # convert_date = self.request.data['planned_start_date']
        if self.request.data['pre_check_status'] == 'Resolved':
            # datetime.datetime.now()
            json_query['planned_end_date'] = self.request.data['planned_start_date']

            # SHIFT = select_date_time()
            # shift = SHIFT.f(hours=json_query['planned_end_date'].time().hour)
            # json_query['shift'] = self.request.GET['shift']
        print(json_query)
        serializer = sm_infra_activate_serializer(data=json_query)
        if serializer.is_valid():
            serializer.save()

            # req_data=Get_all_activity.as_view()(request.data)
            # print(req_data)
            return Response("sm_infra_createed")
        else:
            return Response(serializer.errors)


# class Get_sm_infra_activate(APIView):

#     def get(self, request):
#         arr_query = []
#         if len(self.request.GET) > 0:
#             date = self.request.GET['created_date']
#             query_all = sm_infra_activate.objects.all()
#             convert_date = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M')

#             for j in query_all.values():
#                 start_date = j['planned_start_date']
#                 end_date = j['planned_end_date']
#                 if j['planned_end_date'] != None:
#                     SHIFT = select_date_time()
#                     shift = SHIFT.f(hours=convert_date.time().hour)
#                     if (start_date.date() <= convert_date.date()) and (convert_date.date() <= end_date.date()):
#                         # print(f(convert_date.time().hour))
#                         if shift == 'Morning':
#                             arr_query.append({'id': j['id'],
#                                               "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#                                               "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#                                               'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
#                         elif shift == 'Afternoon':
#                             arr_query.append({'id': j['id'],
#                                               "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#                                               "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#                                               'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})

#                         elif shift == 'Night':
#                             arr_query.append({'id': j['id'],
#                                               "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#                                               "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#                                               'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
#                             # break
#                 else:
#                     print("else =>", start_date, convert_date)
#                     if convert_date.date() >= start_date.date():
#                         print("afternoon 2")
#                         arr_query.append({'id': j['id'],
#                                           "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#                                           "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#                                           'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})

#         else:
#             query_all = sm_infra_activate.objects.all().values()
#             serializer = Activity_table(instance=query_all, many=True)
#             for j in query_all:
#                 arr_query.append({'id': j['id'],
#                                   "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#                                   "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#                                   'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
#         #
#         df = pd.DataFrame(arr_query)
#         new_arr = []
#         if len(df) > 0:
#             for v in df['ticket_id'].unique():
#                 df_new=df[(df['ticket_id'] == v)]

                
#                 if len(self.request.GET) > 0:
#                     # df,new_params,convert_date
#                     datetime_sortage=New_ticket1()
#                     df_new=datetime_sortage.new_tickets_SM_INFRA(df=df_new,new_params=self.request.GET['shift'],convert_date=convert_date.date())

#                     json_data = df_new[(df_new['ticket_id'] == v) & (
#                         df_new['shift'] == self.request.GET['shift'])]
#                 else:
#                     json_data = df_new[(df_new['ticket_id'] == v)]
                
#                 if len(json_data) > 0:
                    
#                     df1 = json_data.sort_values(by=['id'], ascending=False)
#                     for i, j in df1.iterrows():
#                         new_arr.append({'id': j['id'],
#                                         "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#                                         "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#                                         'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
#                         break
#                 else:
                    
#                     json_data = df_new[(df_new['ticket_id'] == v)]
#                     # print("else=>,", json_data)
#                     df1 = json_data.sort_values(by=['id'], ascending=False)
#                     for i, j in df1.iterrows():
#                         new_arr.append({'id': j['id'],
#                                         "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#                                         "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#                                         'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
#                         break
#                 # break
#             new_arr1 = []
#             arr = new_arr
            
#             # arr = pd.DataFrame(arr)
#             # for k, j in arr.iterrows():

#             #     new_arr1.append({'id': j['id'],
#             #                      "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#             #                      "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#             #                      'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
#             return Response(new_arr)
#         else:
#             return Response([])

class Get_sm_infra_activate(APIView):

    def get(self,request):
        arr_query = []
        query_all = sm_infra_activate.objects.all()
        # 
        if len(self.request.GET) > 0:
            req_date = parse(self.request.GET['created_date'])
            quer=query_all.values()
            data=[]
            new_df=pd.DataFrame(quer)
            import numpy as np
            for v in new_df['ticket_id'].unique():
                tic_new_df=new_df[new_df['ticket_id']==v]
                tic_new_df.replace({np.nan: None}, inplace = True)
                for k,j in tic_new_df.iterrows():
                    
                    start_date = j['planned_start_date']
                    end_date = j['planned_end_date']
                    print(end_date,"end_date          ")
                    
                    if end_date != None :
                        
                        if (start_date.date() <= req_date.date()) and (req_date.date() <= end_date.date() ):

                            if end_date.date() >= req_date.date():
                                # data.append(j)
                                # break
                                if self.request.GET['shift'] == "Morning":
                                    if j['shift'] == "Morning":
                                        data.append(j)
                                    else:
                                        data.append(j)
                                        break

                                elif self.request.GET['shift'] == "Afternoon":
                                    if j['shift'] in ["Morning","Afternoon"]:
                                        data.append(j)

                                elif self.request.GET['shift'] == "Night":
                                    if  j['shift'] in ["Morning","Afternoon","Night"]:
                                        data.append(j)
                    else:
                        if req_date.date() >= start_date.date():
                            data.append(j)
            # for j in range(len(quer)):
            #     # print(j['planned_end_date'],"j['planned_end_date']")
            #     start_date = quer[j]['planned_start_date']
            #     end_date = quer[j]['planned_end_date']

            #     if end_date != None:
            #         if (start_date.date() <= req_date.date()) and (req_date.date() <= end_date.date() ):

            #             print(end_date.date() >= req_date.date(),end_date.date(),req_date.date())

            #             if end_date.date() >= req_date.date():
            #                 print(quer[j])
                            
            #                 if self.request.GET['shift'] == "Morning":
            #                     if quer[j]['shift'] == "Morning":
            #                         data.append(quer[j])
            #                     # else:
            #                     #     data.append(quer[j])
            #                     #     # break
            #                 elif self.request.GET['shift'] == "Afternoon":
            #                     if quer[j]['shift'] in ["Morning","Afternoon"]:
            #                         data.append(quer[j])
            #                 elif self.request.GET['shift'] == "Night":
            #                     if quer[j]['shift'] in ["Morning","Afternoon","Night"]:
            #                         data.append(quer[j])
                            
            #                 data.append(quer[j])
                            
            #     else:
            #         if req_date.date() >= start_date.date():
            #             data.append(quer[j])
        else:
            quer=query_all.values()
            data=[]
            for i in quer:
                data.append(i)
        unique_data=pd.DataFrame(data)
        new_arr=[]
        print(unique_data)
        if len(unique_data)>0:
            for j in unique_data['ticket_id'].unique():
                unique_data_=unique_data[unique_data['ticket_id']==j]
                if len(self.request.GET) >0:
                    
                    unique_data_data=unique_data_[unique_data_['shift']==self.request.GET['shift']]
                else:
                    unique_data_data=unique_data_
                if len(unique_data_data)>0:
                    dec=unique_data_data.sort_values(by=['id'], ascending=False)
                    for k,j in dec.iterrows():
                            new_arr.append({'id': j['id'],
                            "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
                            "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
                            'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
                            break
                else:
                    dec=unique_data_.sort_values(by=['id'], ascending=False)
                    for k,j in dec.iterrows():
                            new_arr.append({'id': j['id'],
                            "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
                            "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
                            'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
                            break

            final_arr=[]
            res=New_ticket1()
            if len(self.request.GET)>0:
                re=res.generate_tickets3(df1=new_arr,new_params=self.request.GET['shift'],req_date=req_date)
            else:
                create_shift=select_date_time()
                createshift=create_shift.f(hours=datetime.datetime.now().hour)
                print(createshift,"createshift")
                re=res.generate_tickets3(df1=new_arr,new_params=createshift,req_date=datetime.datetime.now())
            for k,j in re.iterrows():
                final_arr.append({'id': j['id'],
                        "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
                        "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
                        'shift': j['shift'], "floatingImplementation": j["floatingImplementation"]})
            return Response(final_arr)
        else:
            return Response([])


class Activity_db(APIView):

    def post(self, request):

        # date_hour=
        # json_query=JSON_query(self.request.data)
        json_query = JSON_convert()
        json_query = json_query.JSON_query(data=self.request.data)

        if ActivityDB.objects.filter(ticket_id=json_query['ticket_id']).exists():
            query1 = ActivityDB.objects.filter(
                ticket_id=json_query['ticket_id']).values()
            import dateutil.parser
            convert_date=dateutil.parser.parse("2022-12-27T04:43")
            # json_query['planned_start_date'] = datetime.datetime.now()
            json_query['planned_start_date'] = convert_date
            if len(query1) > 1:
                # print()

                ActivityDB.objects.filter(
                    **query1[len(query1)-1]).update(planned_end_date=json_query['planned_start_date'])
            else:
                print(query1[0])
                # self.request.data['planned_start_date']=da
                ActivityDB.objects.filter(
                    **query1[0]).update(planned_end_date=json_query['planned_start_date'])
            SHIFT = select_date_time()
            shift = SHIFT.f(hours=json_query['planned_start_date'].time().hour)
            json_query['shift'] = shift

        # try:
        #     convert_date=datetime.datetime.strptime(self.request.data['planned_start_date'],'%Y-%m-%dT%H:%M:%SZ')
        # except:
        #     convert_date=datetime.datetime.strptime(self.request.data['planned_start_date'],'%Y-%m-%dT%H:%M')
        convert_date = json_query['planned_start_date']
        if self.request.data['pre_check_status'] == 'Resolved':
            # datetime.datetime.now()
            json_query['planned_end_date'] = datetime.datetime.now()
            SHIFT = select_date_time()
            shift = SHIFT.f(hours=convert_date.time().hour)
            json_query['shift'] = shift
        serializer = Activity_table(data=json_query)
        if serializer.is_valid():
            serializer.save()
            # req_data=Get_all_activity.as_view()(request._request)
            return Response("Activate DB created")
        else:
            return Response(serializer.errors)

    # def get()


# class Get_all_activity(APIView):

#     def get(self, request):
#         arr_query = []
#         if len(self.request.GET) > 0:
#             date = self.request.GET['created_date']
#             query_all = ActivityDB.objects.all()
#             convert_date = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M')
#             import pytz
#             # query_date=ActivityDB.objects.raw('select * from ActivityDB where planned_start_date > '+str(convert_date)+' and planned_end_date < '+str(convert_date)+'').value()
#             # query_date=ActivityDB.objects.filter(planned_start_date__date__gte = convert_date.date() , planned_end_date__date__lt=convert_date.date() )
#             # print(query_date,"query_date")
#             for j in query_all.values():
#                 # print(j['planned_end_date'],"j['planned_end_date']")
#                 start_date = j['planned_start_date']
#                 end_date = j['planned_end_date']
#                 if j['planned_end_date'] != None:
#                     # #print(i['start_time'],type(i['start_time']),"................................")

#                     if (start_date.date() <= convert_date.date()) and (convert_date.date() <= end_date.date()):

#                         arr_query.append({'id': j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"],
#                                           "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
#                                           "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
#                                           "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], 'shift': j['shift'], "floatingCmpDate": j['floatingCmpDate']})
#                         # break
#                 else:
                    
#                     # print("else =>", start_date, convert_date, "activ",
#                     #       convert_date.date() >= start_date.date())
#                     if convert_date.date() >= start_date.date():
#                         # elif f(convert_date.time().hour) == 'Afternoon':
#                         print("afternoon 2")
#                     #     query=ActivityDB.objects.filter(**j).values()
#                         arr_query.append({'id': j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"], "subject": j["subject"],
#                                           "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"],
#                                           "resource": j["resource"], 'shift': j['shift'], "floatingCmpDate": j['floatingCmpDate']})

#                         # arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
#                         # ['end_time']})
#                         # print(i)
#                         # break
#                         # else:
#                         #     # print(i)
#                         #     print("night")
#                         #     query=ActivityDB.objects.filter(**j).values()
#                         #     arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"],
#                         #     "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"]
#                         #     ,"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],"comments":j["comments"]
#                         #     ,"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],'shift':j['shift']})
#                         # arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
#                         # ['end_time']})

#                         # break
#                 # else:
#                 #     # print(ActivityDB.objects.filter(**j))
#                 #     print("else part")
#                 #     if convert_date.date()>=start_date.date():
#                 #         arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"]
#                 #         ,"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"]
#                 #         ,"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"]
#                 #         ,"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],'shift':j['shift']})

#                 #     arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
#                 #     ['end_time']})

#         else:
#             query_all = ActivityDB.objects.all().values()
#             serializer = Activity_table(instance=query_all, many=True)
#             for j in query_all:
#                 arr_query.append({'id': j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
#                                   "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], 'shift': j['shift'], "floatingCmpDate": j['floatingCmpDate']})

#         # if len(arr_query) == 0 :
#         #     query_all=ActivityDB.objects.all().values()
#         #     serializer=Activity_table(instance=query_all,many=True)
#         #     for j in query_all:
#         #         arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"]
#         #             ,"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"]
#         #             ,"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"]
#         #             ,"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],'shift':j['shift']})

#         df = pd.DataFrame(arr_query)
#         print(len(df), "............................................")
#         dic = {}
#         new_arr = []
#         # new_df=df[['ticket_id','planned_type']].drop_duplicates()
#         # print(new_df,"NEW DF")
#         if len(df) > 0:
#             for v in df['ticket_id'].unique():
#                 print(v)
#                 df_new=df[(df['ticket_id'] == v)]
#                 # df_new=df_new[(df_new['planned_end_date'] != "NaT")]
#                 datetime_sortage=New_ticket1()
#                 for k,v in df_new.iterrows():
#                     print(v['planned_end_date'])
#                 # df_new1=datetime_sortage.new_tickets_SM_INFRA(df=df_new,new_params=self.request.GET['shift'],convert_date=convert_date.date())
#                 print(df_new)
#                 # df_new=datetime_sortage.new_tickets_SM_INFRA(df=df_new,new_params=shift,convert_date=datetime.datetime.now().date())

                


















#                 # # for b in df['planned_type'].unique():
#                 # # print(b,v)(df['planned_type']==v['planned_type']) ['ticket_id']
#                 # if len(self.request.GET) > 0:
                   
#                 #     # df=df_new
#                 #     # if len(json_data) == 0:

#                 #     json_data = df_new[(df_new['ticket_id'] == v) & (
#                 #         df_new['shift'] == self.request.GET['shift'])]
#                 #     # print(json_data,"JSON")
#                 # else:
#                 #     # sf=select_date_time()
#                 #     # shift=sf.f(hours=datetime.datetime.now().hour)
#                 #     # 
#                 #     json_data = df_new[(df_new['ticket_id'] == v)]

#                 # # print(json_data,"lengthhh")
#                 # if len(json_data) > 0:
#                 #     # pass
#                 #     df1 = json_data.sort_values(by=['id'], ascending=False)
#                 #     for i, j in df1.iterrows():
#                 #         # print()
#                 #         new_arr.append({"ID": j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
#                 #                         "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], "shift": j["shift"], "floatingCmpDate": j['floatingCmpDate']})
#                 #         # break
#                 #     # print(new_arr)
#                 # else:

#                 #     json_data = df_new[(df_new['ticket_id'] == v)]
#                 #     # break
#                 #     df1 = json_data.sort_values(by=['id'], ascending=False)
#                 #     for i, j in df1.iterrows():
#                 #         # print()
#                 #         new_arr.append({"ID": j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
#                 #                         "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], "shift": j["shift"], "floatingCmpDate": j['floatingCmpDate']})
#                 #         # break
#                 # datetime_sortage=New_ticket1()
#                 # df_new=datetime_sortage.new_tickets_SM_INFRA(df=df_new,new_params=self.request.GET['shift'],convert_date=convert_date.date())
#                 # dic["Test"]=new_arr
#                 #         # break
#                 # new_arr=[]
#             new_arr1 = []
#             # if len(self.request.GET) > 0:
#             #     # generate_tickets3
#             #     new_tic = New_ticket1()
#             #     newtic = new_tic.generate_tickets3(
#             #         df1=new_arr, new_params=self.request.GET['shift'])
#             #     # arr=new_tickets(new_arr,self.request.GET['shift'])
#             #     # arr1=[]
#             #     arr = pd.DataFrame(newtic)
#             #     for k, j in newtic.iterrows():

#             #         new_arr1.append({"ID": j['ID'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
#             #                          "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], "shift": j["shift"], "floatingCmpDate": j['floatingCmpDate']})
#             # else:
#             #     print(new_arr)
#             #     convert_date = datetime.datetime.now()
#             #     # arr=new_tickets(new_arr,f(convert_date.time().hour))
#             #     arr = pd.DataFrame(new_arr)
#             #     print("else....................")
#             #     # arr=arr[arr['pre_check_status']!='Resolved']
#             #     for k, j in arr.iterrows():
#             #         new_arr1.append({"ID": j['ID'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
#             #                          "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], "shift": j["shift"], "floatingCmpDate": j['floatingCmpDate']})
#             return Response("json_data")
#         else:
#             return Response([])
from dateutil.parser import parse
class Get_all_activity(APIView):

    def get(self, request):
        arr_query = []
        query_all = ActivityDB.objects.all()
        if len(self.request.GET) > 0:
            req_date = parse(self.request.GET['created_date'])
            quer=query_all.values()
            data=[]
            for j in range(len(quer)):
                # print(j['planned_end_date'],"j['planned_end_date']")
                start_date = quer[j]['planned_start_date']
                end_date = quer[j]['planned_end_date']
                if end_date != None:
                        # 25 <= 26 and 26<=27 
                        # 25<=27 and 27<=27
                        # 27-12-2022 <= 27-12-2022 and 27-12-2022 <= 29-12-2022
                        #29-12-2022 <= 27-12-2022
                    if (start_date.date() <= req_date.date()) and (req_date.date() <= end_date.date()):
                            # 27>=26
                        
                        if end_date.date() >= req_date.date():
                            if self.request.GET['shift'] == "Morning":
                                if quer[j]['shift'] == "Morning":
                                    data.append(quer[j])
                            elif self.request.GET['shift'] == "Afternoon":
                                if quer[j]['shift'] in ["Morning","Afternoon"]:
                                    data.append(quer[j])
                            elif self.request.GET['shift'] == "Night":
                                if quer[j]['shift'] in ["Morning","Afternoon","Night"]:
                                    data.append(quer[j])
                else:
                    #30 >= 29
                    if req_date.date() >= start_date.date():
                        data.append(quer[j])
        else:
            quer=query_all.values()
            data=[]
            for i in quer:
                data.append(i)
        unique_data=pd.DataFrame(data)
        new_arr=[]
        if len(unique_data)>0:
            for j in unique_data['ticket_id'].unique():
                unique_data_=unique_data[unique_data['ticket_id']==j]
                if len(self.request.GET)>0:
                    unique_data_res=unique_data_[unique_data_['shift']==self.request.GET['shift']]
                else:
                    unique_data_res=unique_data_
                if len(unique_data_res)>0:
                    dec=unique_data_res.sort_values(by=['id'], ascending=False)
                    
                    for k,j in dec.iterrows():
                            new_arr.append({'id': j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"],
                                                    "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
                                                    "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
                                                    "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], 'shift': j['shift'], "floatingCmpDate": j['floatingCmpDate']})
                            break
                else:
                    dec=unique_data_.sort_values(by=['id'], ascending=False)
                    
                    for k,j in dec.iterrows():
                            new_arr.append({'id': j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"],
                                                    "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
                                                    "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
                                                    "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], 'shift': j['shift'], "floatingCmpDate": j['floatingCmpDate']})
                            break
            final_arr=[]
            res=New_ticket1()
            if len(self.request.GET)>0:
                re=res.generate_tickets3(df1=new_arr,new_params=self.request.GET['shift'],req_date=req_date)
            else:
                create_shift=select_date_time()
                createshift=create_shift.f(hours=datetime.datetime.now().hour)
                re=res.generate_tickets3(df1=new_arr,new_params=createshift,req_date=datetime.datetime.now())
            for k,j in re.iterrows():
                final_arr.append({'ID': j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"],
                                        "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"],
                                        "ticket_id": j["ticket_id"], "subject": j["subject"], "pre_check_status": j["pre_check_status"],
                                        "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], 'shift': j['shift'], "floatingCmpDate": j['floatingCmpDate']})
            return Response(final_arr)
        else:
            return Response([])
                


















                # # for b in df['planned_type'].unique():
                # # print(b,v)(df['planned_type']==v['planned_type']) ['ticket_id']
                # if len(self.request.GET) > 0:
                   
                #     # df=df_new
                #     # if len(json_data) == 0:

                #     json_data = df_new[(df_new['ticket_id'] == v) & (
                #         df_new['shift'] == self.request.GET['shift'])]
                #     # print(json_data,"JSON")
                # else:
                #     # sf=select_date_time()
                #     # shift=sf.f(hours=datetime.datetime.now().hour)
                #     # 
                #     json_data = df_new[(df_new['ticket_id'] == v)]

                # # print(json_data,"lengthhh")
                # if len(json_data) > 0:
                #     # pass
                #     df1 = json_data.sort_values(by=['id'], ascending=False)
                #     for i, j in df1.iterrows():
                #         # print()
                #         new_arr.append({"ID": j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
                #                         "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], "shift": j["shift"], "floatingCmpDate": j['floatingCmpDate']})
                #         # break
                #     # print(new_arr)
                # else:

                #     json_data = df_new[(df_new['ticket_id'] == v)]
                #     # break
                #     df1 = json_data.sort_values(by=['id'], ascending=False)
                #     for i, j in df1.iterrows():
                #         # print()
                #         new_arr.append({"ID": j['id'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
                #                         "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], "shift": j["shift"], "floatingCmpDate": j['floatingCmpDate']})
                #         # break
                # datetime_sortage=New_ticket1()
                # df_new=datetime_sortage.new_tickets_SM_INFRA(df=df_new,new_params=self.request.GET['shift'],convert_date=convert_date.date())
                # dic["Test"]=new_arr
                #         # break
                # new_arr=[]
            # new_arr1 = []
            # if len(self.request.GET) > 0:
            #     # generate_tickets3
            #     new_tic = New_ticket1()
            #     newtic = new_tic.generate_tickets3(
            #         df1=new_arr, new_params=self.request.GET['shift'])
            #     # arr=new_tickets(new_arr,self.request.GET['shift'])
            #     # arr1=[]
            #     arr = pd.DataFrame(newtic)
            #     for k, j in newtic.iterrows():

            #         new_arr1.append({"ID": j['ID'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
            #                          "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], "shift": j["shift"], "floatingCmpDate": j['floatingCmpDate']})
            # else:
            #     print(new_arr)
            #     convert_date = datetime.datetime.now()
            #     # arr=new_tickets(new_arr,f(convert_date.time().hour))
            #     arr = pd.DataFrame(new_arr)
            #     print("else....................")
            #     # arr=arr[arr['pre_check_status']!='Resolved']
            #     for k, j in arr.iterrows():
            #         new_arr1.append({"ID": j['ID'], "pre_check_status_text": j['pre_check_status_text'], "region": j['region'], "planned_type": j["planned_type"], "planned_start_date": j['planned_start_date'], "planned_end_date": j["planned_end_date"], "ticket_id": j["ticket_id"],
            #                          "subject": j["subject"], "pre_check_status": j["pre_check_status"], "comments": j["comments"], "cr_id": j["cr_id"], "cr_approval": j["cr_approval"], "resource": j["resource"], "shift": j["shift"], "floatingCmpDate": j['floatingCmpDate']})
        
        # else:
        #     return Response([])


# else:
#             query=tickets_count_table.objects.all().order_by('-id')
#             if len(query)>0:
#                 serializer=tickets_counts_serializer(instance=query,many=True)

#                 return Response(serializer.data[0])
#             else:
#                 return Response("No data found")


# if i['end_time'] != None:
            #     start_time=i['start_time'].replace(tzinfo=None)
            #     end_time=i['end_time'].replace(tzinfo=None)
            #     # #print(type(i['start_time']),start_time,">",convert_date," and ",convert_date,"<",end_time)
            #     # #print(start_time > convert_date and convert_date < end_time)
            #     # date>start_date.replace(tzinfo=None) and date <= end_date.replace(tzinfo=None)
            #     if convert_date>=start_time and convert_date <= end_time:
            #         #print(i['Status'],"STATUS")
            #         arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
            #         ['end_time']})

            #         break
