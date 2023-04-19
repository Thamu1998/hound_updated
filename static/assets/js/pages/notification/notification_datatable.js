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

    var end_date_start = $("#kt_daterangepicker_end_date").data('daterangepicker').startDate;

    var end_date_end = $("#kt_daterangepicker_end_date").data('daterangepicker').endDate;

    end_date_start = end_date_start.format('YYYY-MM-DD.HH:mm');

    end_date_end = end_date_end.format('YYYY-MM-DD.HH:mm');

    $('#from_datetime').html($("#kt_daterangepicker_end_date").data('daterangepicker').startDate.format('DD-MMMM,YY HH:mm'));

    $('#to_datetime').html($("#kt_daterangepicker_end_date").data('daterangepicker').endDate.format('DD-MMMM,YY HH:mm'));
    
    var is_parameter = $(location).attr('href').split("?");

    if (is_parameter.length == 1){
	    var URL = query_api_url.replace(/&amp;/g, '&')+`EndDateTime_gt=`+end_date_start+`&EndDateTime_lt=`+end_date_end;
    }else{
        var URL = query_api_url.replace(/&amp;/g, '&')+is_parameter[1];
    }
    
    var columnDef = ['EventID','NotificationID', 'NotificationSubType', 'SentToCustomerOn', 'EntityLastChangedOn','CreatedViaAPI','CurrentTemplateName','EndDate','EndTime','EventName','JiraTicket','NTDBEmailStatus','Phase','StartDate','StartTime','TestMode','BundleID','CreatedBy','StartDateTime','EndDateTime','NotificationType','Status','SystemRoles','ServiceStatus','CreationDateTime','DataCenters','IsStartTimeRevised','IsSLARelevant','IsServiceStatusRevised','IsEndTimeRevised','IsInterRcaSloExpired','IsInterRcaSlaExpired','IsFinalRcaSloExpired','IsFinalRcaSlaExpired','IsInterRcaSend','IsFinalRcaSend', 'isProd']

    var colums = [
                    {data: 'EventID', name: 'ParentObjectID__EventID'},
                    {data: 'NotificationID', name: 'NotificationID'},
                    {data: 'NotificationSubType', name: 'NotificationSubType__code'},
                    {data: 'SentToCustomerOn', name: 'SentToCustomerOn__month'},
                    {data: 'IsInterRcaSloExpired', name: 'ParentObjectID__IsInterRcaSloExpired'},
                    {data: 'IsInterRcaSlaExpired', name: 'ParentObjectID__IsInterRcaSlaExpired'},
                    {data: 'IsInterRcaSend', name: 'ParentObjectID__IsInterRcaSend'},
                    {data: 'IsFinalRcaSloExpired', name: 'ParentObjectID__IsFinalRcaSloExpired'},
                    {data: 'IsFinalRcaSlaExpired', name: 'ParentObjectID__IsFinalRcaSlaExpired'},
                    {data: 'IsFinalRcaSend', name: 'ParentObjectID__IsFinalRcaSend'},
                    {data: 'CurrentTemplateName', name: 'ParentObjectID__CurrentTemplateName'},
                    {data: 'EventName', name: 'ParentObjectID__EventName'},
                    {data: 'Phase', name: 'ParentObjectID__Phase__code'},
                    {data: 'BundleID', name: 'ParentObjectID__BundleID'},
                    {data: 'CreatedBy', name: 'ParentObjectID__CreatedBy'},
                    {data: 'StartDateTime', name: 'ParentObjectID__StartDateTime__month'},
                    {data: 'EndDateTime', name: 'ParentObjectID__EndDateTime__month'},
                    {data: 'DataCenters', name: 'ParentObjectID__DataCenters'},
                    {data: 'NotificationType', name: 'ParentObjectID__NotificationType__code'},
                    {data: 'Status', name: 'ParentObjectID__Status__code'},
                    {data: 'SystemRoles', name: 'ParentObjectID__SystemRoles'},
                    {data: 'ServiceStatus', name: 'ParentObjectID__ServiceStatus__code'},
                    {data: 'CreationDateTime', name: 'ParentObjectID__CreationDateTime__month'},
                    {data: 'IsStartTimeRevised', name: 'IParentObjectID__sStartTimeRevised'},
                    {data: 'IsSLARelevant', name: 'ParentObjectID__IsSLARelevant'},
                    {data: 'IsServiceStatusRevised', name: 'ParentObjectID__IsServiceStatusRevised'},
                    {data: 'IsEndTimeRevised', name: 'ParentObjectID__IsEndTimeRevised'},
                    {data: 'isProd', name: 'ParentObjectID__isProd'},
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},
                        {targets: 'EventID'},
                        {targets: 'NotificationID', visible:false},
                        {targets: 'NotificationSubType'},
                        {targets: 'SentToCustomerOn', render: convert_date},
                        {targets: 'IsInterRcaSloExpired', render: yes_no_label},
                        {targets: 'IsInterRcaSlaExpired', render: yes_no_label},
                        {targets: 'IsInterRcaSend', render: yes_no_label},
                        {targets: 'IsFinalRcaSloExpired', render: yes_no_label},
                        {targets: 'IsFinalRcaSlaExpired', render: yes_no_label},
                        {targets: 'IsFinalRcaSend', render: yes_no_label},
                        {targets: 'CurrentTemplateName', visible:false},
                        {targets: 'EventName', visible:false},
                        {targets: 'Phase'},
                        {targets: 'BundleID', visible:false},
                        {targets: 'CreatedBy', visible:false},
                        {targets: 'StartDateTime', render: convert_date},
                        {targets: 'EndDateTime', render: convert_date},
                        {targets: 'DataCenters'},
                        {targets: 'NotificationType'},
                        {targets: 'Status'},
                        {targets: 'SystemRoles'},
                        {targets: 'ServiceStatus'},
                        {targets: 'CreationDateTime', render: convert_date},
                        {targets: 'IsStartTimeRevised'},
                        {targets: 'IsSLARelevant'},
                        {targets: 'IsServiceStatusRevised'},
                        {targets: 'IsEndTimeRevised'},
                        {targets: 'isProd', render: yes_no_label},

                    ]
    
    var sort_data = [[ 15, "desc" ],[ 0, "acs" ],[ 2, "acs" ]]

    rowGroup_data = {dataSrc: 'EventID',startRender: function(rows, group) {
        return $('<tr class="group group-start"><td class="bg-secondary text-dark" colspan="28"></td></tr>');
    }},
    console.log(URL,"url")
	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});

var max_limitdate = new Date();

// max_limitdate.setDate(max_limitdate.getDate());

function getUrlVars()
{
    
    let paramString = window.location.href.split('?')[1];
    
    if (paramString == undefined){

        var from_date = new Date();

        var to_date = new Date();

        from_date.setDate(from_date.getDate() - 7);
        
        return([from_date,to_date]);
    }

    var vars = [], hash;

    var hashes = paramString.split('&');
    
    for(var i = 0; i < hashes.length; i++)
    {   
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    if(vars.hasOwnProperty("ParentObjectID__isProd_flt")){
        $('#is_prod_dropdown').val(vars.ParentObjectID__isProd_flt)
    };
    if(vars.hasOwnProperty("ParentObjectID__ServiceStatus__code_flt")){
        $('#service_status_dropdown').val(vars.ParentObjectID__ServiceStatus__code_flt)
    };
    if(vars.hasOwnProperty("ParentObjectID__IsInterRcaSloExpired_flt")){
        $('#IsInterRcaSloExpired_dropdown').val(vars.ParentObjectID__IsInterRcaSloExpired_flt)
    };
    if(vars.hasOwnProperty("ParentObjectID__IsInterRcaSlaExpired_flt")){
        $('#IsInterRcaSlaExpired_dropdown').val(vars.ParentObjectID__IsInterRcaSlaExpired_flt)
    };
    if(vars.hasOwnProperty("ParentObjectID__IsInterRcaSend_flt")){
        $('#IsInterRcaSend_dropdown').val(vars.ParentObjectID__IsInterRcaSend_flt)
    };
    if(vars.hasOwnProperty("ParentObjectID__IsFinalRcaSloExpired_flt")){
        $('#IsFinalRcaSloExpired_dropdown').val(vars.ParentObjectID__IsFinalRcaSloExpired_flt)
    };
    if(vars.hasOwnProperty("ParentObjectID__IsFinalRcaSlaExpired_flt")){
        $('#IsFinalRcaSlaExpired_dropdown').val(vars.ParentObjectID__IsFinalRcaSlaExpired_flt)
    };
    if(vars.hasOwnProperty("ParentObjectID__IsFinalRcaSend_flt")){
        $('#IsFinalRcaSend_dropdown').val(vars.ParentObjectID__IsFinalRcaSend_flt)
    };

    var report_date = [vars.EndDateTime_gt, vars.EndDateTime_lt]
    
    return report_date;
}

$("#kt_daterangepicker_end_date").daterangepicker({
    startDate: new Date(getUrlVars()[0]),
    endDate: new Date(getUrlVars()[1]),
    timePicker: true,
    showDropdowns: true,
    showButtonPanel: true,
    autoApply: true,
    maxDate: max_limitdate,
    minYear: 2020,
    maxYear: parseInt(moment().format("YYYY"),10),
    locale: {
        format: 'MMMM DD, YYYY hh:mm A'
      },
      ranges: {
        "Yesterday": [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
        }
});

$('#load_notification_btn').on('click', function(e){

    var report_date_start = $("#kt_daterangepicker_end_date").data('daterangepicker').startDate;

    var report_date_end = $("#kt_daterangepicker_end_date").data('daterangepicker').endDate;

    report_date_start = report_date_start.format('YYYY-MM-DD.HH:mm');

    report_date_end = report_date_end.format('YYYY-MM-DD.HH:mm');

    var url = `/notification/event/view?EndDateTime_gt=`+report_date_start+`&EndDateTime_lt=`+report_date_end;

    if($('#is_prod_dropdown').val() != '') {
        url += `&ParentObjectID__isProd_flt=`+$('#is_prod_dropdown').val()
    }
    if($('#service_status_dropdown').val() != '') {
        url += `&ParentObjectID__ServiceStatus__code_flt=`+$('#service_status_dropdown').val()
    }
    if($('#IsInterRcaSloExpired_dropdown').val() != '') {
        url += `&ParentObjectID__IsInterRcaSloExpired_flt=`+$('#IsInterRcaSloExpired_dropdown').val()
    }
    if($('#IsInterRcaSlaExpired_dropdown').val() != '') {
        url += `&ParentObjectID__IsInterRcaSlaExpired_flt=`+$('#IsInterRcaSlaExpired_dropdown').val()
    }
    if($('#IsFinalRcaSloExpired_dropdown').val() != '') {
        url += `&ParentObjectID__IsFinalRcaSloExpired_flt=`+$('#IsFinalRcaSloExpired_dropdown').val()
    }
    if($('#IsFinalRcaSlaExpired_dropdown').val() != '') {
        url += `&ParentObjectID__IsFinalRcaSlaExpired_flt=`+$('#IsFinalRcaSlaExpired_dropdown').val()
    }
    if($('#IsInterRcaSend_dropdown').val() != '') {
        url += `&ParentObjectID__IsInterRcaSend_flt=`+$('#IsInterRcaSend_dropdown').val()
    }
    if($('#IsFinalRcaSend_dropdown').val() != '') {
        url += `&ParentObjectID__IsFinalRcaSend_flt=`+$('#IsFinalRcaSend_dropdown').val()
    }

    window.location.replace(url);

});
