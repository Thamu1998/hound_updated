from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(tracking_history)
admin.site.register(master_tickets)
admin.site.register(outage_tracking_history)
admin.site.register(outage_master_tickets)
admin.site.register(tickets_notes)
admin.site.register(tickets_count_table)
admin.site.register(ActivityDB)
admin.site.register(sm_infra_activate)
