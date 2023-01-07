from apps.uptime.models import uptime_time_series_data
import datetime
import time
import pandas as pd
from django.utils import timezone
from django.db.models import Q

class downtime_time_series(object):

    def __init__(self, *args, **kwargs):
        super(downtime_time_series, self).__init__()

    def scan(self, **kwargs):

        current_tz = timezone.get_current_timezone()

        startdate = current_tz.localize(kwargs['startdate'])
        
        enddate = current_tz.localize(kwargs['enddate'])
        
        downtime_data = uptime_time_series_data.objects.values().filter(Q(ToTime__range=(startdate, enddate))|Q(FromTime__range=(startdate, enddate)))
        
        if len(downtime_data) == 0:
            raise Exception("No downtime found on the given timeline.")
        
        df_pingDown = pd.DataFrame(downtime_data)

        for time_inst in df_pingDown.groupby('SID')['FromTime']:
            
            if (time_inst[1].min() - startdate).total_seconds() >= 60:
                
                status = df_pingDown[(df_pingDown['SID']==time_inst[0]) & (df_pingDown['FromTime']==time_inst[1].min())].Status.item()
                
                if status == 'up':
                    df_pingDown.loc[(df_pingDown['SID']==time_inst[0]) & (df_pingDown['FromTime']==time_inst[1].min()), 'FromTime'] = startdate
                else:
                    durationIs = time_inst[1].min() - startdate

                    minIs = int((time_inst[1].min() - startdate).total_seconds())//60

                    addUpDict = {'SID':time_inst[0],'FromTime':startdate, 'ToTime':time_inst[1].min(), 'Status':'up', 'Duration':durationIs, 'durationInMin':minIs}

                    df_pingDown = df_pingDown.append(addUpDict, ignore_index = True)
        
        df_pingDown.loc[df_pingDown["ToTime"].isnull(), "ToTime"] = enddate

        df_pingDown['Duration'] = pd.to_datetime(df_pingDown["ToTime"]) - pd.to_datetime(df_pingDown["FromTime"])

        df_pingDown['durationInMin'] = [int(duration.total_seconds()//60) for duration in df_pingDown['Duration']]

        df_pingDown = df_pingDown.groupby('SID').filter(lambda SID: any(SID['Status'] == 'down')).sort_values(['SID','FromTime'], ascending=[1,1])
               
        df_pingDown['per'] = df_pingDown.groupby('SID')['durationInMin'].transform(lambda x: x/x.sum() * 100)
        
        df_groupby = df_pingDown.groupby('SID')

        final_dict = {}

        for SID,DF in df_groupby:

            TempList = []

            per = 0

            min = 0
            
            downCount = DF['Status'].value_counts()['down']

            getminFrom = DF.loc[DF['Status'] == 'down'].min()['FromTime']
            
            totalDown = 0
                
            for index, row in DF.iterrows():

                per = round(row['per'],2)

                if round(row['per'],1) <= 1:
                    per = 2

                if row['Status'] == 'down':
                    totalDown = totalDown+row['durationInMin']

                from_date = int(time.mktime(row['FromTime'].timetuple()))

                ToTime = int(time.mktime(row['ToTime'].timetuple()))
                
                TempList.append({'min': row['durationInMin'],\
                                 'per': per,\
                                 'status': row['Status'],\
                                 'duration': str(row['Duration']).split(".")[0],\
                                 'FromTime':datetime.datetime.strftime(row['FromTime'], "%d-%m-%Y %H:%M"),\
                                 'ToTime':datetime.datetime.strftime(row['ToTime'], "%d-%m-%Y %H:%M"),\
                                 'card_data': {'x': SID,'y':[row['FromTime'], row['ToTime']]}})              
            
            final_dict[SID] = {'downCount':downCount, 'fromTime':getminFrom,'totalDown':totalDown,'details':TempList}

        return final_dict

        return df_pingDown

    