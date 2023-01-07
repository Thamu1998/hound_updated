from apps.daily_availability.models import availability
import pandas as pd
import datetime
from django.db.models import Count, Avg, Q, Sum
from apps.spc_cld.models import system
from rest_framework.views import APIView
from rest_framework.response import Response
from config.common_functions.common_querys import get_application_system_role


class yesterday_availability(APIView):

    def get(self, request):
        try:
            report_date = datetime.datetime.today().date() - datetime.timedelta(days=1)

            system_role_list = get_application_system_role()
            
            prod_queryset = availability.objects.filter(StartDateTime__date=report_date, SystemRole__in=system_role_list, BusinessType__in=["ZH001", "ZH006"])
            
            prod_persentage = prod_queryset.aggregate(avg=Avg('AvailabilityInPercentage'))

            prod_persentage = str(prod_persentage['avg'])[:5]
            
            prod_sys_down = prod_queryset .exclude(AvailabilityInPercentage=100).count()

            prod_down_min = prod_queryset.aggregate(total=Sum('TotalUnplannedCommunicatedDowntimesInMinutes'))['total']
            
            prod_count = prod_queryset.count()

            non_prod_queryset = availability.objects.filter(StartDateTime__date=report_date, SystemRole__in=system_role_list).exclude(BusinessType__in=["ZH001", "ZH006"])

            non_prod_persentage = non_prod_queryset.aggregate(avg=Avg('AvailabilityInPercentage'))
            
            non_prod_persentage = str(non_prod_persentage['avg'])[:5]

            non_prod_sys_down = non_prod_queryset .exclude(AvailabilityInPercentage=100).count()

            non_prod_down_min = non_prod_queryset.aggregate(total=Sum('TotalUnplannedCommunicatedDowntimesInMinutes'))['total']

            non_prod_count = non_prod_queryset.count()
            
            return Response({'prod_persentage': prod_persentage, 'prod_sys_down': prod_sys_down, 'prod_down_min': prod_down_min, 'prod_count': prod_count, 'non_prod_persentage': non_prod_persentage, 'non_prod_sys_down': non_prod_sys_down, 'non_prod_down_min': non_prod_down_min, 'non_prod_count': non_prod_count})


        except Exception as e:
            return Response(str(e),status=500)

class calculate_availability_prod(APIView):

    def get(self, request):
        try:

            _final_availability = []

            _availability_date = []

            min_value = 0

            _last_4_days = [datetime.datetime.today().date() - datetime.timedelta(days=report_date) for report_date in reversed(range(1,5))]

            system_role_list = [system_role for system_role in system.objects.exclude(Q(SystemRole__icontains="_SC")|Q(SystemRole__icontains="_HANA")).values_list('SystemRole', flat=True).distinct('SystemRole').order_by('SystemRole')]

            for system_role in system_role_list:

                temp_data = []

                for report_date in _last_4_days:
                    
                    count = availability.objects.filter(StartDateTime__date=report_date, SystemRole=system_role, BusinessType__in=["ZH001", "ZH006"]).count()
                    
                    availability_persentage = availability.objects.filter(StartDateTime__date=report_date, SystemRole=system_role, BusinessType__in=["ZH001", "ZH006"]).values('SystemRole').annotate(avg=Avg('AvailabilityInPercentage'))
                    
                    if len(availability_persentage) != 0:

                        if not report_date in _availability_date:
                            _availability_date.append(report_date)

                        if min_value == 0:
                            min_value = availability_persentage[0]['avg']
                        else:
                            if min_value > availability_persentage[0]['avg']:
                                min_value = availability_persentage[0]['avg']

                        temp_data.append(str(availability_persentage[0]['avg'])[:5])
                
                _final_availability.append({'name': system_role, 'data': temp_data})
            
            dates_list = [date.strftime("%b %d") for date in _availability_date]

            minus_with = 100-min_value

            if minus_with < 0.05:
                minus_with = 0.05

            return Response({"data":_final_availability, "label": dates_list ,'min_value':round(min_value-(minus_with), 4)})
        except Exception as e:
            return Response(str(e),status=500)

class calculate_availability_nonprod(APIView):

    def get(self, request):
        try:

            _final_availability = []

            _availability_date = []

            min_value = 0

            _last_4_days = [datetime.datetime.today().date() - datetime.timedelta(days=report_date) for report_date in reversed(range(1,5))]

            system_role_list = [system_role for system_role in system.objects.exclude(Q(SystemRole__icontains="_SC")|Q(SystemRole__icontains="_HANA")).values_list('SystemRole', flat=True).distinct('SystemRole').order_by('SystemRole')]

            for system_role in system_role_list:

                temp_data = []

                for report_date in _last_4_days:
                    
                    count = availability.objects.filter(StartDateTime__date=report_date, SystemRole=system_role).exclude(BusinessType__in=["ZH001", "ZH006"]).count()
                    
                    availability_persentage = availability.objects.filter(StartDateTime__date=report_date, SystemRole=system_role).exclude(BusinessType__in=["ZH001", "ZH006"]).values('SystemRole').annotate(avg=Avg('AvailabilityInPercentage'))
                    
                    if len(availability_persentage) != 0:

                        if not report_date in _availability_date:
                            _availability_date.append(report_date)

                        if min_value == 0:
                            min_value = availability_persentage[0]['avg']
                        else:
                            if min_value > availability_persentage[0]['avg']:
                                min_value = availability_persentage[0]['avg']
                            
                        temp_data.append(str(availability_persentage[0]['avg'])[:5])
                
                _final_availability.append({'name': system_role, 'data': temp_data})
            
            dates_list = [date.strftime("%b %d") for date in _availability_date]

            minus_with = 100-min_value

            if minus_with < 0.05:
                minus_with = 0.05

            return Response({"data":_final_availability, "label": dates_list,'min_value':round(min_value-(minus_with), 3)})
        except Exception as e:
            return Response(str(e),status=500)
            