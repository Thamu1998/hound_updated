# Generated by Django 3.2.6 on 2022-03-09 08:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system_configuration', '0007_auto_20220309_1207'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menu',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]
