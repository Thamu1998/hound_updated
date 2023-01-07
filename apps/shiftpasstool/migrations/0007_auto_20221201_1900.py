# Generated by Django 3.2.6 on 2022-12-01 13:30

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shiftpasstool', '0006_auto_20221126_1227'),
    ]

    operations = [
        migrations.AddField(
            model_name='sm_infra_activate',
            name='floatingImplementation',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='master_tickets',
            name='date',
            field=models.DateField(default=datetime.datetime(2022, 12, 1, 19, 0, 7, 634607)),
        ),
        migrations.AlterField(
            model_name='outage_master_tickets',
            name='date',
            field=models.DateField(default=datetime.datetime(2022, 12, 1, 19, 0, 7, 634607)),
        ),
        migrations.AlterField(
            model_name='outage_tracking_history',
            name='date',
            field=models.DateField(default=datetime.date(2022, 12, 1)),
        ),
        migrations.AlterField(
            model_name='tracking_history',
            name='date',
            field=models.DateField(default=datetime.datetime(2022, 12, 1, 19, 0, 7, 634607)),
        ),
    ]
