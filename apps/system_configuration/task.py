from config.common_functions.app_parameter import menu_url, default_api_urls
from apps.system_configuration.models import menu, menu_category, api_details
from django.contrib.auth.models import Group

def create_url_db(*args, **kwargs):

    for details in menu_url:
        
        menu_category_detail = menu_category.objects.update_or_create(name=details['name'], defaults={
                                    'icon': details['icon'],
                                    'order': details['order'],
                                    'menu_type': details['menu_type']
                                })
        
        for url in details['url_list']:

            menu_inst = menu.objects.update_or_create(name=url['name'], defaults={
                            'url': url['url'],
                            'is_live': url['is_live'],
                            'category': menu_category_detail[0],
                            'order': url['order']
                        })
            accessGroup = url['access_group']

            accessGroup = Group.objects.filter(name__in=accessGroup)
            
            menu_inst[0].access_group.set(accessGroup)

def load_api_details(*args, **kwargs):

    for details in default_api_urls:

        api_details.objects.update_or_create(unique_id=details['unique_id'], defaults={
            'end_point': details['end_point'],
            'description': details['description']
        })
