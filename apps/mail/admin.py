from django.contrib import admin
from apps.mail.models import release, release_notification
# Register your models here.

class release_notification_admin(admin.ModelAdmin):

    list_display = ['release', 'title', 'description', 'app_url', 'image']

admin.site.register(release_notification, release_notification_admin)
admin.site.register(release)