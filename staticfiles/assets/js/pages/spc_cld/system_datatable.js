function generate_toggle_pill(){

    var toggle_pill = ""

    $('.table_header th').each(function (index) { 
     
       var is_show = $(this).attr('is_show')
       
       var column_name = $(this).text()
        
       if (is_show=="false"){

            toggle_pill = toggle_pill+'<button type="button" class="btn btn-light-primary font-weight-bold btn-pill topmorgin" data-column="'+index+'"><i class="fas fa-plus fs-4 me-2"></i> '+column_name+' </button>&nbsp;';
        }
        else
        {
            toggle_pill = toggle_pill+'<button type="button" class="btn btn-light-danger font-weight-bold btn-pill topmorgin" data-column="'+index+'"><i class="fas fa-times fs-4 me-2"></i> '+column_name+' </button>&nbsp;';
        }

    });

    $("#toggle_pill").html(toggle_pill)

};

jQuery(document).ready(function() {

    generate_toggle_pill();

	var URL = query_api_url.replace(/&amp;/g, '&');

    var columnDef = ['SystemNumber','SID','LifeCycleStatus','SystemRole','DBSystemID','BusinessType','CustomerID','CustomerName','CustomerTenantMainURL','DataCenterID','NetworkSegmentID','LeadingProductPPMS','LeadingProductVersionPPMS','HasSharedDBTenant','EUAccess','DatabaseHostFQDN','DatabaseHost','WebdispatcherFarmName','ApplicationHost','ApplicationHostFQDN','LeadingProductName','LeadingProductPatchVersion','LeadingProductSupportPackage','LeadingProductVersionNumber','CMPTemplateID','InfrastructureType','DRActiveSystem','DRSystemType','DRSystemNumber','ApplicationDRType','DataBaseDRType','HAActiveSystem','HASystemType','HASystemNumber','ApplicationHAType','DataBaseHAType','CreationDateTime','EntityLastChangedOn']

    var colums = [
                    {data: 'SystemNumber', name: 'SystemNumber'},
                    {data: 'SID', name: 'SID'},
                    {data: 'LifeCycleStatus', name: 'LifeCycleStatus'},
                    {data: 'SystemRole', name: 'SystemRole'},
                    {data: 'DBSystemID', name: 'DBSystemID'},
                    {data: 'BusinessType', name: 'BusinessType__code'},
                    {data: 'CustomerID', name: 'CustomerID'},
                    {data: 'CustomerName', name: 'CustomerName'},
                    {data: 'CustomerTenantMainURL', name: 'CustomerTenantMainURL'},
                    {data: 'DataCenterID', name: 'DataCenterID__code'},
                    {data: 'NetworkSegmentID', name: 'NetworkSegmentID'},
                    {data: 'LeadingProductPPMS', name: 'LeadingProductPPMS'},
                    {data: 'LeadingProductVersionPPMS', name: 'LeadingProductVersionPPMS'},
                    {data: 'HasSharedDBTenant', name: 'HasSharedDBTenant'},
                    {data: 'EUAccess', name: 'EUAccess'},
                    {data: 'DatabaseHostFQDN', name: 'DatabaseHostFQDN'},
                    {data: 'DatabaseHost', name: 'DatabaseHost'},
                    {data: 'WebdispatcherFarmName', name: 'WebdispatcherFarmName'},
                    {data: 'ApplicationHost', name: 'ApplicationHost'},
                    {data: 'ApplicationHostFQDN', name: 'ApplicationHostFQDN'},
                    {data: 'LeadingProductName', name: 'LeadingProductName'},
                    {data: 'LeadingProductPatchVersion', name: 'LeadingProductPatchVersion'},
                    {data: 'LeadingProductSupportPackage', name: 'LeadingProductSupportPackage'},
                    {data: 'LeadingProductVersionNumber', name: 'LeadingProductVersionNumber'},
                    {data: 'CMPTemplateID', name: 'CMPTemplateID'},
                    {data: 'InfrastructureType', name: 'InfrastructureType'},
                    {data: 'DRActiveSystem', name: 'DRActiveSystem'},
                    {data: 'DRSystemType', name: 'DRSystemType'},
                    {data: 'DRSystemNumber', name: 'DRSystemNumber'},
                    {data: 'ApplicationDRType', name: 'ApplicationDRType__code'},
                    {data: 'DataBaseDRType', name: 'DataBaseDRType__code'},
                    {data: 'HAActiveSystem', name: 'HAActiveSystem'},
                    {data: 'HASystemType', name: 'HASystemType'},
                    {data: 'HASystemNumber', name: 'HASystemNumber'},
                    {data: 'ApplicationHAType', name: 'ApplicationHAType__code'},
                    {data: 'DataBaseHAType', name: 'DataBaseHAType__code'},
                    {data: 'CreationDateTime', name: 'CreationDateTime'},
                    {data: 'EntityLastChangedOn', name: 'EntityLastChangedOn'}
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},                        
                        {targets:'SystemNumber', render: open_spc_system_number,},
                        {targets:'SystemRole', render: remove_undersquare,},
                        {targets:'CustomerTenantMainURL', render:convert_to_url,},
                        {targets:'LifeCycleStatus', render: system_lifecycle_status,},
                        {targets:'EntityLastChangedOn', render: convert_date,},
                        {targets:'CreationDateTime', render: convert_date,},
                        {targets: 'HasSharedDBTenant', render: yes_no_label,},
                        {targets: 'EUAccess', render: yes_no_label,},
                        {targets: 'DRActiveSystem', render: yes_no_label,},
                        {targets: 'HAActiveSystem', render: yes_no_label,},
                        {targets: 'CustomerID', visible:false,},
                        {targets: 'LeadingProductPPMS', visible:false,},
                        {targets: 'LeadingProductVersionPPMS', visible:false,},
                        {targets: 'DatabaseHostFQDN', visible:false,},
                        {targets: 'ApplicationHostFQDN', visible:false,},
                        {targets: 'LeadingProductName', visible:false},
                        {targets: 'LeadingProductSupportPackage', visible:false},
                        {targets: 'LeadingProductVersionNumber', visible:false},
                    ]
    
    var sort_data = [[ 4, "desc" ],[ 0, "acs" ],[ 9, "acs" ]]

    rowGroup_data = null,

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDef, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});