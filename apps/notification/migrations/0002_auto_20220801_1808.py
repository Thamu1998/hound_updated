# Generated by Django 3.2.6 on 2022-08-01 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification_events',
            name='CustomerName',
            field=models.CharField(default='', max_length=350),
        ),
        migrations.AddField(
            model_name='notification_events',
            name='SystemNumber',
            field=models.CharField(default='', max_length=18),
        ),
    ]
