# Generated by Django 3.2.6 on 2022-09-25 15:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('system_configuration', '0015_alter_api_details_unique_id'),
    ]

    operations = [
        migrations.DeleteModel(
            name='menu',
        ),
    ]
