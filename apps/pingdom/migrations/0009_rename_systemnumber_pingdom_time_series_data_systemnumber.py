# Generated by Django 3.2.6 on 2022-05-28 13:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pingdom', '0008_pingdom_time_series_data_systemnumber'),
    ]

    operations = [
        migrations.RenameField(
            model_name='pingdom_time_series_data',
            old_name='SystemNumber',
            new_name='systemNumber',
        ),
    ]
