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

    var columnDef = ['EVENTID','BUNDLEID','TENANTID','CUSTOMERID' ,'SYSTEMROLE' ,'DATACENTER','TENANTROLE' ,'SERVICESTATUS','CURRENTTEMPLATENAME','SLO','SLA','ACTION' ,'CREATEDBY' ,'STARTDATETIME',
     'ENDDATETIME','CREATIONDATETIME' ,'EVENTNAME', 'STATUS' ,'ENDDATE' ,'ENDTIME' ,'JIRATICKET','NTDBEMAILSTATUS','PHASE','STARTDATE' ,'STARTTIME','TESTMODE ','NOTIFICATIONTYPE','ISSLARELEVANT']

    var colums = [
                    {data: 'EVENTID', name: 'EVENTID'},
                    {data: 'BUNDLEID', name: 'BUNDLEID'},
                    {data: 'TENANTID', name: 'TENANTID'},
                    {data: 'CUSTOMERID', name: 'CUSTOMERID'},
                    {data: 'SystemRole', name: 'SYSTEMROLE'},
                    {data: 'DATACENTER', name: 'DATACENTER'},
                    {data: 'TENANTROLE', name: 'TENANTROLE'},
                    {data: 'SERVICESTATUS', name: 'SERVICESTATUS'},
                    {data: 'CURRENTTEMPLATENAME', name: 'CURRENTTEMPLATENAME'},
                    {data: 'SLO', name: 'SLO'},
                    {data: 'SLA', name: 'SLA'},
                    {data: 'ACTION', name: 'ACTION'},
                    {data: 'CREATEDBY', name: 'CREATEDBY'},
                    {data: 'STARTDATETIME', name: 'STARTDATETIME'},                    
                    {data: 'ENDDATETIME', name: 'ENDDATETIME'},                    
                    {data: 'CREATIONDATETIME', name: 'CREATIONDATETIME'},
                    {data: 'EVENTNAME', name: 'EVENTNAME'},
                    {data: 'STATUS', name: 'STATUS'},
                    {data: 'ENDDATE', name: 'ENDDATE'},
                    {data: 'ENDTIME', name: 'ENDTIME'},
                    {data: 'JIRATICKET', name: 'JIRATICKET'},
                    {data: 'NTDBEMAILSTATUS', name: 'NTDBEMAILSTATUS'},
                    {data: 'PHASE', name: 'PHASE'},
                    {data: 'STARTDATE', name: 'STARTDATE'},
                    {data: 'STARTTIME', name: 'STARTTIME'},
                    {data: 'TESTMODE', name: 'TESTMODE'},
                    {data: 'NOTIFICATIONTYPE', name: 'NOTIFICATIONTYPE'},
                    {data: 'ISSLARELEVANT', name: 'ISSLARELEVANT'},
                    
                 ]
    
    var columnDefs = [
                        // { targets:'_all', className: 'dt-center'},                        
                        // {targets:'EVENTID', render: open_spc_system_number,},
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
    
    var sort_data = [[ 2, "desc" ],[1, "desc" ],[4, "desc" ],[11, "acs" ]]

    rowGroup_data = {dataSrc: 'DBSystemID'},

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});