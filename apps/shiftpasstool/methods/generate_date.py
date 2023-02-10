import datetime
from django.http import QueryDict
import pandas as pd

from apps.shiftpasstool.serializers import outage_history_tickets_serializer, tracking_serializer

class New_ticket1(object):
    def __init__(self,*args,**kwargs):
        super(New_ticket1,self).__init__()
    
    def generate_tickets1(self,*args,**kwargs):
        df1=kwargs['df1']
        new_params=kwargs['new_params']
        # print(len(df1))
        df1=pd.DataFrame(df1)
    # df1=df1[df1['shift']==new_params]
    # #print(df1.end_date.dt.strftime("%Y-%m-%dT%H:%M:%SZ"))
        df1['new_end_date'] = pd.to_datetime(df1['end_date'], infer_datetime_format=True)
        # #print(df1['new_end_date'].hours 
        SHIFT=select_date_time()
        equal_shift=SHIFT.f(hours=df1.new_end_date.dt.hour.values[0])
        # equal_shift=f(df1.new_end_date.dt.hour.values[0])
        print(new_params,equal_shift,"new_params == equal_shift SPCCCCCCCC")
        if new_params == equal_shift:
            df1=df1[df1['Status'].isin(['Resolved','Waiting','InProgress','New'])]
        else:
            df1=df1[df1['Status'].isin(['Waiting','Inprogress','New'])]
        # print(len(df1))
        return df1
    
    def generate_tickets2(self,*args,**kwargs):
        df1=kwargs['df1']
        new_params=kwargs['new_params']
        # df1=pd.DataFrame(df1)
        # df1['end_date'] = df1['end_date'].apply(lambda x: x.strftime('%Y-%m-%dT%H:%S')if not pd.isnull(x) else "0")
        # print(df1['end_date'].values[0] == 'No date',df1['end_date'].values[0] != "0","ACTIVATE")
        # df2=df1['end_date'].to_list()
        import dateutil.parser
        arr=[]
        print(df1,'..................................',len(df1))
        for new_list in df1:
            
                    
            try:
                # SHIFT=select_date_time()
                # equal_shift=SHIFT.f(hours=new_list['end_time'].time().hour)
                # print(equal_shift , new_params,new_list['shift'])
                # print(new_list['end_time'] == kwargs['req_date'].date() and equal_shift == new_params)
                print(new_list['Status'])
                if new_list['end_time'] == kwargs['req_date'].date():
                    print(new_list['shift'].lower() , new_params.lower())
                    if new_list['shift'].lower() == new_params.lower():
                        # if :
                            arr.append(new_list)
                    # elif new_list['shift'] != new_params.lower():
                    #     # arr=[]
                    else:
                        if new_list['Status'] in ['Waiting','Inprogress','New']:
                            arr.append(new_list)
                else:
                    if new_list['Status'] in ['Waiting','Inprogress','New']:
                        arr.append(new_list)
            except:
                arr.append(new_list)
            # except:
            #     new_list['end_date']='0'

        #     print(new_list['end_date'])
        # print(df2)
        # arr=pd.DataFrame()
        # for i in range(len(df1)):
        #     print(df1['end_date'][i])
        #     if df1['end_date'][i] != "0":
            
        #         df1['new_end_date'] = pd.to_datetime(df1['end_date'][i], infer_datetime_format=True)
        #         # df1=df1[df1['Status']=='Resolved']
        #         SHIFT=select_date_time()
        #         equal_shift=SHIFT.f(hours=df1.new_end_date.dt.hour.values[0])
        #         # equal_shift=f(df1.new_end_date.dt.hour.values[0])
        #         print(equal_shift,new_params,"OTSAGE")
        #         if new_params == equal_shift:
        #             import dateutil.parser
        #             df1['end_date'][i]=dateutil.parser.parse(df1['end_date'][i])
        #             print(df1['end_date'][i].date() == kwargs['req_date'].date(),"INSIDE ")
                    
        #             if df1['end_date'][i].date() == kwargs['req_date'].date():
        #                 if df1['Status'][i] in ['Resolved','Waiting','InProgress','New']:
        #                     # df1=df1[df1['Status'].isin(['Resolved','Waiting','InProgress','New'])]
        #                     arr.append(df1.iloc[i])
        #             else:
        #                 if df1['Status'][i] in ['Waiting','InProgress','New']:
        #                     # df1=df1[df1['Status'].isin(['Resolved','Waiting','InProgress','New'])]
        #                     arr.append(df1.iloc[i])
        #                 # df1=df1[df1['Status'].isin()]
        #                 # arr.append(df1)
        #     else:
        #         if df1['Status'][i] in ['Waiting','InProgress','New']:
        #                     # df1=df1[df1['Status'].isin(['Resolved','Waiting','InProgress','New'])]
        #                     arr.append(df1.iloc[i])
        #         # df1=df1[df1['Status'].isin(['Waiting','Inprogress','New'])]
        #         # arr.append(df1)
        print(len(arr))
        return arr

    def generate_tickets3(self,*args,**kwargs):
        df1=kwargs['df1']
        new_params=kwargs['new_params']
        df1=pd.DataFrame(df1)

        df1['new_end_date'] = pd.to_datetime(df1['planned_end_date'], infer_datetime_format=True,utc=True)
        print(df1['new_end_date'] ,"df1['new_end_date'] ")
        SHIFT=select_date_time()
        shift=SHIFT.f(hours=df1.new_end_date.dt.hour.values[0])
        equal_shift=shift
        print(equal_shift,'1OTSAGE')
        print(new_params, equal_shift,df1.new_end_date.dt.hour.values[0], "OTSAGE")
        # print(df1['planned_end_date'][0].date() , datetime.datetime.now().date())
        if new_params == equal_shift:
            print(df1['planned_end_date'][0].date() == datetime.datetime.now().date())
            if df1['planned_end_date'][0].date() == kwargs['req_date'].date():
                df1=df1[df1['pre_check_status'].isin(['Resolved','Waiting','Inprogress','New'])]
            else:
                df1=df1[df1['pre_check_status'].isin(['Waiting','Inprogress','New'])]
        else:
            df1=df1[df1['pre_check_status'].isin(['Waiting','Inprogress','New'])]
        return df1

    def new_tickets_SM_INFRA(self,*args,**kwargs):
    
    
        df1 = kwargs['df'].sort_values(by=['id'], ascending=False)
        df1['planned_end_date'] = df1['planned_end_date'].apply(lambda x: x.strftime('%Y-%m-%dT%H:%S')if not pd.isnull(x) else "0")
        print(df1['planned_end_date'].values[0] == 'No date',df1['planned_end_date'].values[0] != "0","ACTIVATE")
        if df1['planned_end_date'].values[0] != "0":
            df1['new_end_date'] = pd.to_datetime(df1['planned_end_date'], infer_datetime_format=True)
            SHIFT=select_date_time()
            shift=SHIFT.f(hours=df1.new_end_date.dt.hour.values[0])
            import dateutil.parser
            df_date=dateutil.parser.parse(str(df1['planned_end_date'].values[0]))

            print(kwargs['new_params'] , df1['shift'].values[0] , df_date.date()  , kwargs['convert_date'])

            print(kwargs['new_params'] == shift and df_date.date() == kwargs['convert_date'])
            if kwargs['new_params'] == shift and df_date.date() == kwargs['convert_date']:
                df1=df1[df1['pre_check_status'].isin(['Resolved','Waiting','Inprogress','New'])]
            else:
                df1=df1[df1['pre_check_status'].isin(['Waiting','Inprogress','New'])]
            #     df1=df1[df1['pre_check_status'].isin(['Waiting','Inprogress','New'])]

        else:

            df1=df1[df1['pre_check_status'].isin(['Waiting','Inprogress','New'])]
        # else:
        #     for k,v in df1.iterrows():
        #         # print(v['planned_end_date'],"...........................................")
        #         # print(v)
        #         if v['planned_end_date'] == "0":
        #             print(datetime.datetime.now(v['planned_start_date'].tzinfo))
        #             if v['planned_start_date'] < datetime.datetime.now(v['planned_start_date'].tzinfo):
        #                 print(v,"Greater then datetime.now()")


            # df1=df1[(df1['planned_end_date']!=0) & (df1['pre_check_status'] 
            # )]




        return df1


class select_date_time(object):
    
    def __init__(self,*args,**kwargs):
        super(select_date_time,self).__init__()

    def f(self,*args,**kwargs):
        x=kwargs['hours']
        if (x >= 6) and (x < 14):
            return 'Morning'
        elif (x >= 14) and (x < 23):
            return'Afternoon'
        elif (x >= 23 and 6 < x) or ((x >= 0) and (x<=6)):
            return'Night'
        
    def f1(self,*args,**kwargs):
        x=kwargs['hours']
        convert_date=datetime.datetime.strptime(x,'%Y-%m-%dT%H:%M')
        get_date=datetime.datetime.strftime(convert_date,'%Y-%m-%d')
        x=datetime.datetime.strftime(convert_date,'%H')
        x=int(x)
        # #print(type(x),"///////////.............")``
        if (x >= 6) and (x < 15):
            return {'shift':"06:00AM - 3:00PM"}
        elif (x >= 14) and (x <= 23):
            return {'shift':"02:00PM -11:00PM"} 
        elif (x > 22) and (x < 7) or (x >= 0) and (x<=7):
            return {'shift':"10:00PM - 07:00PM"}



class UTC(object):
    def __init__(self,*args,**kwargs):
        super(UTC,self).__init__()

    def utc_format(*args,**kwargs):
        date=kwargs['date']
        from datetime import datetime   
        import pytz

        local = pytz.timezone("America/Los_Angeles")
        # naive = datetime.strptime("2001-2-3 10:11:12", "%Y-%m-%dT%H:%M")
        local_dt = local.localize(date, is_dst=None)
        utc_dt = local_dt.astimezone(pytz.utc)
        get_date=utc_dt.strftime("%Y-%m-%d")

        get_hour=utc_dt.strftime("%H")
        return get_date,get_hour
    

class JSON_convert(object):
    def __init__(self,*args,**kwargs):
        super(JSON_convert,self).__init__()

    def JSON_query(self,*args,**kwargs):
        # data['date']=datetime.datetime.now()
        data=kwargs['data']
        query_dict_1 = QueryDict('', mutable=True)
        query_dict_1.update(data)
        return query_dict_1


class datetime_converter(object):
    def __init__(self,*args,**kwargs):
        super(datetime_converter,self).__init__()

    def DateTimeConvert(self,*args,**kwargs):
        date=kwargs['date']
        try:
            convert_date=datetime.datetime.strptime(date,'%Y-%m-%dT%H:%M')
            get_date=datetime.datetime.strftime(convert_date,'%Y-%m-%d')
            get_hour=datetime.datetime.strftime(convert_date,'%H')
            
        except:
            print(type(date),'date')
            # if type(date) == "<class 'datetime.datetime'>":

            try:
                convert_date=datetime.datetime.strptime(date,'%Y-%m-%dT%H:%M:%S.%fZ')
            except:
                try:
                    convert_date=datetime.datetime.strptime(date,'%Y-%m-%dT%H:%M:%SZ')
                except:
                    import dateutil.parser
                    convert_date=dateutil.parser.parse(date)
            get_date=datetime.datetime.strftime(convert_date,'%Y-%m-%d')
            get_hour=datetime.datetime.strftime(convert_date,'%H')
        
        # x=int(x)
        return get_date,get_hour,convert_date


class Histories(object):
    def __init__(self,*args,**kwargs):
        super(Histories,self).__init__()

    def make_history(self,*args,**kwargs):
        data=kwargs['data']
    # serializer=master_tracking_serializer(instance=data,many=True)
    # for i in serializer.data:
    #     query_dict_0={"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"Action_Taken":i['Action_Taken'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":str(datetime.datetime.now().date()),"shift":i['shift']}
        query_dict_1 = QueryDict('', mutable=True)
        query_dict_1.update(data)
        create_history=tracking_serializer(data=query_dict_1)
        if create_history.is_valid():
            create_history.save()
        else:
            print(create_history.errors)

    def make_outage_history(self,*args,**kwargs):
        #print(data)
        data=kwargs['data']
        query_dict_1 = QueryDict('', mutable=True)
        query_dict_1.update(data)
        
        serializer=outage_history_tickets_serializer(data=query_dict_1)
        if serializer.is_valid():
            serializer.save()
            # #print(serializer.data,"history")
            
        else:
            print(serializer.errors,"ERROR")



# @api_view(['GET'])

# @background(schedule=10)
# def trigger_tracking_outage():
#     trigger_tracking()

#     query=outage_tracking_history.objects.all()
#     serializer=outage_history_tickets_serializer(instance=query,many=True)
    
#     from datetime import date
#     # #print(len(serializer.data),serializer.data)
#     for i in serializer.data:
#         #print(i['created_date'])
#         date_=i['created_date'].split('-')
#         d0 = date(int(date_[0]),int(date_[1]),int(date_[2]))  # created date
#         d1 = datetime.datetime.now().date()  # current date
#         delta = d1 - d0
#         #print('The number of days between the given range of dates is :')
#         #print(delta.days)

#         if i['Status'] in ['open','inprogress']:
#             hour=datetime.datetime.now().hour
#             #print(f(hour))
#             shift=select_date_time()
#             get_shift=shift.f(hours=hour)
#             query_dict_0={"Ticket_ID": i['Ticket_ID'],"Subject":i['Subject'],"customer_impact":i['customer_impact'],"Action_Required":i['Action_Required'],"Status":i['Status'],"created_date":i['created_date'],"date":str(datetime.datetime.now().date()),"shift":get_shift.lower()}
#             query_dict_1 = QueryDict('', mutable=True)
#             query_dict_1.update(query_dict_0)
#             #print(query_dict_1)
#             his=Histories()
#             his.make_outage_history(data=query_dict_1)
#             # make_outage_history()
                
#     return Response("history created")


# for i in df1['planned_end_date']:
                
#                 if str(i) != 'NaT':
#                     dat=datetime_converter()
#                     date=dat.DateTimeConvert(date=str(i))
                   
#                     if date[0] == today_date:
#                         print(df1['pre_check_status'],"Insiide loop")

# from django.core.mail import send_mail

# subject = 'Hello'
# message = '<p>This is an <strong>HTML</strong> message.</p>'
# from_email = 'noreply@example.com'
# recipient_list = ['recipient@example.com']
# send_mail(subject, message, from_email, recipient_list, html_message=message)