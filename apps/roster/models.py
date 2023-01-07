from django.db import models
from django.utils.translation import gettext_lazy as _
import datetime
from apps.user_account.models import User, location, subTeam
from django.core.exceptions import ValidationError
from  django.utils import timezone

REQUEST_TYPE_CHOICE = [('LEAVE_REQUEST', 'Leave Request'), ('SHIFT_CHANGE', 'Shift Change')]

# Create your models here.

class shift_type(models.Model):
    code = models.CharField(max_length=50, default='S1')
    name = models.CharField(max_length=100,null=False)
    color = models.CharField(max_length=30,null=True)
    text_color = models.CharField(max_length=30,null=True)
    is_allow_in_preference = models.BooleanField(default=False)
    is_allow_in_dashboard = models.BooleanField(default=False)
    is_leave = models.BooleanField(default=False)
    time_info = models.CharField(max_length=100, null=True)
    normal_claim = models.IntegerField(default=0)
    holiday_claim = models.IntegerField(default=0)
    location = models.ForeignKey(location, on_delete=models.CASCADE, blank=True,null=True)
    ordering = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Shift Type"
        verbose_name_plural = "Shift Types"

    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(code=self.code, location=self.location).exists():
            raise ValidationError(message='Shift type already exists.',code='unique_together',)

    def __str__(self):
        return self.code

class shift_status(models.Model):
    code = models.CharField(max_length=50,primary_key=True)
    name = models.CharField(max_length=100,null=False)
    is_allow_use_by_members = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Shift Status"
        verbose_name_plural = "Shift Status"

    def __str__(self):
        return self.code

class shift(models.Model):
    sdate = models.DateField(_("Date"), default=datetime.date.today, null=False)
    member = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    shift = models.ForeignKey(shift_type, on_delete=models.CASCADE, blank=True,null=True)
    status = models.ForeignKey(shift_status, on_delete=models.CASCADE, blank=True,null=True)
    is_shift_locked = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Shift Roster"
        verbose_name_plural = "Shift Roster"
    
    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(member=self.member, sdate=self.sdate).exists():
            raise ValidationError(message='Shift on this date already exists.',code='unique_together',)

class task_plan(models.Model):
    sdate = models.DateField(_("Date"), default=datetime.date.today, null=False)
    member = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    task = models.ForeignKey(subTeam, on_delete=models.CASCADE, blank=True,null=True)

    class Meta:
        verbose_name = "Task Plan"
        verbose_name_plural = "Task Plan"
    
    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(member=self.member, sdate=self.sdate).exists():
            raise ValidationError(message='Task on this date already exists.',code='unique_together',)

class shift_temp(models.Model):
    sdate = models.DateField(_("Date"), default=datetime.date.today)
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shift_member_info",blank=True, null=True)
    shift = models.ForeignKey(shift_type, on_delete=models.CASCADE, blank=True,null=True)
    status = models.ForeignKey(shift_status, on_delete=models.CASCADE, blank=True,null=True)
    is_shift_locked = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Shift Roster Temp"
        verbose_name_plural = "Shift Roster Temp"
    
    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(member=self.member, sdate=self.sdate).exists():
            raise ValidationError(message='Shift on this date already exists.',code='unique_together',)

class shift_preferance(models.Model):
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shift_preferance_info",blank=True, null=True)
    shift = models.ForeignKey(shift_type, on_delete=models.CASCADE, blank=True,null=True)
    shift_off = models.CharField(max_length=40, null=True, blank=True)

    class Meta:
        verbose_name = "Shift Preferance"
        verbose_name_plural = "Shift Preferances"

class Holiday(models.Model):
    name = models.CharField(max_length=200, null=False, blank=False)
    date = models.DateField(_("Date"), default=datetime.date.today)
    img = models.CharField(max_length=30, null=True)
    location = models.ForeignKey(location, on_delete=models.CASCADE, blank=True,null=True)

    class Meta:
        verbose_name = "Holiday"
        verbose_name_plural = "Holidays"

    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(location=self.location, date=self.date).exists():
            raise ValidationError(message='Holiday on this date already exists.',code='unique_together',)

class shift_comment(models.Model):
    comment_month = models.IntegerField(default=0)
    comment = models.CharField(max_length=3000, default='')
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment_shift_member_info")

    class Meta:
        verbose_name = "Shift Comments"
        verbose_name_plural = "Shift Coments"

    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(member=self.member, comment_month=self.comment_month).exists():
            raise ValidationError(message='User Comment already exists',code='unique_together',)

class change_request(models.Model):

    sdate = models.DateField(_("Date"), default=datetime.date.today, null=False)
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lr_member_info",blank=True, null=True)
    change_to = models.ForeignKey(shift_type, related_name="change_to", on_delete=models.CASCADE, blank=True,null=True)
    change_from = models.ForeignKey(shift_type, related_name="change_from",on_delete=models.CASCADE, blank=True,null=True)
    is_seen = models.BooleanField(_("Is Seen"), default=False)
    request_type = models.CharField(max_length=70,choices=REQUEST_TYPE_CHOICE, null=True, blank=True)
    status = models.ForeignKey(shift_status, on_delete=models.CASCADE, blank=True,null=True)
    approver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lr_approver_by_info',blank=True, null=True)
    request_on = models.DateTimeField(default=timezone.now)
    request_approved_on = models.DateTimeField(null=True, default=None)

    class Meta:
        verbose_name = "Change Request"
        verbose_name_plural = "Change Request"

    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(member=self.member, sdate=self.sdate).exists():
            raise ValidationError(message='Request already exists',code='unique_together',)

class change_request_comment(models.Model):
    comment_for = models.ForeignKey(change_request, related_name='change_request_comment',on_delete=models.CASCADE)
    comment_by = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    comment = models.CharField(max_length=1000)
    is_seen = models.BooleanField(_("Is Seen"), default=False)
    comment_on = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Change Request Comment"
        verbose_name_plural = "Change Request Comment"

class status_change_request(models.Model):

    sdate = models.DateField(_("Date"), default=datetime.date.today, null=False)
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lr_status_member_info",blank=True, null=True)
    shift_status_to = models.ForeignKey(shift_status, related_name="shift_status_request", on_delete=models.CASCADE, blank=True,null=True)
    status = models.ForeignKey(shift_status, on_delete=models.CASCADE, blank=True,null=True)
    approver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lr_status_approver_by_info',blank=True, null=True)
    request_on = models.DateTimeField(default=timezone.now)
    request_approved_on = models.DateTimeField(null=True, default=None)

    class Meta:
        verbose_name = "Status change Request"
        verbose_name_plural = "Status change Request"

    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(member=self.member, sdate=self.sdate).exists():
            raise ValidationError(message='Request already exists',code='unique_together',)

class status_change_request_comment(models.Model):
    comment_for = models.ForeignKey(status_change_request, related_name='status_change_request_comment',on_delete=models.CASCADE)
    comment_by = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    comment = models.CharField(max_length=1000)
    is_seen = models.BooleanField(_("Is Seen"), default=False)
    comment_on = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Status change Request Comment"
        verbose_name_plural = "Status change Request Comment"

class swap_request(models.Model):
    swap_date_from = models.DateField(_("Swap Date From"), default=datetime.date.today, null=False)
    swap_shift_from = models.ForeignKey(shift_type, related_name="swap_shift_info_from", on_delete=models.CASCADE, blank=True,null=True)
    swap_date_to = models.DateField(_("Swap Date To"), default=datetime.date.today, null=False)
    swap_shift_to = models.ForeignKey(shift_type, related_name="swap_shift_info_to", on_delete=models.CASCADE, blank=True,null=True)
    requested_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requested_from_info',blank=True, null=True)
    requested_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requested_to_info',blank=True, null=True)
    sm_status = models.ForeignKey(shift_status, related_name='sm_status', on_delete=models.CASCADE, blank=True,null=True)
    sm_approved_on = models.DateTimeField(null=True, default=None)
    status = models.ForeignKey(shift_status, on_delete=models.CASCADE, blank=True,null=True)
    approver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sr_approver_by_info',blank=True, null=True)
    request_on = models.DateTimeField(default=timezone.now)
    request_approved_on = models.DateTimeField(null=True, default=None)

    class Meta:
        verbose_name = "Swap Request"
        verbose_name_plural = "Swap Request"

    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(requested_from=self.requested_from, swap_date_to=self.swap_date_to).exists():
            raise ValidationError(message='Request already exists',code='unique_together',)

class swap_request_comment(models.Model):
    comment_for = models.ForeignKey(swap_request, related_name='swap_request_comment',on_delete=models.CASCADE)
    comment_by = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)
    comment = models.CharField(max_length=1000)
    is_seen = models.BooleanField(_("Is Seen"), default=False)
    comment_on = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Swap Request Comment"
        verbose_name_plural = "Swap Request Comment"

class planned_leave_calander(models.Model):
    sdate = models.DateField(_("Date"), default=datetime.date.today, null=False)
    member = models.ForeignKey(User, on_delete=models.CASCADE,blank=True, null=True)

    class Meta:
        verbose_name = "Planned Leave"
        verbose_name_plural = "Planned Leave"

    def validate_unique(self, *args, **kwargs):
        super().validate_unique(*args, **kwargs)
        if self.__class__.objects.filter(member=self.member, sdate=self.sdate).exists():
            raise ValidationError(message='Planned Leave already exists',code='unique_together',)
