from django.core.mail import EmailMessage, send_mail
from django.template.loader import render_to_string, get_template
import threading
import sys
from django.utils.html import strip_tags

# """############### BEGIN Initiate logger ###############"""
# from config.logger import init_logging

#log = init_logging("logs/shiftpasstool.#log", __name__)
# """############### END Initiate logger ###############"""


class EmailThread(threading.Thread):

    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send(fail_silently=False)


class send_mail_to_destination:

    def __init__(self, *args, **kwargs):
        super(send_mail_to_destination, self).__init__()

    def mail_content(self, *args, **kwargs):
        try:
            #log.error("start mail content")
            json_data = kwargs['json_data']
            subject = 'Shift Handover'
            to = ["naveen.kumar.devaraj@sap.com", "abishek.p@sap.com",
                  "hariprasath.narayanamoorthy@sap.com"]
            body = "HI Team"
            context = {}
            from datetime import datetime
            for i in json_data['shifpassjs']:

                i['shift_date']['selected_date'] = datetime.strptime(
                    i['shift_date']['selected_date'], '%Y-%m-%dT%H:%M')
                i['shift_date']['selected'] = datetime.strftime(
                    i['shift_date']['selected_date'], '%b-%d %Y')
                date = datetime.strftime(
                    i['shift_date']['selected_date'], '%A')
                context['shift_and_date'] = i['shift_date']

                context['day'] = date
                try:
                    context['outage_data'] = i['outage_get']['report']
                except KeyError as e:

                    context['outage_data'] = []
                try:
                    context['follow_up'] = i['follow_up']['new_data1']
                except KeyError as e:
                    context['follow_up'] = []
            try:

                add_charts = json_data['shiftpasschartjs']['quer_chart']
                context['quer_chart'] = json_data['shiftpasschartjs']['quer_chart']
                context['total_quer_chart'] = int(add_charts['alerts'])+int(
                    add_charts['manual_incidents'])+int(add_charts['problems'])+int(add_charts['service_request'])

            except:
                context['quer_chart'] = {}
                context['total_quer_chart'] = 0

            try:
                context['ticket_comment'] = json_data['shiftpasschartjs']['ticket_comment']
            except KeyError as e:
                context['ticket_comment'] = []

            try:
                context['sm_infra_data'] = json_data['shiftpasschartjs']['sm_infra_data']
            except KeyError as e:
                context['sm_infra_data'] = []

            try:
                sorted_items = sorted(json_data['shiftpasschartjs']['activity_data'], key=lambda x: x['region'])
                data = sorted_items
            except KeyError as e:
                data = []

            try:
                context['employees'] = json_data['shiftpasschartjs']['Userdetails_employee']
            except KeyError as e:
                context['employees'] = []
            try:
                context['Lead'] = json_data['shiftpasschartjs']['Userdetails_lead']
            except KeyError as e:
                context['Lead'] = []

            duplicates = set([data[i]["planned_type"]
                              for i in range(len(data))])

            dictionary = {}
            for i in duplicates:

                dictionary[i] = [data[k]
                                 for k in range(len(data)) if data[k]['planned_type'] == i]

            context['Activity_data'] = dictionary

            # Render the HTML template
            #log.error("Initial mail HTML")
            html_content = get_template(
                'shiftpasstool/mail.html').render(context)
            #log.error("Finish mail HTML", context)
            # email = EmailMessage(f'Shift Handover - {context["shift_and_date"]["selected"]} ({context["shift_and_date"]["shift"]})', html_content,
            #                      'hound@mail.s4hana.ondemand.com', to)
            # #log.error("Start mail message")
            # email.content_subtype = 'html'
            # email.send()

            send_mail(
            f'Shift Handover - {context["shift_and_date"]["selected"]} ({context["shift_and_date"]["shift"]})',
            'Here is the message.',
            'jeevanom306@gmail.com',
            ['jeevanom306@gmail.com','kunigal.naveen@gmail.com'],
            html_message=html_content
            )
            #log.error("Mail Sent succesfully")
# 
            return context['Activity_data']
        
        except Exception as e:
            print(str(e))
            #log.error(str(e))
