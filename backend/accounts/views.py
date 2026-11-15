import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST


def get_json_body(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict):
        return None
    return data


@csrf_exempt
@require_POST
def register(request):
    data = get_json_body(request)
    if data is None:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)

    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))

    if not username or not password:
        return JsonResponse({"error": "Username and password are required."}, status=400)
    if len(password) < 6:
        return JsonResponse({"error": "Password must be at least 6 characters."}, status=400)
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "This username is already taken."}, status=400)

    user = User.objects.create_user(username=username, password=password)
    login(request, user)

    return JsonResponse({"id": user.id, "username": user.username}, status=201)


@csrf_exempt
@require_POST
def login_view(request):
    data = get_json_body(request)
    if data is None:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)

    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid username or password."}, status=401)

    login(request, user)
    return JsonResponse({"id": user.id, "username": user.username})


@csrf_exempt
@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out."})


@require_GET
def me(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Not logged in."}, status=401)

    return JsonResponse({
        "id": request.user.id,
        "username": request.user.username,
        "is_staff": request.user.is_staff,
    })