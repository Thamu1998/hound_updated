from django.db import models

# Create your models here.
choice_category_type = [
    ('OperationLinks', 'OperationLinks'),
    ('OtherLinks', 'OtherLinks'),

]


class Category(models.Model):
    category_name = models.CharField(max_length=50)
    category_type = models.CharField(
        max_length=20, choices=choice_category_type, null=False, blank=False, default='OperationLinks')

    def __str__(self):
        return self.category_name


class Link(models.Model):
    name = models.CharField(max_length=50)
    subname = models.CharField(max_length=50)
    url = models.URLField(null=False, blank=False)
    category = models.ForeignKey(
        "Category",  on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name
