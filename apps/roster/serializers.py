from .models import shift_type
from apps.user_account.models import User
from rest_framework import serializers

class shift_type_serializers(serializers.ModelSerializer):

    class Meta:
        model = shift_type
        fields = '__all__'
        read_only_fields = ('id',)
