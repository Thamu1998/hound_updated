# Generated by Django 3.2.6 on 2023-02-02 14:39

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityDB',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('planned_type', models.CharField(choices=[('S4H', 'S4H'), ('IBP', 'IBP'), ('BYD/C4C', 'BYD/C4C')], default='S4H', max_length=20)),
                ('region', models.CharField(choices=[('EMEA', 'EMEA'), ('APJ', 'APJ'), ('AMER', 'AMER'), ('MENA', 'MENA'), ('OTHERS', 'OTHERS')], default='EMEA', max_length=20)),
                ('planned_start_date', models.DateTimeField()),
                ('planned_end_date', models.DateTimeField(blank=True, null=True)),
                ('ticket_id', models.CharField(max_length=100, null=True)),
                ('subject', models.TextField(null=True)),
                ('pre_check_status', models.CharField(default='New', max_length=250)),
                ('pre_check_status_text', models.TextField()),
                ('comments', models.TextField(null=True)),
                ('cr_id', models.CharField(max_length=250, null=True)),
                ('cr_approval', models.CharField(choices=[('Inprogress', 'Inprogress'), ('Waiting', 'Waiting'), ('New', 'New'), ('Resolved', 'Resolved')], default='New', max_length=250, null=True)),
                ('resource', models.TextField(null=True)),
                ('shift', models.CharField(max_length=250, null=True)),
                ('floatingCmpDate', models.TextField(null=True)),
                ('timerange', models.TimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='master_tickets',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Ticket_ID', models.CharField(max_length=10)),
                ('Subject', models.TextField(null=True)),
                ('Action_Taken', models.TextField(null=True)),
                ('Action_Required', models.TextField(null=True)),
                ('Status', models.CharField(max_length=20)),
                ('created_date', models.DateTimeField()),
                ('date', models.DateField(default=datetime.datetime(2023, 2, 2, 20, 9, 47, 885216))),
                ('shift', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='outage_master_tickets',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Ticket_ID', models.CharField(max_length=10)),
                ('Subject', models.TextField(null=True)),
                ('customer_impact', models.TextField(null=True)),
                ('Action_Required', models.TextField(null=True)),
                ('Status', models.CharField(max_length=20)),
                ('created_date', models.DateTimeField()),
                ('date', models.DateField(default=datetime.datetime(2023, 2, 2, 20, 9, 47, 887215))),
                ('shift', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='outage_tracking_history',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Ticket_ID', models.CharField(max_length=10)),
                ('Subject', models.TextField(null=True)),
                ('customer_impact', models.TextField()),
                ('Action_Required', models.TextField()),
                ('Status', models.CharField(max_length=20)),
                ('created_date', models.DateTimeField()),
                ('date', models.DateField(default=datetime.date(2023, 2, 2))),
                ('shift', models.CharField(max_length=20)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('timerange', models.TimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='sm_infra_activate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('planned_start_date', models.DateTimeField()),
                ('planned_end_date', models.DateTimeField(blank=True, null=True)),
                ('subject', models.TextField(null=True)),
                ('pre_check_status', models.CharField(choices=[('Inprogress', 'Inprogress'), ('Waiting', 'Waiting'), ('New', 'New'), ('Resolved', 'Resolved')], default='New', max_length=250)),
                ('ticket_id', models.CharField(max_length=250, null=True)),
                ('shift', models.CharField(max_length=250, null=True)),
                ('floatingImplementation', models.TextField(null=True)),
                ('timerange', models.TimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='tickets_count_table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shift', models.CharField(max_length=20)),
                ('date', models.DateTimeField()),
                ('alerts', models.CharField(max_length=50)),
                ('manual_incidents', models.CharField(max_length=50)),
                ('problems', models.CharField(max_length=50)),
                ('service_request', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='tickets_notes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('shift', models.CharField(max_length=20)),
                ('date', models.DateTimeField()),
                ('notes', models.TextField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='tracking_history',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Ticket_ID', models.CharField(max_length=10)),
                ('Subject', models.TextField(null=True)),
                ('Action_Taken', models.TextField(null=True)),
                ('Action_Required', models.TextField()),
                ('Status', models.CharField(max_length=20)),
                ('created_date', models.DateTimeField()),
                ('date', models.DateField(default=datetime.datetime(2023, 2, 2, 20, 9, 47, 884213))),
                ('shift', models.CharField(max_length=100)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('timerange', models.TimeField(blank=True, null=True)),
            ],
        ),
    ]
