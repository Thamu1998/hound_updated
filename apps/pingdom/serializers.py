from .models import pingdom_time_series_data
from apps.user_account.models import User
from rest_framework import serializers

class mttd_SERIALIZER(serializers.ModelSerializer):

    acknowledgedBy = serializers.SerializerMethodField()
    acknowledgedAt = serializers.SerializerMethodField()
    errorStartTime = serializers.SerializerMethodField()


    class Meta:
        model = pingdom_time_series_data
        fields = ('SID','systemNumber','errorStartTime', 'acknowledgedAt', 'IsAcknowledged','acknowledgedBy', 'acknowledgedWithin', 'Product_Area')


    def get_acknowledgedBy(self, obj):
        username = ""
        if obj.acknowledgedBy != None:
            username = obj.acknowledgedBy.username
        return username  

    def get_acknowledgedAt(self, obj):
        acknowledgedAt = ""
        if obj.acknowledgedAt != None:
                    acknowledgedAt = obj.acknowledgedAt.strftime('%d-%m-%Y %H:%M:%S')
        return acknowledgedAt

    def get_errorStartTime(self, obj):
        errorStartTime = ""
        if obj.errorStartTime != None:
                    errorStartTime = obj.errorStartTime.strftime('%d-%m-%Y %H:%M:%S')
        return errorStartTime

class mttd_SERIALIZER_DATE_NAME(serializers.ModelSerializer):

    acknowledgedBy = serializers.SerializerMethodField()
    acknowledgedAt = serializers.SerializerMethodField()
    errorStartTime = serializers.SerializerMethodField()


    class Meta:
        model = pingdom_time_series_data
        fields = ('SID','systemNumber','errorStartTime', 'acknowledgedAt', 'IsAcknowledged','acknowledgedBy', 'acknowledgedWithin', 'Product_Area')


    def get_acknowledgedBy(self, obj):
        username = ""
        if obj.acknowledgedBy != None:
            username = obj.acknowledgedBy.username
        return username  

    def get_acknowledgedAt(self, obj):
        acknowledgedAt = ""
        if obj.acknowledgedAt != None:
                    acknowledgedAt = obj.acknowledgedAt.strftime('%d %B, %Y  %H:%M:%S')
        return acknowledgedAt

    def get_errorStartTime(self, obj):
        errorStartTime = ""
        if obj.errorStartTime != None:
                    errorStartTime = obj.errorStartTime.strftime('%d %B, %Y  %H:%M:%S')
        return errorStartTime