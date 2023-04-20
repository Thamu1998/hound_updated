from apps.user_account.models import User, sub_team_owner, subTeam, team
import pandas as pd

from datetime import datetime
from apps.roster.methods.today_shift import today_plan
from dateutil.parser import parse
from django.http.request import QueryDict
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.generic import TemplateView
from apps.shiftpasstool.methods.sendmail import send_mail_to_destination
from apps.shiftpasstool.methods.ticket_history_maintain import ticket_handling
from .serializers import master_tracking_serializer, outage_history_tickets_serializer, tracking_serializer, \
    outage_master_tickets_serializer, tickets_notes_serializer, tickets_counts_serializer, Activity_table, \
    sm_infra_activate_serializer
from .models import outage_master_tickets, outage_tracking_history, tracking_history, master_tickets

from apps.shiftpasstool.methods.generate_date import Histories, JSON_convert, datetime_converter, select_date_time
from apps.shiftpasstool.models import tickets_notes, tickets_count_table, ActivityDB, sm_infra_activate


# Create your views here.


class dashboard_html(TemplateView):
    template_name = 'shiftpasstool/shiftpasstool.html'


'''
POST tracking for each ticket id

In this function it will store once in master table and once in history table.


'''


class post_tracking(APIView):
    def post(self, request):
        self.request.data['timerange'] = datetime.now().time()
        self.request.data['shift'] = self.request.data['shift'].lower()
        shift = select_date_time()
        self.request.data['hour'] = shift.f1(
            hours=self.request.data['start_time'])
        self.request.data['hour'] = self.request.data['hour']['shift']
        master_serializer = master_tracking_serializer(data=self.request.data)
        if master_serializer.is_valid():
            master_serializer.save()
        else:
            pass
        serializer = tracking_serializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response("Tracking data saved successfully")
        else:
            return Response(serializer.error_messages)

    def get(self, request):
        try:
            arr_query = []
            query_all = tracking_history.objects.all()
            quer = query_all.values()
            df = pd.DataFrame(quer)
            ticket_filter = ticket_handling()
            if len(self.request.GET) > 0:

                final_arr = []

                for j in df['Ticket_ID'].unique():
                    req_date = datetime.strptime(
                        self.request.GET['created_date'].split("T")[0], "%Y-%m-%d")

                    df_filter = df[df['Ticket_ID'] == j]

                    ticket_res = ticket_filter.get_current_ticket_status_Follow_up(
                        req_date=req_date, filter_df=df_filter, shift=self.request.GET['shift'].lower())

                    if ticket_res is None:
                        pass
                    else:
                        if ticket_res != "NULL":
                            final_arr.append(ticket_res)

            else:
                final_arr = []

                for j in df['Ticket_ID'].unique():

                    df_filter = df[df['Ticket_ID'] == j]
                    SHIFT = select_date_time()
                    shift = SHIFT.f(hours=datetime.now().hour)
                    req_date = datetime.strptime(
                        str(datetime.now().date()), "%Y-%m-%d")
                    res = ticket_filter.get_current_ticket_status_Follow_up(
                        req_date=req_date, shift=shift.lower(), filter_df=df_filter)
                    if res is None:
                        pass
                    else:
                        if res != "NULL":
                            final_arr.append(res)

            return Response({"new_data1": final_arr, "new_data2": final_arr})
        except:
            return Response({"new_data1": [], "new_data2": []})


'''
In this function if someone update the ticket in open into inprogress or inprogress into resolved.

And same thing it will post in history table also
'''


class update_tracking(APIView):
    def put(self, request):
        self.request.data['timerange'] = datetime.now().time()
        if master_tickets.objects.filter(Ticket_ID=self.request.data['Ticket_ID']).exists():
            query = master_tickets.objects.filter(
                Ticket_ID=self.request.data['Ticket_ID']).values()
            history = tracking_history.objects.filter(
                Ticket_ID=self.request.data['Ticket_ID']).values()
            self.request.data['start_time'] = parse(
                self.request.data['created_date'])
            if len(history) > 1:
                new_history = history[len(history) - 1]
                query = tracking_history.objects.filter(
                    **new_history).update(end_time=self.request.data['start_time'])
            else:
                new_history = history
                tracking_history.objects.filter(Ticket_ID=self.request.data['Ticket_ID']).update(
                    end_time=self.request.data['start_time'])

            shift = datetime.now().hour
            shift_1 = select_date_time()
            get_shift = shift_1.f(hours=shift)
            if self.request.data['Status'].lower().replace(" ", "") == 'resolved':
                self.request.data['end_time'] = self.request.data['start_time']

            master_tickets.objects.filter(Ticket_ID=self.request.data['Ticket_ID']).update(
                Status=self.request.data['Status'], date=self.request.data['start_time'], shift=get_shift)
            his = Histories()
            his.make_history(data=self.request.data)

            return Response("Tracking history updated successfully")

        else:
            return Response(f"{request.data['Ticket_ID']} Ticket ID does not exist")


# create history table
# create a ticket in master table
# create history table in every day
'''
trigger function is to trigger in cronjob.....
'''


class post_api(APIView):

    def post(self, request):
        self.request.data['timerange'] = datetime.now().time()
        self.request.data['shift'] = self.request.data['shift'].lower()
        serializer = outage_master_tickets_serializer(data=self.request.data)

        if serializer.is_valid():

            serializer.save()

            his = Histories()

            his.make_outage_history(data=self.request.data)

            return Response('created')
        else:
            return Response(serializer.errors)

    def put(self, request):

        self.request.data['timerange'] = datetime.now().time()

        query1 = outage_master_tickets.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).first()
        query = outage_master_tickets.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).values()
        history = outage_tracking_history.objects.filter(
            Ticket_ID=self.request.data['Ticket_ID']).values()

        self.request.data['start_time'] = parse(
            self.request.data['created_date'])

        if len(history) > 1:
            new_history = history[len(history) - 1]
            outage_tracking_history.objects.filter(
                **new_history).update(end_time=self.request.data['start_time'])
        else:
            new_history = history
            outage_tracking_history.objects.filter(Ticket_ID=self.request.data['Ticket_ID']).update(
                end_time=self.request.data['start_time'])

        if self.request.data['Status'].lower().replace(" ", "") == 'resolved':
            self.request.data['end_time'] = self.request.data['start_time']

        if query[0]['Status'].lower().replace(" ", "") == 'resolved' or query[0]['Status'].lower().replace(" ",
                                                                                                           "") == 'inprogress' or \
                query[0]['Status'].lower().replace(" ", "") == 'waiting' or query[0]['Status'].lower().replace(" ",
                                                                                                               "") == 'new':

            query_dict_1 = QueryDict('', mutable=True)
            query_dict_1.update(self.request.data)

            serializer = outage_master_tickets_serializer(
                query1, data=query_dict_1, partial=True)
            if serializer.is_valid():
                serializer.save()
                shift = datetime.now().hour
                shift_1 = select_date_time()
                get_shift = shift_1.f(hours=shift)
                his = Histories()

                history = his.make_outage_history(data=self.request.data)
                return Response("updated")
            else:
                return Response(serializer.errors)

    def get(self, request):
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


class outage_get_api(APIView):
    def get(self, request):
        all_results = outage_tracking_history.objects.all()
        all_result_values = all_results.values()
        df = pd.DataFrame(all_result_values)
        ticket = ticket_handling()
        if len(self.request.GET) > 0:
            req_date = datetime.strptime(
                self.request.GET['created_date'].split("T")[0], "%Y-%m-%d")

            final_arr = []
            for row in df['Ticket_ID'].unique():
                filter_dataframe = df[df['Ticket_ID'] == row]
                res = ticket.get_current_ticket_status_outage(
                    req_date=req_date, shift=self.request.GET['shift'].lower(), filter_df=filter_dataframe)
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        final_arr.append(res)
        else:
            final_arr = []

            for row in df['Ticket_ID'].unique():
                filter_dataframe = df[df['Ticket_ID'] == row]
                SHIFT = select_date_time()
                shift = SHIFT.f(hours=datetime.now().hour)
                req_date = datetime.strptime(
                    str(datetime.now().date()), "%Y-%m-%d")
                res = ticket.get_current_ticket_status_outage(
                    req_date=req_date, shift=shift.lower(), filter_df=filter_dataframe)
                if res is None:
                    pass
                else:
                    if res != "NULL":
                        final_arr.append(res)
        final_res = {}
        final_res['report'] = final_arr
        final_res['timezones'] = final_arr
        return Response(final_res)


class ticket_comment(APIView):

    def post(self, request):
        date = self.request.data['date']

        shift = self.request.data['shift']
        convertFormat = datetime_converter()

        converted_date = convertFormat.DateTimeConvert(date=date)

        if tickets_notes.objects.filter(date__date=converted_date[0], date__hour=converted_date[1],
                                        shift=shift).exists():
            json_query = JSON_convert()
            json = json_query.JSON_query(data=self.request.data)
            json_query = json
            update_query = tickets_notes.objects.filter(
                **self.request.data).first()

            serializer = tickets_notes_serializer(
                instance=update_query, data=json_query, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response("tickets notes updates")
            else:
                return Response(serializer.errors)
        else:
            json_query = JSON_convert()
            json = json_query.JSON_query(data=self.request.data)
            serializer_query = json

            serializer = tickets_notes_serializer(data=serializer_query)

            if serializer.is_valid():
                serializer.save()
                return Response("Tickets Notes created")
            else:
                return Response(serializer.errors)

    def get(self, request):

        if len(self.request.GET) > 0:
            date = self.request.GET['created_date']
            convertFormat = datetime_converter()

            get_date, get_hour, get_datetime = convertFormat.DateTimeConvert(
                date=date)

            query = tickets_notes.objects.filter(
                date__date=get_date, shift=self.request.GET['shift']).order_by('-id')

            if len(query) == 0:
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
            query = tickets_notes.objects.filter(
                date__date=latest_date).order_by('-id')
        if len(query) > 0:
            serializer = tickets_notes_serializer(instance=query, many=True)

            return Response(serializer.data[0])
        else:
            return Response([])


class today_shift_planer_info_for_tickets(APIView):

    def get(self, request):
        try:
            team_id = request.GET.get('tm', None)

            today_plan_init = today_plan(user_info=request.user)
            shift = today_plan_init.plan(team_id=team_id)
            return Response(shift, status=200)
        except Exception as e:
            return Response(status=500)


class set_Ticket_count(APIView):

    def post(self, request):

        json_query = JSON_convert()
        json_data = json_query.JSON_query(data=self.request.data)
        serializer = tickets_counts_serializer(data=json_data)
        if serializer.is_valid():
            serializer.save()
            return Response("Ticket count created")
        else:
            return Response("Not created Ticket count")

    def put(self, request):
        date = self.request.data['date']

        shift = self.request.data['shift']
        convertFormat = datetime_converter()

        converted_date = convertFormat.DateTimeConvert(date=date)

        if tickets_count_table.objects.filter(date__date=converted_date[0], date__hour=converted_date[1],
                                              shift=shift).exists():

            update_query = tickets_count_table.objects.filter(
                **self.request.data).first()
            self.request.data['date'] = datetime.now()
            json_query = JSON_convert()
            json_query = json_query.JSON_query(data=self.request.data)

            serializer = tickets_counts_serializer(
                instance=update_query, data=json_query, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response("Updated successfully")
            else:

                return Response(serializer.error_messages)
        else:
            self.post(self.request.data)

            return Response("Ticket count POSTEd")

    def get(self, request):
        if len(self.request.GET) > 0:

            date = self.request.GET['created_date']
            convertFormat = datetime_converter()
            shift = self.request.GET['shift']

            get_date, get_hour, get_datetime = convertFormat.DateTimeConvert(
                date=date)
            query = tickets_count_table.objects.filter(
                date__date=get_date, shift=shift).order_by('-id')
            if len(query) == 0:
                query = tickets_count_table.objects.filter(
                    date__date=get_date).order_by('-id')

        else:
            date = datetime.now()
            get_date = date.date()
            get_hour = date.hour

            query = tickets_count_table.objects.all().order_by('-id')

        if len(query) > 0:
            serializer = tickets_counts_serializer(query, many=True)
            return Response(serializer.data[0])
        else:
            return Response("No data")


class sm_infra_activate_obj(APIView):

    def post(self, request):

        self.request.data['timerange'] = datetime.now().time()
        json_query = JSON_convert()
        json_query = json_query.JSON_query(data=self.request.data)

        if sm_infra_activate.objects.filter(ticket_id=json_query['ticket_id']).exists():
            query1 = sm_infra_activate.objects.filter(
                ticket_id=json_query['ticket_id']).values()
            if len(query1) > 1:

                sm_infra_activate.objects.filter(
                    **query1[len(query1) - 1]).update(planned_end_date=self.request.data['planned_start_date'])
            else:
                sm_infra_activate.objects.filter(
                    **query1[0]).update(planned_end_date=self.request.data['planned_start_date'])

        if self.request.data['pre_check_status'] == 'Resolved':
            json_query['planned_end_date'] = self.request.data['planned_start_date']

        serializer = sm_infra_activate_serializer(data=json_query)
        if serializer.is_valid():
            serializer.save()
            return Response("sm_infra_createed")
        else:
            return Response(serializer.errors)


class Get_sm_infra_activate(APIView):

    def get(self, request):
        try:
            arr_query = []
            query_all = sm_infra_activate.objects.all()
            quer = query_all.values()
            df_filter = pd.DataFrame(quer)
            ticket = ticket_handling()
            if len(self.request.GET) > 0:
                req_date = datetime.strptime(
                    self.request.GET['created_date'].split("T")[0], "%Y-%m-%d")
                final_arr = []
                import numpy as np
                for v in df_filter['ticket_id'].unique():
                    tic_new_df = df_filter[df_filter['ticket_id'] == v]
                    res = ticket.get_current_ticket_status_SM_INFRA(
                        req_date=req_date, shift=self.request.GET['shift'].lower(), filter_df=tic_new_df)
                    if res is None:
                        pass
                    else:
                        if res != "NULL":
                            final_arr.append(res)

            else:
                final_arr = []

                for row in df_filter['ticket_id'].unique():
                    filter_dataframe = df_filter[df_filter['ticket_id'] == row]
                    SHIFT = select_date_time()
                    shift = SHIFT.f(hours=datetime.now().hour)
                    req_date = datetime.strptime(
                        str(datetime.now().date()), "%Y-%m-%d")
                    res = ticket.get_current_ticket_status_SM_INFRA(
                        req_date=req_date, shift=shift.lower(), filter_df=filter_dataframe)
                    if res is None:
                        pass
                    else:
                        if res != "NULL":
                            final_arr.append(res)
            return Response(final_arr)
        except:
            return Response([])


class Activity_db(APIView):

    def post(self, request):
        self.request.data['timerange'] = datetime.now().time()
        json_query = JSON_convert()
        json_query = json_query.JSON_query(data=self.request.data)

        if ActivityDB.objects.filter(ticket_id=json_query['ticket_id']).exists():
            query1 = ActivityDB.objects.filter(
                ticket_id=json_query['ticket_id']).values()
            if len(query1) > 1:
                ActivityDB.objects.filter(
                    **query1[len(query1) - 1]).update(planned_end_date=json_query['planned_start_date'])
            else:
                ActivityDB.objects.filter(
                    **query1[0]).update(planned_end_date=json_query['planned_start_date'])

        convert_date = json_query['planned_start_date']
        if self.request.data['pre_check_status'] == 'Resolved':
            json_query['planned_end_date'] = json_query['planned_start_date']
        serializer = Activity_table(data=json_query)
        if serializer.is_valid():
            serializer.save()
            return Response("Activate DB created")
        else:
            return Response(serializer.errors)


class Get_all_activity(APIView):

    def get(self, request):
        try:
            arr_query = []
            query_all = ActivityDB.objects.all()
            quer = query_all.values()
            df_filter = pd.DataFrame(quer)
            ticket = ticket_handling()
            if len(self.request.GET) > 0:
                req_date = datetime.strptime(
                    self.request.GET['created_date'].split("T")[0], "%Y-%m-%d")

                final_arr = []
                import numpy as np
                for v in df_filter['ticket_id'].unique():
                    tic_new_df = df_filter[df_filter['ticket_id'] == v]

                    res = ticket.get_current_ticket_status_WeeekendActivity(
                        req_date=req_date, shift=self.request.GET['shift'].lower(), filter_df=tic_new_df)
                    if res is None:
                        pass
                    else:
                        if res != "NULL":
                            final_arr.append(res)

            else:
                final_arr = []

                for row in df_filter['ticket_id'].unique():
                    filter_dataframe = df_filter[df_filter['ticket_id'] == row]
                    SHIFT = select_date_time()
                    shift = SHIFT.f(hours=datetime.now().hour)
                    req_date = datetime.strptime(
                        str(datetime.now().date()), "%Y-%m-%d")
                    res = ticket.get_current_ticket_status_WeeekendActivity(
                        req_date=req_date, shift=shift.lower(), filter_df=filter_dataframe)
                    if res is None:
                        pass
                    else:
                        if res != "NULL":
                            final_arr.append(res)

            return Response(final_arr)
        except:
            return Response([])


class MailAPI_view(APIView):

    def post(self, request):
        email = send_mail_to_destination()
        res = email.mail_content(json_data=self.request.data)
        return Response(res)


class admin_page(APIView):

    def get(self, request):

        context = {}

        context = {"user_list": [{"id": user[0], "first_name":user[1], "last_name":user[2], "name": user[1] + " " + user[2], "username": user[3]} for user in
                                 User.objects.values_list("id", "first_name", "last_name", "username").filter(
                                     team_id__in=['BRL_SM_OP', 'EU_SM_OP'])]}
        return Response(context)
