from config.common_functions.pull_request import pull_cloud_reporting_data
from apps.system_configuration.models import api_details
from apps.spc_cld.models import system, dr_systems
from config.settings.base import Team
from django.db.models import Q

############### BEGIN Initiate logger #############################
from config.logger import init_logging
log = init_logging("logs/dr_sync.log", __name__)
############### END Initiate logger #############################

class sync_dr_systems_data(object):

    def __init__(self, *args, **kwargs):
        super(sync_dr_systems_data, self).__init__()

    def run(self, *args, **kwargs):

        dr_systems_api_detail = api_details.objects.get(unique_id="DR_SYSTEMS") # Get count API details
        
        dr_systems_data = pull_cloud_reporting_data(url=dr_systems_api_detail.end_point, cert=dr_systems_api_detail.auth.auth, key=dr_systems_api_detail.auth.key)
        
        self.update_table(data=dr_systems_data)

    def update_table(self, *args, **kwargs):

        dr_systems.objects.all().delete()

        for index, data in kwargs['data'].iterrows():

            has_prod = False
            has_dr = False
            SecondaryDC = ""
            PrimaryDC = ""
            SystemRole = ""
            SID = ""
            DBSID = ""
            
            CUST_DETAILS = system.objects.filter(CustomerID__icontains=data['Customer ID'],LifeCycleStatus__in=['L','UPG'], SystemRole__in=["S4_PC","S4_1C"]).exclude(SystemRole__icontains="HANA")
            
            if CUST_DETAILS.exists():
                
                PrimaryDC =CUST_DETAILS[0].DataCenterID.code

                SystemRole = CUST_DETAILS[0].SystemRole

                GET_P_DETAILS = CUST_DETAILS.filter(Q(BusinessType='ZH001')|Q(BusinessType='ZH006')).filter(LifeCycleStatus='L')
                
                if GET_P_DETAILS.exists():

                    for SYSDET in GET_P_DETAILS:
                        SID = SYSDET.SID
                        DBSID = SYSDET.DBSystemID
                        CHECK_DR = system.objects.filter(SID=SID,SystemNumber__regex='^DR_')
                        has_dr = False
                        has_prod = True
                        PrimaryDC =SYSDET.DataCenterID.code
                        

                        if CHECK_DR.exists():
                            has_dr = True
                            SecondaryDC = CHECK_DR[0].DataCenterID.code

                        dr_systems.objects.update_or_create(CustomerID=data['Customer ID'],SID=SID,defaults={
                                    'CustomerName' : data['Customer'],
                                    'has_prod' : has_prod,
                                    'has_dr':has_dr,
                                    'PrimaryDC'  : PrimaryDC,
                                    'SecondaryDC' :SecondaryDC,
                                    'DBSID' : DBSID,
                                    'quantity' : data['Quantity'],
                                    'SystemRole' : SystemRole
                                    })
                else:
                    

                    dr_systems.objects.update_or_create(CustomerID=data['Customer ID'],defaults={
                                'CustomerName' : data['Customer'],
                                'has_prod' : has_prod,
                                'has_dr':has_dr,
                                'PrimaryDC'  : PrimaryDC,
                                'SecondaryDC' :SecondaryDC,
                                'SID' : SID,
                                'DBSID' : DBSID,
                                'quantity' : data['Quantity'],
                                'SystemRole' : SystemRole
                                })

    def CheckAndChange(self):

        DRSYSTEMS = dr_systems.objects.exclude(SID='')

        for systemSID in DRSYSTEMS:

            DR_SYSTEM_COUNT = system.objects.filter(SID=systemSID.SID,SystemRole__in=["S4_PC", "S4_1C"],SystemNumber__regex='^DR_').exclude(SystemRole__icontains="HANA")

            if DR_SYSTEM_COUNT.count() != 0:
                
                dr_systems.objects.update_or_create(SID=systemSID.SID,defaults={'has_dr':True,'SecondaryDC' :DR_SYSTEM_COUNT[0].DataCenterID})