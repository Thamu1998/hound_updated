# Generated by Django 3.2.6 on 2022-05-14 11:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_account', '0035_user_deactivated_on'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='page_access',
            options={'permissions': (('team_member_cust', 'Custom: Default access for team member'), ('limited_access_cust', 'Custom: Default access for non-team member'), ('tenant_list_view_cust', 'Custom: Access to view the tenant view'), ('modify_pingdom_access', 'Pingdom: User can modify the pingdom check name'))},
        ),
    ]
