from django.core.management.base import BaseCommand
from django.http import request
from apps.system_configuration.task import create_url_db, load_api_details
from apps.spc_cld.bg import sync_data_cld, pingdom_data_sync, uptime_data_sync, sync_data_notification_daily
from background_task.models import Task


def schedule_jobs():
    try:
        
        existing_tasks = Task.objects.filter(task_name__icontains="sync_data_cld")

        if not existing_tasks.exists():
            sync_data_cld(repeat=86400)
            sync_data_notification_daily(repeat=86400)
        
        Task.objects.filter(task_name__icontains="pingdom_data_sync").delete()
        pingdom_data_sync(repeat=60)

        Task.objects.filter(task_name__icontains="uptime_data_sync").delete()
        uptime_data_sync(repeat=60)

        print("schedule jobs completed")
    except Exception as e:
       print(str(e))

def schedule_notification_sync():

    try:
        sync_data_notification_daily()
    except Exception as e:
        print(str(e))

class Command(BaseCommand):
    help = 'schedule jobs'

    def add_arguments(self, parser):
        parser.add_argument('-r', '--run', action='store_true', help='schedule jobs')
        parser.add_argument('-n', '--notification', action='store_true', help='schedule notification jobs')


    def handle(self, *args, **kwargs):
        RunTM = kwargs['run']
        notiTM = kwargs['notification']

        if RunTM:
            schedule_jobs()
        elif notiTM:
            schedule_notification_sync()
        else:
            print("\nPlease select any of the below options:\n-n  --notification - schedule notification jobs\n")
    
    