# Generated by Django 3.2.6 on 2022-06-23 09:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('roster', '0008_leave_request_is_approved'),
    ]

    operations = [
        migrations.AddField(
            model_name='leave_request',
            name='is_rejected',
            field=models.BooleanField(default=False, verbose_name='Is Approved'),
        ),
        migrations.AddField(
            model_name='leave_request',
            name='status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='roster.shift_status'),
        ),
    ]
