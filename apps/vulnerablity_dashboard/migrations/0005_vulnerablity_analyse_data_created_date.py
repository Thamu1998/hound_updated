# Generated by Django 3.2.6 on 2023-02-04 17:58

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('vulnerablity_dashboard', '0004_remove_vulnerablity_analyse_data_created_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='vulnerablity_analyse_data',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
