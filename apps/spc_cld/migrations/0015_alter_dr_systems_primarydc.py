# Generated by Django 3.2.6 on 2022-09-18 05:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spc_cld', '0014_rename_dr_customer_dr_systems'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dr_systems',
            name='PrimaryDC',
            field=models.CharField(default='', max_length=30, null=True),
        ),
    ]
