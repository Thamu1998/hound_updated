from django.apps import AppConfig


class SpcCldConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.spc_cld'

    # def ready(self):
    #     try:
    #         from .bg import sync_data_cld
    #         from background_task.models import Task

    #         existing_tasks = Task.objects.filter(task_name="apps.spc_cld.bg.sync_data_cld")

    #         if not existing_tasks.exists():
    #             sync_data_cld(repeat=86400)

    #     except Exception as e:
    #         print(str(e))
