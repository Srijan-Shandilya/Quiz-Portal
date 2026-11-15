from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Quiz


@require_GET
def quiz_list(request):
    quizzes = Quiz.objects.filter(is_active=True).annotate(
        question_count=Count("questions")
    )

    data = []
    for quiz in quizzes:
        data.append({
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "duration_minutes": quiz.duration_minutes,
            "question_count": quiz.question_count,
        })

    return JsonResponse(data, safe=False)


@require_GET
def quiz_detail(request, quiz_id):
    try:
        quiz = Quiz.objects.prefetch_related("questions__options").get(
            id=quiz_id, is_active=True
        )
    except Quiz.DoesNotExist:
        return JsonResponse({"error": "Quiz not found."}, status=404)

    questions = []
    for question in quiz.questions.all():
        options = []
        for option in question.options.all():
            options.append({
                "id": option.id,
                "text": option.text,
            })

        questions.append({
            "id": question.id,
            "text": question.text,
            "order": question.order,
            "options": options,
        })

    data = {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "duration_minutes": quiz.duration_minutes,
        "questions": questions,
    }
    return JsonResponse(data)