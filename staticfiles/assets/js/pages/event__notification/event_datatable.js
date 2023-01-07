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

	var URL = '/event/api';

    var columnDefs = ['EventID','BundleID','CreationDateTime' ,'TenantID','CustomerID' ,'SystemRole' ,'ServiceStatus','DataCenter', 'Status' ,'JiraTicket','TenantRole' ,'CurrentTemplateName' 
    ,'CreatedBy' ,'StartDateTime','EndDateTime','EventName' ,'EndDate' ,'EndTime','NTDBEmailStatus','Phase','StartDate' ,'StartTime','TestMode ','NotificationType','ISSLARELEVANT']
    var colums = [
                            {data: 'EventID', name: 'EventID'},
                            {data: 'BundleID', name: 'BundleID'},
                            {data: 'CreationDateTime', name: 'CreationDateTime'},
                            {data: 'TenantID', name: 'TenantID'},
                            {data: 'CustomerID', name: 'CustomerID'},
                            {data: 'SystemRole', name: 'SystemRole'},
                            {data: 'ServiceStatus', name: 'ServiceStatus'},
                            {data: 'DataCenter', name: 'DataCenter'},
                            {data: 'Status', name: 'Status'},
                            {data: 'JiraTicket', name: 'JiraTicket'},
                            {data: 'TenantRole', name: 'TenantRole'},
                            {data: 'CurrentTemplateName', name: 'CurrentTemplateName'},
                            // {data: 'STARTDATE', name: 'SLO Breach Date'},
                            // {data: 'STARTDATE', name: 'SLA Breach Date'},
                            // {data: 'STARTDATE', name: 'ACTION'},
                            {data: 'CreatedBy', name: 'CreatedBy'},
                            {data: 'StartDateTime', name: 'StartDateTime'},                    
                            {data: 'EndDateTime', name: 'EndDateTime'},                    
                            {data: 'EventName', name: 'EventName'},
                            {data: 'EndDate', name: 'EndDate'},
                            {data: 'EndTime', name: 'EndTime'},
                            {data: 'NTDBEmailStatus', name: 'NTDBEmailStatus'},
                            {data: 'Phase', name: 'Phase'},
                            {data: 'StartDate', name: 'StartDate'},
                            {data: 'StartTime', name: 'StartTime'},
                            {data: 'TestMode', name: 'TestMode'},
                            {data: 'NotificationType', name: 'NotificationType'},
                            {data: 'IsSLARelevant', name: 'IsSLARelevant'},
                    
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},                        
                        // {targets:'SystemNumber', render: open_spc_system_number,},
                        // {targets:'system_role', render: remove_undersquare,},
                        // {targets:'system_life_cycle', render: system_lifecycle_status,},
                        // {targets:'tic_life_cycle', render: system_lifecycle_status,},
                        // {targets:'instance_type', render: instance_type,},
                        // {targets: 'is_shared_db', render: yes_no_label,},
                        // {targets: 'is_eudp', render: yes_no_label,},
                        // {targets:'creation_datetime', render: convert_date,},
                        // {targets:'lastChange_datetime', render: convert_date,},
                        // {targets: 'system_os_name', visible:false,},
                        // {targets: 'system_os_type', visible:false,},
                        // {targets: 'usage_area', visible:false,},
                        // {targets: 'main_url', visible:false,},
                    ]
    
    var sort_data = [[ 2, "desc" ]]

    rowGroup_data = {dataSrc: 'TenantID'},

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});