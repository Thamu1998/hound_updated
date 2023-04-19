from dataclasses import field
import datetime
from rest_framework import serializers
# from ..shiftpasstool.models import tracking_history

from .models import tracking_history, master_tickets, outage_master_tickets, outage_tracking_history, tickets_notes, tickets_count_table
from rest_framework import serializers
from apps.shiftpasstool.models import tickets_notes, tickets_count_table, ActivityDB, sm_infra_activate


class tracking_serializer(serializers.ModelSerializer):
    class Meta:
        model = tracking_history
        fields = '__all__'


class master_tracking_serializer(serializers.ModelSerializer):
    class Meta:
        model = master_tickets
        fields = '__all__'


class outage_master_tickets_serializer(serializers.ModelSerializer):
    class Meta:
        model = outage_master_tickets
        fields = '__all__'


class outage_history_tickets_serializer(serializers.ModelSerializer):
    class Meta:
        model = outage_tracking_history
        fields = '__all__'


class outage_history_(serializers.ModelSerializer):
    class Meta:
        model = outage_tracking_history
        fields = '__all__'


class tickets_notes_serializer(serializers.ModelSerializer):
    class Meta:
        model = tickets_notes
        fields = '__all__'


class tickets_counts_serializer(serializers.ModelSerializer):
    class Meta:
        model = tickets_count_table
        fields = '__all__'


class tickets_notes_serializer(serializers.ModelSerializer):
    class Meta:
        model = tickets_notes
        fields = '__all__'


class tickets_counts_serializer(serializers.ModelSerializer):
    class Meta:
        model = tickets_count_table
        fields = '__all__'


class Activity_table(serializers.ModelSerializer):
    class Meta:
        model = ActivityDB
        fields = '__all__'


class sm_infra_activate_serializer(serializers.ModelSerializer):
    class Meta:
        model = sm_infra_activate
        fields = "__all__"
