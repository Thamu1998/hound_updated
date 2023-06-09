# Generated by Django 3.2.6 on 2022-07-13 07:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('spc_cld', '0003_auto_20220523_1729'),
    ]

    operations = [
        migrations.AddField(
            model_name='host',
            name='updated_on',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='system',
            name='updated_on',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='tenant',
            name='updated_on',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now),
        ),
    ]
