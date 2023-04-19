from django.db import models
import datetime
# Create your models here.

def get_upload_file(instance,filename):
      return f'vulnerablity/{instance.created_date.date()}_{filename}'

class vulnerablity_data(models.Model):
      excel_sheet=models.FileField(upload_to=get_upload_file)
      created_date=models.DateTimeField(default=datetime.datetime.now())
        

class vulnerablity_analyse_data(models.Model):
    Vulnerability_count=models.TextField()
    OS=models.TextField()
    Software=models.TextField()
    Sap_rating_high=models.TextField()
    Sap_rating_low=models.TextField()
    Sap_rating_medium=models.TextField()
    Sap_rating_critical=models.TextField()
    patch_online=models.TextField()
    patch_offline=models.TextField()
    created_date=models.DateTimeField()