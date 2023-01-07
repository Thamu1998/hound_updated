# Generated by Django 3.2.6 on 2022-09-17 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spc_cld', '0012_auto_20220829_0801'),
    ]

    operations = [
        migrations.CreateModel(
            name='DR_CUSTOMER',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('CustomerID', models.CharField(default='', max_length=30, null=True)),
                ('CustomerName', models.TextField(null=True)),
                ('has_prod', models.BooleanField(default=False)),
                ('has_dr', models.BooleanField(default=False)),
                ('PrimaryDC', models.CharField(default='', max_length=10, null=True)),
                ('SecondaryDC', models.CharField(default='', max_length=30, null=True)),
                ('SID', models.CharField(default='', max_length=10, null=True)),
                ('DBSID', models.CharField(default='', max_length=10, null=True)),
                ('quantity', models.IntegerField(null=True)),
                ('comments', models.TextField(null=True)),
                ('isactive', models.BooleanField(default=True)),
            ],
        ),
    ]
