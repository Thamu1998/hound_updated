# Generated by Django 3.2.6 on 2022-06-13 04:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('link', '0002_rename_category_category_category_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='category_type',
            field=models.CharField(choices=[('OperationLinks', 'OperationLinks'), ('OtherLinks', 'OtherLinks')], default='OperationLinks', max_length=20),
        ),
    ]