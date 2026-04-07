import os
import requests
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.conf import settings

def home(request):
    return HttpResponse("<h1>This is home</h1>")

@csrf_exempt
@require_http_methods(["POST"])
def analyze_pdf(request):
    # Check if file is present
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file provided'}, status=400)

    pdf_file = request.FILES['file']
    if not pdf_file.name.lower().endswith('.pdf'):
        return JsonResponse({'error': 'Only PDF files are allowed'}, status=400)

    # Get optional message from the request
    user_message = request.POST.get('message', '')  

    # n8n webhook URL (from environment)
    N8N_WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL', 'http://localhost:5678/webhook/pdf-analyze')
    headers = {'X-API-Key': 'pdf-local-2026'}

    # Prepare the file field for n8n
    files = {
        'data': (pdf_file.name, pdf_file.read(), 'application/pdf')
    }

    # Prepare extra form data (the message)
    data = {}
    if user_message:
        data['message'] = user_message

    try:
        response = requests.post(
            N8N_WEBHOOK_URL,
            files=files,
            data=data,           # <-- send the message as a separate field
            headers=headers,
            timeout=120
        )
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.exceptions.Timeout:
        return JsonResponse({'error': 'n8n processing timed out'}, status=504)
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f'n8n error: {str(e)}'}, status=500)
