# Generated by Django 3.2.6 on 2022-07-22 10:10

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('roster', '0024_auto_20220721_0707'),
    ]

    operations = [
        migrations.CreateModel(
            name='shift_swap',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('swap_date', models.DateField(default=datetime.date.today, verbose_name='Swap Date')),
                ('is_approved_sm', models.BooleanField(default=False)),
                ('request_on', models.DateTimeField(default=django.utils.timezone.now)),
                ('request_approved_on', models.DateTimeField(default=None, null=True)),
                ('approver', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sr_approver_by_info', to=settings.AUTH_USER_MODEL)),
                ('requested_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='requested_by_info', to=settings.AUTH_USER_MODEL)),
                ('requested_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='requested_to_info', to=settings.AUTH_USER_MODEL)),
                ('status', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='roster.shift_status')),
                ('swap_shift', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='swap_shift_info', to='roster.shift_type')),
            ],
            options={
                'verbose_name': 'Swap Request',
                'verbose_name_plural': 'Swap Request',
            },
        ),
    ]
