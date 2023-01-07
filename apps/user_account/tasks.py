from config.common_functions.app_parameter import user_group_list, location_list, team_list, page_access_list, auth_groups_list
from .models import location,team,subTeam,role, page_access
from django.contrib.auth.models import Permission, Group

def load_sub_team_data():

    for group in user_group_list:
        team_inst = team.objects.get(code=group['team'])
        subTeam.objects.update_or_create(code=group['code'], defaults={'name': group['name'], 'team':team_inst})

def load_loaction_data():

    for loc in location_list:
        
        location.objects.update_or_create(code=loc['code'], defaults={'name': loc['name']})

def load_team_data():

    for team_date in team_list:

        location_inst = location.objects.get(code=team_date['location'])
        
        team.objects.update_or_create(code=team_date['code'], defaults={'name': team_date['name'], 'location':location_inst})

def load_page_access():

    for access in page_access_list:

        permission_inst = None

        if access['access_name']:
            print(access['access_name'])
            
            permission_inst = Permission.objects.get(codename=access['access_name'])

        page_access.objects.update_or_create(url_name=access['url_name'], space_name=access['space_name'], request_method=access['request_method'], defaults={'access_name': permission_inst, 'is_allow_everyone':access['is_allow_everyone']})

def load_group():

    for auth_group in auth_groups_list:

        permissions = Permission.objects.filter(codename__in=auth_group['permissions'])

        group = Group.objects.get_or_create(name=auth_group['name'])
        
        group[0].permissions.add(*permissions)

        group[0].save()
