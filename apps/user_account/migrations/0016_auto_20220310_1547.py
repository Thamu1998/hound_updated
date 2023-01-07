# Generated by Django 3.2.6 on 2022-03-10 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('user_account', '0015_auto_20220310_1140'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'user', 'verbose_name_plural': 'users'},
        ),
        migrations.CreateModel(
            name='custom_access',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url_name', models.CharField(max_length=100)),
                ('space_name', models.CharField(max_length=100, unique=True)),
                ('access_name', models.CharField(max_length=100, unique=True)),
                ('group_access', models.ManyToManyField(blank=True, related_name='sub_team_owner_ref', to='auth.Group')),
            ],
            options={
                'permissions': (('TeamMember', 'Team_Member access role'),),
            },
        ),
    ]
