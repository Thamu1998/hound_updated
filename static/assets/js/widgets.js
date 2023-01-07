var widget_1 = function(chart_name, chart_height="100",text_with_color, text_color, text_sub, total_count, label, value, label_color, col_order, url_list){
    
    var sub_div_label = ""
    
    label.forEach(function(item, index){

        sub_div_label = sub_div_label+`<div class="d-flex fs-6 pt-2 fw-bold align-items-center">
        <div class="bullet w-8px h-6px rounded-2 #fca311 me-3" style="background-color: `+label_color[index]+`;"></div>
        <div class="text-gray-500 flex-grow-1 me-4 fw-bolder"><a href="`+url_list[index]+`">`+item+`</a></div>
        <div class="fw-boldest text-gray-700 text-xxl-end">`+value[index]+`</div>
        </div>`;

    })
    
    var widget = `<div class="card card-flush h-md-`+chart_height+` mb-5 mb-xl-10 `+col_order+`" style="max-height:281px">
                    <div class="card-header pt-5">
                        <div class="card-title d-flex flex-column">
                            <div class="d-flex align-items-center">
                                <h3 class="fw-bolder"><span class="`+text_color+`">`+text_with_color+` </span><span> `+text_sub+` </span></h3>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-2 pb-4 d-flex align-items-center">
                        <div class="d-flex flex-center me-5 pt-2">
                            <div class="d-flex flex-center" style="position: absolute;">
                                <span class="fs-2hx fw-bolder text-dark">`+total_count+`</span>
                            </div>                            
                            <canvas id="`+chart_name+`" width="100" height="100" data-kt-size="70" data-kt-line="11"></canvas>
                        </div>
                        <div class="d-flex flex-column content-justify-center w-100">
                            `+sub_div_label+`                           
                        </div>
                    </div>
                </div>`;

    var config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: value,
                            backgroundColor: label_color
                        }],
                        labels: label
                    },
                    options: {
                        plugins: { legend: { display: false, }, title: {display: false, text: 'Status'}, animation: {animateScale: true, animateRotate: true},},
                        cutout: 35,
                        borderRadius:4,
                        responsive: false,
                        maintainAspectRatio: true,
                    }
                };
    
    return [widget, config]

};

var widget_2 = function(chart_name, text_with_color, text_color, text_sub, label, value, label_color, widget_name, col_order, url_list){

            var widget = `<div class="row g-5 g-xl-8 `+col_order+`"><div class="card card-flush overflow-hidden h-md-50">
                                <div class="card-header pt-10">
                                <h3 class="fw-bolder"><span class="`+text_color+`">`+text_with_color+` </span><span> `+text_sub+` </span></h3>
                            </div>
                            <div class="card-body d-flex justify-content-between flex-column pt-0 px-0">  
                                <div id="`+chart_name+`" class="min-h-auto ps-4 pe-6" style="height: 300px"></div>
                            </div>
                        </div></div>`;

                              
            
            var e = document.getElementById(chart_name);
            
            var a = KTUtil.getCssVariableValue("--bs-gray-800")

            var  t = KTUtil.getCssVariableValue("--bs-gray-400");
            
            var config = {
                            series: [{
                                name: widget_name,
                                data: value
                            }],
                            chart: {
                                fontFamily: "inherit",
                                type: "bar",
                                height: 300,
                                toolbar: {
                                    show: !1
                                },
                                events: {
                                    dataPointSelection: (event, chartContext, config) => {
                                        var key = config.w.config.xaxis.categories[config.dataPointIndex];
                                        window.location.href = url_list[key];
                                    }
                                  }                                
                            },
                            plotOptions: {
                                bar: {
                                    borderRadius: 8,
                                    horizontal: !0,
                                    distributed: !0,
                                    barHeight: 50,
                                    dataLabels: {
                                        position: "bottom"
                                    }
                                }
                            },
                            dataLabels: {
                                enabled: !0,
                                textAnchor: "start",
                                offsetX: 0,
                                formatter: function(e, a) {
                                    return e
                                },
                                style: {
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    align: "left"
                                }
                            },
                            legend: {
                                show: !1
                            },
                            colors: label_color,
                            xaxis: {
                                categories: label,
                                labels: {
                                    formatter: function(e) {
                                        return e
                                    },
                                    style: {
                                        colors: a,
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        align: "left"
                                    }
                                },
                                axisBorder: {
                                    show: !1
                                }
                            },
                            yaxis: {
                                labels: {
                                    formatter: function(e, a) {
                                        return Number.isInteger(e) ? e + " - " + parseInt(100 * e / 18).toString() + "%" : e
                                    },
                                    style: {
                                        colors: a,
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    },
                                    offsetY: 2,
                                    align: "left"
                                }
                            },
                            grid: {
                                borderColor: t,
                                xaxis: {
                                    lines: {
                                        show: !0
                                    }
                                },
                                yaxis: {
                                    lines: {
                                        show: !1
                                    }
                                },
                                strokeDashArray: 4
                            },
                            tooltip: {
                                style: {
                                    fontSize: "12px"
                                },
                                y: {
                                    formatter: function(e) {
                                        return e
                                    }
                                }
                            }
                        };
            
            return [widget, config]
};

var static_card_primary = function(props){

    var card = `<div class="col-xl-6 order-`+props.order+`" style="height:200px;">
                    <a href="`+props.url+`" class="card bg-primary hoverable card-xl-stretch mb-xl-8">
                        <div class="card-body">
                            <span class="svg-icon svg-icon-gray-100 svg-icon-3x ms-n1">
                                `+props.svg+`
                            </span>
                            <div class="text-gray-100 fw-bolder fs-2 mb-2 mt-5">`+props.value+`</div>
                            <div class="fw-bold text-gray-100 fw-bolder fs-6">`+props.title+`</div>
                        </div>
                    </a>
                </div>`;
    
    return card;
}

var static_card_white = function(props){

    var card = `<div class="col-xl-6 order-`+props.order+`" style="height:200px;">
                    <a href="`+props.url+`" class="card bg-body hoverable card-xl-stretch mb-xl-8">
                        <div class="card-body">
                            <span class="svg-icon svg-icon-primary svg-icon-3x ms-n1">
                                `+props.svg+`
                            </span>
                            <div class="text-gray-900 fw-bolder fs-2 mb-2 mt-5">`+props.value+`</div>
                            <div class="fw-bold text-gray-400 fw-bolder fs-5">`+props.title+`</div>
                        </div>
                    </a>
                </div>`;
    
    return card;
};

var amr_widget_1_div = function(props){

    var card = `<div class="card card-flush h-xl-50">
                    <div class="card-header pt-7 mb-7">
                    <a href="`+props.url+`"><h3 class="fw-bolder"><span class="`+props.text_color+`">`+props.text_with_color+` </span><span> `+props.text_sub+` </span></h3></a>
                        <div class="card-toolbar">
                            <div class="d-flex flex-center">
                                <span class="fs-2hx fw-bolder text-dark">`+props.total_count+`</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body d-flex justify-content-between flex-column">
                        <div id="`+props.chart_name+`" style="height: 235px;"></div>
                    </div>
                </div>`;

    return card;
};

var amr_widget_1_chart = {
    init: function(props) {
        ! function() {
            if ("undefined" != typeof am5) {

                am5.ready(function() {
    
                    // Create root element
                    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                    var chart_name = document.getElementById(props.chart_name);
                    
                    var root = am5.Root.new(chart_name);
                    
                    
                    // Set themes
                    // https://www.amcharts.com/docs/v5/concepts/themes/
                    root.setThemes([
                      am5themes_Animated.new(root)
                    ]);
                    
                    
                    // Create chart
                    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
                    var chart = root.container.children.push(am5percent.PieChart.new(root, {
                      layout: root.verticalLayout
                    }));
                    
                    
                    // Create series
                    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
                    var series = chart.series.push(am5percent.PieSeries.new(root, {
                      alignLabels: true,
                      calculateAggregates: true,
                      valueField: "value",
                      categoryField: "category"
                    }));
                    
                    series.slices.template.setAll({
                      strokeWidth: 3,
                      stroke: am5.color(0xffffff)
                    });
                    
                    series.labelsContainer.set("paddingTop", 10)
                    
                    
                    // Set up adapters for variable slice radius
                    // https://www.amcharts.com/docs/v5/concepts/settings/adapters/
                    series.slices.template.adapters.add("radius", function (radius, target) {
                      var dataItem = target.dataItem;
                      var high = series.getPrivate("valueHigh");
                    
                      if (dataItem) {
                        var value = target.dataItem.get("valueWorking", 0);
                        
                        return radius * value / high
                      }
                      return radius;
                    });
                    
                    
                    // Set data
                    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
                    series.data.setAll(props.data_set);
                    
                    
                    
                    series.labels.template.set("visible", false);
                    series.ticks.template.set("visible", false)
                    
                    
                    // Play initial series animation
                    // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
                    series.appear(1000, 100);
                    
                    }); // end am5.ready()
                
            }
        }()
    }
};

var apex_chart_1 = function(props) {
        
        var card = `<div class="card card-xl-stretch mb-5 mb-xl-8">         
                        <div class="card-header border-0 pt-5">
                            <h3 class="fw-bolder"><span class="`+props.text_color+`">`+props.text_with_color+` </span><span> `+props.text_sub+` </span></h3>
                        </div>
                        <div class="card-body">
                            <div id="`+props.chart_name+`" style="height: 350px" class="card-rounded-bottom"></div>
                        </div>
                    </div>`
    
        var a = KTUtil.getCssVariableValue("--bs-gray-500"),
            o = KTUtil.getCssVariableValue("--bs-gray-200"),
            s = KTUtil.getCssVariableValue("--bs-gray-300"),
            r = KTUtil.getCssVariableValue("--bs-warning"),
            i = KTUtil.getCssVariableValue("--bs-light-warning"),
            l = KTUtil.getCssVariableValue("--bs-success"),
            n = KTUtil.getCssVariableValue("--bs-light-success"),
            c = KTUtil.getCssVariableValue("--bs-primary"),
            d = KTUtil.getCssVariableValue("--bs-light-primary");
    
    var config = {
                    series: props.data_series,
                    chart: {
                        fontFamily: "inherit",
                        type: "area",
                        height: 480,
                        toolbar: {
                            show: !1
                        },
                        zoom: {
                            enabled: !1
                        },
                        sparkline: {
                            enabled: !0
                        }
                    },
                    plotOptions: {},
                    legend: {
                        show: !1
                    },
                    dataLabels: {
                        enabled: !1
                    },
                    fill: {
                        type: "solid",
                        opacity: 1
                    },
                    stroke: {
                        curve: "smooth",
                        show: !0,
                        width: 2,
                        colors: props.label_color
                    },
                    xaxis: {
                        x: 0,
                        offsetX: 0,
                        offsetY: 0,
                        padding: {
                            left: 0,
                            right: 0,
                            top: 0
                        },
                        categories: props.label,
                        axisBorder: {
                            show: !1
                        },
                        axisTicks: {
                            show: !1
                        },
                        labels: {
                            show: !1,
                            style: {
                                colors: a,
                                fontSize: "12px"
                            }
                        },
                        crosshairs: {
                            show: !1,
                            position: "front",
                            stroke: {
                                color: s,
                                width: 1,
                                dashArray: props.label.length
                            }
                        },
                        tooltip: {
                            enabled: !0,
                            formatter: void 0,
                            offsetY: 0,
                            style: {
                                fontSize: "12px"
                            }
                        }
                    },
                    yaxis: {
                        y: 0,
                        offsetX: 0,
                        offsetY: 0,
                        padding: {
                            left: 0,
                            right: 0
                        },
                        labels: {
                            show: !1,
                            style: {
                                colors: a,
                                fontSize: "12px"
                            }
                        }
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
                                return e
                            }
                        }
                    },
                    colors: [i, n, d],
                    grid: {
                        borderColor: o,
                        strokeDashArray: 4,
                        padding: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                        }
                    },
                    markers: {
                        colors: props.label_color,
                        strokeColor: props.label_color,
                        strokeWidth: props.label.length
                    }
                };
    
    return [card, config]
};

var apex_chart_bar = function(props) {

    var card = `<div class="card card-flush" style="height:600px;">
                    <div class="card-header pt-7">
                        <h2 class="card-title align-items-start flex-column">
                            <span class="card-label fw-bolder text-gray-800">`+props.title+`</span>
                            <span class="text-gray-400 mt-1 fw-bold fs-6">`+props.sub_text+`</span>
                        </h2>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between pb-5 px-0">
                        <div class="tab-content ps-4 pe-6">
                            <div id="`+props.chart_name+`" class="min-h-auto" style="height: 270px"></div>
                        </div>
                    </div>
                </div>`;

    $('#'+props.div_name+'').html(card)

    var e = document.getElementById(props.chart_name);

    var a = parseInt(KTUtil.css(e, "height")),
        t = KTUtil.getCssVariableValue("--bs-gray-900"),
        l = KTUtil.getCssVariableValue("--bs-border-dashed-color")

    var config = {
                    series: [{
                        name: "Total",
                        data: props.data
                    }],
                    chart: {
                        fontFamily: "inherit",
                        type: "bar",
                        height: 480,
                        toolbar: {
                            show: !1
                        },
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                var key = config.w.config.xaxis.categories[config.dataPointIndex];
                                console.log(key);
                                window.location.href = props.url_list[key];
                            }
                          }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: !1,
                            columnWidth: ["28%"],
                            borderRadius: 5,
                            dataLabels: {
                                position: "top"
                            },
                            startingShape: "flat"
                        }
                    },
                    legend: {
                        show: !1
                    },
                    dataLabels: {
                        enabled: !0,
                        offsetY: -28,
                        style: {
                            fontSize: "13px",
                            colors: [t]
                        },
                        formatter: function(e) {
                            return e
                        }
                    },
                    stroke: {
                        show: !0,
                        width: 2,
                        colors: ["transparent"]
                    },
                    xaxis: {
                        categories: props.label,
                        axisBorder: {
                            show: !1
                        },
                        axisTicks: {
                            show: !1
                        },
                        labels: {
                            style: {
                                colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                                fontSize: "13px"
                            }
                        },
                        crosshairs: {
                            fill: {
                                gradient: {
                                    opacityFrom: 0,
                                    opacityTo: 0
                                }
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: KTUtil.getCssVariableValue("--bs-gray-500"),
                                fontSize: "13px"
                            },
                            formatter: function(e) {
                                return e
                            }
                        }
                    },
                    fill: {
                        opacity: 1
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
                                return + e + " Systems"
                            }
                        }
                    },
                    colors: [KTUtil.getCssVariableValue("--bs-primary"), KTUtil.getCssVariableValue("--bs-light-primary")],
                    grid: {
                        borderColor: l,
                        strokeDashArray: 4,
                        yaxis: {
                            lines: {
                                show: !0
                            }
                        }
                    }
                };
    
    var myDoughnut = new ApexCharts(e, config).render();

}

var apex_chart_card_1 = function(props) {
    
    var card = `<div class="card overflow-hidden h-md-50 mb-5 mb-xl-10" style="max-height:281px">
                    <div class="card-body d-flex justify-content-between flex-column px-0 pb-0">
                        <div class="mb-4 px-9">
                            <div class="d-flex align-items-center mb-2">
                                <span class="fs-2hx fw-bolder text-gray-800 me-2 lh-1 ls-n2">`+props.total+`</span>
                                <span class="d-flex align-items-end text-gray-400 fs-6 fw-bold">`+props.side_text+`</span>
                            </div>
                            <span class="fs-6 fw-bold text-gray-400">`+props.title+`</span>
                        </div>
                        <div id="`+props.chart_name+`" class="min-h-auto" style="height: 125px"></div>
                    </div>
                </div>`;

    $('#'+props.div_name+'').append(card)

    var e = document.getElementById(props.chart_name);

    if (e) {
        var a = parseInt(KTUtil.css(e, "height")),
            t = (KTUtil.getCssVariableValue("--bs-border-dashed-color"), KTUtil.getCssVariableValue("--bs-gray-800")),
            l = KTUtil.getCssVariableValue("--bs-success"),
            o = new ApexCharts(e, {
                series: [{
                    name: "Total",
                    data: props.data
                }],
                chart: {
                    fontFamily: "inherit",
                    type: "area",
                    height: a,
                    toolbar: {
                        show: !1
                    }
                },
                legend: {
                    show: !1
                },
                dataLabels: {
                    enabled: !1
                },
                fill: {
                    type: "solid",
                    opacity: 0
                },
                stroke: {
                    curve: "smooth",
                    show: !0,
                    width: 2,
                    colors: [t]
                },
                xaxis: {
                    categories: props.label,
                    axisBorder: {
                        show: !1
                    },
                    axisTicks: {
                        show: !1
                    },
                    labels: {
                        show: !1
                    },
                    crosshairs: {
                        position: "front",
                        stroke: {
                            color: t,
                            width: 1,
                            dashArray: 3
                        }
                    },
                    tooltip: {
                        enabled: !0,
                        formatter: void 0,
                        offsetY: 0,
                        style: {
                            fontSize: "12px"
                        }
                    }
                },
                yaxis: {
                    labels: {
                        show: !1
                    }
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
                            return + e + " VM's"
                        }
                    }
                },
                colors: [l],
                grid: {
                    strokeDashArray: 4,
                    padding: {
                        top: 0,
                        right: -20,
                        bottom: -20,
                        left: -20
                    },
                    yaxis: {
                        lines: {
                            show: !0
                        }
                    }
                },
                markers: {
                    strokeColor: t,
                    strokeWidth: 2
                }
            });
        setTimeout((function() {
            o.render()
        }), 300)
    };             
}