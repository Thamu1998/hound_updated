# Generated by Django 3.2.6 on 2023-03-31 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shiftpasstool', '0002_auto_20230211_2225'),
    ]

    operations = [
        migrations.AddField(
            model_name='activitydb',
            name='assigned',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='activitydb',
            name='remarks',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='master_tickets',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='outage_master_tickets',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='outage_tracking_history',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='tracking_history',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
    ]
