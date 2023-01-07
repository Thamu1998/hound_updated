"use strict";
var stack_chart = function (chart_name, data, label, max_y) {
    var element = document.getElementById(chart_name);
    var height = parseInt(KTUtil.css(element, 'height'));
    var labelColor = KTUtil.getCssVariableValue('--bs-gray-500');
    var borderColor = KTUtil.getCssVariableValue("--bs-gray-300");
    var baseColor = KTUtil.getCssVariableValue('--kt-primary');
    var baseLightColor = KTUtil.getCssVariableValue('--kt-primary-light');
    var secondaryColor = KTUtil.getCssVariableValue('--kt-info');

    if (!element) {
        return;
    }

    var options = {
        series: data,
        chart: {
            fontFamily: 'inherit',
            type: "bar",
            height: height,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                endingShape: 'rounded',
                columnWidth: ['90px'], 
                borderRadius: 6
            },
        },
        legend: {
            show: true
        },
        dataLabels: {
            enabled: true
        },
        stroke: {
            curve: 'smooth',
            show: true,
            width: 10,
            colors: ['transparent']
        },
        xaxis: {
            categories: label,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            max: max_y,
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: '12px'
                }
            }
        },
        fill: {
            opacity: 1
        },
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            active: {
                allowMultipleDataPointsSelection: true,
                filter: {
                    type: 'none',
                    value: 0
                }
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontSize: '12px'
            },
            y: {
                formatter: function (val) {
                    return val + " events"
                }
            }
        },
        colors: ['#fae1ca', '#cfe1b9', '#fbb1bd', '#99e2b4'],
        grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: !0
                }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        }
    };

    var chart = new ApexCharts(element, options);
    
    return chart;
}

var intermediate_chart_load = {


	init: function() {

        var end_date_start = $("#kt_daterangepicker_end_date").data('daterangepicker').startDate;

        var end_date_end = $("#kt_daterangepicker_end_date").data('daterangepicker').endDate;

        end_date_start = end_date_start.format('YYYY-MM-DD.HH:mm');

        end_date_end = end_date_end.format('YYYY-MM-DD.HH:mm');

        var is_parameter = $(location).attr('href').split("?");
        
        if (is_parameter.length == 1){

            var URL = `/notification/event/chart/intermediate?`+`EndDateTime_gt=`+end_date_start+`&EndDateTime_lt=`+end_date_end;

        }else{

            var URL = `/notification/event/chart/intermediate?`+is_parameter[1].replaceAll("ParentObjectID__", "");
        }
        
        $.ajax({
            method: "GET",
            url: URL,
            success: function(data){
                
                if(data.label.length > 5) {
                    $('#chart_intermidiate_slo').css('width', '1500px');
                    $('#chart_intermidiate_sla').css('width', '1500px');
                }
                
                var chart_inter_slo = stack_chart("chart_intermidiate_slo", data['slo'], data.label, data.slo_max)
                chart_inter_slo.render();

                var chart_inter_sla = stack_chart("chart_intermidiate_sla", data['sla'], data.label, data.sla_max)
                chart_inter_sla.render();
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

	}
};

var fianl_chart_load = {
	init: function() {

        var end_date_start = $("#kt_daterangepicker_end_date").data('daterangepicker').startDate;

        var end_date_end = $("#kt_daterangepicker_end_date").data('daterangepicker').endDate;

        end_date_start = end_date_start.format('YYYY-MM-DD.HH:mm');

        end_date_end = end_date_end.format('YYYY-MM-DD.HH:mm');

        var is_parameter = $(location).attr('href').split("?");
        
        if (is_parameter.length == 1){

            var URL = `/notification/event/chart/final?`+`EndDateTime_gt=`+end_date_start+`&EndDateTime_lt=`+end_date_end;

        }else{

            var URL = `/notification/event/chart/final?`+is_parameter[1].replaceAll("ParentObjectID__", "");
        }

        $.ajax({
            method: "GET",
            url: URL,
            success: function(data){

                if(data.label.length > 5) {
                    $('#chart_final_slo').css('width', '1500px');
                    $('#chart_final_sla').css('width', '1500px');
                };

                var chart_final_slo = stack_chart("chart_final_slo", data['slo'], data.label, data.slo_max)
                chart_final_slo.render();

                var chart_final_sla = stack_chart("chart_final_sla", data['sla'], data.label, data.sla_max)
                chart_final_sla.render();
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

	}
};

KTUtil.onDOMContentLoaded((function() {
	intermediate_chart_load.init()
    fianl_chart_load.init()
}));