var max_limitdate = new Date();

max_limitdate.setDate(max_limitdate.getDate() - 1);

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    var report_date = vars.StartDateTime__date__range.split('to');
    
    return report_date;
}

$("#kt_daterangepicker_5").daterangepicker();

$("#kt_daterangepicker_report_date").daterangepicker({
    startDate: new Date(getUrlVars()[0]),
    endDate: new Date(getUrlVars()[1]),
    showDropdowns: true,
    showButtonPanel: true,
    autoApply: true,
    maxDate: max_limitdate,
    minYear: 2020,
    maxYear: parseInt(moment().format("YYYY"),10),
    locale: {
        format: 'MMMM DD, YYYY'
      },
      ranges: {
        "Yesterday": [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
        }
});

$('#load_report_btn').on('click', function(e){

    var report_date_start = $("#kt_daterangepicker_report_date").data('daterangepicker').startDate;

    var report_date_end = $("#kt_daterangepicker_report_date").data('daterangepicker').endDate;

    report_date_start = report_date_start.format('YYYY-MM-DD');

    report_date_end = report_date_end.format('YYYY-MM-DD');

   var system_type = "";

   if ($('#isProd').is(":checked") == true && $('#isnonProd').is(":checked") == false)
    {
        system_type = "ZH001;ZH006"
    }
    else if ($('#isProd').is(":checked") == false && $('#isnonProd').is(":checked") == true)
    {
        system_type = "ZH029;ZH019;ZH037;ZH040;ZH023;ZH028;ZH032"
    }
    else
    {
        system_type = "ZH001;ZH006;ZH029;ZH019;ZH037;ZH040;ZH023;ZH028;ZH032"
    }

    var url = `/availability/report?StartDateTime__date__range=`+report_date_start+`to`+report_date_end+`&AvailabilityInPercentage!=100&BusinessType=`+system_type+``;
  
    window.location.replace(url);
  });

// Class definition
var KTDatatablesDailyAvailability = function () {
    // Shared variables
    var table;
    var dt;
    var filterPayment;

    // Private functions
    var initDatatable = function () {
        
        dt = $("#kt_datatable_example_1").DataTable({
            searchDelay: 500,
            serverSide: true,
            pageLength: 25,
            order: [[0, 'desc'], [3, 'acse']],
            stateSave: true,
            autoWidth: false,
            fixedColumns: true,
            select: {
                style: 'multi',
                selector: 'td:first-child input[type="checkbox"]',
                className: 'row-selected'
            },
            ajax: {
                url: query_api_url.replace(/&amp;/g, '&'),
            },
            columns: [
                { data: 'StartDateTime' },
                { data: 'SystemLocation' },
                { data: 'SystemID' },
                { data: 'BusinessType', name: 'BusinessType__code'},
                { data: 'SystemRole' },
                { data: 'CustomerName' },
                { data: 'AvailabilityInPercentage' },
                { data: 'TotalUnplannedCommunicatedDowntimesInMinutes'},
                { data: 'OutageType'},
                { data: 'Category'},
                { data: 'SubCategory'},
                { data: 'RCACategory'},
                { data: 'Description'},
                { data: 'ProblemTicket'},
                { data: 'BusinessType_desc'}
            ],

            columnDefs : [
                { targets:'_all'},                        
                {targets:'report_date', className: 'dt-center', render: convert_date_only,},
                {targets:'dc', className: 'dt-center', render: function (data, type, full, meta){
                    
                    return `<div style="overflow-x: auto;white-space: nowrap;">`+data+`</div>`
                }},
                {targets:'availablity', className: 'dt-center', render: function (data) {
                    
                    if (data == 100){
                        return `<div class="text-primary text-bolder">`+data.toString() + "&nbsp; %"+`</div>`;
                    }
                    else{
                        return `<div class="text-primary text-bolder">`+data.toString().slice(0, -4) + "&nbsp; %"+`</div>`;
                    }
                }},
                {targets:'system_role', className: 'dt-center'},
                {targets:'sid', className: 'dt-center'},
                {targets:'outage_type', className: 'dt-center', render: function (data, type, full, meta){
                    
                    return `<div style="overflow-x: auto;white-space: nowrap;">`+data+`</div>`
                }},
                {targets:'category', className: 'dt-center', render: function (data, type, full, meta){
                    
                    return `<div style="overflow-x: auto;white-space: nowrap;">`+data+`</div>`
                }},
                {targets:'subcategory', className: 'dt-center', render: function (data, type, full, meta){
                    
                    return `<div style="overflow-x: auto;white-space: nowrap;">`+data+`</div>`
                }},
                {targets:'rca_category', className: 'dt-center', render: function (data, type, full, meta){
                    
                    return `<div style="overflow-x: auto;white-space: nowrap;">`+data+`</div>`
                }},
                {targets:'downtime_in_min', className: 'dt-center', render: function (data) {

                    return `<div class="text-danger text-bolder">`+data.toString() + "&nbsp; Min"+`</div>`;
                    
                }},
                {targets:'reason', className: 'dt-left',render: function (data){
                    return `<div style="width:1000px;align:left;" class="text-left"><p class="text-left">`+data+`</p></div>`;
                }},
                {targets:'system_type', className: 'dt-center', render: function (data, type, full, meta){
                    
                    return `<div style="overflow-x: auto;white-space: nowrap;">`+data + " - " + full.BusinessType_desc+`</div>`
                }},
                {targets:'customer', className: 'dt-center', render: function (data, type, full, meta){
                    
                    return `<div style="overflow-x: auto;white-space: nowrap;">`+data+`</div>`
                }},
                {targets:'ticket', className: 'dt-center', render: function (data, type, full, meta){
                    
                    return `<div style="overflow-x: auto;white-space: nowrap;">`+data+`</div>`
                }},
                {targets:'system_type_desc', visible:false,},
            ],
            
            // Add data-filter attribute
            createdRow: function (row, data, dataIndex) {
                $(row).find('td:eq(4)').attr('data-filter', data.CreditCardType);
            }
        });

        table = dt.$;

    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = function () {
        const filterSearch = document.querySelector('[data-kt-docs-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            dt.search(e.target.value).draw();
        });
    }

    // Public methods
    return {
        init: function () {
            initDatatable();
            handleSearchDatatable();
        }
    }
}();

function convert_date_only(data, type, full, meta) {

    if (data != null){

    var getdate = new Date(data).toUTCString();

    var DateName = getdate.replace("00:00:00 GMT","");
    
    var GetMonthNumber = {"Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"}

    var GetDateSplit = getdate.split(" ");

    var getdate = GetDateSplit[3]+GetMonthNumber[GetDateSplit[2]]+GetDateSplit[1]+GetDateSplit[4].replace(/\:/g,"");

    var output = '<div style="overflow-x: auto;white-space: nowrap;" class="kt-user-card-v2"><div class="kt-user-card-v2__details"><span class="kt-user-card-v2__name font-weight-bold text-info">'+DateName+'</span></div></div>';
    
    output = output.replace("GMT", "")

    return output;
    }
    else{
        return null
    }
};

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTDatatablesDailyAvailability.init();
});