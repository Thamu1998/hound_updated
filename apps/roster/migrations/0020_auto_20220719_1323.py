# Generated by Django 3.2.6 on 2022-07-19 13:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('roster', '0019_shift_status_is_allow_use_by_members'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='leave_request_comment',
            name='comment_by',
        ),
        migrations.RemoveField(
            model_name='leave_request_comment',
            name='comment_for',
        ),
        migrations.AlterModelOptions(
            name='shift_comment',
            options={'verbose_name': 'Change Request Comment', 'verbose_name_plural': 'Change Request Comment'},
        ),
        migrations.DeleteModel(
            name='leave_request',
        ),
        migrations.DeleteModel(
            name='leave_request_comment',
        ),
    ]