# Generated by Django 3.2.6 on 2022-07-19 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roster', '0021_auto_20220719_1325'),
    ]

    operations = [
        migrations.AddField(
            model_name='change_request',
            name='request_type',
            field=models.CharField(blank=True, choices=[('LEAVE_REQUEST', 'Leave Request'), ('SHIFT_CHANGE', 'Shift Change')], max_length=70, null=True),
        ),
    ]
