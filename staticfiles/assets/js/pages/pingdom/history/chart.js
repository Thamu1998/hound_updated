function convert_date(date){

    var convert_date = new Date(date).toUTCString();
    
    var convert_date = convert_date.getTime()
    
    return convert_date;

}


function generate_dom_chart_available(data){   
    
    var element = document.getElementById('kt_apexcharts_6');
    
    var options = {
        series: [
            {
                name: 'up',
                data: data.up
            },
            {
                name: 'Down',
                data: data.down
            }
        ],
        chart: {
            type: 'rangeBar',
            fontFamily: 'inherit',
            height: 150,
            toolbar: {
                show: true,
                position: 'bottom',
            }
        },
        tooltip: {
            enabled: true,
            
            x: {
                show: true,
                format: 'dd MMM HH:mm:ss',
                shared: true,
                formatter: undefined,
            },
        },
        colors: ["#72efdd", "#e39695",],
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '100%',
                rangeBarGroupRows: true
            }
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            labels: {
                formatter: function(value) {
                   return value;    
            }},
            type: 'datetime'
        },
        stroke: {
            width: 1
        },
        fill: {
            show:true,
            type: 'solid',
            opacity: 9
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left'
        }
    };

    var chart = new ApexCharts(element, options);
    chart.render();

};

function get_history_data(url){

    $.ajax({
        method: "GET",
        url: url,
        success: function(data){
            generate_dom_chart_available(data.chart)
            generate_dom_history_data(data.data)
            $('.close_model').click();
        },
        error: function(error_data){
            raise_error_tost("unexpected error occurred, please try giving larger date range.")
        }
    });

}

function generate_dom_history_data(data){

    var table_body = "";

    var up_icon = `<div class="symbol symbol-25px me-4">
                        <span class="symbol-label bg-success">
                            <span class="svg-icon svg-icon-2 svg-icon-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path opacity="0.5" d="M11.4343 14.3657L7.25 18.55C6.83579 18.9643 6.16421 18.9643 5.75 18.55C5.33579 18.1358 5.33579 17.4643 5.75 17.05L11.2929 11.5072C11.6834 11.1166 12.3166 11.1166 12.7071 11.5072L18.25 17.05C18.6642 17.4643 18.6642 18.1358 18.25 18.55C17.8358 18.9643 17.1642 18.9643 16.75 18.55L12.5657 14.3657C12.2533 14.0533 11.7467 14.0533 11.4343 14.3657Z" fill="black"/>
                                    <path d="M11.4343 8.36573L7.25 12.55C6.83579 12.9643 6.16421 12.9643 5.75 12.55C5.33579 12.1358 5.33579 11.4643 5.75 11.05L11.2929 5.50716C11.6834 5.11663 12.3166 5.11663 12.7071 5.50715L18.25 11.05C18.6642 11.4643 18.6642 12.1358 18.25 12.55C17.8358 12.9643 17.1642 12.9643 16.75 12.55L12.5657 8.36573C12.2533 8.05331 11.7467 8.05332 11.4343 8.36573Z" fill="black"/>
                                </svg>
                            </span>
                        </span>
                    </div>`;

    var down_icon = `<div class="symbol symbol-25px me-4">
                        <span class="symbol-label bg-danger">
                            <span class="svg-icon svg-icon-2 svg-icon-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path opacity="0.5" d="M12.5657 9.63427L16.75 5.44995C17.1642 5.03574 17.8358 5.03574 18.25 5.44995C18.6642 5.86416 18.6642 6.53574 18.25 6.94995L12.7071 12.4928C12.3166 12.8834 11.6834 12.8834 11.2929 12.4928L5.75 6.94995C5.33579 6.53574 5.33579 5.86416 5.75 5.44995C6.16421 5.03574 6.83579 5.03574 7.25 5.44995L11.4343 9.63427C11.7467 9.94669 12.2533 9.94668 12.5657 9.63427Z" fill="black"/>
                                    <path d="M12.5657 15.6343L16.75 11.45C17.1642 11.0357 17.8358 11.0357 18.25 11.45C18.6642 11.8642 18.6642 12.5357 18.25 12.95L12.7071 18.4928C12.3166 18.8834 11.6834 18.8834 11.2929 18.4928L5.75 12.95C5.33579 12.5357 5.33579 11.8642 5.75 11.45C6.16421 11.0357 6.83579 11.0357 7.25 11.45L11.4343 15.6343C11.7467 15.9467 12.2533 15.9467 12.5657 15.6343Z" fill="black"/>
                                </svg>
                            </span>
                        </span>
                    </div>`;

    data.forEach(function(item){

        var icon = up_icon;

        if(item.Status == "down"){
            icon = down_icon;
        }

        table_body += `<tr class="text-start text-gray-500 fw-bolder fs-6 text-uppercase gs-0 text-center">
                                <td>`+icon+`</td>
                                <td>`+item.FromTime+`</td>
                                <td>`+item.ToTime+`</td>
                                <td>`+item.duration+`</td>
                                <td>`+item.pre+`&nbsp;%</td>
                        </tr>`

    });

    var table_history = `<div class="col-7 p-5  rounded" style="border: 1px dashed #6c757d;">
                            <table class="table table-row-dashed table-row-gray-300 gy-7">
                                <thead>
                                    <tr class="fw-bolder fs-6 text-gray-800 text-center">
                                        <th style="width:7px;"></th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Duration</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody id="history_table_body">
                                    `+table_body+`
                                </tbody>
                            </table>
                        </div>`

    $('#history_table').html(table_history);

};

var max_limitdate = new Date();

max_limitdate.setDate(max_limitdate.getDate() - 1);

function getUrlVars()
{
    
    let paramString = window.location.href.split('?')[1];
    
    if (paramString == undefined){

        var from_date = new Date();

        var to_date = new Date();

        to_date.setDate(to_date.getDate() - 0);
        
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
    var report_date = vars.scan_dates.split('to');
    
    return report_date;
}

$("#kt_daterangepicker_report_date").daterangepicker({
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

$('#load_scan_btn').on('click', function(e){

    var report_date_start = $("#kt_daterangepicker_report_date").data('daterangepicker').startDate;

    var report_date_end = $("#kt_daterangepicker_report_date").data('daterangepicker').endDate;

    var data = $('#selected_sid').select2('data');

    if(data) {
        var SID = data[0].text;
    
        var checkid = data[0].id;
    }
    
    date_start = report_date_start.format('YYYY-MM-DD.HH:mm');

    date_end = report_date_end.format('YYYY-MM-DD.HH:mm');

    var url = `/pingdom/check/history?check_id=`+checkid+`&sid=`+SID+`&start_time=`+date_start+`&end_time=`+date_end;

    get_history_data(url);
  });