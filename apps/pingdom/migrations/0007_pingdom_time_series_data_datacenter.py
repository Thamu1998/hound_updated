# Generated by Django 3.2.6 on 2022-05-28 10:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pingdom', '0006_auto_20220527_2005'),
    ]

    operations = [
        migrations.AddField(
            model_name='pingdom_time_series_data',
            name='DataCenter',
            field=models.CharField(default='', max_length=50),
        ),
    ]
