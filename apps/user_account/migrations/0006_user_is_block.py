# Generated by Django 3.2.6 on 2021-10-20 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_account', '0005_auto_20211015_1933'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_block',
            field=models.BooleanField(default=True, verbose_name='block'),
        ),
    ]
