# Generated by Django 3.2.6 on 2023-02-04 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vulnerablity_dashboard', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='vulnerablity_analyse_data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Vulnerability_count', models.TextField()),
                ('OS', models.TextField()),
                ('Software', models.TextField()),
                ('Sap_rating_high', models.TextField()),
                ('Sap_rating_low', models.TextField()),
                ('Sap_rating_medium', models.TextField()),
                ('Sap_rating_critical', models.TextField()),
                ('patch_online', models.TextField()),
                ('patch_offline', models.TextField()),
                ('created_date', models.DateTimeField()),
            ],
        ),
    ]
