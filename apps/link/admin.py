from django.contrib import admin

# Register your models here.
from .models import Category, Link

admin.site.register([Category, Link])
