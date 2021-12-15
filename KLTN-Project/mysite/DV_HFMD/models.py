from django.db import models

# Create your models here.

class llvn(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    lon = models.FloatField()
    lat = models.FloatField()
    def __str__(self):
        return self.name
