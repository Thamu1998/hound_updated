# Generated by Django 3.2.6 on 2022-09-08 06:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_account', '0051_alter_page_access_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='page_access',
            options={'permissions': (('shift_planner', 'Custom: User can plan the shift'), ('team_member', 'Custom: Default access for team member'), ('has_access', 'Custom: Default access for CAM user outside operation team'), ('limited_access_cust', 'Custom: Default access for non-team member'), ('modify_pingdom_access', 'Custom: User can modify the pingdom check name'), ('pingdom_sync_access', 'Custom: User can trigger Pingdom status sync'), ('uptime_sync_access', 'Custom: User can trigger Uptime status sync'), ('get_dc_info', 'Custom: User can view the system related info in Pingdom dashboard'), ('acknowledge_downtime_access', 'Custom: User can acknowledge downtime'), ('view_acknowledge_downtime_access', 'Custom: User can view acknowledge downtime'), ('view_user_info', 'Custom: Can view user list(view_user_info)'), ('update_user_info', 'Custom: Can update user info(update_user_info)'), ('delete_user_info', 'Custom: Can delete user info(delete_user_info)'), ('view_shift_type', 'Custom: Can view shift type(view_shift_type)'), ('update_shift_type', 'Custom: Can update shift type(update_shift_type)'), ('delete_shift_type', 'Custom: Can delete shift type(delete_shift_type)'))},
        ),
    ]