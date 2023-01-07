# Generated by Django 3.2.6 on 2021-10-28 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system_configuration', '0005_auto_20211028_1345'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='api_details',
            options={'ordering': ('http_address',), 'verbose_name': 'API Detail', 'verbose_name_plural': 'API Details'},
        ),
        migrations.RemoveIndex(
            model_name='api_details',
            name='system_conf_unique__63670b_idx',
        ),
        migrations.RenameField(
            model_name='api_details',
            old_name='unique_name',
            new_name='unique_id',
        ),
        migrations.AddIndex(
            model_name='api_details',
            index=models.Index(fields=['unique_id'], name='system_conf_unique__3dc0d3_idx'),
        ),
    ]
