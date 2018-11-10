from . import views
from django.urls import path

urlpatterns = [
    path('', views.FetchVoiceText.as_view(), name='home'),
    path('calender/', views.calenderEvents, name="calender")
]