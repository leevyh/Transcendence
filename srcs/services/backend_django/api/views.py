from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
# from .forms import UserSite

def index(request):
	return HttpResponse("API Django App")

# @csrf_exempt
# def register(request):
# 	if request.method == 'POST':
# 		form = UserForm(request.POST)
# 		if form.is_valid():
# 			form.save()
# 			return HttpResponse('User created', status=201)
# 		return HttpResponse(form.errors, status=400)
# 	return HttpResponse('Method Not Allowed', status=405)

