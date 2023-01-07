from django.http import JsonResponse
from .models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth import (REDIRECT_FIELD_NAME, get_user_model, login as auth_login)
import datetime
from django.conf import settings

class authMixin(object):

    def form_invalid(self, form):
        
        response = super(authMixin, self).form_invalid(form)
        
        if self.request.is_ajax():
            return JsonResponse({'error': 'Invalid Login, Please try again'}, status=400)
        else:
            return response

    def form_valid(self, form):
        response = super(authMixin, self).form_valid(form)
        
        if self.request.is_ajax():

            userObj = form.cleaned_data
            username = userObj['username']
            password = userObj['password']

            user = authenticate(username=username, password=password)
            
            auth_login(self.request, user)
            
            redirect_to = self.request.POST.get(REDIRECT_FIELD_NAME, self.request.GET.get(REDIRECT_FIELD_NAME, settings.LOGIN_REDIRECT_URL))
            
            data = {
                'redirect': redirect_to
            }
            return JsonResponse(data)
        else:
            return response
    