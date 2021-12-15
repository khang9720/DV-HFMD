from django.conf.urls.static import static
from django.urls import include, path

from . import views

app_name = "mapsJs"
urlpatterns = [
    path('', views.c_index.as_view(), name='index'),
    path('name/', views.search, name='search'),
]
