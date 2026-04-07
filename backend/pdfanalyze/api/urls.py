from django.contrib import admin
from django.urls import path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    path('ai/', RedirectView.as_view(url='http://localhost:3000', permanent=False), name='ai'),
    path('chat/', views.ai_chat, name='ai_chat'),
]
