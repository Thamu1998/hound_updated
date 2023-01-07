from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import User,location,team, subTeam, role, sub_team_owner, page_access, change_work_group_request
from django.utils.translation import gettext, gettext_lazy as _
from django.contrib.auth.models import Permission

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = UserAdmin.list_display + ('is_active', 'cam', 'is_block','team', 'sub_team', 'role')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'team', 'sub_team', 'role', 'technical_user', 'cam')
    list_editable = ('team', 'sub_team')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    fieldsets = (
                    (None, {'fields': ('username', 'password')}),
                    (_('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'dob')}),
                    (_('Team info'), {'classes': ('wide',),'fields': ('team', 'sub_team', 'role')}),
                    (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'technical_user', 'cam', 'is_block','groups', 'user_permissions')}),
                    (_('Important dates'), {'fields': ('last_login', 'date_joined', 'deactivated_on')}),
                )
    
    def get_form(self, request, obj=None, **kwargs):
        form = super(CustomUserAdmin, self).get_form(request, obj, **kwargs)
        if not "/admin/user_account/user/add/" in request.get_full_path():
            form.base_fields['team'].required = False
            form.base_fields['sub_team'].required = False
            form.base_fields['role'].required = False
        return form

class locationAdmin(admin.ModelAdmin):
    list_display = ['code','name']

class teamAdmin(admin.ModelAdmin):
    list_display = ['code','name','location']
    list_filter = ['location']

class subteamAdmin(admin.ModelAdmin):
    list_display = ['code','name','team']
    list_filter = ['team']

class rolesAdmin(admin.ModelAdmin):
    list_display = ['code','name','team','isInShiftPlan']
    list_filter = ['team', 'isInShiftPlan']

class sub_team_owner_admin(admin.ModelAdmin):
    list_display = ['sub_team']
    list_filter = ['sub_team']

class page_access_admin(admin.ModelAdmin):
    list_display = ['url_name', 'request_method', 'space_name', 'access_name']
    list_filter = ['url_name', 'space_name']

    def get_form(self, request, obj=None, **kwargs):
        form = super(page_access_admin, self).get_form(request, obj, **kwargs)
        # if not "/admin/user_account/page_access/add/" in request.get_full_path():
        form.base_fields['space_name'].required = False
        return form

class Permission_admin(admin.ModelAdmin):
    list_display = ['codename']
    list_filter = ['content_type__app_label']
    search_fields = ('codename',)

class change_work_group_request_admin(admin.ModelAdmin):
    list_display = ['user', 'source', 'target', 'status', 'approver', 'request_on', 'request_approved_on']

admin.site.register(User, CustomUserAdmin)
admin.site.register(location, locationAdmin)
admin.site.register(team, teamAdmin)
admin.site.register(subTeam, subteamAdmin)
admin.site.register(role, rolesAdmin)
admin.site.register(sub_team_owner, sub_team_owner_admin)
admin.site.register(page_access, page_access_admin)
admin.site.register(Permission, Permission_admin)
admin.site.register(change_work_group_request, change_work_group_request_admin )
