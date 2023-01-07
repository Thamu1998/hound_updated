from typing import cast
from django.db import models
from django.contrib.auth.models import Group
from django.db.models import indexes
from django.db.models.fields import Field

menu_type = (
    ("1", 'BLOCK'),
    ("2", 'STACK'),
    ("3", 'SINGLE MENU')
)

# Create your models here.
class menu_category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    icon = models.TextField(null=True, unique=True)
    order = models.IntegerField(null=True)
    menu_type = models.CharField(max_length = 20, choices = menu_type, default = '3')

    class Meta:
        verbose_name = 'Menu Category'
        verbose_name_plural = 'Menu Categorys'
        ordering = ('order',)

    def __str__(self):
        return self.name

class menu(models.Model):
    name = models.CharField(max_length=50)
    url = models.TextField(null=True, unique=True)
    category = models.ForeignKey(menu_category, related_name='menuCategory', on_delete=models.CASCADE, null=True)
    access_group = models.ManyToManyField(Group, related_name='accessgroup', blank=True)
    is_live = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        permissions = (
                        ('CUSTOM_PERMISSION_VIEW_SYSTEM',"Custom Access to view system page"),
                      )

    def __str__(self):
        return self.name

class auth_details(models.Model):
    http_address = models.CharField(max_length=100,default='')
    auth_name = models.CharField(max_length=50, primary_key=True)
    auth = models.CharField(max_length=250,default='')
    key = models.CharField(max_length=250,default='')

    def __str__(self):
        return self.auth_name
    
    class Meta:
        verbose_name = 'AUTH Detail'
        verbose_name_plural = 'AUTH Details'

class api_details(models.Model):
    end_point = models.TextField(null=True)
    auth = models.ForeignKey(auth_details, on_delete=models.CASCADE, related_name="authdtl", blank=True, null=True)
    description = models.TextField(null=True)
    unique_id = models.CharField(max_length=50,default='',primary_key=True)

    def __str__(self):
        return self.unique_id
    
    class Meta:
        indexes = [ models.Index(fields=['unique_id']), ]
        verbose_name = 'API Detail'
        verbose_name_plural = 'API Details'
        ordering = ('auth',)