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

    var columnDef = ['SystemNumber','SID', 'DBSystemID', 'BusinessType','LifeCycleStatus', 'SystemExternalStatus','CustomerTenantMainURL', 'CustomerName','HostName','SystemType','InstanceType','InstanceNumber','InstanceName', 'SystemHypervisorServerName', 'DataCenterID', 'SystemRole', 'EUAccess', 'HasSharedDBTenant', 'LeadingProductPatchVersion','CPUCount','SystemMemory','SystemOSName','SystemOSRelease','SystemOSType','SystemOSVersion','CMPTime','InfrastructureType','ApplicationHostFQDN','DatabaseHostFQDN','CMPTemplateID','NetworkSegmentID','ComputerSystemPool', 'ComputerSystemResourcePool', 'ComputerSystemUsageArea', 'ComputerSystemDataCenterID', 'ComputerSystemCreationDateTime', 'ComputerSystemLastChangeDateTime', 'ComputerSystemVMFlavor']

    var colums = [
                    {data: 'SystemNumber', name: 'SystemNumber'},
                    {data: 'SID', name: 'SID__SID'},
                    {data: 'DBSystemID', name: 'SID__DBSystemID'},
                    {data: 'BusinessType', name: 'SID__BusinessType__code'},
                    {data: 'LifeCycleStatus', name: 'LifeCycleStatus'},
                    {data: 'SystemExternalStatus', name: 'SystemExternalStatus'},
                    {data: 'SystemRole', name: 'SID__SystemRole'},
                    {data: 'CustomerTenantMainURL', name: 'SID__CustomerTenantMainURL'},
                    {data: 'CustomerName', name: 'SID__CustomerName'},
                    {data: 'HostName', name: 'HostName'},
                    {data: 'SystemType', name: 'SystemType'},
                    {data: 'InstanceType', name: 'InstanceType'},
                    {data: 'InstanceNumber', name: 'InstanceNumber'},
                    {data: 'InstanceName', name: 'InstanceName'},
                    {data: 'SystemHypervisor', name: 'SystemHypervisor'},
                    {data: 'DataCenterID', name: 'SID__DataCenterID__code'},                    
                    {data: 'ComputerSystemDataCenterID', name: 'ComputerSystemDataCenterID__code'},                    
                    {data: 'EUAccess', name: 'SID__EUAccess'},
                    {data: 'HasSharedDBTenant', name: 'SID__HasSharedDBTenant'},
                    {data: 'LeadingProductPatchVersion', name: 'SID__LeadingProductPatchVersion'},
                    {data: 'CPUCount', name: 'CPUCount'},
                    {data: 'SystemMemory', name: 'SystemMemory'},
                    {data: 'SystemOSName', name: 'SystemOSName'},
                    {data: 'SystemOSRelease', name: 'SystemOSRelease'},
                    {data: 'SystemOSType', name: 'SystemOSType'},
                    {data: 'SystemOSVersion', name: 'SystemOSVersion'},
                    {data: 'CMPTemplateID', name: 'SID__CMPTemplateID'},
                    {data: 'CMPTime', name: 'SID__CMPTime'},
                    {data: 'InfrastructureType', name: 'SID__InfrastructureType'},
                    {data: 'ApplicationHostFQDN', name: 'SID__ApplicationHostFQDN'},
                    {data: 'DatabaseHostFQDN', name: 'SID__DatabaseHostFQDN'},
                    {data: 'NetworkSegmentID', name: 'SID__NetworkSegmentID'},
                    {data: 'ComputerSystemPool', name: 'ComputerSystemPool'},
                    {data: 'ComputerSystemResourcePool', name: 'ComputerSystemResourcePool'},
                    {data: 'ComputerSystemUsageArea', name: 'ComputerSystemUsageArea'},
                    {data: 'ComputerSystemVMFlavor', name: 'ComputerSystemVMFlavor'},
                    {data: 'ComputerSystemCreationDateTime', name: 'ComputerSystemCreationDateTime'},
                    {data: 'ComputerSystemLastChangeDateTime', name: 'ComputerSystemLastChangeDateTime'}
                    
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},                        
                        {targets:'SystemNumber', render: open_spc_system_number,},
                        {targets:'system_role', render: remove_undersquare,},
                        {targets:'system_life_cycle', render: system_lifecycle_status,},
                        {targets:'tic_life_cycle', render: system_lifecycle_status,},
                        {targets:'instance_type', render: instance_type,},
                        {targets: 'is_shared_db', render: yes_no_label,},
                        {targets: 'is_eudp', render: yes_no_label,},
                        {targets:'creation_datetime', render: convert_date,},
                        {targets:'lastChange_datetime', render: convert_date,},
                        {targets: 'system_os_name', visible:false,},
                        {targets: 'system_os_type', visible:false,},
                        {targets: 'usage_area', visible:false,},
                        {targets: 'main_url', visible:false,},
                    ]
    
    var sort_data = [[ 2, "desc" ],[1, "desc" ],[4, "desc" ],[11, "acs" ]]

    rowGroup_data = {dataSrc: 'DBSystemID'},

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDef, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});