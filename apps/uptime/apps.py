from django.apps import AppConfig


class UptimeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.uptime'

    # def ready(self):
    #     try:
    #         from .bg import uptime_sync
    #         from background_task.models import Task

    #         Task.objects.filter(task_name="apps.uptime.bg.uptime_sync").delete()

    #         uptime_sync(repeat=60)

    #     except Exception as e:
    #         print(str(e))
