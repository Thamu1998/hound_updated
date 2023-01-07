from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission

STATUS_TYPE_CHOICE = [('WAITING', 'WAITING'), ('APPROVED', 'APPROVED'), ('REJECTED', 'REJECTED')]

class location(models.Model):
    code = models.CharField(max_length=3, primary_key=True)
    name = models.CharField(max_length=100,null=False,unique=True)

    def __str__(self):
        return self.name

class team(models.Model):
    code = models.CharField(max_length=10,primary_key=True)
    name = models.CharField(max_length=100,null=False)
    location = models.ForeignKey(location, related_name='teamLocation', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

class subTeam(models.Model):
    code = models.CharField(max_length=30, primary_key=True)
    name = models.CharField(max_length=100,null=False)
    team = models.ForeignKey(team, related_name='subteam_team', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Sub-Team'
        verbose_name_plural = 'Sub-Teams'

class role(models.Model):
    code = models.CharField(max_length=30,primary_key = True)
    name = models.CharField(max_length=100,null=False,unique=True)
    team = models.ForeignKey(team, related_name='roleTeam', on_delete=models.SET_NULL, null=True)
    isInShiftPlan = models.BooleanField(default=False)
 
    def __str__(self):
        return self.name
        
class User(AbstractUser):
    team = models.ForeignKey(team, related_name='userteam', on_delete=models.SET_NULL, null=True)
    sub_team = models.ForeignKey(subTeam, related_name='subteam', on_delete=models.SET_NULL, null=True)
    role = models.ForeignKey(role, related_name='userRole', on_delete=models.SET_NULL, null=True)
    technical_user = models.BooleanField(help_text ="Designates whether the user can use API.",default=False)
    cam = models.BooleanField(help_text="Designates whether the user is created by CAM Profile or Manually",default=True)
    dob = models.DateField(default="9999-01-01", blank=True)
    deactivated_on = models.DateField(_('Deactivated on'),default="9999-01-01",null=True, blank=True)
    is_block = models.BooleanField(_('block'), default=False, help_text="Designates whether the user should be blocked")

class sub_team_owner(models.Model):
    sub_team = models.OneToOneField(subTeam, related_name='sub_team_ref', on_delete=models.CASCADE, null=True)
    owner = models.ManyToManyField(User, related_name='sub_team_owner_ref', blank=True)

    class Meta:
        verbose_name = 'Sub-Team-Owner'
        verbose_name_plural = 'Sub-Team-Owners'

class change_work_group_request(models.Model):
    user = models.OneToOneField(User, related_name='transfer_wg_ref', on_delete=models.CASCADE, null=True)
    source = models.ForeignKey(subTeam, related_name='source_subteam_info', on_delete=models.SET_NULL, null=True)
    target = models.ForeignKey(subTeam, related_name='target_subteam_info', on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=70,choices=STATUS_TYPE_CHOICE, null=True, blank=True, default='WAITING')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requested_by_info',blank=True, null=True)
    approver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wg_approver',blank=True, null=True)
    request_on = models.DateTimeField(default=timezone.now)
    request_approved_on = models.DateTimeField(null=True, default=None)

    class Meta:
        verbose_name = "Work Group Request"
        verbose_name_plural = "Work Group Request"


class page_access(models.Model):
    url_name = models.CharField(max_length=100,null=False)
    space_name = models.CharField(max_length=100,null=False)
    request_method = models.CharField(max_length=15,null=False, default="GET")
    access_name = models.ForeignKey(Permission, related_name='access_name_ref', on_delete=models.CASCADE, null=True, blank=True)
    is_allow_everyone = models.BooleanField(_('Allow Everyone'), default=False, help_text="If True allow anyone to access this page.")

    class Meta:
        unique_together = (("url_name", "space_name", "request_method"),)
        permissions = ( 
            ("shift_planner", "Custom: User can plan the shift"),
            ("team_member", "Custom: Default access for team member"),
            ("has_access", "Custom: Default access for CAM user outside operation team"),
            ("limited_access_cust", "Custom: Default access for non-team member"),
            ("modify_pingdom_access", "Custom: User can modify the pingdom check name"),
            ("pingdom_sync_access", "Custom: User can trigger Pingdom status sync"),
            ("uptime_sync_access", "Custom: User can trigger Uptime status sync"),
            ("get_dc_info", "Custom: User can view the system related info in Pingdom dashboard"),
            ("acknowledge_downtime_access", "Custom: User can acknowledge downtime"),
            ("view_acknowledge_downtime_access", "Custom: User can view acknowledge downtime"),
            ("view_user_info", "Custom: Can view user list(view_user_info)"),
            ("update_user_info", "Custom: Can update user info(update_user_info)"),
            ("delete_user_info", "Custom: Can delete user info(delete_user_info)"),
            ("view_shift_type", "Custom: Can view shift type(view_shift_type)"),
            ("update_shift_type", "Custom: Can update shift type(update_shift_type)"),
            ("delete_shift_type", "Custom: Can delete shift type(delete_shift_type)"),
            ("update_member_leave", "Custom: Can update shift member leave(update_member_leave)"),
            ("create_work_group_owner", "Custom: Can create work group(create_work_group_owner)"),
            ("view_work_group_owner", "Custom: Can view work group(view_work_group_owner)"),
            ("update_work_group_owner", "Custom: Can update work group(update_work_group_owner)"),
            ("delete_work_group_owner", "Custom: Can delete work group(delete_work_group_owner)"),
        )
