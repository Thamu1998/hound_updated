# Generated by Django 3.2.6 on 2022-05-21 10:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pingdom', '0003_alter_comment_table_unique_together'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment_table',
            old_name='created_on',
            new_name='updated_on',
        ),
    ]
