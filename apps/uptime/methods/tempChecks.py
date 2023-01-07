from apps.uptime.models import *
from apps.system_configuration.models import api_details
from config.common_functions.pull_request import get_data_uptime, post_data_uptime, delete_data_uptime
import requests
import json
import datetime
from config.settings.base import Team

class update_temp_check(object):

    def __init__(self):
        super(update_temp_check, self).__init__()
        self.status = {'OK': 'up', 'FAILED':'down', 'FAILED_NO_RESPONSE': 'down', 'OFF':'paused'}
        self.cookies = '; '.join([cookie.cookie_name+'='+cookie.cookie_value for cookie in uptime_cookies.objects.all()])

    def create_check(self, **kwargs):

        if Team == "S4":
            subscriptions = {
                                "20432572": {
                                "userId": 20432572,
                                "isOwner": True,
                                "sendAlerts": True,
                                "alertOnUnknown": False,
                                "alertHysteresis": 3,
                                "emaAlpha": 0.1,
                                "emaAlertOn": 0,
                                "emaAlertOff": 0,
                                "slo": 0.9990000000000001
                                }
                            }
        else:
            subscriptions = {
                                "20425159": {
                                    "userId": 20425159,
                                    "isOwner": True,
                                    "sendAlerts": True,
                                    "alertOnUnknown": True,
                                    "alertHysteresis": 1,
                                    "emaAlpha": 0.1,
                                    "emaAlertOn": 0.0,
                                    "emaAlertOff": 0.0,
                                    "slo": 0.999
                                },
                                "20400200": {
                                    "userId": 20400200,
                                    "isOwner": True,
                                    "sendAlerts": True,
                                    "alertOnUnknown": True,
                                    "alertHysteresis": 1,
                                    "emaAlpha": 0.1,
                                    "emaAlertOn": 0.0,
                                    "emaAlertOff": 0.0,
                                    "slo": 0.999
                                },
                                "20430082": {
                                    "userId": 20430082,
                                    "isOwner": False,
                                    "sendAlerts": True,
                                    "alertOnUnknown": False,
                                    "alertHysteresis": 3,
                                    "emaAlpha": 0.1,
                                    "emaAlertOn": 0.0,
                                    "emaAlertOff": 0.0,
                                    "slo": 0.999
                                }
                            }
        
        DC = kwargs['DC']

        system_number = kwargs["system_number"]

        SID = kwargs["SID"]

        url = kwargs['url']

        product_name = kwargs['product_name']

        exp_date = kwargs["exp_date"]
        
        check_name = f"NPROD|{DC}|{system_number}|{product_name}|{SID}|TMP"
        
        payload = json.dumps({
                                "id": 0,
                                "name": check_name,
                                "description": "",
                                "enabled": True,
                                "type": "HTTPGET",
                                "shared": True,
                                "interval": 1,
                                "timeout": 30000,
                                "ioTimeout": 0,
                                "url": f"https://{url}/ui?saml2=disabled",
                                "proxy": "AUTO",
                                "region": "",
                                "insecureSSL": False,
                                "authenticationType": "AUTO",
                                "username": "",
                                "password": "",
                                "assertionType": "NONE",
                                "assertionValue": "",
                                "assertionValue2": "",
                                "subscriptions": subscriptions,
                                "oauthTokenEndpoint": "",
                                "oauthScope": "",
                                "oauthClientId": "",
                                "oauthClientSecret": ""
                            })
        
        uptime_api_detail = api_details.objects.get(unique_id='UPTIME_API') # Get API details

        response = post_data_uptime(url=uptime_api_detail.end_point, payload=payload, auth=uptime_api_detail.auth.auth, cookies=self.cookies) # POST status from Uptime API
        
        checkid = response.headers['location'].split('/')[-1]

        tempMonitor.objects.update_or_create(checkID=checkid, defaults={'SID':SID, 'isDelete': True, 'ExpryDate': exp_date})

        return checkid

    def delete_check(self, *args, **kwargs):

        check_id = kwargs['check_id']

        uptime_api_detail = api_details.objects.get(unique_id='UPTIME_API') # Get API details

        url = "https://uptime.sapcloud.io/b/api/monitorservice/monitors/"+check_id

        payload={}

        response = delete_data_uptime(url=url, payload=payload, auth=uptime_api_detail.auth.auth, cookies=self.cookies) # Delete status from Uptime API

        return response.status_code

    def check_if_exist(self, *args, **kwargs):

        payload={}

        SID = kwargs["SID"]
        
        uptime_api_detail = api_details.objects.get(unique_id='UPTIME_API') # Get API details

        response = get_data_uptime(url=uptime_api_detail.end_point, auth=uptime_api_detail.auth.auth, cookies=self.cookies) # Get status from Uptime API
        
        data = json.loads(response.text)
        
        for check in data:
            
            if SID in check['monitor']['name']:
                return True, check['monitor']["id"]

        return False, False

    def update_tempcheck(self, *args, **kwargs):

        SID = kwargs["SID"]

        checkid = kwargs["checkid"]

        exp_date = kwargs["exp_date"]

        tempMonitor.objects.update_or_create(checkID=checkid, defaults={'SID':SID, 'isDelete': False, 'ExpryDate': exp_date})





