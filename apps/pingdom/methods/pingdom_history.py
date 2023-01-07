from config.common_functions.pull_request import get_data_pingdom
from apps.system_configuration.models import api_details
from apps.pingdom.models import pingdom_status
from apps.spc_cld.models import system, datacenter_decs
import json
import datetime, time

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/pingdom_status.log", __name__)
############### END Initiate logger #############################

class pingdom_check_history(object):

    def __init__(self, *args, **kwargs):
        super(pingdom_check_history, self).__init__()

    def get_history(self, **kwargs):

        pingdom_api_detail = api_details.objects.get(unique_id='PINGDOM_API_3_CHECK_HISTORY') # Get API details
        
        from_date = round(datetime.datetime.strptime(kwargs["start_time"], '%Y-%m-%d.%H:%M').timestamp())

        to_date = round(datetime.datetime.strptime(kwargs["end_time"], '%Y-%m-%d.%H:%M').timestamp())

        response = get_data_pingdom(url=pingdom_api_detail.end_point.format(id=kwargs['check_id'],fromdate=from_date,todate=to_date), auth=pingdom_api_detail.auth.auth) # Get status from Pingdom API

        data = json.loads(response.text)
        
        GetTotalSeconds =  max([datetime.datetime.fromtimestamp(i["timeto"]) for i in data['summary']['states']]) - min([datetime.datetime.fromtimestamp(i["timefrom"]) for i in data['summary']['states']])

        GetTotalSeconds = GetTotalSeconds.total_seconds()

        FinalData = []

        chart_data = {'up':[], 'down':[]}

        for statustime in data['summary']['states']:

            TempData = {'FromTime': '', 'ToTime': '', 'pre': '', 'duration': ''}

            FromTime = datetime.datetime.fromtimestamp(statustime['timefrom'])

            ToTime = datetime.datetime.fromtimestamp(statustime['timeto'])
            
            GetDuration = ToTime - FromTime
            
            GetPercentage = round(GetDuration.total_seconds()*100/GetTotalSeconds, 2)
            
            TempData['FromTime'] = str(FromTime.strftime('%a, %d %b %Y %I:%M:%S %p'))+" UTC"

            TempData['ToTime'] = str(ToTime.strftime('%a, %d %b %Y %I:%M:%S %p'))+" UTC"

            TempData['duration'] = str(GetDuration)

            TempData['pre'] = GetPercentage

            TempData['Status'] = statustime['status']

            if statustime['status'] == "up":
                chart_data['up'].append({'x': kwargs['SID'], 'y': [time.mktime(FromTime.timetuple()) * 1000, time.mktime(ToTime.timetuple()) * 1000]})
            else:
                chart_data['down'].append({'x': kwargs['SID'], 'y': [time.mktime(FromTime.timetuple()) * 1000, time.mktime(ToTime.timetuple()) * 1000]})

            FinalData.append(TempData)

        return {"data":FinalData, 'chart':chart_data}