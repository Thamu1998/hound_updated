from dataclasses import field
import datetime
from rest_framework import serializers
# from ..shiftpasstool.models import tracking_history 

from .models import tracking_history,master_tickets,outage_master_tickets,outage_tracking_history,tickets_notes,tickets_count_table
from rest_framework import serializers
from apps.shiftpasstool.models import tickets_notes,tickets_count_table,ActivityDB,sm_infra_activate

class tracking_serializer(serializers.ModelSerializer):
    class Meta:
        model=tracking_history
        fields='__all__'


class master_tracking_serializer(serializers.ModelSerializer):
    class Meta:
        model=master_tickets
        fields='__all__'


class outage_master_tickets_serializer(serializers.ModelSerializer):
    class Meta:
        model=outage_master_tickets
        fields='__all__'
    

    # Ticket_ID=serializers.CharField(max_length=10)
    # Subject=serializers.TimeField()
    # customer_impact=serializers.CharField(style={'base_template': 'textarea.html'})
    # Action_Required=serializers.CharField(style={'base_template': 'textarea.html'})
    # Status=serializers.CharField(max_length=20)
    # created_date=serializers.DateTimeField()
    # date=serializers.DateField(default=datetime.datetime.now())
    # shift=serializers.CharField(max_length=20)

    # def create(self, validated_data):
    #     """
    #     Create and return a new `outage_master_tickets` instance, given the validated data.
    #     """
    #     return outage_master_tickets.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     """
    #     Update and return an existing `outage_master_tickets` instance, given the validated data.
    #     """
    #     instance.Ticket_ID = validated_data.get('Ticket_ID', instance.Ticket_ID)
    #     instance.Subject = validated_data.get('Subject', instance.Subject)
    #     instance.customer_impact = validated_data.get('customer_impact', instance.customer_impact)
    #     instance.Action_Required = validated_data.get('Action_Required', instance.Action_Required)
    #     instance.Status = validated_data.get('Status', instance.Status)
    #     instance.shift = validated_data.get('shift', instance.shift)
    #     instance.created_date = validated_data.get('created_date', instance.created_date)
    #     instance.save()
    #     return instance

class outage_history_tickets_serializer(serializers.ModelSerializer):
    class Meta:
        model=outage_tracking_history
        fields='__all__'
    # Ticket_ID=serializers.CharField(max_length=10)
    # Subject=serializers.TimeField()
    # customer_impact=serializers.CharField(style={'base_template': 'textarea.html'})
    # Action_Required=serializers.CharField(style={'base_template': 'textarea.html'})
    # Status=serializers.CharField(max_length=20)
    # created_date=serializers.DateTimeField()
    # date=serializers.DateField(default=datetime.datetime.now())
    # shift=serializers.CharField(max_length=20)
    # start_time = serializers.DateTimeField()
    # end_time=serializers.DateTimeField(allow_null=True,required=False)


    # def create(self, validated_data):
    #     """
    #     Create and return a new `outage_master_tickets` instance, given the validated data.
    #     """
    #     return outage_tracking_history.objects.create(**validated_data)

class outage_history_(serializers.ModelSerializer):
    class Meta:
        model=outage_tracking_history
        fields='__all__'

class tickets_notes_serializer(serializers.ModelSerializer):
    class Meta:
        model=tickets_notes
        fields='__all__'

class tickets_counts_serializer(serializers.ModelSerializer):
    class Meta:
        model=tickets_count_table
        fields='__all__'





class tickets_notes_serializer(serializers.ModelSerializer):
    class Meta:
        model=tickets_notes
        fields='__all__'

class tickets_counts_serializer(serializers.ModelSerializer):
    class Meta:
        model=tickets_count_table
        fields='__all__'


class Activity_table(serializers.ModelSerializer):
    class Meta:
        model=ActivityDB
        fields='__all__'

class sm_infra_activate_serializer(serializers.ModelSerializer):
    class Meta:
        model=sm_infra_activate
        fields="__all__"