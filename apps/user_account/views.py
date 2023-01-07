from django.contrib.auth import (
    REDIRECT_FIELD_NAME, get_user_model, login as auth_login,
    logout as auth_logout, update_session_auth_hash,
)
from django.contrib.auth.forms import AuthenticationForm
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework.views import APIView
from django.conf import settings
from django.urls import reverse
from django.shortcuts import resolve_url
from .auth_mixin import authMixin
from django.views.generic import FormView, TemplateView
from rest_framework.viewsets import ModelViewSet
from url_filter.integrations.drf import DjangoFilterBackend
import json
import time
import re
from datetime import datetime
from datetime import timedelta
from .models import User,team, subTeam, role, change_work_group_request, sub_team_owner
from django.contrib.auth.models import Group
from .serializers import user_serializer, work_group_request_serializer, sub_team_owner_serializers, sub_team_serializer
from django.db.models import Q

class users_html(TemplateView):

    template_name = "user_account/users.html"

    def get_context_data(self, **kwargs):
        context = {}

        context["team"] = [{"code":team[0], "name":team[1]} for team in team.objects.values_list("code", "name").all().order_by('code').distinct("code")]
        context["sub_team"] = [{"code":team[0], "name":team[1]} for team in subTeam.objects.values_list("code", "name").order_by('code').distinct("code")]
        context["role"] = [{"code":team[0], "name":team[1]} for team in role.objects.values_list("code", "name").all().order_by('code').distinct("code")]
        context["group"] = [{"id":team[0], "name":team[1]} for team in Group.objects.values_list("id", "name").all().order_by('id').distinct("id")]
        return context

class team_owner_html(TemplateView):

    template_name = "user_account/team_owner.html"

    def get_context_data(self, **kwargs):
        context = {}

        context["team"] = [{"code":team[0], "name":team[1]} for team in team.objects.values_list("code", "name").all().order_by('code').distinct("code")]
        context["sub_team"] = [{"code":team[0], "name":team[1]} for team in subTeam.objects.values_list("code", "name").all().order_by('code').distinct("code")]
        context["shift_planner"] = [{"id":user_info[0], "fname":user_info[1], "lname":user_info[2]} for user_info in User.objects.values_list("id", "first_name", "last_name").filter(groups__name='shift_planner').order_by('username').distinct("username")]
        return context

class sub_team_data(generics.ListAPIView):
    
    queryset = subTeam.objects.all()

    serializer_class = sub_team_serializer

    filter_backends = [DjangoFilterBackend]

    filter_fields = ['code', 'name', 'team']

class team_details_html(TemplateView):

    template_name = "user_account/team_details.html"

class user_mv(ModelViewSet):

    queryset = User.objects.all()
    serializer_class = user_serializer

    def get_queryset(self):
        try:
            if self.request.user.is_superuser:
                queryset = User.objects.exclude(Q(technical_user=True)|Q(is_superuser=True))
            else:
                queryset = User.objects.exclude(Q(technical_user=True)|Q(is_superuser=True)).filter(team=self.request.user.team)
            return queryset
        except Exception as e:
            return Response(str(e),status=500)

class update_user_group(APIView):

    def patch(self, request):
        try:
            user_id = self.request.data.get('user_id', None)

            groups = self.request.data.get('groups', None)

            user_inst = User.objects.get(id=user_id)

            user_inst.groups.clear()

            for group in groups:
                GroupName = Group.objects.get(id=group)
                GroupName.user_set.add(user_inst)
            
            return Response({'detail': "user update success"})

        except Exception as e:
            print(str(e))
            return Response(str(e),status=500)

class auth_test(APIView):

    def get(self, request):
        return Response({"message": "Login Success"})

class work_group_request_mv(ModelViewSet):

    serializer_class = work_group_request_serializer
    queryset = change_work_group_request.objects.all()

    def get_queryset(self):
        try:
            sub_team_id = sub_team_owner.objects.values_list('sub_team_id', flat=True).filter(owner=self.request.user, sub_team__team__code=self.request.user.team.code)

            queryset = change_work_group_request.objects.filter(user__sub_team__in=sub_team_id, status="WAITING")

            return queryset

        except Exception as e:
            return Response(str(e), status=500)

class work_group_request_my_mv(ModelViewSet):

    serializer_class = work_group_request_serializer
    queryset = change_work_group_request.objects.all()

    def get_queryset(self):
        try:
            queryset = change_work_group_request.objects.filter(requested_by=self.request.user, status="WAITING")

            return queryset

        except Exception as e:
            return Response(str(e), status=500)

class approve_work_group_request(APIView):

    def post(self, request):
        try:
            request_id = self.request.data.get('request_id', None)

            work_group_request_info = change_work_group_request.objects.get(id=request_id)

            User.objects.filter(username=work_group_request_info.user).update(sub_team=work_group_request_info.target)

            work_group_request_info.status = 'APPROVED'

            work_group_request_info.approver = request.user

            work_group_request_info.request_approved_on = datetime.now()

            work_group_request_info.save()

            return Response({'detail': "Update Successful"})

        except Exception as e:
            return Response(str(e), status=500)

class reject_work_group_request(APIView):

    def post(self, request):
        try:
            request_id = self.request.data.get('request_id', None)

            work_group_request_info = change_work_group_request.objects.get(id=request_id)

            work_group_request_info.status = 'REJECTED'

            work_group_request_info.approver = request.user

            work_group_request_info.request_approved_on = datetime.now()

            work_group_request_info.save()

            return Response({'detail': "Update Successful"})
        except Exception as e:
            return Response(str(e), status=500)

class create_work_group_request(APIView):

    def post(self, request):
        try:
            user_id = self.request.data.get('user_id', None)

            target = self.request.data.get('target', None)

            user_info  = User.objects.get(id=user_id)

            target = subTeam.objects.get(code=target)

            change_work_group_request_init = change_work_group_request()

            change_work_group_request_init.user = user_info

            change_work_group_request_init.source = user_info.sub_team

            change_work_group_request_init.target = target

            change_work_group_request_init.requested_by = self.request.user

            change_work_group_request_init.save()

            return Response({'detail': "Created Successful"})
        except Exception as e:
            return Response(str(e), status=500)

class sub_team_owner_mv(ModelViewSet):

    queryset = sub_team_owner.objects.all()
    serializer_class = sub_team_owner_serializers

class login_html(authMixin, FormView):

    form_class = AuthenticationForm
    template_name = "user_account/login.html"
    
    def get_success_url(self):

        next_url = self.request.GET.get('next',None)
        
        if next_url:
            return next_url
        else :
            redirect_to = resolve_url(settings.LOGIN_REDIRECT_URL)

            return reverse(redirect_to)
    
    def form_valid(self,form):

        if form.is_valid():
            
            auth_login(self.request, form.get_user())
        
        return super(login_html, self).form_valid(form)