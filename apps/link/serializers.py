from .models import *
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = '__all__'
        depth = 1


class TimelineSerializer(serializers.Serializer):
    categorys = CategorySerializer(many=True)
    links = LinkSerializer(many=True)
