import datetime
from django.http import QueryDict
import pandas as pd

from apps.shiftpasstool.serializers import outage_history_tickets_serializer, tracking_serializer


class New_ticket1(object):
    def __init__(self, *args, **kwargs):
        super(New_ticket1, self).__init__()

    def generate_tickets1(self, *args, **kwargs):
        df1 = kwargs['df1']
        new_params = kwargs['new_params']
        df1 = pd.DataFrame(df1)
        df1['new_end_date'] = pd.to_datetime(
            df1['end_date'], infer_datetime_format=True)
        SHIFT = select_date_time()
        equal_shift = SHIFT.f(hours=df1.new_end_date.dt.hour.values[0])
        if new_params == equal_shift:
            df1 = df1[df1['Status'].isin(
                ['Resolved', 'Waiting', 'InProgress', 'New'])]
        else:
            df1 = df1[df1['Status'].isin(['Waiting', 'Inprogress', 'New'])]
        return df1

    def generate_tickets2(self, *args, **kwargs):
        df1 = kwargs['df1']
        new_params = kwargs['new_params']
        import dateutil.parser
        arr = []
        for new_list in df1:
            try:
                if new_list['end_time'] == kwargs['req_date'].date():
                    if new_list['shift'].lower() == new_params.lower():
                        arr.append(new_list)
                    else:
                        if new_list['Status'] in ['Waiting', 'Inprogress', 'New']:
                            arr.append(new_list)
                else:
                    if new_list['Status'] in ['Waiting', 'Inprogress', 'New']:
                        arr.append(new_list)
            except:
                arr.append(new_list)

        return arr

    def generate_tickets3(self, *args, **kwargs):
        df1 = kwargs['df1']
        new_params = kwargs['new_params']
        df1 = pd.DataFrame(df1)

        df1['new_end_date'] = pd.to_datetime(
            df1['planned_end_date'], infer_datetime_format=True, utc=True)
        SHIFT = select_date_time()
        shift = SHIFT.f(hours=df1.new_end_date.dt.hour.values[0])
        equal_shift = shift
        if new_params == equal_shift:
            print(df1['planned_end_date'][0].date()
                  == datetime.datetime.now().date())
            if df1['planned_end_date'][0].date() == kwargs['req_date'].date():
                df1 = df1[df1['pre_check_status'].isin(
                    ['Resolved', 'Waiting', 'Inprogress', 'New'])]
            else:
                df1 = df1[df1['pre_check_status'].isin(
                    ['Waiting', 'Inprogress', 'New'])]
        else:
            df1 = df1[df1['pre_check_status'].isin(
                ['Waiting', 'Inprogress', 'New'])]
        return df1

    def new_tickets_SM_INFRA(self, *args, **kwargs):

        df1 = kwargs['df'].sort_values(by=['id'], ascending=False)
        df1['planned_end_date'] = df1['planned_end_date'].apply(
            lambda x: x.strftime('%Y-%m-%dT%H:%S')if not pd.isnull(x) else "0")

        if df1['planned_end_date'].values[0] != "0":
            df1['new_end_date'] = pd.to_datetime(
                df1['planned_end_date'], infer_datetime_format=True)
            SHIFT = select_date_time()
            shift = SHIFT.f(hours=df1.new_end_date.dt.hour.values[0])
            import dateutil.parser
            df_date = dateutil.parser.parse(
                str(df1['planned_end_date'].values[0]))
            if kwargs['new_params'] == shift and df_date.date() == kwargs['convert_date']:
                df1 = df1[df1['pre_check_status'].isin(
                    ['Resolved', 'Waiting', 'Inprogress', 'New'])]
            else:
                df1 = df1[df1['pre_check_status'].isin(
                    ['Waiting', 'Inprogress', 'New'])]

        else:

            df1 = df1[df1['pre_check_status'].isin(
                ['Waiting', 'Inprogress', 'New'])]

        return df1


class select_date_time(object):

    def __init__(self, *args, **kwargs):
        super(select_date_time, self).__init__()

    def f(self, *args, **kwargs):
        x = kwargs['hours']
        if (x >= 6) and (x < 14):
            return 'Morning'
        elif (x >= 14) and (x < 23):
            return'Afternoon'
        elif (x >= 23 and 6 < x) or ((x >= 0) and (x <= 6)):
            return'Night'

    def f1(self, *args, **kwargs):
        x = kwargs['hours']
        convert_date = datetime.datetime.strptime(x, '%Y-%m-%dT%H:%M')
        get_date = datetime.datetime.strftime(convert_date, '%Y-%m-%d')
        x = datetime.datetime.strftime(convert_date, '%H')
        x = int(x)
        if (x >= 6) and (x < 15):
            return {'shift': "06:00AM - 3:00PM"}
        elif (x >= 14) and (x <= 23):
            return {'shift': "02:00PM -11:00PM"}
        elif (x > 22) and (x < 7) or (x >= 0) and (x <= 7):
            return {'shift': "10:00PM - 07:00PM"}


class UTC(object):
    def __init__(self, *args, **kwargs):
        super(UTC, self).__init__()

    def utc_format(*args, **kwargs):
        date = kwargs['date']
        from datetime import datetime
        import pytz

        local = pytz.timezone("America/Los_Angeles")
        local_dt = local.localize(date, is_dst=None)
        utc_dt = local_dt.astimezone(pytz.utc)
        get_date = utc_dt.strftime("%Y-%m-%d")

        get_hour = utc_dt.strftime("%H")
        return get_date, get_hour


class JSON_convert(object):
    def __init__(self, *args, **kwargs):
        super(JSON_convert, self).__init__()

    def JSON_query(self, *args, **kwargs):
        data = kwargs['data']
        query_dict_1 = QueryDict('', mutable=True)
        query_dict_1.update(data)
        return query_dict_1


class datetime_converter(object):
    def __init__(self, *args, **kwargs):
        super(datetime_converter, self).__init__()

    def DateTimeConvert(self, *args, **kwargs):
        date = kwargs['date']
        try:
            convert_date = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M')
            get_date = datetime.datetime.strftime(convert_date, '%Y-%m-%d')
            get_hour = datetime.datetime.strftime(convert_date, '%H')

        except:
            try:
                convert_date = datetime.datetime.strptime(
                    date, '%Y-%m-%dT%H:%M:%S.%fZ')
            except:
                try:
                    convert_date = datetime.datetime.strptime(
                        date, '%Y-%m-%dT%H:%M:%SZ')
                except:
                    import dateutil.parser
                    convert_date = dateutil.parser.parse(date)
            get_date = datetime.datetime.strftime(convert_date, '%Y-%m-%d')
            get_hour = datetime.datetime.strftime(convert_date, '%H')

        return get_date, get_hour, convert_date


class Histories(object):
    def __init__(self, *args, **kwargs):
        super(Histories, self).__init__()

    def make_history(self, *args, **kwargs):
        data = kwargs['data']
        query_dict_1 = QueryDict('', mutable=True)
        query_dict_1.update(data)
        create_history = tracking_serializer(data=query_dict_1)
        if create_history.is_valid():
            create_history.save()
        else:
            print(create_history.errors)

    def make_outage_history(self, *args, **kwargs):
        data = kwargs['data']
        query_dict_1 = QueryDict('', mutable=True)
        query_dict_1.update(data)

        serializer = outage_history_tickets_serializer(data=query_dict_1)
        if serializer.is_valid():
            serializer.save()

        else:
            print(serializer.errors, "ERROR")
