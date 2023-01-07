from apps.roster.models import shift, task_plan, change_request, shift_type
import datetime
from apps.user_account.models import User

class work_plan(object):

    def __init__(self, *args, **kwargs):
        super(work_plan, self).__init__()
        self.member = kwargs['member']

    def get_plan(self, *args, **kwargs):

        data_set = []

        get_next_plan_month = shift.objects.filter(member=self.member, sdate__month=datetime.datetime.now().month, sdate__year=datetime.datetime.now().year, sdate__gte=datetime.datetime.now()- datetime.timedelta(days=5), sdate__lt=datetime.datetime.now() + datetime.timedelta(days=10)).order_by('sdate')

        get_next_task_month = task_plan.objects.filter(member=self.member, sdate__month=datetime.datetime.now().month, sdate__year=datetime.datetime.now().year, sdate__gte=datetime.datetime.now()- datetime.timedelta(days=5), sdate__lt=datetime.datetime.now() + datetime.timedelta(days=10)).order_by('sdate')

        get_change_request = {data['sdate']:{'change_to': data['change_to__code'], 'status__code':data['status__code'], 'admin_name': "" if data['approver'] == None else User.objects.get(id=data['approver']).get_full_name()} for data in change_request.objects.values('sdate', 'change_to__code', 'status__code', 'approver').filter(member=self.member, sdate__month=datetime.datetime.now().month, sdate__year=datetime.datetime.now().year, sdate__gte=datetime.datetime.now()- datetime.timedelta(days=5), sdate__lt=datetime.datetime.now() + datetime.timedelta(days=10)).exclude(status="APPROVED").order_by('sdate')}
        
        for plan in get_next_plan_month:

            shift_code = plan.shift.code

            shift_name = plan.shift.name

            date = plan.sdate.strftime('%B %d, %Y')

            change_req_status = get_change_request.get(plan.sdate, None)

            if change_req_status:
                
                change_req_status['status'] = shift_type.objects.get(code=change_req_status['change_to']).name + " request waiting for approval"

                if change_req_status['status__code'] == "REJECTED":
                    change_req_status['status'] = shift_type.objects.get(code=change_req_status['change_to']).name + " request rejected by"

            status = None

            if plan.status:
                status = plan.status.name
            
            temp_data = {'sdate': plan.sdate, 'day': plan.sdate.strftime('%d'), 'date': plan.sdate.strftime('%a'), 'plan':{'shift_code': shift_code, 'shift_name':shift_name, 'status': status, 'task': get_next_task_month.get(sdate=plan.sdate).task.code, 'task_name':get_next_task_month.get(sdate=plan.sdate).task.name, 'pending_change_request': change_req_status}}

            data_set.append(temp_data)

        return data_set

