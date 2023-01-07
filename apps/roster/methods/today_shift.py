from apps.roster.models import shift, task_plan, shift_type
import datetime
from apps.user_account.models import subTeam, team

class today_plan(object):

    def __init__(self, *args, **kwargs):
        super(today_plan, self).__init__()
        self.user_info = kwargs['user_info']

    def plan(self, *args, **kwargs):

        final_data = {}
        
        selected_team = self.user_info.team.code if kwargs['team_id'] == None else team.objects.get(code=kwargs['team_id']).code

        location_code = self.user_info.team.location.code if kwargs['team_id'] == None else team.objects.get(code=kwargs['team_id']).location.code

        if kwargs.get('selected_team', None):

            selected_team = self.user_info.team.code

            location_code = self.user_info.team.location.code

        get_group_list = subTeam.objects.values('code', 'name').filter(team__code=selected_team)

        get_shift_list = shift_type.objects.values('code', 'name', 'time_info', 'ordering').filter(is_allow_in_dashboard=True, location__code=location_code).order_by('ordering')

        get_today_task = task_plan.objects.filter(sdate=datetime.datetime.today(), member__team__code=selected_team, task__code__in=[grp['code'] for grp in get_group_list])

        get_today_shift = shift.objects.filter(sdate=datetime.datetime.today(), member__team__code=selected_team, shift__code__in=[sft['code'] for sft in get_shift_list])

        for shift_inst in get_shift_list:

            final_data[shift_inst['code']] = {}

            shift_member = get_today_shift.values_list('member__username', flat=True).filter(shift__code=shift_inst['code'])
            
            for mem in shift_member:
                
                task_details = get_today_task.get(member__username=mem)
                
                final_data[shift_inst['code']].setdefault(task_details.task.code, []).append({'name': task_details.member.get_full_name(), 'inumber': task_details.member.username, 'email': task_details.member.email,'task_name': task_details.task.name})
        
        shift_info = {sf['code']:{'name':sf['name'], 'time_info': sf['time_info']} for sf in get_shift_list}      
        
        return {"plan":final_data, "meta":shift_info}
