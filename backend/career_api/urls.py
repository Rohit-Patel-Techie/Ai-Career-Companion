from django.urls import path
from .views import CareerSubmitView, dashboard_data

urlpatterns = [
    path('submit-profile/', CareerSubmitView.as_view()),
    path('dashboard-data/', dashboard_data),
]