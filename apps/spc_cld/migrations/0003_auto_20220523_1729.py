# Generated by Django 3.2.6 on 2022-05-23 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spc_cld', '0002_alter_system_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='datacenter_decs',
            name='cmp_id',
            field=models.CharField(default='', max_length=64),
        ),
        migrations.AddField(
            model_name='datacenter_decs',
            name='cmp_timing',
            field=models.CharField(default='', max_length=250),
        ),
    ]