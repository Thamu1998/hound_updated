

from datetime import datetime,timedelta

class date_method:

    def __init__(self):
        super(date_method, self).__init__()

    def shift_date_check(self,*args,**kwargs):

        req_date=kwargs['shift_date']
        shift=kwargs['shift_type']

        
        req_date=datetime.strptime(req_date,"%Y-%m-%dT%H:%M")

        current_date=datetime.now().date()

        if shift == 'Night':

            if shift == 'Night' and current_date == req_date.date():
                return True
            elif shift == 'Night' and current_date - timedelta(days=1) == req_date.date():
                return True
            else:
                return False
        
        elif req_date.date() == current_date:
            return True
        else:
            return False