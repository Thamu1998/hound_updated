# Generated by Django 3.2.6 on 2022-06-26 03:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('roster', '0017_auto_20220625_1237'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='leave_request',
            name='is_approved',
        ),
        migrations.RemoveField(
            model_name='leave_request',
            name='is_rejected',
        ),
    ]
