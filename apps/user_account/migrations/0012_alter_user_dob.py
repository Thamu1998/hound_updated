# Generated by Django 3.2.6 on 2022-03-09 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_account', '0011_user_dob'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='dob',
            field=models.DateField(blank=True, default='9999-03-09'),
        ),
    ]