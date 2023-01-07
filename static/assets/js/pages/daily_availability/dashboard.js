// Class definition
var chart_widgets = function() {

    var weekly_prod_availablity = function() {

        var endpoint = '/availability/cht/prod/daily';
        var label = [];
        var data_series = [];
        var min_value = 0;
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                data_series = data.data
                label = data.label
                min_value = data.min_value
                weekly_prod_availablity_init()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function weekly_prod_availablity_init(){

            var card = `<div class="card card-xl-stretch-50 mb-5 mb-xl-8 h-290px" style="height:285px">            
                            <div class="card-body p-0 d-flex justify-content-between flex-column overflow-hidden">                
                                <div class="d-flex flex-stack flex-wrap flex-grow-1 px-9 pt-9 pb-3">
                                    <div class="me-2">
                                        <span class="d-block"><span class="fw-bolder text-primary fs-3">Production </span><span class="fw-bolder fs-3">Availability</span></span>
                                        <span class="text-gray-400 fw-bold">`+label[0]+` - `+label[label.length-1]+`</span>
                                    </div>
                                </div>
                                <div class="chart_prod_availablity" data-kt-color="primary" style="height: 175px"></div>
                            </div>
                        </div>`
            
            $('#availablity_chart').append(card)
            
            var e, t, a, o = document.querySelectorAll(".chart_prod_availablity"),
                s = KTUtil.getCssVariableValue("--bs-gray-500"),
                r = KTUtil.getCssVariableValue("--bs-gray-200"),
                i = KTUtil.getCssVariableValue("--bs-gray-300");

            [].slice.call(o).map((function(o) {

                e = o.getAttribute("data-kt-color"), t = parseInt(KTUtil.css(o, "height")), a = KTUtil.getCssVariableValue("--bs-" + e), new ApexCharts(o, {
                    series: data_series,
                    chart: {
                        fontFamily: "inherit",
                        type: "bar",
                        height: t,
                        toolbar: {
                            show: !1
                        },
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                var GetMonthNumber = {"Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"} 

                                var date = config.w.config.xaxis.categories[config.dataPointIndex];

                                var year = new Date().getFullYear();

                                var month = date.split(' ')[0];

                                var day = date.split(' ')[1];

                                var report_date = year + '-' + GetMonthNumber[month] + '-' + day;
                                
                                var sys_rol = config.w.config.series[config.dataPointIndex]['name'];
                                
                                var url = `/availability/report?StartDateTime__date__range=`+report_date+`to`+report_date+`&AvailabilityInPercentage!=100&BusinessType=ZH001;ZH006`;

                                window.location.href = url;
                            }
                        }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: !1,
                            columnWidth: ["40%"],
                            borderRadius: 4
                        }
                    },
                    legend: {
                        show: !1
                    },
                    dataLabels: {
                        enabled: !1
                    },
                    stroke: {
                        show: !0,
                        width: 2,
                        colors: ["transparent"]
                    },
                    xaxis: {
                        categories: label,
                        axisBorder: {
                            show: !1
                        },
                        axisTicks: {
                            show: !1
                        },
                        labels: {
                            style: {
                                colors: s,
                                fontSize: "12px"
                            }
                        }
                    },
                    yaxis: {
                        y: 0,
                        min: min_value,
                        max: 100,
                        tickAmount: 4,
                        offsetX: 0,
                        offsetY: 0,
                        labels: {
                            style: {
                                colors: s,
                                fontSize: "12px"
                            }
                        }
                    },
                    fill: {
                        type: "solid"
                    },
                    states: {
                        normal: {
                            filter: {
                                type: "none",
                                value: 0
                            }
                        },
                        hover: {
                            filter: {
                                type: "none",
                                value: 0
                            }
                        },
                        active: {
                            allowMultipleDataPointsSelection: !1,
                            filter: {
                                type: "none",
                                value: 0
                            }
                        }
                    },
                    tooltip: {
                        style: {
                            fontSize: "12px"
                        },
                        y: {
                            formatter: function(e) {
                                return "%"+e + " availablity"
                            }
                        }
                    },
                    colors: [a, i, "#dda15e"],
                    grid: {
                        padding: {
                            top: 10
                        },
                        borderColor: r,
                        strokeDashArray: 4,
                        yaxis: {
                            lines: {
                                show: !0
                            }
                        }
                    }
                }).render()
            }))
        };
    }

    var weekly_non_prod_availablity = function() {
        var endpoint = '/availability/cht/nonprod/daily';
        var label = [];
        var data_series = [];
        min_value = 0;
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                data_series = data.data
                label = data.label
                min_value = data.min_value
                weekly_non_prod_availablity_init()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function weekly_non_prod_availablity_init(){

            var card = `<div class="card card-xl-stretch-50 mb-5 mb-xl-8 h-290px" style="height:285px">            
                            <div class="card-body p-0 d-flex justify-content-between flex-column overflow-hidden">                
                                <div class="d-flex flex-stack flex-wrap flex-grow-1 px-9 pt-9 pb-3">
                                    <div class="me-2">
                                        <span class="d-block"><span class="fw-bolder text-warning fs-3">Non-Production </span><span class="fw-bolder fs-3">Availability</span></span>
                                        <span class="text-gray-400 fw-bold">`+label[0]+` - `+label[label.length-1]+`</span>
                                    </div>
                                </div>
                                <div class="chart_non_prod_availablity" data-kt-color="primary" style="height: 175px"></div>
                            </div>
                        </div>`
            
            $('#availablity_chart').append(card)
            
            var e, t, a, o = document.querySelectorAll(".chart_non_prod_availablity"),
                s = KTUtil.getCssVariableValue("--bs-gray-500"),
                r = KTUtil.getCssVariableValue("--bs-gray-200"),
                i = KTUtil.getCssVariableValue("--bs-gray-300");

            [].slice.call(o).map((function(o) {

                e = o.getAttribute("data-kt-color"), t = parseInt(KTUtil.css(o, "height")), a = KTUtil.getCssVariableValue("--bs-" + e), new ApexCharts(o, {
                    series: data_series,
                    chart: {
                        fontFamily: "inherit",
                        type: "bar",
                        height: t,
                        toolbar: {
                            show: !1
                        },
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                var GetMonthNumber = {"Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"} 

                                var date = config.w.config.xaxis.categories[config.dataPointIndex];

                                var year = new Date().getFullYear();

                                var month = date.split(' ')[0];

                                var day = date.split(' ')[1];

                                var report_date = year + '-' + GetMonthNumber[month] + '-' + day;
                                
                                var sys_rol = config.w.config.series[config.dataPointIndex]['name'];
                                
                                var url = `/availability/report?StartDateTime__date__range=`+report_date+`to`+report_date+`&AvailabilityInPercentage!=100&BusinessType=ZH029;ZH019;ZH037;ZH040;ZH023;ZH028;ZH032`;

                                window.location.href = url;
                            }
                        }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: !1,
                            columnWidth: ["40%"],
                            borderRadius: 4
                        }
                    },
                    legend: {
                        show: !1
                    },
                    dataLabels: {
                        enabled: !1
                    },
                    stroke: {
                        show: !0,
                        width: 2,
                        colors: ["transparent"]
                    },
                    xaxis: {
                        categories: label,
                        axisBorder: {
                            show: !1
                        },
                        axisTicks: {
                            show: !1
                        },
                        labels: {
                            style: {
                                colors: s,
                                fontSize: "12px"
                            }
                        }
                    },
                    yaxis: {
                        y: 0,
                        min: min_value,
                        max: 100,
                        tickAmount: 4,
                        offsetX: 0,
                        offsetY: 0,
                        labels: {
                            style: {
                                colors: s,
                                fontSize: "12px"
                            }
                        }
                    },
                    fill: {
                        type: "solid"
                    },
                    states: {
                        normal: {
                            filter: {
                                type: "none",
                                value: 0
                            }
                        },
                        hover: {
                            filter: {
                                type: "none",
                                value: 0
                            }
                        },
                        active: {
                            allowMultipleDataPointsSelection: !1,
                            filter: {
                                type: "none",
                                value: 0
                            }
                        }
                    },
                    tooltip: {
                        style: {
                            fontSize: "12px"
                        },
                        y: {
                            formatter: function(e) {
                                return "%"+e + " availablity"
                            }
                        }
                    },
                    colors: [a, i, "#dda15e"],
                    grid: {
                        padding: {
                            top: 10
                        },
                        borderColor: r,
                        strokeDashArray: 4,
                        yaxis: {
                            lines: {
                                show: !0
                            }
                        }
                    }
                }).render()
            }))
        };

    }

    return {
        init: function() { 
            weekly_prod_availablity();
            weekly_non_prod_availablity();
        }
    };
}();


jQuery(document).ready(function() {
    
    chart_widgets.init();
});