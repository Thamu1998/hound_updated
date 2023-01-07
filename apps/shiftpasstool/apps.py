from timeit import repeat
from django.apps import AppConfig


class ShiftpasstoolConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.shiftpasstool'
    # def ready(self):
    #         try:
    #             from .views import trigger_tracking_outage,trigger_tracking
    #             from background_task.models import Task

    #             # Task.objects.filter(task_name="apps.shiftpasstool.views.trigger_tracking_outage").delete()
    #             # RunSyncData(repeat=86400,schedule=date.replace(hour=2, minute=10))
    #             # date = datetime.datetime(year=2022, month=10, day=30, hour=8, minute=28800)
    #             # #pass the date to schedule parameter
    #             # schedule_email_notification(schedule=date, repeat=Task.DAILY)
    #             trigger_tracking_outage(repeat=10)            

    #         except Exception as e:
    #             print(str(e))
    def ready(self):
            try:
                from .views import trigger_tracking_outage
                from background_task.models import Task

                # Task.objects.filter(task_name="apps.shiftpasstool.views.trigger_tracking_outage").delete()
                # RunSyncData(repeat=86400,schedule=date.replace(hour=2, minute=10))
                # date = datetime.datetime(year=2022, month=10, day=30, hour=8, minute=28800)
                # #pass the date to schedule parameter
                # schedule_email_notification(schedule=date, repeat=Task.DAILY)
                trigger_tracking_outage(repeat=10) 

            except Exception as e:
                print(str(e))
