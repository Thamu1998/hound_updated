import re
import random
import string
from re import sub
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.urls import resolve
from django.utils.deprecation import MiddlewareMixin
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import (REDIRECT_FIELD_NAME, get_user_model, login as auth_login)
from django.contrib.auth.models import Group
from datetime import datetime
from datetime import timedelta
from rest_framework import permissions
from apps.user_account.models import User, team, subTeam, role
from  django.core.exceptions import ObjectDoesNotExist
# from apps.user_account.methods import GetUserDetails
from apps.user_account.methods.CheckAccessLDAP import checkCamAccess,getUserDetails
from rest_framework.authentication import TokenAuthentication
from urllib.parse import unquote
from django.contrib import messages
from apps.user_account.models import page_access
from django.contrib.auth.models import Permission
from django.urls import get_resolver
from django.utils import timezone

IGNORE_PATHS = [re.compile(settings.LOGIN_URL)]

IGNORE_PATHS += [re.compile(url) for url in getattr(settings, 'LOGIN_REQUIRED_IGNORE_PATHS', [])]

IGNORE_VIEW_NAMES = [name for name in getattr(settings, 'LOGIN_REQUIRED_IGNORE_VIEW_NAMES', [])]

ALLOWED_PAGE_NON_TEAM = [name for name in getattr(settings, 'ALLOWED_PAGE_NON_TEAM', [])]

def seconds_until_end_of_day():
    time_delta = datetime.combine(datetime.now().date() + timedelta(days=1), datetime.strptime("0000", "%H%M").time()) - datetime.now()
    return time_delta.seconds

class LoginRequiredMiddleware(MiddlewareMixin):

    def deactivate_user(self,inumber):
        try:
            userDetail = User.objects.get(username=inumber)
            # user_inst.is_active = False
            # user_inst.cam = False
            # user_inst.deactivated_on = timezone.now()
            # user_inst.save()
            userDetail.groups.clear()
            GroupName = Group.objects.get(name="no_access")
            GroupName.user_set.add(userDetail) 

        except Exception as e:
            return 

    def register_user(self,inumber,rawPEM):
        try:
            isAllowedAccess = checkCamAccess(inumber)
            
            email,first_name,last_name = self.read_user_details(rawPEM) #READ THE PEM CERTIFICATE AND GET THE USER DETAILS 
            
            user = User.objects.create_user(inumber,email)
            
            user.first_name = first_name

            user.last_name = last_name

            user.is_active = True

            user.cam = isAllowedAccess[0]

            user.team = None if isAllowedAccess[0] == False else team.objects.get(code=isAllowedAccess[2])

            user.sub_team = None if isAllowedAccess[0] == False else subTeam.objects.get(code=isAllowedAccess[3])

            user.role = None if isAllowedAccess[0] == False else role.objects.get(code="SHIFT_MEM")
            
            user.save()

            GroupName = Group.objects.get(name=isAllowedAccess[1])
            GroupName.user_set.add(user)    

            return user
        except Exception as e:
            raise Exception(str(e))

    # # def SSO_LOGIN(self,request, *args, **kwargs):

    # #     pattern = r"CN=(.*)"

    # #     HTTP_X_SSL_CLIENT_S_DN = request.META.get('HTTP_X_SSL_CLIENT_S_DN', None)

    # #     rawPEM = request.META.get('HTTP_X_SSL_CLIENT_ECP_CERT', None)
        
    # #     for DN in HTTP_X_SSL_CLIENT_S_DN.split(','):
            
    # #         HTTP_X_SSL_CLIENT_S_DN_LIST  = re.findall(pattern, DN)

    # #         if len(HTTP_X_SSL_CLIENT_S_DN_LIST) != 0:

    # #             HTTP_X_SSL_CLIENT_S_DN = HTTP_X_SSL_CLIENT_S_DN_LIST[0]

    # #     inumber = HTTP_X_SSL_CLIENT_S_DN

    # #     isAllowedAccess = checkCamAccess(inumber)           
        
    # #     try:            
    # #         userDetail = User.objects.get(username=inumber) #CHECK FOR USERNAME

    # #         if userDetail.is_block:
    # #             raise PermissionDenied("User inactive, Please contact site admin.")

    # #         if isAllowedAccess:
    # #             userDetail.is_active = True
    # #             userDetail.cam = True
    # #             userDetail.deactivated_on = None
    # #             userDetail.save()
    # #             try:
    # #                 GroupName = Group.objects.get(name=isAllowedAccess[1])
    # #                 GroupName.user_set.add(userDetail)
    # #             except Exception as e:
    # #                 print(str(e))

    # #         if userDetail.is_active == False:
    # #             raise PermissionDenied("CAM profile missing, Please request CAM profile(CAM_S4H_HOUND_ACCESS) to access Hound.")

    # #         if (isAllowedAccess == False and userDetail.cam == True and userDetail.is_active == True):
    # #             #DELETE USER IF CAM ACCESS MISSING AND USER TYPE IS CAM
    # #             self.deactivate_user(inumber)

    # #             raise PermissionDenied("CAM profile missing, Please request CAM profile(CAM_S4H_HOUND_ACCESS) to access Hound.")

    # #     except ObjectDoesNotExist:

    # #         userDetail = self.register_user(inumber, rawPEM) #CREATE USER
        
    # #     #FAIL AUTH IF CAM IS MISSING AND NOT A CAM USER AND NOT ACTIVE
    # #     if (isAllowedAccess == False and userDetail.cam == False and userDetail.is_active == False):
    # #         raise PermissionDenied("CAM profile missing, Please request CAM profile(CAM_S4H_HOUND_ACCESS) to access Hound.")

    # #     auth_login(request, userDetail)

    # #     request.session.set_expiry(seconds_until_end_of_day())

    # #     return

    # # def read_user_details(self,rawPEM):
    # #     try:
    # #         from cryptography import x509
    # #         from cryptography.hazmat.backends import default_backend
    # #         from cryptography.x509.oid import ExtensionOID
    # #         from typing import cast, List
            
    # #         subj_alt_names: List[str] = []
            
    # #         rawPEM = bytes(unquote(rawPEM), 'utf-8')
            
    # #         cert = x509.load_pem_x509_certificate(rawPEM, default_backend())
            
    # #         serial_number = cert.extensions.get_extension_for_oid(ExtensionOID.SUBJECT_ALTERNATIVE_NAME)
            
    # #         san_ext_value = cast(x509.SubjectAlternativeName, serial_number.value)

    # #         subj_alt_names = san_ext_value.get_values_for_type(x509.RFC822Name)

    # #         email = subj_alt_names[0]

    # #         first_name = ""

    # #         last_name = ""

    # #         name = email.split('@')[0].split('.')
            
    # #         if len(name) > 1:
    # #             first_name = name[0].capitalize()
    # #             last_name = name[1].capitalize()
    # #         else:
    # #             first_name = name[0]
            
    # #         return email,first_name,last_name
    # #     except Exception as e:
    # #         print(str(e))
    # #         return "dummy@hound.com","",""

    # # def check_page_access(self, request, *args, **kwargs):
    # #     try:
            
    # #         if len(kwargs["url_prop"].app_names) == 0:
    # #             kwargs["url_prop"].app_names = ['redirect']

    # #         access_detail = page_access.objects.get(url_name=kwargs["url_prop"].url_name, space_name__in=kwargs["url_prop"].app_names, request_method=request.method)
            
    # #         if access_detail.is_allow_everyone: #check is allowed everyone 
    # #             return True
            
    # #         user_permission = set(request.user.user_permissions.values_list('codename', flat=True).all()).union(set(Permission.objects.values_list('codename', flat=True).filter(group__user=request.user)))
            
    # #         isAny = True if access_detail.access_name.codename in user_permission else False
            
    # #         return isAny
    # #     except Exception as e:
    # #         if not any([request.user.has_perm('user_account.has_access'),request.user.has_perm('user_account.team_member')]):
    # #             return False
    # #         return True          

    # # def process_view(self, request, view_func, view_args, view_kwargs):
    # #     try:
        
    # #         assert hasattr(request, 'user'), (
    # #             'The LoginRequiredMiddleware requires authentication middleware '
    # #             'to be installed. Edit your MIDDLEWARE setting to insert before '
    # #             "'django.contrib.auth.middleware.AuthenticationMiddleware'."
    # #         )

    # #         path = request.path

    # #         header_token = request.META.get('HTTP_AUTHORIZATION', None)
            
    # #         HTTP_X_SSL_CLIENT_VERIFY = request.META.get("HTTP_X_SSL_CLIENT_VERIFY", None)
            
    # #         if header_token:
    # #             try:

    # #                 token = ""
                    
    # #                 if "Token" in header_token:
    # #                     token = sub('Token ', '', request.META.get('HTTP_AUTHORIZATION', None)).strip()
                    
    # #                 if "Bearer" in header_token:
    # #                     token = sub('Bearer ', '', request.META.get('HTTP_AUTHORIZATION', None)).strip()

    # #                 token_obj = Token.objects.get(key=token)

    # #                 request.user = token_obj.user

    # #                 if request.user.is_block:
    # #                     raise PermissionDenied("User inactive, Please contact Hound admin.")

    # #                 if not request.user.technical_user:
    # #                     raise PermissionDenied("User does not have the right permissions")

    # #                 can_access_page = self.check_page_access(request,url_prop=resolve(path))
                
    # #                 if (can_access_page == False and request.user.is_superuser == False):
    # #                     raise PermissionDenied("User does not have the right permissions")
                
    # #             except ObjectDoesNotExist:
    # #                 raise PermissionDenied("Invalid Token")

    # #             return
            
    # #         if request.user.is_authenticated:
    # #             if request.user.is_block:
    # #                 raise PermissionDenied("User inactive, Please contact Hound admin.")
                
    # #             can_access_page = self.check_page_access(request,url_prop=resolve(path))
                
    # #             if (can_access_page == False and request.user.is_superuser == False):
    # #                 # raise PermissionDenied("User does not have the right permissions")
    # #                 if request.is_ajax():
    # #                     raise PermissionDenied("User does not have the right permissions")                            
    # #                 messages.error(request, "You dont have the right permissions to view the page.")
    # #                 return redirect('/home')

    # #             return
            
    # #         resolver = resolve(path)

    # #         if resolver.view_name in IGNORE_VIEW_NAMES:
    # #             return

    # #         if request.is_ajax():
    # #             raise PermissionDenied()

    # #         views = ((name == resolver.view_name) for name in IGNORE_VIEW_NAMES)

    # #         if not any(views) and not any(url.match(path) for url in IGNORE_PATHS):
                
    # #             if HTTP_X_SSL_CLIENT_VERIFY == "SUCCESS":

    # #                 self.SSO_LOGIN(request)

    # #                 can_access_page = self.check_page_access(request,url_prop=resolve(path))
                
    # #                 if (can_access_page == False and request.user.is_superuser == False):
    # #                     raise PermissionDenied("User does not have the right permissions")             
    # #                     messages.error(request, "Something went wrong, please request OTP again")
    # #                     return redirect('/ua/login')

    # #                 return 
    # #             else:
    #                 return redirect_to_login(path)
    #         else:
    #             return redirect_to_login(path)

        except Exception as e:

            return JsonResponse({'detail': str(e)}, status=401)

class DisableOptionsPermission(permissions.BasePermission):
    """
    Global permission to disallow all requests for method OPTIONS.
    """

    def has_permission(self, request, view):
        if request.method == 'OPTIONS':
            return False
        return True

class CustomPermissionCheck(permissions.BasePermission):
    """
    Global permission check for ops_member.
    """

    def has_permission(self, request, view):
        
        if not request.user.has_perm('user_account.has_access'):
            return False
        return True

class BearerAuthentication(TokenAuthentication):
    '''
    Simple token based authentication using utvsapitoken.

    Clients should authenticate by passing the token key in the 'Authorization'
    HTTP header, prepended with the string 'Bearer '.  For example:

    Authorization: Bearer 956e252a-513c-48c5-92dd-bfddc364e812
    '''
    keyword = 'Bearer'