from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.views.generic import FormView, TemplateView
from django.db.models import Q, Count, Sum, Max
import json
import datetime
from .bg import sync_cld_data
from background_task.models import Task
from .methods.sync_dr_systems import sync_dr_systems_data

##MODEL-IMPORT
from .models import system, host, tenant, datacenter_decs, dr_systems

##SERIALIZER IMPORT
from .serializers import system_serializer, host_serializer, tenant_serializer, datacenter_decs_serializer, dr_systems_serializer

#IMPORT COMMON FUNCTIONS
from config.common_functions import query_builder

#IMPORT OPTION-FILTER
from .filter_options import options_system_cld, options_host_cld, options_tenant_cld, options_datacenter_decs

# Create your views here.

class dashboard_html(TemplateView):

    template_name = "spc_cld/dashboard.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class sync_dr_systems(APIView):

    def get(self, request):
        try:
            sync_dr_systems_data_inst = sync_dr_systems_data()
            sync_dr_systems_data_inst.run()

            return Response({'detail': 'Successfully synced'})
        except Exception as e:
            return Response(str(e),status=500)


class system_cld_html(TemplateView):

    template_name = "spc_cld/system_cld.html"

    def get_context_data(self, **kwargs):
        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = options_system_cld(model_filter=model_filter, model_exclude=model_exclude)
        context['page_title'] = "System View"
        context['card_title'] = "System View"
        context['tabel_name'] = "system"
        context['default_query_filter'] = "&"+default_query_filter_excel   
        context['query_api_url'] = "/cld/api/system/list/?format=datatables"+"&"+default_query_filter
        return context

class tenant_cld_html(TemplateView):

    template_name = "spc_cld/tenant_cld.html"

    def get_context_data(self, **kwargs):
        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = options_tenant_cld(model_filter=model_filter, model_exclude=model_exclude)
        context['page_title'] = "Tenant List"
        context['card_title'] = "Tenant List"
        context['tabel_name'] = "tenant"
        context['default_query_filter'] = "&"+default_query_filter_excel
        context['query_api_url'] = "/cld/api/tenant/list/?format=datatables"+"&"+default_query_filter
        return context

class host_cld_html(TemplateView):

    template_name = "spc_cld/host_cld.html" 

    def get_context_data(self, **kwargs):

        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)
        
        context = options_host_cld(model_filter=model_filter, model_exclude=model_exclude)
        context['page_title'] = "Host List"
        context['card_title'] = "Host List"
        context['tabel_name'] = "host"
        context['default_query_filter'] = "&"+default_query_filter_excel
               
        
        context['query_api_url'] = "/cld/api/host/list/?format=datatables"+"&"+default_query_filter
        return context

class sync_master_data(APIView):

    def get(self, request):
        try:
            from .methods.sync_master import sync_master_data

            sync_master_data_init = sync_master_data()

            # sync_master_data_init.sync()

            get_result = sync_master_data_init.match_infra_data()
            
            return Response({"message": get_result})
        except Exception as e:
            return Response(str(e),status=500)

class sync_system_cld(APIView):

    def get(self, request):

        # is_repeat = self.request.GET.get('repeat', None)

        # existing_tasks = Task.objects.filter(task_name="apps.spc_cld.bg.sync_cld_data")

        # if not existing_tasks.exists():

        #     if is_repeat == None:
        #         sync_cld_data()
        #     else:
        #         sync_cld_data(repeat=86400)

        sync_cld_data_init = sync_cld_data()

        sync_cld_data_init.run(cld_type="CLD_SYSTEM")

        return Response({"message": "Sync Scheduled"})

class dr_systems_mv(ModelViewSet):

    queryset = dr_systems.objects.all()
    serializer_class = dr_systems_serializer

class dr_systems_html(TemplateView):

    template_name = "spc_cld/dr_systems.html"


class system_list_view(ModelViewSet):
    
    queryset = system.objects.all()

    serializer_class = system_serializer

    def get_queryset(self):
        try:

            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)
                
            queryset = system.objects.filter(model_filter).exclude(model_exclude).order_by('-EntityLastChangedOn')

            return queryset
            
        except Exception as e:
            return Response(str(e),status=500)

class host_list_view(ModelViewSet):
    
    queryset = host.objects.all()

    serializer_class = host_serializer

    def get_queryset(self):
        try:

            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)
            
            queryset = host.objects.filter(model_filter).exclude(model_exclude).order_by('-SystemNumber')
    
            return queryset
            
        except Exception as e:
            return Response(str(e),status=500)

class tenant_list_view(ModelViewSet):
    
    queryset = tenant.objects.all()

    serializer_class = tenant_serializer

    def get_queryset(self):
        try:

            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)
            
            queryset = tenant.objects.filter(model_filter).exclude(model_exclude).order_by('-SystemNumber')
    
            return queryset
            
        except Exception as e:
            return Response(str(e),status=500)

class customer_system_in_different_zone_html(TemplateView):

    template_name = "spc_cld/customer_in_diff_nw.html"

class customer_system_in_different_zone_mv(APIView):

    def get(self, request):
        try:            
            get_difference  = system.objects.filter(LifeCycleStatus="L").exclude(Q(CustomerID="")|Q(BusinessType__in=['ZH002','ZH005'])).values('CustomerID', 'CustomerName').annotate(different_nw=Count("NetworkSegmentID", distinct=True)).filter(different_nw__gte=2).order_by('CustomerID')
            
            customer_list = {details['CustomerID']:details['CustomerName'] for details in get_difference}
            
            final_data_set = []

            for customerID in customer_list:

                temp_list = []

                queryset = system.objects.exclude(Q(CustomerID="")|Q(BusinessType__in=['ZH002','ZH005'])).filter(LifeCycleStatus="L", CustomerID=customerID)
                
                distinct_nw = queryset.values_list('NetworkSegmentID', flat=True).distinct("NetworkSegmentID").order_by('NetworkSegmentID')
                
                for nw in distinct_nw:

                    nw_count = queryset.filter(NetworkSegmentID=nw).count()

                    temp_list.append({'CustomerID': customerID, 'CustomerName':customer_list[customerID], 'NetworkSegmentID':nw, 'count': nw_count})

                final_data_set.append(temp_list)
       
            return Response(final_data_set)

        except Exception as e:
            return Response(str(e), status=500)

class system_in_different_zone_html(TemplateView):

    template_name = "spc_cld/host_in_diff_nw.html"

class system_in_different_zone_mv(APIView):

    def get(self, request):
        try:            
            get_difference  = host.objects.filter(LifeCycleStatus="L").exclude(Q(ComputerSystemResourcePool="")|Q(InstanceType="DBC")).values('SID__DBSystemID').annotate(different_nw=Count("ComputerSystemResourcePool", distinct=True)).filter(different_nw__gte=2).order_by('SID__DBSystemID')
            
            system_list = set([DBSystemID['SID__DBSystemID'] for DBSystemID in get_difference])

            final_data_set = []

            for db_system in system_list:
                get_nw_count = host.objects.filter(LifeCycleStatus="L", SID__DBSystemID=db_system).exclude(Q(ComputerSystemResourcePool="")|Q(InstanceType="DBC")).values("SID__DBSystemID","ComputerSystemResourcePool").annotate(count=Count("ComputerSystemResourcePool"))
                
                final_data_set.append(get_nw_count)
            
            return Response(final_data_set)

        except Exception as e:
            return Response(str(e), status=500)

class prod_sys_without_ai_html(TemplateView):

    template_name = "spc_cld/system_cld.html"

    def get_context_data(self, **kwargs):
        excel_filter = ";".join(system.objects.filter(BusinessType__in=['ZH006','ZH001'],LifeCycleStatus__in=['L','UPG']).exclude(Q(SystemRole__icontains="_HANA")|Q(SystemRole__icontains="_SC")|Q(CustomerID="")|Q(SystemNumber__icontains='HA_')|Q(SystemNumber__icontains='DR_')|Q(SystemNumber__icontains='MIG2CC_')|Q(CustomerID="")).values_list('SID', flat=True).annotate(HaAI=Count('SystemDetails', filter=Q(SystemDetails__InstanceType='D'))).filter(HaAI=0))
        
        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = options_system_cld(**kwargs, model_filter=model_filter, model_exclude=model_exclude)
        context['page_title'] = "Production system without AI"
        context['card_title'] = "Production system without AI"
        context['tabel_name'] = "system"
        context['default_query_filter'] = "&"+default_query_filter_excel+"&LifeCycleStatus=L"+"&SID="+excel_filter   
        context['query_api_url'] = "/cld/api/prod/no/ai/?format=datatables"+"&"+default_query_filter
        return context

class prod_sys_without_ai_mv(ModelViewSet):

    queryset = system.objects.all()

    serializer_class = system_serializer

    def get_queryset(self):
        try:
            queryset = system.objects.filter(BusinessType__in=['ZH006','ZH001'],LifeCycleStatus__in=['L','UPG']).exclude(Q(SystemRole__icontains="_HANA")|Q(SystemRole__icontains="_SC")|Q(CustomerID="")|Q(SystemNumber__icontains='HA_')|Q(SystemNumber__icontains='DR_')|Q(SystemNumber__icontains='MIG2CC_')|Q(CustomerID="")).annotate(HaAI=Count('SystemDetails', filter=Q(SystemDetails__InstanceType='D'))).filter(HaAI=0)
        
            return queryset
        except Exception as e:
            return Response(str(e), status=500)

class db_tenant_with_more_than_2_shared_container_html(TemplateView):

    template_name = "spc_cld/system_cld.html"

    def get_context_data(self, **kwargs):
        excel_filter = ";".join(system.objects.filter(LifeCycleStatus="L", SystemRole__icontains="_HANA").values_list('SID', flat=True).annotate(total=Count('SystemDetails_Tenant', filter=Q(SystemDetails_Tenant__TenantBusinessType="ZH053"))).filter(total__gt=2).order_by('SID'))
        
        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = options_system_cld(**kwargs, model_filter=model_filter, model_exclude=model_exclude)
        context['page_title'] = "DB with more than 2 Shared Containers"
        context['card_title'] = "DB with more than 2 Shared Containers"
        context['tabel_name'] = "system"
        context['default_query_filter'] = "&"+default_query_filter_excel+"&LifeCycleStatus=L"+"&SID="+excel_filter
        context['query_api_url'] = "/cld/api/more/2/sh/container/?format=datatables"+"&"+default_query_filter
        return context

class db_tenant_with_more_than_2_shared_container_mv(ModelViewSet):

    queryset = system.objects.all()

    serializer_class = system_serializer

    http_method_names = ['get', 'head']

    def get_queryset(self):
        try:
            
            queryset = system.objects.filter(LifeCycleStatus="L", SystemRole__icontains="_HANA").annotate(total=Count('SystemDetails_Tenant', filter=Q(SystemDetails_Tenant__TenantBusinessType="ZH053"))).filter(total__gt=2).order_by('SID')
    
            return queryset
            
        except Exception as e:
            return Response(str(e),status=500)

class not_a_valid_pip_html(TemplateView):

    template_name = "spc_cld/system_cld.html"

    def get_context_data(self, **kwargs):
        excel_filter = ";".join(system.objects.filter(LifeCycleStatus="PIP", EntityLastChangedOn__lt=datetime.datetime.now()- datetime.timedelta(days=30)).values_list('SID', flat=True))
        
        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = options_system_cld(**kwargs, model_filter=model_filter, model_exclude=model_exclude)
        context['page_title'] = "Not a valid PIP system"
        context['card_title'] = "Not a valid PIP system"
        context['tabel_name'] = "system"
        context['default_query_filter'] = "&"+default_query_filter_excel+"&LifeCycleStatus=PIP"+"&SID="+excel_filter
        context['query_api_url'] = "/cld/api/not/valid/pip/?format=datatables"+"&"+default_query_filter
        return context

class dc_mapping_mv(ModelViewSet):

    queryset = datacenter_decs.objects.all()

    serializer_class = datacenter_decs_serializer

    def get_queryset(self):
        try:

            get_filter_raw = self.request.query_params

            model_filter, model_exclude = query_builder.generate_datatable(query=get_filter_raw)
            
            queryset = datacenter_decs.objects.filter(model_filter).exclude(model_exclude)
    
            return queryset
            
        except Exception as e:
            return Response(str(e),status=500)

class dc_mapping_html(TemplateView):

    template_name = "spc_cld/datacenter_mapping.html"

    def get_context_data(self, **kwargs):
        default_query_filter_excel = "&".join(query+"="+self.request.GET[query] for query in self.request.GET)

        default_query_filter = "&".join(query+"_flt"+"="+self.request.GET[query] for query in self.request.GET)

        get_filter_raw = self.request.GET

        model_filter, model_exclude = query_builder.generate(query=get_filter_raw)

        context = options_datacenter_decs(model_filter=model_filter, model_exclude=model_exclude)
        context['page_title'] = "Datacenter List"
        context['card_title'] = "Datacenter List"
        context['tabel_name'] = "datacenter_decs"
        context['default_query_filter'] = "&"+default_query_filter_excel
        context['query_api_url'] = "/cld/api/datacenter/?format=datatables"+"&"+default_query_filter
        return context

class not_a_valid_pip_mv(ModelViewSet):

    queryset = system.objects.all()

    serializer_class = system_serializer

    http_method_names = ['get', 'head']

    def get_queryset(self):
        try:
            
            queryset = system.objects.filter(LifeCycleStatus="PIP", EntityLastChangedOn__lt=datetime.datetime.now()- datetime.timedelta(days=30))
    
            return queryset
            
        except Exception as e:
            return Response(str(e),status=500)





