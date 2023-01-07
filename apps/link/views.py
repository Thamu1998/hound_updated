from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import permission_required
from django.views.generic import TemplateView
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from collections import namedtuple
import json
import ast
import importlib
from background_task import background
from .serializers import *
# ---------------- BEGIN Initiate Models ------------------
from .models import *
# ---------------- END Initiate Models --------------------

Timeline = namedtuple('Timeline', ('categorys', 'links'))


class TimelineViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing the category and links in your Timeline.
    """

    def list(self, request):
        timeline = Timeline(
            categorys=Category.objects.all(),
            links=Link.objects.all(),
        )
        serializer = TimelineSerializer(timeline)

        return Response(serializer.data)


class PostData(APIView):
    def post(self, request):
        print(request.data, "post data")
        new_Category = Category(
            category_name=request.data['name'], category_type=request.data['tags'])

        new_Category.save()

        return HttpResponse('asd')


class PostLinkData(APIView):
    def post(self, request):

        sampledata = request.data

        name = sampledata['name']
        subname = sampledata['subname']
        url = sampledata['url']
        category = sampledata['category']

        new_link = Link(name=name, subname=subname, url=url,
                        category=Category.objects.get(category_name=category))
        new_link.save()
        return HttpResponse('asd')


class UpdateData(APIView):
    def put(self, request, format=None):

        sampledata = request.data

        id = int(sampledata['id'])
        name = sampledata['name']
        subname = sampledata['subname']
        url = sampledata['url']
        category = sampledata['category']

        new_link = Link.objects.filter(id=id).update(name=name, subname=subname, url=url,
                                                     category=Category.objects.get(category_name=category))

        return HttpResponse('update data')


class DeleteData(APIView):
    def delete(self, request, format=None):
        sampledata = request.data
        print(sampledata, "sampledata")
        id = int(sampledata['id'])
        Link.objects.filter(id=id).delete()
        return HttpResponse('deleted data')
