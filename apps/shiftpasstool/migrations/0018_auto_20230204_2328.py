# Generated by Django 3.2.6 on 2023-02-04 17:58

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shiftpasstool', '0017_auto_20230204_2327'),
    ]

    operations = [
        migrations.AlterField(
            model_name='master_tickets',
            name='date',
            field=models.DateField(default=datetime.datetime(2023, 2, 4, 23, 28, 8, 447311)),
        ),
        migrations.AlterField(
            model_name='outage_master_tickets',
            name='date',
            field=models.DateField(default=datetime.datetime(2023, 2, 4, 23, 28, 8, 447311)),
        ),
        migrations.AlterField(
            model_name='tracking_history',
            name='date',
            field=models.DateField(default=datetime.datetime(2023, 2, 4, 23, 28, 8, 447311)),
        ),
    ]