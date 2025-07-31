from rest_framework import serializers
from .models import CareerProfile, CustomUser, OTP

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'is_active', 'is_staff', 'date_joined']

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['id', 'user', 'otp_code', 'created_at', 'is_used']
        read_only_fields = ['id', 'created_at', 'is_used']

class CareerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerProfile
        fields = '__all__'
