from django.db import models
import datetime
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.utils.timezone import now

choice_planned_type = [
    ('S4H', 'S4H'),
    ('IBP', 'IBP'),
    ('BYD', 'BYD'),
    ('C4C', 'C4C')
]

choice_region = [
    ('EMEA', 'EMEA'),
    ('APJ', 'APJ'),
    ('AMER', 'AMER'),
    ('MENA', 'MENA'),
    ('OTHERS', 'OTHERS')
]

choice_status = [
    ('Inprogress', 'Inprogress'),
    ('Waiting', 'Waiting'),
    ('New', 'New'),
    ('Resolved', 'Resolved'),
]
# Create your models here.

# SPC ticket


class tracking_history(models.Model):
    Ticket_ID = models.CharField(max_length=10)
    Subject = models.TextField(null=True)
    Action_Taken = models.TextField(null=True)
    Action_Required = models.TextField(blank=True, null=True)
    Status = models.CharField(max_length=20)
    created_date = models.DateTimeField()
    date = models.DateField(auto_now_add=True)
    shift = models.CharField(max_length=100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)
    timerange = models.TimeField(blank=True, null=True)


class master_tickets(models.Model):
    Ticket_ID = models.CharField(max_length=10)
    Subject = models.TextField(null=True)
    Action_Taken = models.TextField(null=True)
    Action_Required = models.TextField(null=True)
    Status = models.CharField(max_length=20)
    created_date = models.DateTimeField()
    date = models.DateField(auto_now_add=True)
    shift = models.CharField(max_length=20)


# outage
class outage_tracking_history(models.Model):
    Ticket_ID = models.CharField(max_length=10)
    Subject = models.TextField(null=True)
    customer_impact = models.TextField(blank=True, null=True)
    Action_Required = models.TextField(blank=True, null=True)
    Status = models.CharField(max_length=20)
    created_date = models.DateTimeField()
    date = models.DateField(auto_now_add=True)
    shift = models.CharField(max_length=20)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)
    timerange = models.TimeField(blank=True, null=True)


class outage_master_tickets(models.Model):
    Ticket_ID = models.CharField(max_length=10)
    Subject = models.TextField(null=True)
    customer_impact = models.TextField(null=True)
    Action_Required = models.TextField(null=True)
    Status = models.CharField(max_length=20)
    created_date = models.DateTimeField()
    date = models.DateField(auto_now_add=True)
    shift = models.CharField(max_length=20)


# cmd
class tickets_notes(models.Model):
    shift = models.CharField(max_length=20)
    date = models.DateTimeField()
    notes = models.TextField(null=True)


class tickets_count_table(models.Model):
    shift = models.CharField(max_length=20)
    date = models.DateTimeField()
    alerts = models.CharField(max_length=50)
    manual_incidents = models.CharField(max_length=50)
    problems = models.CharField(max_length=50)
    service_request = models.CharField(max_length=50)


class ActivityDB(models.Model):
    planned_type = models.CharField(
        max_length=20, choices=choice_planned_type, null=False, blank=False, default='S4H')
    region = models.CharField(
        max_length=20, choices=choice_region, null=False, blank=False, default='EMEA')
    planned_start_date = models.DateTimeField()
    planned_end_date = models.DateTimeField(null=True, blank=True)
    ticket_id = models.CharField(max_length=100, null=True)
    subject = models.TextField(null=True)
    pre_check_status = models.CharField(
        max_length=250, default='New', blank=False)
    pre_check_status_text = models.TextField()
    comments = models.TextField(null=True)
    cr_id = models.CharField(max_length=250, null=True)
    cr_approval = models.CharField(
        max_length=250, null=True, choices=choice_status, default='New', blank=False)
    resource = models.TextField(null=True)
    shift = models.CharField(max_length=250, null=True)
    floatingCmpDate = models.TextField(null=True)
    timerange = models.TimeField(blank=True, null=True)
    assigned = models.CharField(max_length=250, null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)

    # def __str__(self):
    #     return self.planned_type


class sm_infra_activate(models.Model):
    planned_start_date = models.DateTimeField()
    planned_end_date = models.DateTimeField(null=True, blank=True)
    subject = models.TextField(null=True)
    pre_check_status = models.CharField(
        max_length=250, choices=choice_status, default='New', blank=False)
    ticket_id = models.CharField(max_length=250, null=True)
    shift = models.CharField(max_length=250, null=True)
    floatingImplementation = models.TextField(null=True)
    timerange = models.TimeField(blank=True, null=True)
    assigned = models.CharField(max_length=250, null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)
