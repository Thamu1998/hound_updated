# Generated by Django 3.2.6 on 2022-09-24 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('daily_availability', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='availability',
            name='Category',
            field=models.CharField(default='', max_length=150),
        ),
        migrations.AddField(
            model_name='availability',
            name='Description',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='availability',
            name='EndTime',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='availability',
            name='EventID',
            field=models.CharField(default='', max_length=50),
        ),
        migrations.AddField(
            model_name='availability',
            name='OutageType',
            field=models.CharField(default='', max_length=150),
        ),
        migrations.AddField(
            model_name='availability',
            name='ProblemTicket',
            field=models.CharField(default='', max_length=40),
        ),
        migrations.AddField(
            model_name='availability',
            name='RCACategory',
            field=models.CharField(default='', max_length=150),
        ),
        migrations.AddField(
            model_name='availability',
            name='Reason',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='availability',
            name='StartTime',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='availability',
            name='SubCategory',
            field=models.CharField(default='', max_length=150),
        ),
    ]
