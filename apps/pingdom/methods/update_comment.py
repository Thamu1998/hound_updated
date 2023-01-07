from apps.pingdom.models import comment_table
import datetime

class update_comment(object):

    def __init__(self, *args, **kwargs):
        super(update_comment, self).__init__()

    def update(self, *args, **kwargs):

        if "SID" in kwargs:
            filter = {"SID": kwargs["SID"]}

        else:
            filter = {"DC": kwargs["DC"]}

        comment_table.objects.update_or_create(**filter, defaults={
                'comment': kwargs['comment'],
                'expry_date': kwargs['expry_date'],
                'comment_by': kwargs['comment_by']
            })

        get_comment = comment_table.objects.filter(**filter).values("SID","DC", "comment", "expry_date", "updated_on", "comment_by_id__first_name", "comment_by_id__last_name")
            
        
        return get_comment