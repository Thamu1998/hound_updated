from django.contrib import admin
from .models import menu_category, menu, api_details, auth_details
# Register your models here.

class menu_category_admin(admin.ModelAdmin):
    list_display = ['name','order','menu_type']
    list_editable = ['order','menu_type']

class menu_admin(admin.ModelAdmin):
    list_display = ['name','url', 'category', 'is_live', 'order']

class auth_details_admin(admin.ModelAdmin):
    list_display = ['http_address','auth_name', 'auth', 'key']
    list_filter = ['http_address']

class api_details_admin(admin.ModelAdmin):
    try:
        list_display = ['unique_id','description','auth','end_point']
        list_filter = ['auth']
        list_editable = ["auth"]
        search_fields = ['unique_id','description','end_point']
    except Exception as e:
        raise


admin.site.register(menu, menu_admin)
admin.site.register(menu_category, menu_category_admin)
admin.site.register(api_details, api_details_admin)
admin.site.register(auth_details, auth_details_admin)
