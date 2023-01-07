from django.contrib import admin
from .models import system_business_type_decs, tenant_business_type_decs, datacenter_decs, application_dr_type_collection_decs, application_ha_type_collection_decs, database_dr_type_collection_decs, database_ha_type_collection_decs
# Register your models here.

class system_business_type_decs_admin(admin.ModelAdmin):
    list_display = ['code','description']
    search_fields = ['code','description']

class tenant_business_type_decs_admin(admin.ModelAdmin):
    list_display = ['code','description']
    search_fields = ['code','description']

class datacenter_decs_admin(admin.ModelAdmin):
    list_display = ['code','infra', 'region','description', 'cmp_id', 'cmp_timing']
    search_fields = ['code']
    list_editable = ['description', 'infra', 'region', 'cmp_id', 'cmp_timing']
    list_filter = ['is_used', 'infra', 'region']

class application_dr_type_collection_decs_admin(admin.ModelAdmin):
    list_display = ['code','description']
    search_fields = ['code','description']

class application_ha_type_collection_decs_admin(admin.ModelAdmin):
    list_display = ['code','description']
    search_fields = ['code','description']

class database_dr_type_collection_decs_admin(admin.ModelAdmin):
    list_display = ['code','description']
    search_fields = ['code','description']

class database_ha_type_collection_decs_admin(admin.ModelAdmin):
    list_display = ['code','description']
    search_fields = ['code','description']  

admin.site.register(system_business_type_decs, system_business_type_decs_admin)
admin.site.register(tenant_business_type_decs, tenant_business_type_decs_admin)
admin.site.register(datacenter_decs, datacenter_decs_admin)
admin.site.register(application_dr_type_collection_decs, application_dr_type_collection_decs_admin)
admin.site.register(application_ha_type_collection_decs, application_ha_type_collection_decs_admin)
admin.site.register(database_dr_type_collection_decs, database_dr_type_collection_decs_admin)
admin.site.register(database_ha_type_collection_decs, database_ha_type_collection_decs_admin)
