# Generated by Django 3.2.6 on 2022-03-11 09:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_account', '0029_alter_page_access_access_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='page_access',
            name='request_method',
            field=models.CharField(default='GET', max_length=15),
        ),
        migrations.AlterField(
            model_name='page_access',
            name='url_name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterUniqueTogether(
            name='page_access',
            unique_together={('url_name', 'space_name')},
        ),
        migrations.RemoveField(
            model_name='page_access',
            name='group_access',
        ),
    ]