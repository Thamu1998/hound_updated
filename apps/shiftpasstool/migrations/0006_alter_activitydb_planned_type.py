# Generated by Django 3.2.6 on 2023-04-18 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shiftpasstool', '0005_merge_0003_auto_20230213_1602_0004_auto_20230401_1310'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activitydb',
            name='planned_type',
            field=models.CharField(choices=[('S4H', 'S4H'), ('IBP', 'IBP'), ('BYD', 'BYD'), ('C4C', 'C4C')], default='S4H', max_length=20),
        ),
    ]
