# Generated by Django 3.2.6 on 2022-05-19 10:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('spc_cld', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='availability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ObjectID', models.CharField(default='', max_length=255)),
                ('AvailabilityInPercentage', models.FloatField(blank=True, null=True)),
                ('EndDateTime', models.DateTimeField(null=True)),
                ('StartDateTime', models.DateTimeField(null=True)),
                ('SystemNumber', models.CharField(default='', max_length=20)),
                ('TenantID', models.CharField(default='', max_length=20)),
                ('LastChangeDateTime', models.DateTimeField(null=True)),
                ('TotalAvailableMinutes', models.IntegerField(blank=True, default=0, null=True)),
                ('TotalCommunicatedDowntimesInMinutes', models.IntegerField(blank=True, default=0, null=True)),
                ('TotalExcludedCommunicatedDowntimesInMinutes', models.IntegerField(blank=True, default=0, null=True)),
                ('TotalExcludedDowntimesInMinutes', models.IntegerField(blank=True, default=0, null=True)),
                ('TotalPlannedAvailableMinutes', models.IntegerField(blank=True, default=0, null=True)),
                ('TotalUnplannedCommunicatedDowntimesInMinutes', models.IntegerField(blank=True, default=0, null=True)),
                ('SystemRole', models.CharField(default='', max_length=30)),
                ('SystemLocation', models.CharField(default='', max_length=30)),
                ('CRMCustomerID', models.CharField(default='', max_length=30)),
                ('CustomerID', models.IntegerField(blank=True, default=0, null=True)),
                ('CustomerName', models.CharField(default='', max_length=255)),
                ('LifecycleStatus', models.CharField(default='', max_length=40)),
                ('ExternalSystemID', models.CharField(default='', max_length=30)),
                ('SystemID', models.CharField(default='', max_length=10)),
                ('BusinessType', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='system_business_type_decs_info', to='spc_cld.system_business_type_decs')),
                ('SystemInfo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notification_system_info', to='spc_cld.system')),
                ('TenantInfo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notification_tenant_info', to='spc_cld.tenant')),
            ],
            options={
                'ordering': ['StartDateTime'],
            },
        ),
        migrations.AddIndex(
            model_name='availability',
            index=models.Index(fields=['StartDateTime'], name='daily_avail_StartDa_782e22_idx'),
        ),
        migrations.AddIndex(
            model_name='availability',
            index=models.Index(fields=['SystemNumber'], name='daily_avail_SystemN_f7aac3_idx'),
        ),
    ]