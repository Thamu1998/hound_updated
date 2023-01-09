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

from apps.shiftpasstool.methods.ticket_history_maintain import ticket_handling
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
        self.request.data['timerange']=datetime.now().time()
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


    def get(self, request):
        arr_query = []
        query_all = tracking_history.objects.all()
        quer=query_all.values()
        df=pd.DataFrame(quer)
        ticket_filter=ticket_handling()
        if len(self.request.GET) > 0:
            
            final_arr=[]
            
            for j in df['Ticket_ID'].unique():
                req_date=datetime.strptime(self.request.GET['created_date'].split("T")[0],"%Y-%m-%d")

                df_filter=df[df['Ticket_ID'] == j]

                ticket_res=ticket_filter.get_current_ticket_status_Follow_up(req_date=req_date,filter_df=df_filter,shift=self.request.GET['shift'].lower())
                
                if ticket_res is None:
                    pass
                else:
                    if ticket_res != "NULL":
                        print(ticket_res)
                        final_arr.append(ticket_res)

        else:
            final_arr=[]

            for j in df['Ticket_ID'].unique():
                

                df_filter=df[df['Ticket_ID'] == j]
                SHIFT=select_date_time()
                shift=SHIFT.f(hours=datetime.now().hour)
                req_date=datetime.strptime(str(datetime.now().date()),"%Y-%m-%d")
                # print(req_date)
                res=ticket_filter.get_current_ticket_status_Follow_up(req_date=req_date,shift=shift.lower(),filter_df=df_filter)
                print(type(res))
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        print(type(res),res,"RESSSS")
                        final_arr.append(res)
            
        return Response({"new_data1": final_arr, "new_data2": final_arr})



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
        self.request.data['timerange']=datetime.now().time()
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

            shift = datetime.now().hour
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
        self.request.data['timerange']=datetime.now().time()
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
        
        self.request.data['timerange']=datetime.now().time()

        query1 = outage_master_tickets.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).first()
        query = outage_master_tickets.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).values()
        print(query, "len(query)")
        history = outage_tracking_history.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).values()
        
        self.request.data['start_time'] = parse(self.request.data['created_date'])
        # self.request.data['start_time']=datetime.strptime('2022-11-15T12:00','%Y-%m-%dT%H:%M')

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
            # self.request.data['end_time']=datetime.strptime('2022-11-15T12:00','%Y-%m-%dT%H:%M')

        if query[0]['Status'].lower().replace(" ", "") == 'resolved' or query[0]['Status'].lower().replace(" ", "") == 'inprogress' or query[0]['Status'].lower().replace(" ", "") == 'waiting' or query[0]['Status'].lower().replace(" ", "") == 'new':
            # request.data['date']=[datetime.date()]

            query_dict_1 = QueryDict('', mutable=True)
            query_dict_1.update(self.request.data)

            # print(query_dict_1)

            serializer = outage_master_tickets_serializer(
                query1, data=query_dict_1, partial=True)
            if serializer.is_valid():
                serializer.save()
                #print(serializer.data,"BEFORE HISTORY ")
                shift = datetime.now().hour
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



from datetime import datetime, time

class outage_get_api(APIView):
    def get(self, request):
        all_results = outage_tracking_history.objects.all()
        all_result_values=all_results.values()
        df=pd.DataFrame(all_result_values)
        ticket=ticket_handling()
        if len(self.request.GET) > 0:
            req_date=datetime.strptime(self.request.GET['created_date'].split("T")[0],"%Y-%m-%d")
            
            final_arr=[]
            for row in df['Ticket_ID'].unique():
                # req_date, shift,filter_df
                filter_dataframe=df[df['Ticket_ID'] == row]
                # filter_dataframe.to_csv('F:\\Hound\\final.csv')
                res=ticket.get_current_ticket_status_outage(req_date=req_date,shift=self.request.GET['shift'].lower(),filter_df=filter_dataframe)
                print()
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        
                        print(type(res),res,"RESSSS")
                        final_arr.append(res)
        else:
            final_arr=[]

            for row in df['Ticket_ID'].unique():
                # req_date, shift,filter_df
                filter_dataframe=df[df['Ticket_ID'] == row]
                # filter_dataframe.to_csv('F:\\Hound\\final.csv')
                SHIFT=select_date_time()
                shift=SHIFT.f(hours=datetime.now().hour)
                req_date=datetime.strptime(str(datetime.now().date()),"%Y-%m-%d")
                print(req_date)
                res=ticket.get_current_ticket_status_outage(req_date=req_date,shift=shift.lower(),filter_df=filter_dataframe)
                print(type(res))
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        
                        print(type(res),res,"RESSSS")
                        final_arr.append(res)
        final_res={}
        final_res['report'] = final_arr
        final_res['timezones'] = final_arr
        return Response(final_res)



class ticket_comment(APIView):

   

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
            latest_date = datetime.now().date()
            hour = datetime.now().hour

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
            self.request.data['date'] = datetime.now()
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
            date = datetime.now()
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
        self.request.data['timerange']=datetime.now().time()
        json_query = JSON_convert()
        json_query = json_query.JSON_query(data=self.request.data)
        # json_query=JSON_query(self.request.data)
        print(json_query, "......"
        )
        if sm_infra_activate.objects.filter(ticket_id=json_query['ticket_id']).exists():
            query1 = sm_infra_activate.objects.filter(
                ticket_id=json_query['ticket_id']).values()
            if len(query1) > 1:

                sm_infra_activate.objects.filter(
                    **query1[len(query1)-1]).update(planned_end_date=self.request.data['planned_start_date'])
            else:
                print(query1[0])
                sm_infra_activate.objects.filter(
                    **query1[0]).update(planned_end_date=self.request.data['planned_start_date'])
                
        if self.request.data['pre_check_status'] == 'Resolved':
            # datetime.now()
            json_query['planned_end_date'] = self.request.data['planned_start_date']

            
        print(json_query)
        serializer = sm_infra_activate_serializer(data=json_query)
        if serializer.is_valid():
            serializer.save()

            # req_data=Get_all_activity.as_view()(request.data)
            # print(req_data)
            return Response("sm_infra_createed")
        else:
            return Response(serializer.errors)


class Get_sm_infra_activate(APIView):

    def get(self,request):
        arr_query = []
        query_all = sm_infra_activate.objects.all()
        quer=query_all.values()
        df_filter=pd.DataFrame(quer)
        ticket=ticket_handling()
        if len(self.request.GET) > 0:
            req_date=datetime.strptime(self.request.GET['created_date'].split("T")[0],"%Y-%m-%d")
            final_arr=[]
            import numpy as np
            for v in df_filter['ticket_id'].unique():
                tic_new_df=df_filter[df_filter['ticket_id']==v]
                # tic_new_df.replace({np.nan: None}, inplace = True)
                res=ticket.get_current_ticket_status_SM_INFRA(req_date=req_date,shift=self.request.GET['shift'].lower(),filter_df=tic_new_df)
                print()
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        
                        print(type(res),res,"RESSSS")
                        final_arr.append(res)
                
            
        else:
            final_arr=[]

            for row in df_filter['ticket_id'].unique():
                # req_date, shift,filter_df
                filter_dataframe=df_filter[df_filter['ticket_id'] == row]
                # filter_dataframe.to_csv('F:\\Hound\\final.csv')
                SHIFT=select_date_time()
                shift=SHIFT.f(hours=datetime.now().hour)
                req_date=datetime.strptime(str(datetime.now().date()),"%Y-%m-%d")
                print(req_date)
                res=ticket.get_current_ticket_status_SM_INFRA(req_date=req_date,shift=shift.lower(),filter_df=filter_dataframe)
                print(type(res))
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        
                        print(type(res),res,"RESSSS")
                        final_arr.append(res)
        return Response(final_arr)


class Activity_db(APIView):

    def post(self, request):
        self.request.data['timerange']=datetime.now().time()
        # date_hour=
        # json_query=JSON_query(self.request.data)
        json_query = JSON_convert()
        json_query = json_query.JSON_query(data=self.request.data)

        if ActivityDB.objects.filter(ticket_id=json_query['ticket_id']).exists():
            query1 = ActivityDB.objects.filter(
                ticket_id=json_query['ticket_id']).values()
            # import dateutil.parser
            # convert_date=dateutil.parser.parse(json_query['planned_start_date'])
            # json_query['planned_start_date'] = datetime.now()
            # json_query['planned_start_date'] = convert_date
            if len(query1) > 1:
                # print()

                ActivityDB.objects.filter(
                    **query1[len(query1)-1]).update(planned_end_date=json_query['planned_start_date'])
            else:
                print(query1[0])
                # self.request.data['planned_start_date']=da
                ActivityDB.objects.filter(
                    **query1[0]).update(planned_end_date=json_query['planned_start_date'])
            # SHIFT = select_date_time()
            # shift = SHIFT.f(hours=json_query['planned_start_date'].time().hour)
            # json_query['shift'] = shift

        # try:
        #     convert_date=datetime.strptime(self.request.data['planned_start_date'],'%Y-%m-%dT%H:%M:%SZ')
        # except:
        #     convert_date=datetime.strptime(self.request.data['planned_start_date'],'%Y-%m-%dT%H:%M')
        convert_date = json_query['planned_start_date']
        if self.request.data['pre_check_status'] == 'Resolved':
            # datetime.now()
            json_query['planned_end_date'] = json_query['planned_start_date']
            # SHIFT = select_date_time()
            # shift = SHIFT.f(hours=convert_date.time().hour)
            # json_query['shift'] = shift
        serializer = Activity_table(data=json_query)
        if serializer.is_valid():
            serializer.save()
            # req_data=Get_all_activity.as_view()(request._request)
            return Response("Activate DB created")
        else:
            return Response(serializer.errors)


from dateutil.parser import parse
class Get_all_activity(APIView):

    def get(self, request):
        arr_query = []
        query_all = ActivityDB.objects.all()
        quer=query_all.values()
        df_filter=pd.DataFrame(quer)
        ticket=ticket_handling()
        if len(self.request.GET) > 0:
            req_date=datetime.strptime(self.request.GET['created_date'].split("T")[0],"%Y-%m-%d")
         
            final_arr=[]
            import numpy as np
            for v in df_filter['ticket_id'].unique():
                tic_new_df=df_filter[df_filter['ticket_id']==v]
                # tic_new_df.replace({np.nan: None}, inplace = True)
                res=ticket.get_current_ticket_status_WeeekendActivity(req_date=req_date,shift=self.request.GET['shift'].lower(),filter_df=tic_new_df)
                # print()
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        print(type(res),res,"RESSSS")
                        final_arr.append(res)
                
            
        else:
            final_arr=[]

            for row in df_filter['ticket_id'].unique():
                # req_date, shift,filter_df
                filter_dataframe=df_filter[df_filter['ticket_id'] == row]
                # filter_dataframe.to_csv('F:\\Hound\\final.csv')
                SHIFT=select_date_time()
                shift=SHIFT.f(hours=datetime.now().hour)
                req_date=datetime.strptime(str(datetime.now().date()),"%Y-%m-%d")
                print(req_date)
                res=ticket.get_current_ticket_status_WeeekendActivity(req_date=req_date,shift=shift.lower(),filter_df=filter_dataframe)
                print(type(res))
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        
                        print(type(res),res,"RESSSS")
                        final_arr.append(res)
        return Response(final_arr)


        