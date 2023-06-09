# Generated by Django 3.2.6 on 2023-01-18 09:03

import apps.mail.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='release',
            fields=[
                ('release_id', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='release_notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=500)),
                ('description', models.TextField()),
                ('image', models.ImageField(null=True, upload_to=apps.mail.models.get_image_location)),
                ('release', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mail.release')),
            ],
        ),
    ]
