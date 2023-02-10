from rest_framework import serializers
from .models import *

class analyse_vulnerablity_serializer(serializers.ModelSerializer):
    class Meta:
        model=vulnerablity_analyse_data
        fields="__all__"