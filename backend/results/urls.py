from django.urls import path

from . import views

urlpatterns = [
    path("submit/<int:quiz_id>/", views.submit_quiz, name="submit_quiz"),
    path("my/", views.my_results, name="my_results"),
]