from django.urls import path
from .views import CareerSubmitView, dashboard_data, GenerateRoadmapView, RoadmapDetailView
from . import views_auth, views

urlpatterns = [
    path('submit-profile/', CareerSubmitView.as_view()),
    path('dashboard-data/', dashboard_data),

    # Auth endpoints
    path('auth/request-otp/', views_auth.RequestOTPView.as_view(), name='request-otp'),
    path('auth/verify-otp/', views_auth.VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/google-oauth/', views_auth.google_oauth_callback, name='google-oauth'),
    path('auth/signup/', views_auth.SignupView.as_view(), name='signup'),
    path('auth/login/', views_auth.LoginView.as_view(), name='login'),

    # Profile endpoints
    path('profile/', views_auth.ProfileView.as_view(), name='profile'),
    path('user-profile/', views.user_profile, name='user-profile'),

    # Roadmap endpoints
    path('roadmaps/generate/', GenerateRoadmapView.as_view(), name='roadmap-generate'),
    path('roadmaps/<int:short_id>/', RoadmapDetailView.as_view(), name='roadmap-detail'),
]
