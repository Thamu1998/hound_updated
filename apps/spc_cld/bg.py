from .methods.sync_cld import sync_cld_data
from .methods.sync_master import sync_master_data
from background_task import background
from apps.pingdom.methods.pingdom_status import sync_status as pingdom_status_sync
from apps.pingdom.methods.create_time_series import create_time_series as create_time_series_pingdom
from apps.uptime.methods.create_time_series import create_time_series as create_time_series_uptime
from apps.uptime.methods.uptime_status import sync_status as uptime_status_sync
from apps.notification.methods.sync import sync_notification
from apps.daily_availability.methods.sync_daily_notification import sync_notification_daily
from apps.notification.methods.process_event_summary import event_symmary
from .methods.sync_tenant_allocation_limit import sync_tenant_allocation_data
from .methods.sync_dr_systems import sync_dr_systems_data
from config.settings.base import APPENV

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/cld_sync.log", __name__)
log_noti = init_logging("logs/notification_sync.log", __name__)
############### END Initiate logger #############################


@background(queue="cld_sync", schedule=10)
def sync_data_cld():
    try:
        log.info("CLD Sync Start")

        sync_cld_data_init = sync_cld_data()

        sync_cld_data_init.run(cld_type="CLD_SYSTEM")

        sync_cld_data_init.run(cld_type="CLD_HOST")

        sync_cld_data_init.run(cld_type="CLD_TENANT")

        if APPENV == "prod":

            sync_tenant_allocation_data_init = sync_tenant_allocation_data()

            sync_tenant_allocation_data_init.run()

        sync_master_data_init = sync_master_data()

        sync_master_data_init.match_infra_data()

        sync_notification_init = sync_notification()

        sync_notification_init.run(days=1)

        event_data_init = event_symmary()

        event_data_init.process_data()

        sync_dr_systems_data_inst = sync_dr_systems_data()
        
        sync_dr_systems_data_inst.run()

        log.info("CLD Sync Complete")
    except Exception as e:
        log.error(str(e))

@background(queue="cld_sync", schedule=10)
def sync_data_notification_daily():
    try:
        log_noti.info("Notification Sync Start")

        sync_notification_daily_init = sync_notification_daily()

        sync_notification_daily_init.sync()

        log_noti.info("Notification Sync Complete")
    except Exception as e:
        log.error(str(e))

@background(queue="pingdom_sync_queue", schedule=10)
def pingdom_data_sync():
    try:
        print("Pingdom Sync Start")
        sync_status_init = pingdom_status_sync()

        sync_status_init.sync()

        create_time_series_inst = create_time_series_pingdom()

        create_time_series_inst.generate_time_series()

    except Exception as e:
        log.error(str(e))

@background(queue="uptime_sync_queue", schedule=10)
def uptime_data_sync():
    try:
        sync_status_init = uptime_status_sync()

        sync_status_init.sync()

        create_time_series_inst = create_time_series_uptime()

        create_time_series_inst.generate_time_series()

    except Exception as e:
        log.error(str(e))