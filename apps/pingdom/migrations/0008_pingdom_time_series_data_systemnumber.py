# Generated by Django 3.2.6 on 2022-05-28 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pingdom', '0007_pingdom_time_series_data_datacenter'),
    ]

    operations = [
        migrations.AddField(
            model_name='pingdom_time_series_data',
            name='SystemNumber',
            field=models.CharField(default='', max_length=18),
        ),
    ]