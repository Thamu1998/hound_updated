function convert_date(date){

    var convert_date = new Date(date)

    var convert_date = convert_date.getTime()

    return convert_date;

}

function generate_dom_chart_available(data){

    var element = document.getElementById(data.chart_id);
    
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
            height: 90,
            toolbar: {
                show: false,
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
                   return "";    
            }},
            type: 'datetime'
        },
        stroke: {
            width: 1
        },
        fill: {
            show:false,
            type: 'solid',
            opacity: 9
        },
        legend: {
            show: false,
            position: 'bottom',
            horizontalAlign: 'left'
        }
    };

    var chart = new ApexCharts(element, options);
    chart.render();

}

var check_scan_data = function () {

    var initScan = function () {

        var report_date_start = $("#kt_daterangepicker_report_date").data('daterangepicker').startDate;

        var report_date_end = $("#kt_daterangepicker_report_date").data('daterangepicker').endDate;

        report_date_start = report_date_start.format('YYYY-MM-DD.HH:mm');

        report_date_end = report_date_end.format('YYYY-MM-DD.HH:mm');
        
        var endpoint = `/pingdom/downtime/scan?scan_dates=`+report_date_start+`to`+report_date_end;

        var scan_data = [];
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                scan_data = data
                $('#scan_table').show();
                $('#error_div').hide();
                generate_dom()
            },
            error: function(error_data){
                $('#error_div').show();
                $('#scan_table').hide();
                var error = JSON.parse(error_data.responseText);

                var typed = new Typed("#kt_error_div", {
                    strings: [error],
                    typeSpeed: 30
                });
            }
        });

        function generate_dom(){

            var final_data = [];

            var card_data = []

            Object.keys(scan_data).forEach(function(item, index){
                
                var scan_data_inst = scan_data[item];
                console.log(scan_data_inst);
                var card_information = {'chart_id': item.toString()+"_chart", "up":[], "down":[]};

                var tr_data = ""

                scan_data_inst.details.forEach(function(item, index){
                    
                    tmp_tr = ""
                    
                    item.card_data.y =[convert_date(item.card_data.y[0]), convert_date(item.card_data.y[1])]

                    tmp_tr = `<tr><td style="text-align: center;"><span class="font-weight-bold badge badge-light-success fs-6">`+item.status.toUpperCase()+`</span></td><td style="text-align: center;">`+item.FromTime+`</td><td style="text-align: center;">`+item.ToTime+`</td><td style="text-align: center;">`+item.duration+`</td></tr>`

                    if (item.status == 'down'){
                        tmp_tr = `<tr><td style="text-align: center;"><span class="font-weight-bold badge badge-light-danger fs-6">`+item.status.toUpperCase()+`</span></td><td style="text-align: center;">`+item.FromTime+`</td><td style="text-align: center;">`+item.ToTime+`</td><td style="text-align: center;">`+item.duration+`</td></tr>`
                    }
                    
                    if(item.status == 'up'){
                        card_information["up"].push(item.card_data);
                    }
                    else if (item.status == 'down'){
                        card_information["down"].push(item.card_data);
                    }

                    tr_data += tmp_tr
                    
                });

                var card_div = `<div class="row mt-5 p-0"><div id="`+item.toString()+"_chart"+`" class="p-0"></div></div>`;

                var table_data =  `<table class="table align-middle table-row-dashed fs-6 gy-5">
                                        <thead>
                                            <tr class="text-start text-gray-400 fw-bolder fs-6 text-uppercase gs-0 table_header h1-font-size">
                                                <th style="text-align: center;">Status</th>
                                                <th style="text-align: center;">Start</th>
                                                <th style="text-align: center;">End</th>
                                                <th style="text-align: center;">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody class="text-gray-600 fw-bold fs-5">
                                            `+tr_data+`
                                        </tbody>
                                    </table>`;
                
                var model_card = `<div class="modal fade" tabindex="-1" id="kt_modal_`+item+`">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title">Availability for `+item+`</h5>
                                                </div>
                                    
                                                <div class="modal-body">
                                                    `+table_data+`
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;

                $('#model_div_area').append(model_card);
                
                var temp_data = {'SID': item, "DataCenter":scan_data_inst.DataCenter, "BusinessType":scan_data_inst.BusinessType,'chart_div':card_div, 'downCount': scan_data_inst.downCount, 'totalDown': scan_data_inst.totalDown, 'fromTime': scan_data_inst.fromTime};
                
                final_data.push(temp_data);

                card_data.push(card_information);
            });

            getDataForDatatables(final_data);
            
            card_data.forEach(function(item, index){
                generate_dom_chart_available(item);
            })

        }

    }

    return {
        init: function () {
            initScan();
        }
    }
}();

var max_limitdate = new Date();

max_limitdate.setDate(max_limitdate.getDate() + 0);

function getUrlVars()
{
    
    let paramString = window.location.href.split('?')[1];
    
    if (paramString == undefined){

        var from_date = new Date();

        var to_date = new Date();

        from_date.setDate(to_date.getDate() - 1);
        
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

    report_date_start = report_date_start.format('YYYY-MM-DD.HH:mm');

    report_date_end = report_date_end.format('YYYY-MM-DD.HH:mm');

    var url = `/pingdom/downtime?scan_dates=`+report_date_start+`to`+report_date_end;
  
    window.location.replace(url);
  });

KTUtil.onDOMContentLoaded(function () {
    $('#scan_table').hide();
    $('#error_div').hide();
    check_scan_data.init();
});
