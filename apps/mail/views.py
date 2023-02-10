from django.views.generic import TemplateView
from apps.mail.models import release_notification
import os
# Create your views here.


class welcome_email_template(TemplateView):

    template_name = 'mail/welcome.html'

    def get_context_data(self, **kwargs):

        context = {}
        context['username'] = "Mohamed Naveen"
        context['DOMAIN_NAME'] = os.getenv('DOMAIN_NAME', 's4hound.rot.s4h.sap.corp')

        return context

class maintanance_email_template(TemplateView):

    template_name = 'mail/maintanance.html'

    def get_context_data(self, **kwargs):

        release_id = self.request.GET.get('release_id', None)

        release_notifications = release_notification.objects.values().filter(release_id__release_id=release_id)

        context = {}
        context['username'] = "Mohamed Naveen"
        context['release_id'] = release_id
        context['release_notifications'] = release_notifications
        context['DOMAIN_NAME'] = os.getenv('DOMAIN_NAME', 's4hound.rot.s4h.sap.corp')

        return context