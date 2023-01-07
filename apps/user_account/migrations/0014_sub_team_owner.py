# Generated by Django 3.2.6 on 2022-03-09 19:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_account', '0013_alter_user_dob'),
    ]

    operations = [
        migrations.CreateModel(
            name='sub_team_owner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.ManyToManyField(blank=True, related_name='sub_team_owner_ref', to=settings.AUTH_USER_MODEL)),
                ('sub_team', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sub_team_ref', to='user_account.subteam')),
            ],
        ),
    ]
