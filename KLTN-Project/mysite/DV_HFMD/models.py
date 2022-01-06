from django.db import models

# Create your models here.

class llvn(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    lon = models.FloatField()
    lat = models.FloatField()
    def __str__(self):
        return self.name
    
class population(models.Model):
    idname = models.IntegerField()
    name = models.CharField(max_length=255)
    male = models.IntegerField()
    female = models.IntegerField()
    year = models.IntegerField()

    def __str__(self):
        return self.name
