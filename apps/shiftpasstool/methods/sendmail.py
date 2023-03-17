from django.core.mail import EmailMessage,send_mail
from django.template.loader import render_to_string,get_template

from config import settings

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'mail-rot.shp.rot.s4h.sap.corp'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'cisco@shp.rot.s4h.sap.corp'
# EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'DummyValue')


class send_mail_to_destination:

    def __init__(self,*args,**kwargs):
        super(send_mail_to_destination,self).__init__()


    def mail_content(self,*args,**kwargs):
    
        json_data=kwargs['json_data']
        # Create the email message
        subject = 'Email Subject'
        to = ['jeevanom306@gmail.com']
        body="HI Team"
        context={}
        from datetime import datetime
        # print(json_data['shifpassjs'],"")
        for i in json_data['shifpassjs']:
            
            i['shift_date']['selected_date']=datetime.strptime(i['shift_date']['selected_date'],'%Y-%m-%dT%H:%M')
            i['shift_date']['selected']=datetime.strftime(i['shift_date']['selected_date'],'%b-%d %Y')
            date=datetime.strftime(i['shift_date']['selected_date'],'%A')
        #     print(i['shift_date'])
        #     print(i['outage_get']['report'])
        #     print(i['follow_up']['new_data1'])
            context['shift_and_date']=i['shift_date']

            context['day']=date
            # print(i,"OUTAGE")
            try:
                context['outage_data']=i['outage_get']['report']
            except KeyError as e:
                
                context['outage_data']=[]
            try:    
                context['follow_up']=i['follow_up']['new_data1']
            except KeyError as e:
                # print(i,"Follow")
                context['follow_up']=[]
        try:
            # if json_data['shiftpasschartjs']['quer_chart']['shift']:
                print(json_data['shiftpasschartjs']['quer_chart'])
                add_charts=json_data['shiftpasschartjs']['quer_chart']
                context['quer_chart']=json_data['shiftpasschartjs']['quer_chart']
                context['total_quer_chart']=int(add_charts['alerts'])+int(add_charts['manual_incidents'])+int(add_charts['problems'])+int(add_charts['service_request'])
            # else:
            #     context['quer_chart']={}
            #     context['total_quer_chart']=0
        except:
            context['quer_chart']={}
            context['total_quer_chart']=0

        try:
            context['ticket_comment']=json_data['shiftpasschartjs']['ticket_comment']
        except KeyError as e:
            context['ticket_comment']=[]
            
        try:
            context['sm_infra_data']=json_data['shiftpasschartjs']['sm_infra_data']
        except KeyError as e:
            
            context['sm_infra_data']=[]
            
        try:
            data=json_data['shiftpasschartjs']['activity_data']
        except KeyError as e:
            data=[]

        try:
            context['employees']=json_data['shiftpasschartjs']['Userdetails_employee']
            context['Lead']=json_data['shiftpasschartjs']['Userdetails_lead']
        except KeyError as e:
            context['employees']=[]
            context['Lead']=[]
        print(context['employees'],context['Lead'])
        # data=json['activity_data']
        duplicates=set([data[i]["planned_type"] for i in range(len(data))])
        # duplicate_regions=set([data[i]["region"] for i in range(len(data))])
        # arr=[]
        dictionary={}
        for i in duplicates:
            
            dictionary[i]=[data[k] for k in range(len(data)) if data[k]['planned_type'] == i]
        #     arr.append(dictionary)
        #     dictionary[i]=arr

        context['Activity_data']=dictionary

        # Render the HTML template
        html_content=get_template('shiftpasstool/mail.html').render(context)
        # html_content = render_to_string('shiftpasstool/mail.html', context)

        msg = EmailMessage(subject, body,from_email='jeevanom306@gmail.com', to=to,html_message=html_content)
        msg.content_subtype = "html"  # Main content is now text/html
        # msg.attach_alternative(html_content, 'text/html')
        msg.send()
#         send_mail(
#             'Subject',
#             'Here is the message.',
#             'jeevanom306@gmail.com',
#             ['kunigal.naveen@gmail.com'],
#             html_message=html_content
# )
        return context

# import sys
# from django.core.mail import EmailMessage
# from django.template.loader import render_to_string, get_template
# from django.utils.html import strip_tags
# html_tpl_path = 'mail/welcome.html'
# context_data = {'username': sys.argv[1]}
# email_html_template = get_template(html_tpl_path).render(context_data)
# receiver_email = sys.argv[2]
# email = EmailMessage('Welcome to Hound', email_html_template, 'hound@mail.s4hana.ondemand.com', [receiver_email])
# email.content_subtype = 'html'
# email.send()