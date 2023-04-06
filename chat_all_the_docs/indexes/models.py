from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class CollectionStatus(models.TextChoices):
    COMPLETE = "COMPLETE"
    RUNNING = "RUNNING"
    QUEUED = "QUEUED"
    ERROR = "ERROR"


class Document(models.Model):
    collection = models.ForeignKey('Collection', related_name='documents', on_delete=models.CASCADE)
    file = models.FileField(upload_to='documents/')
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

class Collection(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=CollectionStatus.choices)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    model = models.FileField(upload_to='models/')

    def __str__(self):
        return self.title
