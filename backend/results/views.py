import json

from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from quizzes.models import Quiz
from .models import QuizAttempt


@csrf_exempt
@require_POST
def submit_quiz(request, quiz_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Please log in first."}, status=401)

    try:
        quiz = Quiz.objects.prefetch_related("questions__options").get(
            id=quiz_id, is_active=True
        )
    except Quiz.DoesNotExist:
        return JsonResponse({"error": "Quiz not found."}, status=404)

    if QuizAttempt.objects.filter(user=request.user, quiz=quiz).exists():
        return JsonResponse({"error": "You have already submitted this quiz."}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)

    if not isinstance(data, dict) or not isinstance(data.get("answers"), dict):
        return JsonResponse({"error": "Send answers as a dictionary."}, status=400)

    answers = data["answers"]
    questions = list(quiz.questions.all())

    if len(questions) == 0:
        return JsonResponse({"error": "This quiz has no questions."}, status=400)

    score = 0
    for question in questions:
        correct_id = None
        for option in question.options.all():
            if option.is_correct:
                correct_id = option.id

        selected = answers.get(str(question.id))
        if correct_id is not None and selected is not None:
            if str(selected) == str(correct_id):
                score += 1

    try:
        QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=score,
            total_questions=len(questions),
        )
    except IntegrityError:
        return JsonResponse({"error": "You have already submitted this quiz."}, status=400)

    return JsonResponse({
        "quiz": quiz.title,
        "score": score,
        "total_questions": len(questions),
    }, status=201)


@require_GET
def my_results(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Please log in first."}, status=401)

    attempts = QuizAttempt.objects.filter(user=request.user).select_related("quiz")

    data = []
    for attempt in attempts:
        data.append({
            "id": attempt.id,
            "quiz_id": attempt.quiz.id,
            "quiz_title": attempt.quiz.title,
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "submitted_at": attempt.submitted_at.isoformat(),
        })

    return JsonResponse(data, safe=False)