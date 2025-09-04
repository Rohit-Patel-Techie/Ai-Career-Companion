from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import uuid

class CareerProfile(models.Model):
    fullName = models.CharField(max_length=100)
    email = models.EmailField()
    currentlyLiving = models.CharField(max_length=255, blank=True, null=True)
    gradeOrYear = models.CharField(max_length=50, blank=True, null=True)
    subjects = models.JSONField(blank=True, null=True)  # list of subjects
    lastClassPercentageOrCGPA = models.CharField(max_length=50, blank=True, null=True)
    currentCourse = models.CharField(max_length=255, blank=True, null=True)
    lastYearCGPA = models.CharField(max_length=50, blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    experience = models.TextField(blank=True, null=True)
    skills = models.JSONField(blank=True, null=True)  # store as list
    interests = models.JSONField(blank=True, null=True)  # list of interests
    usedAIToolBefore = models.CharField(max_length=20, blank=True, null=True)
    goals = models.TextField(blank=True, null=True)
    mainGoal = models.TextField(blank=True, null=True)
    preferredField = models.CharField(max_length=100, blank=True, null=True)
    learningTime = models.CharField(max_length=50, blank=True, null=True)
    learningStyle = models.CharField(max_length=100, blank=True, null=True)
    longTermCareerGoal = models.TextField(blank=True, null=True)
    challenges = models.TextField(blank=True, null=True)
    biggestCareerChallenge = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Suggestions from API
    suggestion = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.fullName

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        if not username:
            raise ValueError('Username must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class OTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='otps')
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"OTP for {self.user.email} - {self.otp_code}"

class Roadmap(models.Model):
    id = models.AutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='roadmaps')
    title = models.CharField(max_length=255)
    career_input = models.JSONField()
    profile_snapshot = models.JSONField(blank=True, null=True)
    prompt = models.TextField()
    model = models.CharField(max_length=100, default='deepseek/deepseek-chat-v3-0324:free')
    status = models.CharField(max_length=32, default='generated')
    content = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Roadmap #{self.id} - {self.title}"
