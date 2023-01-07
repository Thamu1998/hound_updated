from django.core.management.base import BaseCommand
from django.http import request
from apps.system_configuration.task import create_url_db, load_api_details
from apps.user_account.tasks import load_loaction_data,load_team_data,load_sub_team_data, load_page_access, load_group


def LoadData():
    try:
        create_url_db()
        load_api_details()
        load_loaction_data()
        load_team_data()
        load_sub_team_data()
        load_page_access()
        load_group()
        print("Data load completed")
    except Exception as e:
       print(str(e))

class Command(BaseCommand):
    help = 'Load master data'

    def add_arguments(self, parser):
        parser.add_argument('-r', '--run', action='store_true', help='Load master data')


    def handle(self, *args, **kwargs):
        RunTM = kwargs['run']

        if RunTM:
            LoadData()
        else:
            print("\nPlease select any of the below options:\n-r  --run - Load master data\n")
    
    