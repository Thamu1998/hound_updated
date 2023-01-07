# Generated by Django 3.2.6 on 2022-05-27 18:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pingdom', '0004_rename_created_on_comment_table_updated_on'),
    ]

    operations = [
        migrations.CreateModel(
            name='pingdom_time_series_data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('SID', models.CharField(default='', max_length=3)),
                ('FromTime', models.DateTimeField(blank=True, default=None)),
                ('ToTime', models.DateTimeField(blank=True, null=True)),
                ('Status', models.CharField(default='', max_length=30)),
                ('Duration', models.CharField(default='', max_length=80)),
                ('durationInMin', models.BigIntegerField(default=0)),
                ('errorStartTime', models.DateTimeField(blank=True, default=django.utils.timezone.now)),
                ('acknowledgedAt', models.DateTimeField(null=True)),
                ('IsAcknowledged', models.BooleanField(default=True)),
                ('Product_Area', models.CharField(default='S4_PC', max_length=30)),
                ('acknowledgedWithin', models.BigIntegerField(default=0)),
                ('acknowledgedBy', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
