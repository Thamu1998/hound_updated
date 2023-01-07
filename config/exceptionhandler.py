from django.http.response import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.conf import settings

def handler404_view(request, *args, **kwargs):
    ToPath = getattr(settings, 'HANDLER500',"/")
    return render(request, "error_page/404.html")

def handler500_view(request, *args, **kwargs):
    ToPath = getattr(settings, 'HANDLER500',"/")
    return redirect(ToPath)