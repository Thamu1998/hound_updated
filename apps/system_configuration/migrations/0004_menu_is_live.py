# Generated by Django 3.2.6 on 2021-10-26 19:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system_configuration', '0003_menu_access_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='menu',
            name='is_live',
            field=models.BooleanField(default=False),
        ),
    ]
