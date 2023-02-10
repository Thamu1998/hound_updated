from django.core.mail import EmailMessage
from django.template.loader import render_to_string, get_template
from django.utils.html import strip_tags
import threading
import os
from django.contrib.auth import get_user_model

class EmailThread(threading.Thread):

    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send(fail_silently=False)

def send_welcome_email(*args, **kwargs):

    for email in kwargs['email']:
        user_inst = get_user_model().objects.get(email=email)

        html_tpl_path = 'mail/welcome.html'
        context_data = {'username': user_inst.get_full_name(), 'DOMAIN_NAME': os.getenv('DOMAIN_NAME', 's4hound.rot.s4h.sap.corp')}
        email_html_template = get_template(html_tpl_path).render(context_data)
        receiver_email = user_inst.email
        email = EmailMessage('Welcome to Hound', email_html_template, 'hound@mail.s4hana.ondemand.com', [receiver_email])
        email.content_subtype = 'html'
        EmailThread(email).start()

    print("The welcome email was successfully sent.")