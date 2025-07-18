from django.db import models

class CareerProfile(models.Model):
    fullName = models.CharField(max_length=100)
    email = models.EmailField()
    education = models.TextField()
    experience = models.TextField()
    skills = models.JSONField()  # store as list
    interests = models.TextField()
    goals = models.TextField()
    preferredField = models.CharField(max_length=100)
    learningStyle = models.CharField(max_length=100)
    challenges = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # Suggestions from API
    suggestion = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.fullName