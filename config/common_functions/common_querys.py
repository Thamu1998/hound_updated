from apps.spc_cld.models import system
from django.db.models import Q 

def get_all_system_role():

    system_role_list = system.objects.exclude(SystemRole__icontains="_SC").values_list('SystemRole', flat=True).distinct("SystemRole").order_by("SystemRole")
    
    return system_role_list

def get_database_system_role():

    system_role_list = system.objects.exclude(SystemRole__icontains="_SC").filter(SystemRole__icontains="_HANA").values_list('SystemRole', flat=True).distinct("SystemRole").order_by("SystemRole")

    return system_role_list
1
def get_application_system_role():

    system_role_list = system.objects.exclude(Q(SystemRole__icontains="_SC")|Q(SystemRole__icontains="_HANA")).values_list('SystemRole', flat=True).distinct("SystemRole").order_by("SystemRole")

    return system_role_list

