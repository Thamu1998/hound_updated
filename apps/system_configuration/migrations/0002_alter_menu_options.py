# Generated by Django 3.2.6 on 2021-10-26 16:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('system_configuration', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='menu',
            options={'permissions': (('CUSTOM_PERMISSION_VIEW_SYSTEM', 'Custom Access to view system page'),)},
        ),
    ]
