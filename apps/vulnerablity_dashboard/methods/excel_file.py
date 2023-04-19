import pandas as pd
import os
# from apps.vulnerability_dashboard.models import vulnerability_analyse_data
# from ..models import *

class analyse_vulnerability_excel:
    def __init__(self,*args,**kwargs):
        super(analyse_vulnerability_excel,self).__init__()

    def read_excel(self,*args,**kwargs):
        excel=kwargs['excel_file']
        
        df=pd.read_excel(f"{os.path.abspath(os.curdir)}/{excel}")
        new_df=pd.DataFrame()
        ## 1. Total Vulnerabilities count ( seperated with configuration vulneralility and OS vulnerabilities )
        df_os_path=df[df['Remediation Type'].isin(['patch'])]
        df_os_configpath=df[df['Remediation Type'].isin(['Patch_config'])]
        df_configuration_config=df[df['Remediation Type'].isin(['config'])]
        df_configuration_mitigation=df[df['Remediation Type'].isin(['mitigation'])]
        ## 2. Total count of Emergency, critical  and High vulnerability. ------SAP Rating(L), single table -> Vunerable name and total count with chart with list of hosts
        df_sap_rating_high=df[df['SAP Rating'].apply(lambda x:x.lower())=='high']
        df_sap_rating_medium=df[df['SAP Rating'].apply(lambda x:x.lower())=='medium']
        df_sap_rating_critical=df[df['SAP Rating'].apply(lambda x:x.lower())=='critical']
        df_sap_rating_low=df[df['SAP Rating'].apply(lambda x:x.lower())=='low']
        

        ##4. Total offline vulnerabilities -----Online Patch(AT) (fasle is offline) ----> only count
        ##5. Total online vulnerabilities -----Online Patch (AT) (true is online)
        df_patch_online=df[df['Online Patch'] == True]
        df_patch_offline=df[df['Online Patch'] == False]


        ##2. Total count of Emergency, critical  and High vulnerability. ------SAP Rating(L), single table -> Vunerable name and total count with chart with list of hosts
        final_count_of_ECH={}
        high_vulnerability_count={}
        high_vulnerability_count_list=[]
        for high_vulnerability in df_sap_rating_high['Vulnerability'].unique():

            high_host_count=df_sap_rating_high[df_sap_rating_high['Vulnerability'] == high_vulnerability]['Hostname'].tolist()

            high_vulnerability_count[high_vulnerability]=high_host_count
        high_vulnerability_count_list.append(high_vulnerability_count)
        ##############
        medium_vulnerability_count={}
        medium_vulnerability_count_list=[]
        for medium_vulnerability in df_sap_rating_medium['Vulnerability'].unique():

            medium_host_count=df_sap_rating_high[df_sap_rating_high['Vulnerability'] == medium_vulnerability]['Hostname'].tolist()

            medium_vulnerability_count[medium_vulnerability]=medium_host_count
        medium_vulnerability_count_list.append(medium_vulnerability_count)
        ###################l
        critical_vulnerability_count={}
        critical_vulnerability_count_list=[]
        for critical_vulnerability in df_sap_rating_critical['Vulnerability'].unique():

            critical_host_count=df_sap_rating_critical[df_sap_rating_critical['Vulnerability'] == critical_vulnerability]['Hostname'].tolist()

            critical_vulnerability_count[critical_vulnerability]=critical_host_count
        critical_vulnerability_count_list.append(critical_vulnerability_count)
        ##############################

        low_vulnerability_count={}

        low_vulnerability_count_list=[]

        for low_vulnerability in df_sap_rating_low['Vulnerability'].unique():

            low_host_count=df_sap_rating_low[df_sap_rating_low['Vulnerability'] == low_vulnerability]['Hostname'].tolist()

            low_vulnerability_count[low_vulnerability]=low_host_count
            
        low_vulnerability_count_list.append(low_vulnerability_count)

        final_count_of_ECH['high_vulnerability_count_list'] = high_vulnerability_count_list
        final_count_of_ECH['medium_vulnerability_count_list']=medium_vulnerability_count_list
        final_count_of_ECH['critical_vulnerability_count_list']=critical_vulnerability_count_list
        final_count_of_ECH['low_vulnerability_count_list']=low_vulnerability_count_list


        ## 3. Hostwise vulnerability count

        Vulnerability_dict = {}
        Vulnerability_list=[]
        for Vulnerability in df['Vulnerability'].unique():
            Vulnerabilitynames = df[df['Vulnerability'] == Vulnerability]['Hostname'].tolist()
            Vulnerability_dict[Vulnerability] = list(set(Vulnerabilitynames))
            # result['hostcount']=len(set(hostnames))
        Vulnerability_list.append({"Hostwise_vulnerability_count":Vulnerability_dict})
        
        
        ## 6: In each host how may vulnerability are there ------ count of vulnerability by each host
        hostname_dict={}
        hostname_list=[]
        for host_name in df['Hostname'].unique():
            hostnames=df[df['Hostname'] == host_name]['Vulnerability'].to_list()
            hostname_dict[host_name]=list(set(hostnames))
        hostname_list.append({"vulnerablity_count":hostname_dict})

        new_df['OS_path']=[len(df_os_path)]
        new_df['OS_configpath']=[len(df_os_configpath)]

        new_df['configuration_config']=[len(df_configuration_config)]
        new_df['configuration_mitigation']=[len(df_configuration_mitigation)]
        new_df['Sap_rating_high']=[len(df_sap_rating_high)]
        new_df['Sap_rating_medium']=[len(df_sap_rating_medium)]
        new_df['Sap_rating_critical']=[len(df_sap_rating_critical)]
        new_df['Sap_rating_low']=[len(df_sap_rating_low)]
        new_df['patch_online'] =[len(df_patch_online)]
        new_df['patch_offline'] =[len(df_patch_offline)]



        # new_df,Hostwise_list,final_count_of_ECH

        # for k,v in new_df.iterrows():
        #     vulnerability_analyse_data.objects.create(Vulnerability_count=v['Vulnerability_count'],OS=v['OS'],Software=v['Software']
        #     ,Sap_rating_high=v['Sap_rating_high'],Sap_rating_low=v['Sap_rating_low'],Sap_rating_medium=v['Sap_rating_medium'],
        #     Sap_rating_critical=v['Sap_rating_critical'],patch_online=v['patch_online'],patch_offline=v['patch_offline'],created_date=datetime.datetime.now())
        # for k,v in enumerate(res):
            
        #     for i,j in v.items():
        #         print(v,j[:3])
        #         break
        #     break
        # arr=[{f"{i}":j} for k,v in enumerate(res) for i,j in v.items()]
        return new_df,Vulnerability_list,final_count_of_ECH,hostname_list




