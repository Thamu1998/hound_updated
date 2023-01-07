import requests
import pandas as pd
from apps.uptime.models import uptime_cookies
from django.conf import settings

def get_data_spc(*args, **kwargs):
    
    if settings.USE_CERT:        
        
        response = requests.request("GET", kwargs['url'],  cert=kwargs["auth"])  # USE CERTIFICATE TO LOGIN TO SPC API
    
    else:

        headers = {'Authorization': f'Basic {kwargs["auth"]}'}

        response = requests.request("GET", kwargs['url'], headers=headers) # USE BASIC AUTH TO LOGIN TO SPC API

    return response

def get_data_pingdom(*args, **kwargs):
    
    headers = {'Authorization': f'Bearer {kwargs["auth"]}'}

    response = requests.request("GET", kwargs['url'], headers=headers) # USE BEARER AUTH TO LOGIN TO PINGDOM API

    return response

def get_data_uptime(*args, **kwargs):
    
    payload={}

    headers = {'Authorization': f'Basic {kwargs["auth"]}','Cookie': f'{kwargs["cookies"]}'}
    
    response = requests.request("GET", kwargs['url'], headers=headers, data=payload)
    
    for cookies in response.cookies:
        uptime_cookies.objects.update_or_create(cookie_name=cookies.name, defaults={'cookie_value':cookies.value})

    return response

def post_data_uptime(*args, **kwargs):

    payload=kwargs['payload']

    headers = {'Authorization': f'Basic {kwargs["auth"]}', 'Cookie': f'{kwargs["cookies"]}', 'Content-Type': 'application/json'}
    
    response = requests.request("POST", "https://uptime.sapcloud.io/b/api/monitorservice/monitors", headers=headers, data=payload)
    
    for cookies in response.cookies:
        uptime_cookies.objects.update_or_create(cookie_name=cookies.name, defaults={'cookie_value':cookies.value})

    return response

def delete_data_uptime(*args, **kwargs):
    
    payload={}

    headers = {'Authorization': f'Basic {kwargs["auth"]}','Cookie': f'{kwargs["cookies"]}'}
    
    response = requests.request("DELETE", kwargs['url'], headers=headers, data=payload)
    
    for cookies in response.cookies:
        uptime_cookies.objects.update_or_create(cookie_name=cookies.name, defaults={'cookie_value':cookies.value})

    return response

def put_data_pingdom(*args, **kwargs):
    
    headers = {'Authorization': f'Bearer {kwargs["auth"]}', 'Content-Type': 'application/x-www-form-urlencoded'} # USE BEARER AUTH TO LOGIN TO PINGDOM API

    response = requests.request("PUT", kwargs['url'], headers=headers, data=kwargs['payload']) 

    return response

def pull_cloud_reporting_data(*args, **kwargs):

    cert = (kwargs['cert'], kwargs['key'])

    request = requests.get(url=kwargs['url'], cert=cert).content 

    df = pd.read_excel(request)
    
    return df

