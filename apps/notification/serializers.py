from .models import notification_events_stage
from rest_framework import serializers
# from rest_framework.pagination import PaginationSerializer

class notification_events_stage_serializer(serializers.ModelSerializer):
    
    NotificationSubType = serializers.SerializerMethodField()
    CreatedViaAPI = serializers.SerializerMethodField()
    CurrentTemplateName = serializers.SerializerMethodField()
    EventID = serializers.SerializerMethodField()
    EndDate = serializers.SerializerMethodField()
    EndTime = serializers.SerializerMethodField()
    EventName = serializers.SerializerMethodField()
    JiraTicket = serializers.SerializerMethodField()
    NTDBEmailStatus = serializers.SerializerMethodField()
    Phase = serializers.SerializerMethodField()
    StartDate = serializers.SerializerMethodField()
    StartTime = serializers.SerializerMethodField()
    TestMode = serializers.SerializerMethodField()
    BundleID = serializers.SerializerMethodField()
    CreatedBy = serializers.SerializerMethodField()
    StartDateTime = serializers.SerializerMethodField()
    EndDateTime = serializers.SerializerMethodField()
    NotificationType = serializers.SerializerMethodField()
    Status = serializers.SerializerMethodField()
    SystemRoles = serializers.SerializerMethodField()
    ServiceStatus = serializers.SerializerMethodField()
    CreationDateTime = serializers.SerializerMethodField()
    DataCenters = serializers.SerializerMethodField()
    IsStartTimeRevised = serializers.SerializerMethodField()
    IsSLARelevant = serializers.SerializerMethodField()
    IsServiceStatusRevised = serializers.SerializerMethodField()
    IsEndTimeRevised = serializers.SerializerMethodField()
    IsInterRcaSloExpired = serializers.SerializerMethodField()
    IsInterRcaSlaExpired = serializers.SerializerMethodField()
    IsFinalRcaSloExpired = serializers.SerializerMethodField()
    IsFinalRcaSlaExpired = serializers.SerializerMethodField()
    IsInterRcaSend = serializers.SerializerMethodField()
    IsFinalRcaSend = serializers.SerializerMethodField()
    isProd = serializers.SerializerMethodField()
    

    class Meta:
        model = notification_events_stage
        fields = ('EventID','NotificationID', 'NotificationSubType', 'SentToCustomerOn', 'EntityLastChangedOn','CreatedViaAPI','CurrentTemplateName','EndDate','EndTime','EventName','JiraTicket','NTDBEmailStatus','Phase','StartDate','StartTime','TestMode','BundleID','CreatedBy','StartDateTime','EndDateTime','NotificationType','Status','SystemRoles','ServiceStatus','CreationDateTime','DataCenters','IsStartTimeRevised','IsSLARelevant','IsServiceStatusRevised','IsEndTimeRevised','IsInterRcaSloExpired','IsInterRcaSlaExpired','IsFinalRcaSloExpired','IsFinalRcaSlaExpired','IsInterRcaSend','IsFinalRcaSend','isProd')

    def get_NotificationSubType(self, obj):
        return obj.NotificationSubType.description

    def get_CreatedViaAPI(self, obj):

        return obj.ParentObjectID.CreatedViaAPI

    def get_CurrentTemplateName(self, obj):
        return obj.ParentObjectID.CurrentTemplateName

    def get_EventID(self, obj):
        return obj.ParentObjectID.EventID

    def get_EndDate(self, obj):
        return obj.ParentObjectID.EndDate

    def get_EndTime(self, obj):
        return obj.ParentObjectID.EndTime

    def get_EventName(self, obj):
        return obj.ParentObjectID.EventName

    def get_JiraTicket(self, obj):
        return obj.ParentObjectID.JiraTicket

    def get_NTDBEmailStatus(self, obj):
        return obj.ParentObjectID.NTDBEmailStatus

    def get_Phase(self, obj):
        return obj.ParentObjectID.Phase.description

    def get_StartDate(self, obj):
        return obj.ParentObjectID.StartDate

    def get_StartTime(self, obj):
        return obj.ParentObjectID.StartTime

    def get_TestMode(self, obj):
        return obj.ParentObjectID.TestMode

    def get_BundleID(self, obj):
        return obj.ParentObjectID.BundleID

    def get_CreatedBy(self, obj):
        return obj.ParentObjectID.CreatedBy

    def get_StartDateTime(self, obj):
        return obj.ParentObjectID.StartDateTime

    def get_EndDateTime(self, obj):
        return obj.ParentObjectID.EndDateTime

    def get_NotificationType(self, obj):
        return obj.ParentObjectID.NotificationType.description

    def get_Status(self, obj):
        return obj.ParentObjectID.Status.description

    def get_SystemRoles(self, obj):
        return obj.ParentObjectID.SystemRoles

    def get_ServiceStatus(self, obj):
        return obj.ParentObjectID.ServiceStatus.description

    def get_CreationDateTime(self, obj):
        return obj.ParentObjectID.CreationDateTime

    def get_DataCenters(self, obj):
        return obj.ParentObjectID.DataCenters

    def get_IsStartTimeRevised(self, obj):
        return obj.ParentObjectID.IsStartTimeRevised

    def get_IsSLARelevant(self, obj):
        return obj.ParentObjectID.IsSLARelevant

    def get_IsServiceStatusRevised(self, obj):
        return obj.ParentObjectID.IsServiceStatusRevised

    def get_IsEndTimeRevised(self, obj):
        return obj.ParentObjectID.IsEndTimeRevised
    
    def get_IsInterRcaSloExpired(self, obj):
        return obj.ParentObjectID.IsInterRcaSloExpired

    def get_IsInterRcaSlaExpired(self, obj):
        return obj.ParentObjectID.IsInterRcaSlaExpired

    def get_IsFinalRcaSloExpired(self, obj):
        return obj.ParentObjectID.IsFinalRcaSloExpired

    def get_IsFinalRcaSlaExpired(self, obj):
        return obj.ParentObjectID.IsFinalRcaSlaExpired

    def get_IsInterRcaSend(self, obj):
        return obj.ParentObjectID.IsInterRcaSend

    def get_IsFinalRcaSend(self, obj):
        return obj.ParentObjectID.IsFinalRcaSend

    def get_isProd(self, obj):

        return obj.ParentObjectID.isProd

