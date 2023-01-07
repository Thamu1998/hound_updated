# Generated by Django 3.2.6 on 2022-09-09 14:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('user_account', '0052_alter_page_access_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='change_work_group_request',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(blank=True, choices=[('WAITING', 'WAITING'), ('APPROVED', 'APPROVED'), ('REJECTED', 'REJECTED')], default='WAITING', max_length=70, null=True)),
                ('request_on', models.DateTimeField(default=django.utils.timezone.now)),
                ('request_approved_on', models.DateTimeField(default=None, null=True)),
                ('approver', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='wg_approver', to=settings.AUTH_USER_MODEL)),
                ('current', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='current_subteam_info', to='user_account.subteam')),
                ('target', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='target_subteam_info', to='user_account.subteam')),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='transfer_wg_ref', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]