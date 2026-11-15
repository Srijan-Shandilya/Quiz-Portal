from django.contrib import admin

from .models import QuizAttempt


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("user", "quiz", "score", "total_questions", "submitted_at")
    list_filter = ("quiz",)
    search_fields = ("user__username",)