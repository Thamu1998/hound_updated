# Generated by Django 3.2.6 on 2023-02-04 17:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vulnerablity_dashboard', '0002_vulnerablity_analyse_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vulnerablity_analyse_data',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]