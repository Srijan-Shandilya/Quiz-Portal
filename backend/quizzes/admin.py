from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet

from .models import Quiz, Question, AnswerOption


class AnswerOptionInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()

        option_count = 0
        correct_count = 0

        for form in self.forms:
            if not hasattr(form, "cleaned_data"):
                continue
            if form.cleaned_data.get("DELETE"):
                continue
            if not form.cleaned_data.get("text"):
                continue

            option_count += 1
            if form.cleaned_data.get("is_correct"):
                correct_count += 1

        if option_count < 2:
            raise ValidationError("Please add at least 2 answer options.")
        if correct_count != 1:
            raise ValidationError("Exactly one option must be marked as correct.")


class AnswerOptionInline(admin.TabularInline):
    model = AnswerOption
    formset = AnswerOptionInlineFormSet
    extra = 4


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "duration_minutes", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("__str__", "quiz", "order")
    list_filter = ("quiz",)
    inlines = [AnswerOptionInline]