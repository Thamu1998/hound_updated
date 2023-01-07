from .models import notification_events, notification_events_stage

def options_notification_data(**kwargs):

    context = {}

    context["NotificationSubType"] = [{"code":NotificationSubType[0],"description":NotificationSubType[1]} for NotificationSubType in notification_events_stage.objects.values_list("NotificationSubType__code", "NotificationSubType__description").order_by('NotificationSubType').distinct("NotificationSubType")]
    context["Phase"] = [{"code":Phase[0],"description":Phase[1]} for Phase in notification_events.objects.values_list("Phase__code", "Phase__description").order_by('Phase').distinct("Phase")]
    context["NotificationType"] = [{"code":NotificationType[0],"description":NotificationType[1]} for NotificationType in notification_events.objects.values_list("NotificationType__code", "NotificationType__description").order_by('NotificationType').distinct("NotificationType")]
    context["Status"] = [{"code":Status[0],"description":Status[1]} for Status in notification_events.objects.values_list("Status__code", "Status__description").order_by('Status').distinct("Status")]
    context["ServiceStatus"] = [{"code":ServiceStatus[0],"description":ServiceStatus[1]} for ServiceStatus in notification_events.objects.values_list("ServiceStatus__code", "ServiceStatus__description").order_by('ServiceStatus').distinct("ServiceStatus")]

    return context