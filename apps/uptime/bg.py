from .methods.create_time_series import create_time_series
from .methods.uptime_status import sync_status
from background_task import background

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/uptime_sync.log", __name__)
############### END Initiate logger #############################

@background(queue="uptime_sync", schedule=10)
def uptime_sync():
    try:

        sync_status_init = sync_status()

        sync_status_init.sync()

        create_time_series_inst = create_time_series()

        create_time_series_inst.generate_time_series()

    except Exception as e:
        log.error(str(e))