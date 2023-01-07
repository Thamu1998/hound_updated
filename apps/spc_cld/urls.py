from unicodedata import name
from django.urls import include
from django.urls import path
from .views import *
from rest_framework import routers
from apps.spc_cld.charts import *
from django.conf.urls import url,include

router = routers.DefaultRouter()
router.register(r'system/list', system_list_view)
router.register(r'host/list', host_list_view)
router.register(r'tenant/list', tenant_list_view)
router.register(r'prod/no/ai', prod_sys_without_ai_mv)
router.register(r'more/2/sh/container', db_tenant_with_more_than_2_shared_container_mv)
router.register(r'not/valid/pip', not_a_valid_pip_mv)
router.register(r'datacenter', dc_mapping_mv)
router.register(r'drsystems', dr_systems_mv)

app_name = 'spc_cld'

chart_url = [
                path('cht/pip', system_in_pip.as_view(), name="cht_sys_pip"),
                path('cht/dip', system_in_dip.as_view(), name="cht_sys_dip"),
                path('cht/nminus', system_in_n_minus_version.as_view(), name="system_in_n_minus_version"),
                path('cht/cdn', customer_system_in_different_zone.as_view(), name="customer_system_in_different_zone"),
                path('cht/hdn', system_in_different_zone.as_view(), name="system_in_different_zone"),
                path('cht/pnai', prod_sys_without_ai.as_view(), name="prod_sys_without_ai"),
                path('cht/twmsc', db_tenant_with_more_than_2_shared_container.as_view(), name="db_tenant_with_more_than_2_shared_container"),
                path('cht/npip', invalid_pip_system.as_view(), name="invalid_pip_system"),
                path('cht/vm/count', system_build_on_systemrole.as_view(), name="system_build_on_systemrole"),
                path('cht/vm/monthly/count', vm_created_on_month.as_view(), name="vm_created_on_month"),
                path('cht/stock', on_stock.as_view(), name="on_stock"),
                path('datacenter', dc_mapping_html.as_view(), name="dc_mapping_html"),
                path('cht/overall/version', get_overall_version_based_on_systemrole.as_view(), name="get_overall_version_based_on_systemrole"),
                path('cht/systemrole/count', get_overall_systemrole.as_view(), name="get_overall_systemrole"),
                path('cht/drsystems', dr_systems_chart.as_view(), name="dr_systems_chart"),
            ]

html_url = [
                path('', dashboard_html.as_view(), name="dashboard_html"),
                path('system', system_cld_html.as_view(), name="system_cld_html"),
                path('tenant', tenant_cld_html.as_view(), name="tenant_cld_html"),
                path('host', host_cld_html.as_view(), name="host_cld_html"),
                path('prod/missing/ai', prod_sys_without_ai_html.as_view(), name="prod_sys_without_ai_html"),
                path('bd/tenant/sc', db_tenant_with_more_than_2_shared_container_html.as_view(), name="db_tenant_with_more_than_2_shared_container_html"),
                path('custindnw/systems', customer_system_in_different_zone_html.as_view(), name="customer_system_in_different_zone_html"),
                path('system/different/nw', system_in_different_zone_html.as_view(), name="system_in_different_zone_html"),
                path('not/valid/pip', not_a_valid_pip_html.as_view(), name="not_a_valid_pip_html"),
                path('dr/systems', dr_systems_html.as_view(), name="dr_systems_html"),
           ]

api_url = [ 
                path('sync/data', sync_system_cld.as_view(), name="sync_system_cld"),
                path('sync/master/data', sync_master_data.as_view(), name="sync_master_data"),
                path('sync/dr/data', sync_dr_systems.as_view(), name="sync_dr_systems"),
                path('system/different/nw/api', system_in_different_zone_mv.as_view(), name="system_in_different_zone_mv"),
                path('customer/different/nw/api', customer_system_in_different_zone_mv.as_view(), name="customer_system_in_different_zone_mv"),
                url('^api/', include(router.urls)),
                
          ]   

urlpatterns = html_url + api_url + chart_url


