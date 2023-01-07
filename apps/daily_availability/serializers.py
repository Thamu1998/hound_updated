from .models import availability
from rest_framework import serializers
# from rest_framework.pagination import PaginationSerializer

class availability_serializer(serializers.ModelSerializer):

    BusinessType_desc = serializers.SerializerMethodField()
   
    class Meta:
        model = availability
        fields = '__all__'

    def get_BusinessType_desc(self, obj):
        if obj.BusinessType == None:
            return "NA"
        return obj.BusinessType.description