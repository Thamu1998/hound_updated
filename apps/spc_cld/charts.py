from calendar import month_name
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q, Count, Sum, Max
from functools import reduce
import datetime
from dateutil.relativedelta import relativedelta
from config.common_functions.app_parameter import bg_color_chart
from config.common_functions.common_querys import get_all_system_role, get_application_system_role, get_database_system_role

# IMPORT-MODELS
from apps.spc_cld.models import system, host, dr_systems

class system_in_pip(APIView):

    def get(self, *args, **kwargs):
        try:
            get_pip_data = system.objects.filter(LifeCycleStatus="PIP").values('SystemRole').annotate(total=Count('SystemRole')).order_by('SystemRole')
            
            cht_label = [label['SystemRole'] for label in get_pip_data]

            cht_value = [value['total'] for value in get_pip_data]

            cht_label_color = [bg_color_chart.get(label['SystemRole'], '#6c757d')  for label in get_pip_data]

            total_count = sum(cht_value)

            text_with_color = "In-Prepration"

            text_sub = "Systems"

            text_color = 'text-warning'

            return Response({'label': cht_label, 'value': cht_value, 'label_color':cht_label_color ,'total': total_count, 'text_with_color':text_with_color, 'text_sub': text_sub, 'text_color': text_color})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class system_in_dip(APIView):

    def get(self, *args, **kwargs):
        try:
            get_dip_data = system.objects.filter(LifeCycleStatus="DIP").values('SystemRole').annotate(total=Count('SystemRole')).order_by('SystemRole')
            
            cht_label = [label['SystemRole'] for label in get_dip_data]

            cht_value = [value['total'] for value in get_dip_data]

            cht_label_color = [bg_color_chart.get(label['SystemRole'], '#6c757d')  for label in get_dip_data]

            total_count = sum(cht_value)

            text_with_color = "Decommissioning"

            text_sub = "in Process"

            text_color = 'text-danger'

            return Response({'label': cht_label, 'value': cht_value, 'label_color':cht_label_color ,'total': total_count, 'text_with_color':text_with_color, 'text_sub': text_sub, 'text_color': text_color})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class system_in_n_minus_version(APIView):

    def get(self, *args, **kwargs):
        try:
            get_version_data = system.objects.exclude(Q(LifeCycleStatus__in=["DIP", "D"])|Q(LeadingProductPatchVersion=0)).values('SystemRole','LeadingProductPatchVersion').annotate(total=Count('SystemRole')).order_by('SystemRole')
            
            max_version_list = {}

            final_version_list = {}

            for version in get_version_data:
                
                if max_version_list.get(version['SystemRole'], None):
                    if max_version_list[version['SystemRole']]['max'] < version['total']:
                        max_version_list[version['SystemRole']] = {'max': version['total'], 'version': version['LeadingProductPatchVersion']}
                else:
                    max_version_list[version['SystemRole']] = {'max': version['total'], 'version': version['LeadingProductPatchVersion']}
            
            for version in get_version_data:
                
                if max_version_list[version['SystemRole']]['max'] != version['total']:                    
                    
                    if final_version_list.get(version['SystemRole'], None):
                        
                        final_version_list[version['SystemRole']]['total'] = int(final_version_list[version['SystemRole']]['total']) + int(version['total'])
                        
                    else:
                        final_version_list[version['SystemRole']] = {'total': int(version['total'])}
                        
            cht_label = [label for label in final_version_list]
            
            cht_value = [final_version_list[value]['total'] for value in final_version_list]
            
            cht_label_color = [bg_color_chart.get(label, '#6c757d')  for label in final_version_list]

            text_with_color = "System With N-"

            text_sub = "Version"

            text_color = 'text-primary'

            return Response({'label': cht_label, 'value': cht_value, 'label_color':cht_label_color , 'text_with_color':text_with_color, 'text_sub': text_sub, 'text_color': text_color, 'max_version_list':max_version_list})
            
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class customer_system_in_different_zone(APIView):

    def get(self, *args, **kwargs):
        try:
            
            get_difference = system.objects.filter(LifeCycleStatus="L").exclude(Q(CustomerID="")|Q(BusinessType__in=['ZH002','ZH005'])).values('CustomerID','SystemRole').annotate(different_nw=Count("NetworkSegmentID", distinct=True)).filter(different_nw__gte=2).order_by('CustomerID')

            value = len(get_difference)

            label = "Customer's system in different network"
            
            return Response({'label': label, "value": value})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class system_in_different_zone(APIView):

    def get(self, *args, **kwargs):
        try:
            
            get_difference = host.objects.filter(LifeCycleStatus="L").exclude(Q(ComputerSystemResourcePool="")|Q(InstanceType="DBC")).values('SID__DBSystemID').annotate(different_nw=Count("ComputerSystemResourcePool", distinct=True)).filter(different_nw__gte=2).order_by('SID__DBSystemID')

            value = len(get_difference)

            label = "Host in different network"
            
            return Response({'label': label, "value": value})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class prod_sys_without_ai(APIView):

    def get(self, *args, **kwargs):
        try:
            get_pswa_data = host.objects.filter(LifeCycleStatus__in=["L", "UPG"], SID__BusinessType__in=['ZH001', 'ZH006'],).exclude(Q(SID__SystemRole__icontains="_HANA")|Q(SID__SystemRole__icontains="_SC")|Q(SID__CustomerID="")).values('SID__SID').annotate(total=Count('InstanceType', filter=Q(InstanceType='D'))).filter(total=0).order_by('SID__SID')
            
            value = len(get_pswa_data)

            label = "Production Systems without AI"
            
            return Response({'label': label, "value": value})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class invalid_pip_system(APIView):

    def get(self, *args, **kwargs):
        try:
            get_npip_data = system.objects.filter(LifeCycleStatus="PIP", EntityLastChangedOn__lt=datetime.datetime.now()- datetime.timedelta(days=30)).values('SystemRole').annotate(total=Count('SystemRole')).order_by('SystemRole')

            data_set = [{"value":data['total'],"category": data['SystemRole']} for data in get_npip_data]

            total_count = sum([value['total'] for value in get_npip_data])

            text_with_color = "Not a valid"

            text_sub = "PIP Systems"

            text_color = 'text-primary'

            return Response({'data_set': data_set, 'total': total_count, 'text_with_color':text_with_color, 'text_sub': text_sub, 'text_color': text_color})

        except Exception as e:
            return Response({'detail':str(e)}, status=406)

class db_tenant_with_more_than_2_shared_container(APIView):

    def get(self, *args, **kwargs):
        try:
            get_pswa_data = system.objects.filter(LifeCycleStatus="L", SystemRole__icontains="_HANA").annotate(total=Count('SystemDetails_Tenant', filter=Q(SystemDetails_Tenant__TenantBusinessType="ZH053"))).filter(total__gt=2).order_by('SID')
            
            value = len(get_pswa_data)

            label = "More than 2 Shared containder"
            
            return Response({'label': label, "value": value})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class on_stock(APIView):

    def get(self, *args, **kwargs):
        try:
            on_stock_data = system.objects.filter(LifeCycleStatus="L", CustomerID="").exclude(Q(SystemRole__icontains="_HANA")|Q(SystemRole__icontains="_SC")).values("DataCenterID").annotate(total=Count('SID')).order_by('DataCenterID')

            cht_label = [label['DataCenterID'] for label in on_stock_data]

            cht_value = [value['total'] for value in on_stock_data]

            text_with_color = "On-Stock Availability"

            text_sub = str(sum(cht_value))+" Systems"

            return Response({'label': cht_label, 'value': cht_value, 'title':text_with_color, 'text_sub': text_sub})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class vm_created_on_month(APIView):

    def get(self, *args, **kwargs):
        try:
            month_name = {	'1':'Jan',
                        '2':'Feb',
                        '3':'Mar',
                        '4':'Apr',
                        '5':'May',
                        '6':'Jun',
                        '7':'Jul',
                        '8':'Aug',
                        '9':'Sep',
                        '10':'Oct',
                        '11':'Nov',
                        '12':'Dec'		
                    }
            
            month_list_value = {}

            cht_label = []

            for month in reversed(range(0, 5)):

                month = datetime.datetime.now() - relativedelta(months=month)

                month_list_value[month.month] = 0

                cht_label.append(month_name[str(month.month)])

            date_minus_month = datetime.datetime.now().replace(hour=00, minute=00, day=1) - relativedelta(months=5)

            system_role_list = get_all_system_role()
            
            get_data = host.objects.exclude(InstanceType="DBC").filter(LifeCycleStatus__in=["L", "PIP"], SID__SystemRole__in=system_role_list, ComputerSystemCreationDateTime__range=(date_minus_month, datetime.datetime.now())).values("SID__SystemRole", "ComputerSystemCreationDateTime__month", "ComputerSystemCreationDateTime__year").annotate(total=Count('SID__SystemRole')).order_by('SID__SystemRole', 'ComputerSystemCreationDateTime__month')
            
            cht_value = []

            for month in month_list_value:
                for sys in get_data:
                    if sys['ComputerSystemCreationDateTime__month'] == month:
                        month_list_value[month] = month_list_value[month] + sys['total']

            cht_value = [month_list_value[value] for value in month_list_value]

            total = str(sum(cht_value))

            title = "Created on last 5 Months"

            side_text = " VM's"

            return Response({'label': cht_label, 'value': cht_value, 'total':total ,'title':title, 'side_text': side_text})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

class system_build_on_systemrole(APIView):

    def get(self, *args, **kwargs):
        try:
            data_series = []

            month_name = {	'1':'Jan',
                        '2':'Feb',
                        '3':'Mar',
                        '4':'Apr',
                        '5':'May',
                        '6':'Jun',
                        '7':'Jul',
                        '8':'Aug',
                        '9':'Sep',
                        '10':'Oct',
                        '11':'Nov',
                        '12':'Dec'		
                    }

            date_minus_month = datetime.datetime.now().replace(hour=00, minute=00, day=1) - relativedelta(months=5)
            
            month_list = []

            label = []

            for month in reversed(range(1, 6)):

                month = datetime.datetime.now() - relativedelta(months=month)

                month_list.append(month.month)

                label.append(month_name[str(month.month)])

            system_role_list = get_all_system_role()
            
            get_system_details = host.objects.exclude(InstanceType="DBC").filter(LifeCycleStatus__in=["L", "PIP"], SID__SystemRole__in=system_role_list, ComputerSystemCreationDateTime__range=(date_minus_month, datetime.datetime.now())).values("SID__SystemRole", "ComputerSystemCreationDateTime__month", "ComputerSystemCreationDateTime__year").annotate(total=Count('SID__SystemRole')).order_by('SID__SystemRole', 'ComputerSystemCreationDateTime__month')
            
            for role in system_role_list:

                temp = {'name': role, "data":[]}

                for month in month_list:                    
                    for sys in get_system_details:                        
                        if sys['SID__SystemRole'] == role and sys['ComputerSystemCreationDateTime__month'] == month:
                            temp['data'].append(sys['total'])
                
                data_series.append(temp)

            cht_label_color = [bg_color_chart.get(label, '#6c757d')  for label in system_role_list]
            
            text_with_color = "VM's Created "

            text_sub = "for last 5 Months"

            text_color = 'text-warning'

            # return Response(get_system_details)
            return Response({"label":label, 'data_series': data_series, 'label_color':cht_label_color , 'text_with_color':text_with_color, 'text_sub': text_sub, 'text_color': text_color})
        except Exception as e:
            return Response({'detail': str(e)}, status=406)


class get_overall_version_based_on_systemrole(APIView):

    def get(self, request):
        try:
            version_data = {}

            final_data = {}

            subSeries = {}

            get_version_list = system.objects.exclude(Q(LifeCycleStatus__in=['D','DIP','PIP'])|Q(LeadingProductVersionNumber=0)).filter(SystemRole__in=get_application_system_role()).values('LeadingProductVersionNumber','SystemRole').annotate(total=Count('SystemRole')).order_by('LeadingProductVersionNumber')

            for version in get_version_list:
                version_data.setdefault(version["LeadingProductVersionNumber"], {'category':str(version["LeadingProductVersionNumber"]),'value':0, 'subData':[]})
                version_data[version["LeadingProductVersionNumber"]]['value'] += version["total"]
                version_data[version["LeadingProductVersionNumber"]]['subData'].append({ "category": version["SystemRole"], "value": version["total"] })
                subSeries.setdefault(version["SystemRole"], { "category": version["SystemRole"], "value": 0 })
            
            final_data["series"] = [version_data[version] for version in version_data]
            final_data["subSeries"] = subSeries 

            return Response(final_data)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)

class get_overall_systemrole(APIView):

    def get(self, request):
        try:
            final_data = {'data':[], 'label':[], 'color':[]}

            get_system_role_count = system.objects.exclude(Q(LifeCycleStatus__in=['D','DIP','PIP'])|Q(LeadingProductVersionNumber=0)).filter(SystemRole__in=get_application_system_role()).values('SystemRole').annotate(total=Count('SystemRole')).order_by('SystemRole')

            for data in get_system_role_count:
                final_data['data'].append(data["total"])
                final_data['label'].append(data["SystemRole"])
                final_data['color'].append(bg_color_chart.get(data['SystemRole'], '#6c757d'))

            return Response(final_data)
        except Exception as e:
            return Response({'detail': str(e)}, status=500)

class dr_systems_chart(APIView):

    def get(self, request):
        try:

            GET_DRLC = dr_systems.objects.all()

            COUNT_AVAIL_DR = GET_DRLC.filter(has_dr=True).count()

            COUNT_DR_PRIP  = GET_DRLC.filter(has_dr=False,has_prod=True).count()

            COUNT_LIC_NOT_PROD = GET_DRLC.filter(has_prod=False).count()

            data = {
                    "count":GET_DRLC.count(),
                    "data": {"available":{"name":"Available", "value":COUNT_AVAIL_DR},"dr_to_be_build":{"name":"DR to be build", "value":COUNT_DR_PRIP},"waiting_for_prod":{"name":"Waiting for prod", "value":COUNT_LIC_NOT_PROD}},
            }

            return Response(data)
        except Exception as e:
            return Response({'detail': str(e)}, status=406)

