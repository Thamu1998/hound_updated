from django.http import QueryDict,HttpResponse
from django.shortcuts import render, redirect

from apps.shiftpasstool.models import tickets_notes,tickets_count_table,ActivityDB,sm_infra_activate

from .apps.shiftpasstool.methods.method_serializer import tickets_notes_serializer,tickets_counts_serializer,Activity_table,sm_infra_activate_serializer
from .apps.shiftpasstool.methods.generate_date import JSON_convert, New_ticket1, datetime_converter, select_date_time
from rest_framework.views import APIView
import datetime
from rest_framework.response import Response
import time
import re
from .apps.roster.views import shift_status_info
from django.db.models import Q,Count
import xlwt
import pandas as pd
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

    def post(self,request):
        date=self.request.data['date']

        shift=self.request.data['shift']
        convertFormat=datetime_converter()

        converted_date=convertFormat.DateTimeConvert(date=date)
        # converted_date=DateTimeConvert(date)

        if tickets_notes.objects.filter(date__date=converted_date[0],date__hour=converted_date[1],shift=shift).exists():
            json_query=JSON_convert()
            json=json_query.JSON_query(data=self.request.data)
            json_query=json
            print(json_query)

            update_query=tickets_notes.objects.filter(**self.request.data).first()

            serializer=tickets_notes_serializer(instance=update_query,data=json_query,partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response("tickets notes updates")
            else:
                print(serializer.error_messages)
                print(serializer.errors)
        else:
            json_query=JSON_convert()
            json=json_query.JSON_query(data=self.request.data)
            serializer_query=json

            serializer=tickets_notes_serializer(data=serializer_query)

            if serializer.is_valid():
                serializer.save()
                
            else:
                print(serializer.errors)
                print(serializer.error_messages)
            return Response("Tickets Notes created")


    def get(self,request):
        print("len(self.request.GET)",len(self.request.GET),"........................")
        if len(self.request.GET) >0:
            # shift=self.request.GET['shift']
            date=self.request.GET['created_date']
            convertFormat=datetime_converter()

            get_date,get_hour,get_datetime=convertFormat.DateTimeConvert(date=date)

            query=tickets_notes.objects.filter(date__date=get_date,shift=self.request.GET['shift'].lower()).order_by('-id')
            
            print(query)
            if len(query)>0:
                serializer=tickets_notes_serializer(query,many=True)

                return Response(serializer.data[0])
            else:
                return Response([])

        else:
            latest_date=datetime.datetime.now().date()
            hour=datetime.datetime.now().hour
            
            SHIFT=select_date_time()
            shift=SHIFT.f(hours=hour)
            print(latest_date,hour,shift)
            # query=tickets_notes.objects.filter(date__date=latest_date,shift=SHIFT).order_by('-id')
            query=tickets_notes.objects.filter(date__date=latest_date).order_by('-id')
        if len(query)>0:
            serializer=tickets_notes_serializer(instance=query,many=True)

            return Response(serializer.data[0])
        else:
            return Response([])




class set_Ticket_count(APIView):
    
    def post(self,request):
        # json_data=JSON_query(self.request.data)
        json_query=JSON_convert()
        json_data=json_query.JSON_query(data=self.request.data)
        serializer=tickets_counts_serializer(data=json_data)
        if serializer.is_valid():
            serializer.save()
            return Response("Ticket count created")
        else:
            print(serializer.error_messages)
            print(serializer.errors)

    def put(self,request):
        # json_data=JSON_query(self.request.data)
        date=self.request.data['date']

        shift=self.request.data['shift']
        convertFormat=datetime_converter()

        converted_date=convertFormat.DateTimeConvert(date=date)
        # converted_date=DateTimeConvert(date)
        print(tickets_count_table.objects.filter(date__date=converted_date[0],date__hour=converted_date[1],shift=shift).exists(),"OUTSIDE")
        if tickets_count_table.objects.filter(date__date=converted_date[0],date__hour=converted_date[1],shift=shift).exists():
            
            update_query=tickets_count_table.objects.filter(**self.request.data).first()
            self.request.data['date']=datetime.datetime.now()
            json_query=JSON_convert()
            json_query=json_query.JSON_query(data=self.request.data)

            serializer=tickets_counts_serializer(instance=update_query,data=json_query,partial=True)
            print(serializer.is_valid(),"INSIDE")
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


    def get(self,request):
        # 
        response = shift_status_info.as_view()(request._request)
        print(response.data,"response")
        if len(self.request.GET)>0:

            date=self.request.GET['created_date']
            convertFormat=datetime_converter()

            get_date,get_hour,get_datetime=convertFormat.DateTimeConvert(date=date)
            # get_date,get_hour=DateTimeConvert(date)
        else:
            date=datetime.datetime.now()
            get_date=date.date()
            get_hour=date.hour
# ,date__hour=get_hour
        query=tickets_count_table.objects.filter(date__date=get_date).order_by('-id')
        print(query)
        if len(query)>0:    
            serializer=tickets_counts_serializer(query,many=True)
            return Response(serializer.data[0])
        else:
            return Response("No data")
            # pass
        
class sm_infra_activate_obj(APIView):

    def post(self,request):
        self.request.data['planned_start_date']=datetime.datetime.now()
        json_query=JSON_convert()
        json_query=json_query.JSON_query(data=self.request.data)
        # json_query=JSON_query(self.request.data)
        print(json_query,"......")
        if sm_infra_activate.objects.filter(ticket_id=json_query['ticket_id']).exists():
            query1=sm_infra_activate.objects.filter(ticket_id=json_query['ticket_id']).values()
            if len(query1)>1:
                # print()
                
                sm_infra_activate.objects.filter(**query1[len(query1)-1]).update(planned_end_date=self.request.data['planned_start_date'])
            else:
                print(query1[0])
                sm_infra_activate.objects.filter(**query1[0]).update(planned_end_date=self.request.data['planned_start_date'])
        convert_date=self.request.data['planned_start_date']
        if self.request.data['pre_check_status'] == 'Resolved':
            # datetime.datetime.now()
            json_query['planned_end_date']=datetime.datetime.now()
            
        SHIFT=select_date_time()
        shift=SHIFT.f(hours=convert_date.time().hour)
        json_query['shift']=shift
        serializer=sm_infra_activate_serializer(data=json_query)
        if serializer.is_valid():
            serializer.save()
            
            # req_data=Get_all_activity.as_view()(request.data)
            # print(req_data)
            return Response("sm_infra_createed")
        else:
            return Response(serializer.errors)

class Get_sm_infra_activate(APIView):

    def get(self,request):
        arr_query=[]
        if len(self.request.GET)>0:
            date=self.request.GET['created_date']
            query_all=sm_infra_activate.objects.all()
            convert_date=datetime.datetime.strptime(date,'%Y-%m-%dT%H:%M')

            for j in query_all.values():
                start_date=j['planned_start_date']
                end_date=j['planned_end_date']
                if j['planned_end_date'] != None:
                    SHIFT=select_date_time()
                    shift=SHIFT.f(hours=convert_date.time().hour)
                    if  (start_date.date()<= convert_date.date()) and (convert_date.date() <= end_date.date()):
                        # print(f(convert_date.time().hour))
                        if shift == 'Morning':
                            arr_query.append({'id':j['id'],
                            "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                            "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                            'shift':j['shift'],"floatingImplementation":j["floatingImplementation"]})
                        elif shift == 'Afternoon':
                            arr_query.append({'id':j['id'],
                            "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                            "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                            'shift':j['shift'],"floatingImplementation":j["floatingImplementation"]})

                        elif shift == 'Night':
                            arr_query.append({'id':j['id'],
                            "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                            "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                            'shift':j['shift'],"floatingImplementation":j["floatingImplementation"]})
                            # break
                else:
                    print("else =>",start_date,convert_date)
                    if convert_date.date() >= start_date.date():
                        print("afternoon 2")
                        arr_query.append({'id':j['id'],
                            "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                            "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                            'shift':j['shift'],"floatingImplementation":j["floatingImplementation"]})
    
        else:
            query_all=sm_infra_activate.objects.all().values()
            serializer=Activity_table(instance=query_all,many=True)
            for j in query_all:
                arr_query.append({'id':j['id'],
                            "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                            "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                            'shift':j['shift'],"floatingImplementation":j["floatingImplementation"]})
        #
        df=pd.DataFrame(arr_query)
        new_arr=[]
        if len(df)>0:
            for v in df['ticket_id'].unique():

                if len(self.request.GET)>0:
                    print(df,"if")
                    json_data=df[(df['ticket_id'] == v) & (df['shift'] == self.request.GET['shift'])]
                else:
                    json_data=df[(df['ticket_id'] == v)]
                print("json, with get",json_data)
                if len(json_data)>0:
                    df1=json_data.sort_values(by=['id'], ascending=False)
                    for i,j in df1.iterrows():
                        new_arr.append({'id':j['id'],
                                    "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                                    "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                                    'shift':j['shift'],"floatingImplementation":j["floatingImplementation"]})
                        break
                else:
                    # print(type(.date))
                    # ts = pd.to_datetime(str(df['planned_start_date'].values[0])) 
                    # d = ts.strftime('%Y-%m-%d')
                    # print(convert_date.date() ,d)
                    # if convert_date.date() <= d:
                    #     # print(df['planned_start_date'].date)
                    #     return Response([])
                    # else:
                        
                        json_data=df[(df['ticket_id'] == v)]
                        print("else=>,",json_data)
                        df1=json_data.sort_values(by=['id'], ascending=False)
                        for i,j in df1.iterrows():
                            print()
                            new_arr.append({'id':j['id'],
                                        "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                                        "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                                        'shift':j['shift'],"floatingImplementation":j["floatingImplementation"]})
                            break

            new_arr1=[]
            if len(self.request.GET)>0:
                arr=New_ticket1()
                arr=arr.new_tickets_SM_INFRA(df1=new_arr,new_params=self.request.GET['shift'])
                arr1=[]
                arr=pd.DataFrame(arr)
                for k,j in arr.iterrows():
                
                    new_arr1.append({'id':j['id'],
                                "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                                "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                                'shift':j['shift'],"floatingImplementation":j["floatingImplementation"]})
            else:
                print(new_arr)
                arr=pd.DataFrame(new_arr)
                # arr=arr[arr['pre_check_status']!='Resolved']
                for k,j in arr.iterrows():
                    new_arr1.append({'id':j['id'],
                                "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                                "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                                'shift':j['shift'],"floatingImplementation":j['floatingImplementation']})
            return Response(new_arr1)
        else:
            return Response([])



class Activity_db(APIView):


    def post(self,request):
        
        # date_hour=
        # json_query=JSON_query(self.request.data)
        json_query=JSON_convert()
        json_query=json_query.JSON_query(data=self.request.data)
        json_query['planned_start_date']=datetime.datetime.now()
        if ActivityDB.objects.filter(ticket_id=json_query['ticket_id']).exists():
            query1=ActivityDB.objects.filter(ticket_id=json_query['ticket_id']).values()
            
            if len(query1)>1:
                # print()
                
                ActivityDB.objects.filter(**query1[len(query1)-1]).update(planned_end_date=json_query['planned_start_date'])
            else:
                print(query1[0])
                # self.request.data['planned_start_date']=da
                ActivityDB.objects.filter(**query1[0]).update(planned_end_date=json_query['planned_start_date'])
        # try:
        #     convert_date=datetime.datetime.strptime(self.request.data['planned_start_date'],'%Y-%m-%dT%H:%M:%SZ')
        # except:
        #     convert_date=datetime.datetime.strptime(self.request.data['planned_start_date'],'%Y-%m-%dT%H:%M')
        convert_date=json_query['planned_start_date']
        if self.request.data['pre_check_status'] == 'Resolved':
            # datetime.datetime.now()
            json_query['planned_end_date']=datetime.datetime.now()
        SHIFT=select_date_time()
        shift=SHIFT.f(convert_date.time().hour)
        json_query['shift']=shift
        serializer=Activity_table(data=json_query)
        if serializer.is_valid():
            serializer.save()
            # req_data=Get_all_activity.as_view()(request._request)
            return Response("Activate DB created")
        else:
            return Response(serializer.errors)

    # def get()

class Get_all_activity(APIView):
    
    def get(self,request):
        arr_query=[]
        if len(self.request.GET)>0:
            date=self.request.GET['created_date']
            query_all=ActivityDB.objects.all()
            convert_date=datetime.datetime.strptime(date,'%Y-%m-%dT%H:%M')
            import pytz
            # query_date=ActivityDB.objects.raw('select * from ActivityDB where planned_start_date > '+str(convert_date)+' and planned_end_date < '+str(convert_date)+'').value()
            # query_date=ActivityDB.objects.filter(planned_start_date__date__gte = convert_date.date() , planned_end_date__date__lt=convert_date.date() )
            # print(query_date,"query_date")
            for j in query_all.values():
                # print(j['planned_end_date'],"j['planned_end_date']")
                start_date=j['planned_start_date']
                end_date=j['planned_end_date']
                if j['planned_end_date'] != None:
                    # #print(i['start_time'],type(i['start_time']),"................................")
                    

                    if  (start_date.date()<= convert_date.date()) and (convert_date.date() <= end_date.date()):
                    
                            arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"],
                            "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],
                            "ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],
                            "comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],'shift':j['shift'],"floatingCmpDate":j['floatingCmpDate']})
                            # break
                else:
                    print("else =>",start_date,convert_date,"activ",convert_date.date()>= start_date.date())
                    if convert_date.date()>= start_date.date():
                    # elif f(convert_date.time().hour) == 'Afternoon':
                        print("afternoon 2")
                    #     query=ActivityDB.objects.filter(**j).values()
                        arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"],"planned_start_date":j['planned_start_date']
                        ,"planned_end_date":j["planned_end_date"],"ticket_id":j["ticket_id"],"subject":j["subject"],
                        "pre_check_status":j["pre_check_status"],"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],
                        "resource":j["resource"],'shift':j['shift'],"floatingCmpDate":j['floatingCmpDate']})

                            # arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
                            # ['end_time']})
                            # print(i)
                            # break
                        # else:
                        #     # print(i)
                        #     print("night")
                        #     query=ActivityDB.objects.filter(**j).values()
                        #     arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"],
                        #     "planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"]
                        #     ,"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],"comments":j["comments"]
                        #     ,"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],'shift':j['shift']})
                            # arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
                            # ['end_time']})

                            # break
                # else:
                #     # print(ActivityDB.objects.filter(**j))
                #     print("else part")
                #     if convert_date.date()>=start_date.date():
                #         arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"]
                #         ,"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"]
                #         ,"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"]
                #         ,"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],'shift':j['shift']})

                #     arr_query.append({'ID':i['id'],"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":i['date'],"shift":i['shift'],"start_date":i['start_time'],"end_date":i
                #     ['end_time']})
                    
        else:
            query_all=ActivityDB.objects.all().values()
            serializer=Activity_table(instance=query_all,many=True)
            for j in query_all:
                arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"]
                    ,"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"]
                    ,"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"]
                    ,"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],'shift':j['shift'],"floatingCmpDate":j['floatingCmpDate']})
        
        # if len(arr_query) == 0 :
        #     query_all=ActivityDB.objects.all().values()
        #     serializer=Activity_table(instance=query_all,many=True)
        #     for j in query_all:
        #         arr_query.append({'id':j['id'],"region":j['region'],"planned_type":j["planned_type"]
        #             ,"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"]
        #             ,"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"]
        #             ,"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],'shift':j['shift']})

        df=pd.DataFrame(arr_query)
        print(len(df),"............................................")
        dic={}
        new_arr=[]
        # new_df=df[['ticket_id','planned_type']].drop_duplicates()
        # print(new_df,"NEW DF")
        if len(df)>0:
            for v in df['ticket_id'].unique():
                # for b in df['planned_type'].unique():
                    # print(b,v)(df['planned_type']==v['planned_type']) ['ticket_id']
                if len(self.request.GET)>0:
                    json_data=df[(df['ticket_id'] == v ) & (df['shift'] == self.request.GET['shift'])]
                    # print(json_data,"JSON")
                else:
                    json_data=df[(df['ticket_id'] == v)]

                # print(json_data,"lengthhh")
                if len(json_data) > 0:
                    df1=json_data.sort_values(by=['id'], ascending=False)
                    for i,j in df1.iterrows():
                        # print()
                        new_arr.append({"region":j['region'],"planned_type":j["planned_type"],"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],"shift":j["shift"],"floatingCmpDate":j['floatingCmpDate']})
                        break
                    print(new_arr)
                else:
                    json_data=df[(df['ticket_id'] == v)]
                    df1=json_data.sort_values(by=['id'], ascending=False)
                    for i,j in df1.iterrows():
                        # print()
                        new_arr.append({"region":j['region'],"planned_type":j["planned_type"],"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],"shift":j["shift"],"floatingCmpDate":j['floatingCmpDate']})
                        break
                
                # dic["Test"]=new_arr
                #         # break
                # new_arr=[]
            new_arr1=[]
            if len(self.request.GET)>0:
                # generate_tickets3
                new_tic=New_ticket1()
                newtic=new_tic.generate_tickets3(df1=new_arr,new_params=self.request.GET['shift'])
                # arr=new_tickets(new_arr,self.request.GET['shift'])
                # arr1=[]
                arr=pd.DataFrame(newtic)
                for k,j in newtic.iterrows():
                
                    new_arr1.append({"region":j['region'],"planned_type":j["planned_type"],"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],"shift":j["shift"],"floatingCmpDate":j['floatingCmpDate']})
            else:
                print(new_arr)
                convert_date=datetime.datetime.now()
                # arr=new_tickets(new_arr,f(convert_date.time().hour))
                arr=pd.DataFrame(new_arr)
                print("else....................")
                # arr=arr[arr['pre_check_status']!='Resolved']
                for k,j in arr.iterrows():
                    new_arr1.append({"region":j['region'],"planned_type":j["planned_type"],"planned_start_date":j['planned_start_date'],"planned_end_date":j["planned_end_date"],"ticket_id":j["ticket_id"],"subject":j["subject"],"pre_check_status":j["pre_check_status"],"comments":j["comments"],"cr_id":j["cr_id"],"cr_approval":j["cr_approval"],"resource":j["resource"],"shift":j["shift"],"floatingCmpDate":j['floatingCmpDate']})
            return Response(new_arr1)
        else:
            return Response([])







# else:
#             query=tickets_count_table.objects.all().order_by('-id')
#             if len(query)>0:
#                 serializer=tickets_counts_serializer(instance=query,many=True)

#                 return Response(serializer.data[0])
#             else:
#                 return Response("No data found")

