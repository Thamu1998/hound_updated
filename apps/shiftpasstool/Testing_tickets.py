EG_1 = [
    {
        "ticket_id": "1101",
        "status":"morning",
        "status": "inprogress",
        "start_date": "27-12-2022",
        "end_date": "29-12-2022",
        "timerange":"11:58"
    },
    {
        "ticket_id": "1101",
        "status": "waiting",
        "start_date": "29-12-2022",
        "end_date": "29-12-2022",
        "shift":"afternoon",
        "timerange":"14:58"
    },
    {
        "ticket_id": "1101",
        "status": "resolved",
        "start_date": "29-12-2022",
        "end_date": "29-12-2022",
        "shift":"night",
        "timerange":"00:58"
    }
    
]

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



eg_2=[{    
        "ticket_id": "1101",
        "status": "waiting",
        "start_date": "29-12-2022",
        "end_date": "29-12-2022",
        "shift":"morning"
    },
    {
        "ticket_id": "1101",
        "status": "resolved",
        "start_date": "29-12-2022",
        "end_date": "29-12-2022",
        "shift":"afternoon"
    }
    
]
'''
    req_date - 29-12-2022
    shift - afternoon   
'''
def get_shift_time_range(shift_in_words):
    if shift_in_words == 'morning':
        return (6,14)
    elif shift_in_words == 'afternoon':
        return (14,23)
    elif shift_in_words == 'night':
        return (23,6)
if end_date !=None:
    # timerangee=get_shift_time_range(all_results[row]['timerange'])
    req_timerange=get_shift_time_range(self.request.GET['shift'])
    # with end date


    if start_date <= req_date <= end_date:
           # 11 >= 6     and 11 < 14:
        if all_results[row]['timerange'] >= req_timerange[0] and all_results[row]['timerange'] < req_timerange[1]:

            # 14 >= 23  and 14 < 23 
        if all_results[row]['timerange'] >= req_timerange[0] and all_results[row]['timerange'] < req_timerange[1]:

            # 
        if all_results[row]['timerange'] >= req_timerange[0] and all_results[row]['timerange'] < req_timerange[1]:


        # request date is inbetween startdate and enddate
        

else:
    # without end date
    if req_date >= start_date:
        return status

ticket_id=1 startdate= 07-01- 30
ticket_id=2
ticket_id=1 startdate= 07-01- 33
ticket_id=1 startdate= 07-01- 35
ticket_id=2


def get(self, request):
        # arr_query = []
        all_results = outage_tracking_history.objects.all()
        if len(self.request.GET) > 0:
            req_date = parse(self.request.GET['created_date'])
            all_result_values=all_results.values()
            data=[]
            if_condition=False
            if_condition_night=False
            for row in range(len(all_result_values)):
                # print(j['planned_end_date'],"j['planned_end_date']")
                start_date = all_result_values[row]['start_time']
                end_date = all_result_values[row]['end_time']
                # org_end_date=quer[j]['date']
                # print(start_date,end_date)
                def get_shift_time_range(shift_in_words):
                    if shift_in_words == 'morning':
                        start_time=time(6,0)
                        end_time=time(14,0)
                        return (start_time,end_time)
                    elif shift_in_words == 'afternoon':
                        start_time=time(14,0)
                        end_time=time(23,0)
                        return (start_time,end_time)
                    elif shift_in_words == 'night':
                        start_time=time(23,0)
                        end_time=time(6,0)
                        return (start_time,end_time)
                    
                def get_shift_time_integer(shift_in_words):
                    if shift_in_words == 'morning':
                        # start_time=time(,0)
                        # end_time=time(,0)
                        return (6,14)
                    elif shift_in_words == 'afternoon':
                        # start_time=time(14,0)
                        # end_time=time(23,0)
                        return (14,23)
                    elif shift_in_words == 'night':
                        # start_time=time(23,0)
                        # end_time=time(6,0)
                        return (23,6)

                if end_date != None:
                    print("1","end_date available")
                    # row_shift_time=get_shift_time_range(all_result_values[row]['shift'].lower())

                    
                    print("1.1")
                    print(start_date.date() , req_date.date() , end_date.date() ,all_result_values[row]['Status'] )
                    #3 <= 5 <= 5
                    if start_date.date() <= req_date.date() <= end_date.date():

                        req_shift_time=get_shift_time_range(self.request.GET['shift'].lower())
                        request_time_integer=get_shift_time_integer(self.request.GET['shift'].lower())
                        request_time=time(all_result_values[row]['timerange'].hour,0)
                        
                        

                        print("1.1.1",all_result_values[row]['timerange'].hour, request_time_integer[0],"--------",all_result_values[row]['timerange'].hour,request_time_integer[1] )
                        
                        

                                
                else:
                    print("2", all_result_values[row]['Ticket_ID'])
                    if req_date.date() >= start_date.date():
                        data.append(all_result_values[row])

        else:
            all_result_values=all_results.values()
            data=[]
            for values in all_result_values:
                data.append(values)
        print(data,"INITIAL DATE AND SHIFT FILTERED")
        
        
        final_result=[]

        res=New_ticket1()
        

        all_filtered_dataframes=pd.DataFrame(data)
        # print(re,"LENNNNNNNN")
        if len(all_filtered_dataframes)>0:
            '''start => 2022-12-22, afternoon enddate => 2023-01-04 inprogress

                    ticket 3
                    start => 2023-01-04, Night enddate => 2023-01-06 waiting'''
            # req_shift_time=get_shift_time_range(self.request.GET['shift'].lower())

            for filtered_dataframe in all_filtered_dataframes['Ticket_ID'].unique():

                unique_data_frame=all_filtered_dataframes[all_filtered_dataframes['Ticket_ID']==filtered_dataframe]

                

                # unique_data_frame['shift']=unique_data_frame['shift'].apply(lambda x:x.lower())
                # print(unique_data_frame['shift'])
                # if len(self.request.GET) >0:
                    # new_unique_data=unique_data_

                    # new_unique_data=unique_data_frame[unique_data_frame['shift'] == self.request.GET['shift'].lower()]
                #     print(new_unique_data,".............new_unique_data")
                # else:
                #     new_unique_data=unique_data_frame
                new_unique_data=unique_data_frame
                if len(new_unique_data)>0:

                    dec=new_unique_data.sort_values(by=['id'], ascending=False)
                    # print(dec,"DEC")
                    # final_result.append(dec)
                    for k,i in dec.iterrows():
                        final_result.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_time": i
                                        ['end_time']})
                        break
                else:
                    dec=unique_data_frame.sort_values(by=['id'], ascending=False)
                    for k,i in dec.iterrows():
                        final_result.append({'ID': i['id'], "Ticket_ID": i['Ticket_ID'], "Subject": i['Subject'], "customer_impact": i['customer_impact'], "Action_Required": i['Action_Required'], "Status": i['Status'], "created_date": i['created_date'], "date": i['date'], "shift": i['shift'], "start_date": i['start_time'], "end_time": i
                                        ['end_time']})
                        break
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