# Generated by Django 3.2.6 on 2022-03-11 07:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('user_account', '0026_alter_block_access_options'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='block_access',
            new_name='page_access',
        ),
    ]
