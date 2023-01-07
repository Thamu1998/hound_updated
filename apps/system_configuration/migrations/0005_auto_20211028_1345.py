# Generated by Django 3.2.6 on 2021-10-28 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system_configuration', '0004_menu_is_live'),
    ]

    operations = [
        migrations.CreateModel(
            name='api_details',
            fields=[
                ('http_address', models.CharField(default='', max_length=100)),
                ('end_point', models.TextField(null=True)),
                ('auth', models.CharField(default='', max_length=100)),
                ('description', models.TextField(null=True)),
                ('unique_name', models.CharField(default='', max_length=20, primary_key=True, serialize=False)),
            ],
        ),
        migrations.AddIndex(
            model_name='api_details',
            index=models.Index(fields=['unique_name'], name='system_conf_unique__63670b_idx'),
        ),
    ]