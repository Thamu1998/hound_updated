import subprocess
from django.contrib.auth.models import Group
from apps.user_account.models import User
from config.settings.base import CAM_APP_TEAM, CAM_SM_TEAM, CAM_APP_READ

def checkCamAccess(Inumber):
    try:
        cmd = ["id", Inumber]

        data = subprocess.check_output(cmd)

        data = data.decode("utf-8")
        
        # data = "uid=3326707(i326707) gid=58000(adsuser) groups=58000(adsuser),58095(cam_s4h_cc_os_project_vlab),58088(cam_s4h_cc_os_clmoq_vlab),58091(cam_s4h_cc_os_perf_vlab),58036(cam_s4h_aerial_access),58052(cam_s4h_argus_viewer),58081(cam_s4h_splunk_users),58067(cam_ibp_cc_os_vlab),58057(cam_s4h_cc_os_dlab),58104(cam_s4h_cc_os_ilab),58066(cam_s4h_cc_os_vlab),58092(cam_smc_cc_os_vlab),58031(os_master_cc_s4),58025(cam_ibp_cc_os),58050(cam_s4h_cc_os),58069(cam_smc_cc_os),58120(cam_s4h_hound_sm),58063(cam_s4h_cc_os_project),58085(cam_cis_cc_os_lama),58032(os_master_gcp_and_cc_s4),58012(cam_s4h_repo_viewer),58062(cam_s4h_hound_access),58071(cam_smc_cc_os_eu_only)"
        
        if CAM_APP_TEAM in data and "_eu_only" in data:
            return (True, "ops_member", "EU_APP_OP", "ADHOC_ACTI_APP_EU")

        elif CAM_APP_TEAM in data and "_eu_only" not in data:
            return (True, "ops_member", "BRL_APP_OP", "ADHOC_ACTI")

        elif CAM_SM_TEAM in data and "_eu_only" in data:
            return (True, "ops_member", "EU_SM_OP", "ADHOC_ACTI_SM_EU")

        elif CAM_SM_TEAM in data and "_eu_only" not in data:
            return (True, "ops_member", "BRL_SM_OP", "ADHOC_ACTI_SM")
        
        elif CAM_APP_READ in data:
            return (True, "non_ops_member", "NON_OPS", "ADHOC_ACTI_NON_OPS")

        else:
            return (False, "", "no access", "ADHOC_ACTI_NON_OPS")   

    except Exception as e:
        return (False, "", "no access", "ADHOC_ACTI_NON_OPS") 

def getUserDetails(Inumber):
    
    Auth = "ApiDetails.objects.get(UniqName='LDAP').Authorization"

    DN_NAME = "ApiDetails.objects.get(UniqName='LDAP').EndPoint"

    cmd = 'LDAPTLS_REQCERT=never ldapsearch -v -x -H ldaps://ldap-rot.shp.rot.s4h.sap.corp -D "{DN_NAME}" -w {Auth} -b dc=shp,dc=rot,dc=s4h,dc=sap,dc=corp uid={inumber}'.format(inumber=Inumber, Auth=Auth, DN_NAME=DN_NAME)
    
    data= subprocess.check_output(cmd, shell=True)

    data=data.decode("utf-8").split("\n")

    FinalData = {'Fname':None,'Lname':None,'mail':None}

    for dat in data:
        if dat.split(':')[0] == 'mail':
            FinalData['mail'] = dat.split(':')[1]
            
        if dat.split(':')[0] == 'displayName':
            FinalData['Lname'] = dat.split(':')[1].split(',')[0]
            FinalData['Fname'] = dat.split(':')[1].split(',')[1]

    if FinalData['mail'] != None:        
        EditUserDetailsTmp = User.objects.get(username=Inumber)
        EditUserDetailsTmp.first_name = FinalData['Fname']
        EditUserDetailsTmp.last_name = FinalData['Lname']
        EditUserDetailsTmp.email = FinalData['mail']
        try:
            EditUserDetailsTmp.save()
        except Exception as e:
            EditUserDetailsTmp.first_name = "FirstName"
            EditUserDetailsTmp.last_name = "LastName"
            EditUserDetailsTmp.email = "dummy@hound.com"
            EditUserDetailsTmp.save()  
