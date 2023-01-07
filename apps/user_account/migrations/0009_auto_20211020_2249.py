# Generated by Django 3.2.6 on 2021-10-20 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_account', '0008_alter_user_technical_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='cam',
            field=models.BooleanField(default=True, help_text='Designates whether the user is created by CAM Profile or Manually'),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_block',
            field=models.BooleanField(default=False, help_text='Designates whether the user should be blocked', verbose_name='block'),
        ),
    ]
