import logging
def init_logging(logfile,name):
    try:
        logger = logging.getLogger(name)

        logger.setLevel(logging.DEBUG)
        # create file handler which logs even debug messages

        fh = logging.FileHandler(logfile)
        fh.setLevel(logging.DEBUG)

        # create console handler with a higher log level
        ch = logging.StreamHandler()
        ch.setLevel(logging.ERROR)

        # create formatter and add it to the handlers
        formatter = logging.Formatter('%(asctime)s [%(levelname)s - %(lineno)d ] - [%(filename)s] - [%(funcName)s] : %(message)s', datefmt='%m/%d/%Y %H:%M:%S')
        ch.setFormatter(formatter)
        fh.setFormatter(formatter)

        # add the handlers to logger
        logger.addHandler(ch)
        logger.addHandler(fh)

        return logger
    except Exception as e:
        print(str(e))
