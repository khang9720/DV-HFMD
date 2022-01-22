from django.conf.urls.static import static
from django.urls import include, path

from . import views

app_name = "mapsJs"
urlpatterns = [
    path('', views.c_index.as_view(), name='index'),
    path('view_down_pdf/', views.view_down_pdf, name='view_down_pdf'),
    path('name/', views.search, name='search'),
    path('view_down_pdf/pdf_view/', views.ViewPDF.as_view(), name="pdf_view"),
    path('view_down_pdf/pdf_download/', views.DownloadPDF.as_view(), name="pdf_download"),
]
