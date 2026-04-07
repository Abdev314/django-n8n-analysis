from django.shortcuts import render
from . import urls
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import os
import requests
from django.conf import settings



@require_http_methods(["GET"])
def ai(request):
    # Adjust path: go one level up from BASE_DIR if frontend is outside backend
    react_index = os.path.join(settings.BASE_DIR, 'frontend', 'index.html')
    react_index = os.path.abspath(react_index)  # absolute path

    if not os.path.exists(react_index):
        raise Http404("React index.html not found")

    with open(react_index, 'r', encoding='utf-8') as f:
        return HttpResponse(f.read())


def ai_chat(request):
    return JsonResponse({'message': 'This is the AI chat endpoint'})