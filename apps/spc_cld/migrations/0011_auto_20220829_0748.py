# Generated by Django 3.2.6 on 2022-08-29 07:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('spc_cld', '0010_auto_20220824_1043'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='system',
            name='AllocationLimit',
        ),
        migrations.RemoveField(
            model_name='system',
            name='EligibleDBSize',
        ),
        migrations.RemoveField(
            model_name='system',
            name='HostDBSize',
        ),
    ]
