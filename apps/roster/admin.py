from django.contrib import admin
from .models import shift_type, shift_status, shift_preferance, shift_temp, shift, Holiday, shift_comment, planned_leave_calander, task_plan, change_request, change_request_comment, status_change_request, status_change_request_comment, swap_request, swap_request_comment

class shift_type_admin(admin.ModelAdmin):
    list_display = ['code', 'name', 'color', 'text_color', 'ordering', 'time_info', 'is_leave','location']
    list_editable = ['color', 'text_color', 'ordering', 'time_info', 'location']

class shift_status_admin(admin.ModelAdmin):
    list_display = ['code', 'name']

# Register your models here.
class shift_preferance_admin(admin.ModelAdmin):
    list_display = ['member', 'shift', 'shift_off']
    list_filter = ['shift', 'shift_off']

    def get_form(self, request, obj=None, **kwargs):
        form = super(shift_preferance_admin, self).get_form(request, obj, **kwargs)
        form.base_fields['shift_off'].required = False
        return form

class shift_temp_admin(admin.ModelAdmin):
    list_display = ['sdate', 'member', 'shift', 'is_shift_locked']
    list_filter = ['shift','sdate', 'member']

class shift_admin(admin.ModelAdmin):
    list_display = ['sdate', 'member', 'shift', 'is_shift_locked']
    list_filter = ['shift','sdate', 'member']

class task_plan_admin(admin.ModelAdmin):
    list_display = ['sdate', 'member', 'task']
    list_filter = ['task','sdate', 'member']

class Holiday_admin(admin.ModelAdmin):
    list_display = ['name', 'date', 'img','location']
    list_filter = ['location']

class shift_comment_admin(admin.ModelAdmin):
    list_display = ['comment_month', 'comment', 'member']

class planned_leave_calander_admin(admin.ModelAdmin):
    list_display = ['sdate', 'member']

class change_request_admin(admin.ModelAdmin):
    list_display = ['sdate', 'member', 'change_to', 'status']

class change_request_comment_admin(admin.ModelAdmin):
    list_display = ['comment_for', 'comment_by', 'comment', 'is_seen', 'comment_on']

class status_change_request_admin(admin.ModelAdmin):
    list_display = ['sdate', 'member', 'shift_status_to', 'status']

class status_change_request_comment_admin(admin.ModelAdmin):
    list_display = ['comment_for', 'comment_by', 'comment', 'is_seen', 'comment_on']

class shift_swap_admin(admin.ModelAdmin):
    list_display = ['swap_date_from', 'swap_shift_from', 'swap_date_to', 'swap_shift_to', 'requested_from', 'requested_to', 'approver', 'request_on', 'request_approved_on']

class swap_request_comment_admin(admin.ModelAdmin):
    list_display = ['comment_for', 'comment_by', 'comment', 'is_seen', 'comment_on']

admin.site.register(shift_preferance, shift_preferance_admin)
admin.site.register(shift_type, shift_type_admin)
admin.site.register(shift_status, shift_status_admin)
admin.site.register(shift_temp, shift_temp_admin)
admin.site.register(shift, shift_admin)
admin.site.register(Holiday, Holiday_admin)
admin.site.register(shift_comment, shift_comment_admin)
admin.site.register(planned_leave_calander, planned_leave_calander_admin)
admin.site.register(task_plan, task_plan_admin)
admin.site.register(change_request, change_request_admin)
admin.site.register(change_request_comment, change_request_comment_admin)
admin.site.register(status_change_request, status_change_request_admin)
admin.site.register(status_change_request_comment, status_change_request_comment_admin)
admin.site.register(swap_request_comment, swap_request_comment_admin)
admin.site.register(swap_request, shift_swap_admin )