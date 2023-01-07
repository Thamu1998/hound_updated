from .methods.create_time_series import create_time_series
from .methods.pingdom_status import sync_status
from background_task import background
import time

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/pingdom_sync.log", __name__)
############### END Initiate logger #############################

@background(schedule=10)
def pingdom_sync_data():
    try:
        start = time.time()

        sync_status_init = sync_status()

        sync_status_init.sync()

        create_time_series_inst = create_time_series()

        create_time_series_inst.generate_time_series()

        duration = (time.time() - start)

    except Exception as e:
        log.error(str(e))