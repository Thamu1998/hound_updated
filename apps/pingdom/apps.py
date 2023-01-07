from django.apps import AppConfig


class PingdomConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.pingdom'

    # def ready(self):
    #     try:
    #         from .bg import pingdom_sync
    #         from background_task.models import Task

    #         Task.objects.filter(task_name="apps.pingdom.bg.pingdom_sync").delete()

    #         pingdom_sync(repeat=60)            

    #     except Exception as e:
    #         print(str(e))
