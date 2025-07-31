import random
import string
import datetime
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from .models import  CustomUser, OTP
from .serializers import CustomUserSerializer, OTPSerializer
import requests
from django.contrib.auth import authenticate

# Helper function to generate strong random OTP
def generate_otp(length=6):
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

# Send OTP email using Mailgun API
def send_otp_email(email, otp_code):
    MAILGUN_API_KEY = settings.MAILGUN_API_KEY
    MAILGUN_DOMAIN = settings.MAILGUN_DOMAIN
    if not MAILGUN_API_KEY or not MAILGUN_DOMAIN:
        raise Exception("Mailgun API key or domain not configured")

    return requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": f"Career Companion <mailgun@{MAILGUN_DOMAIN}>",
            "to": [email],
            "subject": "Your OTP Code",
            "text": f"Your OTP code is: {otp_code}. It is valid for 10 minutes.",
        },
    )

class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate email format server-side
        from django.core.validators import validate_email
        from django.core.exceptions import ValidationError
        try:
            validate_email(email)
        except ValidationError:
            return Response({"error": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)

        # Rate limiting: check OTP requests in last 1 minute
        recent_otp = OTP.objects.filter(user__email=email, created_at__gte=timezone.now()-datetime.timedelta(minutes=1))
        if recent_otp.exists():
            return Response({"error": "OTP request too frequent. Please wait before requesting again."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        user, created = CustomUser.objects.get_or_create(email=email)

        otp_code = generate_otp()
        otp = OTP.objects.create(user=user, otp_code=otp_code)

        try:
            response = send_otp_email(email, otp_code)
            if response.status_code != 200:
                return Response({"error": "Failed to send OTP email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "OTP sent successfully"})

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp_code')

        if not email or not otp_code:
            return Response({"error": "Email and OTP code are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp = OTP.objects.filter(user=user, otp_code=otp_code, is_used=False).latest('created_at')
        except OTP.DoesNotExist:
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Check OTP expiry (10 minutes)
        if timezone.now() > otp.created_at + datetime.timedelta(minutes=10):
            return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark OTP as used
        otp.is_used = True
        otp.save()

        # Activate user after successful OTP verification
        user.is_active = True
        user.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        response = Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

        # Set HttpOnly cookie for access token
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=str(refresh.access_token),
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            httponly=True,
            secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
            samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
        )

        return response

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"error": "Username, email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(username=username, email=email, password=password)
        user.is_active = False  # inactive until OTP verification
        user.save()

        otp_code = generate_otp()
        otp = OTP.objects.create(user=user, otp_code=otp_code)

        try:
            response = send_otp_email(email, otp_code)
            if response.status_code != 200:
                return Response({"error": "Failed to send OTP email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Signup successful, OTP sent to email"})

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        identifier = request.data.get('identifier')  # username or email
        password = request.data.get('password')

        if not identifier or not password:
            return Response({"error": "Identifier and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Since USERNAME_FIELD is email, authenticate using email
        try:
            user = CustomUser.objects.get(email=identifier)
            user = authenticate(request, username=user.email, password=password)
        except CustomUser.DoesNotExist:
            # Try username fallback
            try:
                user = CustomUser.objects.get(username=identifier)
                user = authenticate(request, username=user.email, password=password)
            except CustomUser.DoesNotExist:
                user = None

        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"error": "User not verified. Please verify OTP sent to your email."}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        response = Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=str(refresh.access_token),
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            httponly=True,
            secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
            samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
        )

        return response

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_oauth_callback(request):
    token = request.data.get('token')
    if not token:
        return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Verify token with Google
    google_api_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    r = requests.get(google_api_url)
    if r.status_code != 200:
        return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

    data = r.json()
    email = data.get('email')
    if not email:
        return Response({"error": "Email not found in Google token"}, status=status.HTTP_400_BAD_REQUEST)

    user, created = CustomUser.objects.get_or_create(email=email)

    refresh = RefreshToken.for_user(user)
    response = Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    })

    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=str(refresh.access_token),
        expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        httponly=True,
        secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
        samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
    )

    return response

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "date_joined": user.date_joined,
        }
        return Response(data)
