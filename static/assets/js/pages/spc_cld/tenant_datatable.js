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

    var columnDef = ["SID","TenantID","SystemNumber","SystemRole","TenantBusinessType","ExternalID","SystemLifeCycleStatus","EUDataProtectionIndicator","NetworkSegmentID",
    "SystemLocation","VersionNumber","SupportPackage","PatchVersion","MainURL","HasSharedDBTenant","CustomerID","CustomerName","DBSystemID",
    "SystemBusinessType","SystemDBHostFQDN","SystemWebdispatcherFarmName","SystemCMPTemplateID","SystemInfrastructureType","AllocationLimit","memory", "CPU", "MaximumConcurrentCPU"]

    var colums = [
                    {data: 'SystemNumber', name: 'SystemNumber'},
                    {data: 'TenantID', name: 'TenantID'},
                    {data: 'SID', name: 'SID__SID'},
                    {data: 'ExternalID', name: 'ExternalID'},
                    {data: 'SystemLifeCycleStatus', name: 'SystemLifeCycleStatus'},
                    {data: 'SystemRole', name: 'SystemRole'},
                    {data: 'DBSystemID', name: 'DBSystemID'},
                    {data: 'TenantBusinessType', name: 'TenantBusinessType__code'},
                    {data: 'SystemBusinessType', name: 'SystemBusinessType__code'},
                    {data: 'CustomerID', name: 'CustomerID'},
                    {data: 'CustomerName', name: 'CustomerName'},
                    {data: 'MainURL', name: 'MainURL'},
                    {data: 'SystemLocation', name: 'SystemLocation__code'},
                    {data: 'NetworkSegmentID', name: 'NetworkSegmentID'},
                    {data: 'HasSharedDBTenant', name: 'HasSharedDBTenant'},
                    {data: 'EUDataProtectionIndicator', name: 'EUDataProtectionIndicator'},
                    {data: 'SystemDBHostFQDN', name: 'SystemDBHostFQDN'},
                    {data: 'SystemWebdispatcherFarmName', name: 'SystemWebdispatcherFarmName'},
                    {data: 'PatchVersion', name: 'PatchVersion'},
                    {data: 'SupportPackage', name: 'SupportPackage'},
                    {data: 'VersionNumber', name: 'VersionNumber'},
                    {data: 'SystemCMPTemplateID', name: 'SystemCMPTemplateID'},
                    {data: 'SystemInfrastructureType', name: 'SystemInfrastructureType'},
                    {data: 'AllocationLimit', name: 'AllocationLimit'},
                    {data: 'memory', name: 'memory'},
                    {data: 'CPU', name: 'CPU'},
                    {data: 'MaximumConcurrentCPU', name: 'MaximumConcurrentCPU'},
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},                        
                        {targets:'SystemNumber', render: open_spc_system_number,},
                        {targets:'SystemRole', render: remove_undersquare,},
                        {targets:'CustomerTenantMainURL', render:convert_to_url,},
                        {targets:'LifeCycleStatus', render: system_lifecycle_status,},
                        {targets:'EntityLastChangedOn', render: convert_date,},
                        {targets: 'HasSharedDBTenant', render: yes_no_label,},
                        {targets: 'EUAccess', render: yes_no_label,},
                        {targets: 'CustomerID', visible:false},
                        {targets: 'NetworkSegmentID', visible:false},
                        {targets: 'DatabaseHostFQDN', visible:false},
                        {targets: 'WebdispatcherFarmName', visible:false},
                        {targets: 'LeadingProductPatchVersion', visible:false},
                        {targets: 'LeadingProductSupportPackage', visible:false},
                        {targets: 'LeadingProductVersionNumber', visible:false},
                    ]
    
    var sort_data = [[ 5, "desc" ],[ 0, "acs" ],[ 9, "acs" ]]

    rowGroup_data = null,

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});