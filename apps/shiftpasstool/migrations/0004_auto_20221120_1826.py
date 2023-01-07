# Generated by Django 3.2.6 on 2022-11-20 12:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shiftpasstool', '0003_auto_20221120_1620'),
    ]

    operations = [
        migrations.AddField(
            model_name='activitydb',
            name='shift',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='activitydb',
            name='cr_approval',
            field=models.CharField(choices=[('Inprogress', 'Inprogress'), ('Waiting', 'Waiting'), ('New', 'New'), ('Completed', 'Completed')], default='New', max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='activitydb',
            name='pre_check_status',
            field=models.CharField(choices=[('Inprogress', 'Inprogress'), ('Waiting', 'Waiting'), ('New', 'New'), ('Completed', 'Completed')], default='New', max_length=250),
        ),
        migrations.AlterField(
            model_name='master_tickets',
            name='date',
            field=models.DateField(default=datetime.datetime(2022, 11, 20, 18, 26, 15, 68520)),
        ),
        migrations.AlterField(
            model_name='outage_master_tickets',
            name='date',
            field=models.DateField(default=datetime.datetime(2022, 11, 20, 18, 26, 15, 68520)),
        ),
        migrations.AlterField(
            model_name='tracking_history',
            name='date',
            field=models.DateField(default=datetime.datetime(2022, 11, 20, 18, 26, 15, 68520)),
        ),
    ]
