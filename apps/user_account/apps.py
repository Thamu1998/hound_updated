from django.apps import AppConfig

#
class UserAccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.user_account'

    # def ready(self):
    #     try:
    #         from .tasks import load_loaction_data,load_team_data,load_sub_team_data, load_page_access

    #         load_loaction_data()

    #         load_team_data()

    #         load_sub_team_data()

    #         load_page_access()

    #     except Exception as e:
    #         print(str(e))
