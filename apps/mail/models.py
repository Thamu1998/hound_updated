from django.db import models
import os, uuid

def get_image_location(instance, image_name):
    ext = os.path.splitext(image_name)[1]
    image_name = f'{uuid.uuid4()}{ext}'
    return os.path.join('upload', 'images', image_name)

# Create your models here.
class release(models.Model):
    release_id = models.CharField(max_length=20, primary_key=True)

    def __str__(self):
        return self.release_id

class release_notification(models.Model):
    release = models.ForeignKey(release, on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    description = models.TextField()
    image = models.ImageField(null=True, upload_to=get_image_location)
    app_url = models.CharField(max_length=500, blank=True)
