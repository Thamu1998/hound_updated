import pandas as pd

from apps.vulnerablity_dashboard.models import vulnerablity_analyse_data
# from ..models import *

class analyse_vulnerablity_excel:
    def __init__(self,*args,**kwargs):
        super(analyse_vulnerablity_excel,self).__init__()

    def read_excel(self,*args,**kwargs):
        excel=kwargs['excel_file']
        df=pd.read_excel(excel)
        new_df=pd.DataFrame()
        df_os=df[df['Remediation Type'] == 'patch']
        df_software=df[df['Remediation Type'] == 'config']

        df_sap_rating_high=df[df['SAP Rating'].apply(lambda x:x.lower())=='high']
        df_sap_rating_medium=df[df['SAP Rating'].apply(lambda x:x.lower())=='medium']
        df_sap_rating_critical=df[df['SAP Rating'].apply(lambda x:x.lower())=='critical']
        df_sap_rating_low=df[df['SAP Rating'].apply(lambda x:x.lower())=='low']
        df_sap_rating_medium['SAP Rating']

        df_patch_online=df[df['Online Patch'] ==True]
        df_patch_offline=df[df['Online Patch'] ==False]
        grouped = df.groupby('Hostname')['Vulnerability'].count().reset_index(name='count')

        new_df['Vulnerability_count']=[grouped.set_index('Hostname')['count'].to_dict()]

        new_df['OS']=[len(df_os)]
        new_df['Software']=[len(df_software)]
        new_df['Sap_rating_high']=[len(df_sap_rating_high)]
        new_df['Sap_rating_low']=[len(df_sap_rating_low)]
        new_df['Sap_rating_medium']=[len(df_sap_rating_medium)]
        new_df['Sap_rating_critical']=[len(df_sap_rating_critical)]
        new_df['patch_online'] =[len(df_patch_online)]
        new_df['patch_offline'] =[len(df_patch_offline)]
        import datetime
        for k,v in new_df.iterrows():
            vulnerablity_analyse_data.objects.create(Vulnerability_count=v['Vulnerability_count'],OS=v['OS'],Software=v['Software']
            ,Sap_rating_high=v['Sap_rating_high'],Sap_rating_low=v['Sap_rating_low'],Sap_rating_medium=v['Sap_rating_medium'],
            Sap_rating_critical=v['Sap_rating_critical'],patch_online=v['patch_online'],patch_offline=v['patch_offline'],created_date=datetime.datetime.now())


        return "creted vulnerablity_data"




