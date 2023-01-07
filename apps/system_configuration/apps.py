from django.apps import AppConfig


class SystemConfigurationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.system_configuration'

    # def ready(self):

    #     from .task import create_url_db, load_api_details

    #     create_url_db()

    #     load_api_details()
