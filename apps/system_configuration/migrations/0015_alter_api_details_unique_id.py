# Generated by Django 3.2.6 on 2022-07-17 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system_configuration', '0014_auto_20220514_0912'),
    ]

    operations = [
        migrations.AlterField(
            model_name='api_details',
            name='unique_id',
            field=models.CharField(default='', max_length=50, primary_key=True, serialize=False),
        ),
    ]