// Class definition
var chart_widgets = function() {

    var chart_pip = function() {

        var endpoint = '/cld/cht/pip'
        var label = [];
        var value = [];
        var label_color = [];
        var total = 0;
        var text_with_color = "";
        var text_sub = "";
        var text_color = "";
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                label_color = data.label_color
                total = data.total
                text_with_color = data.text_with_color
                text_sub = data.text_sub
                text_color = data.text_color
                init_pip_chart()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function init_pip_chart(){
            if (label !== undefined){

                url_list = [];

                label.forEach(function(item, index){

                    url_list.push("/cld/system?LifeCycleStatus=PIP&SystemRole="+item)

                })

                widget_pip = widget_1("chart_pip", "50",text_with_color, text_color, text_sub, total, label, value, label_color, "order-3", url_list);
                
                $('#chart_widget_1').append(widget_pip[0]);            

                var ctx = document.getElementById('chart_pip').getContext('2d');

                var myDoughnut = new Chart(ctx, widget_pip[1]);
            }
        }
    }

    var chart_dip = function() {

        var endpoint = '/cld/cht/dip'
        var label = [];
        var value = [];
        var label_color = [];
        var total = 0;
        var text_with_color = "";
        var text_sub = "";
        var text_color = "";
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                label_color = data.label_color
                total = data.total
                text_with_color = data.text_with_color
                text_sub = data.text_sub
                text_color = data.text_color
                init_dip_chart()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function init_dip_chart(){
            if (label !== undefined){

                url_list = [];

                label.forEach(function(item, index){

                    url_list.push("/cld/system?LifeCycleStatus=DIP&SystemRole="+item)

                })

                widget_dip = widget_1("chart_dip", "50", text_with_color, text_color, text_sub, total, label, value, label_color, "order-2", url_list)

                $('#chart_widget_1').append(widget_dip[0]);

                var ctx = document.getElementById('chart_dip').getContext('2d');

                ctx.width = 10;
                ctx.height = 10;      

                var myDoughnut = new Chart(ctx, widget_dip[1]);
            }
        }
    }

    var chart_n_minus = function(){

        var endpoint = '/cld/cht/nminus'
        var label = [];
        var value = [];
        var label_color = [];
        var text_with_color = "";
        var text_sub = "";
        var text_color = "";
        var max_version_list = {};
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                label_color = data.label_color
                text_with_color = data.text_with_color
                text_sub = data.text_sub
                text_color = data.text_color
                max_version_list = data.max_version_list
                init_nminus_chart()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });


        function init_nminus_chart(){
            if (label !== undefined){ 
                
                url_list = {};

                label.forEach(function(item, index){
                    
                    url_list[item] = "/cld/system?SystemRole="+item+"&LeadingProductPatchVersion!="+max_version_list[item]['version']+";0&LifeCycleStatus!=DIP;D"

                })

                widget_nminus = widget_2("chart_nminus", text_with_color, text_color, text_sub, label, value, label_color, "count", "order-3", url_list)
                
                $('#chart_widget_2').append(widget_nminus[0])

                var ctx = document.getElementById('chart_nminus');

                var ApexChart_inst = new ApexCharts(ctx, widget_nminus[1]);

                ApexChart_inst.render();
            }
        
        }
    }

    var widget_cust_different_nw = function(){

        var endpoint = '/cld/cht/cdn'
        var label = [];
        var value = [];
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                init_widget_cust_different_nw()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function init_widget_cust_different_nw(){
            if (label !== undefined){
                var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-people" viewBox="0 0 16 16">
                            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                        </svg>`;

                widget = static_card_primary({"value":value, 'title': label, "svg": svg, "order":1, "card_color":"bg-primary", "url":"/cld/custindnw/systems"})
                
                $('#static_widget_1').append(widget)
            }
        }
    }

    var widget_sys_different_nw = function(){

        var endpoint = '/cld/cht/hdn'
        var label = [];
        var value = [];
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                init_widget_sys_different_nw()
            },
            error: function(error_data){
                console.log(error_data)
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function init_widget_sys_different_nw(){
            if (label !== undefined){
                
                var svg = ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hdd-network-fill" viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h5.5v3A1.5 1.5 0 0 0 6 11.5H.5a.5.5 0 0 0 0 1H6A1.5 1.5 0 0 0 7.5 14h1a1.5 1.5 0 0 0 1.5-1.5h5.5a.5.5 0 0 0 0-1H10A1.5 1.5 0 0 0 8.5 10V7H14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm.5 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/>
                            </svg>`;

                widget = static_card_white({"value":value, 'title': label, "svg": svg, "order":2, "url":"/cld/system/different/nw"})
                
                $('#static_widget_1').append(widget)
            }
        }
    }

    var widget_prod_without_ai = function(){

        var endpoint = '/cld/cht/pnai'
        var label = [];
        var value = [];
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                init_widget_prod_without_ai()
            },
            error: function(error_data){
                console.log(error_data)
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function init_widget_prod_without_ai(){
            if (label !== undefined){
                
                var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-send-x" viewBox="0 0 16 16">
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"/>
                                <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-4.854-1.354a.5.5 0 0 0 0 .708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708l-.647-.646.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708 0Z"/>
                            </svg>`;

                widget = static_card_primary({"value":value, 'title': label, "svg": svg, "order":2, "url":"/cld/prod/missing/ai"})
                
                $('#static_widget_2').append(widget)
            }
        }
    }

    var widget_b_tenant_with_more_than_2_shared_container = function(){

        var endpoint = '/cld/cht/twmsc'
        var label = [];
        var value = [];
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                init_widget_b_tenant_with_more_than_2_shared_container();
            },
            error: function(error_data){
                console.log(error_data)
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function init_widget_b_tenant_with_more_than_2_shared_container(){
            
            if (label !== undefined){
                
                var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-boxes" viewBox="0 0 16 16">
                                <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z"/>
                            </svg>`;

                widget = static_card_white({"value":value, 'title': label, "svg": svg, "order":2, 'url': '/cld/bd/tenant/sc'})
                
                $('#static_widget_2').append(widget)
            }
        }
    }

    var widget_invalid_pip_system = function(){

        var endpoint = '/cld/cht/npip'
        var data_set = [];
        var total = 0;
        var text_with_color = "";
        var text_sub = "";
        var text_color = "";
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                data_set = data.data_set
                total = data.total
                text_with_color = data.text_with_color
                text_sub = data.text_sub
                text_color = data.text_color
                init_widget_invalid_pip_system()
            },
            error: function(error_data){
                console.log(error_data)
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function init_widget_invalid_pip_system(){

            var url = "/cld/not/valid/pip";

            widget_npip = amr_widget_1_div({"chart_name":"chart_npip", "text_with_color":text_with_color,"text_color":text_color, "text_sub":text_sub, "total_count":total, "url":url});
            
            $('#arm_chart_1').append(widget_npip); 

            amr_widget_1_chart.init({chart_name:"chart_npip", "data_set": data_set})
        
        }

    }

    var widget_vm_create = function(){

        var endpoint = '/cld/cht/vm/count';
        var label = [];
        var data_series = [];
        var label_color = [];
        var text_with_color = "";
        var text_sub = "";
        var text_color = "";
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                data_series = data.data_series
                label = data.label
                label_color = data.label_color
                text_with_color = data.text_with_color
                text_sub = data.text_sub
                text_color = data.text_color
                init_widget_vm_create()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function init_widget_vm_create(){

            var widget = apex_chart_1({"chart_name": "chart_vm_created","text_color": text_color, "text_with_color": text_with_color, "text_sub": text_sub, "label_color":label_color, "data_series":data_series, "label":label})
            
            $('#vm_count_div').append(widget[0])
            
            var ctx = document.getElementById("chart_vm_created");
            
            var myDoughnut = new ApexCharts(ctx, widget[1]).render();

        }

    }

    var on_stock_widget = function() {

        var endpoint = '/cld/cht/stock'
        var label = [];
        var value = [];
        var title = "";
        var text_sub = "";
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                title = data.title
                text_sub = data.text_sub
                init_on_stock_widget();
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        
        function init_on_stock_widget() {

            url_list = {};

            label.forEach(function(item, index){
                
                url_list[item] = "/cld/system?LeadingProductPatchVersion!=0&SystemRole__icontains!=_HANA&DataCenterID="+item+"&LifeCycleStatus=L&CustomerID=''"

            })


            apex_chart_bar({'data': value, 'label': label, 'chart_name': 'chart_on_stock', 'title': title, 'sub_text': text_sub, 'div_name': 'div_on_stock', 'url_list':url_list });

        }
    }

    var vm_monthly_created = function() {

        var endpoint = '/cld/cht/vm/monthly/count'
        var label = [];
        var value = [];
        var total = 0;
        var title = "";
        var side_text = "";
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                title = data.title
                total = data.total
                side_text = data.side_text
                vm_monthly_created();
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });


       function vm_monthly_created() {
            apex_chart_card_1({'data': value, 'label': label, 'chart_name': 'chart_vm_monthly', 'total':total,'title': title, 'side_text': side_text, 'div_name': 'div_vm' })
       }

    }

    var customer_monthly_onboard = function() {

        var endpoint = '/cld/cht/vm/monthly/count'
        var label = [];
        var value = [];
        var total = 0;
        var title = "";
        var side_text = "";
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                label = data.label
                value = data.value
                title = data.title
                total = data.total
                side_text = data.side_text
                prod_monthly_created();
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });


       function prod_monthly_created() {
            apex_chart_card_1({'data': [0,0,0,0,0], 'label': label, 'chart_name': 'chart_customer_monthly_onboard', 'total':0,'title': "Production onboard for last 5 Months", 'side_text': "Customers", 'div_name': 'div_vm' })
       }

    }

    var daily_availability = function() {

        var endpoint = '/availability/cht/last/availability'
        var get_data = {};
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                get_data = data
                daily_availability_init();
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });


       function daily_availability_init() {
        
        var report_date = new Date();
        
        report_date.setDate(report_date.getDate() - 1);

        report_date = report_date.getFullYear()+"-"+(report_date.getMonth()+1)+"-"+report_date.getDate();

        if (get_data.prod_persentage != "None") {
            
            var card = `<div class="card card-flush border-0 h-md-100" style="max-height:281px">
                        <div class="card-header pt-2">
                            <h3 class="card-title">
                                <span class="fs-3 fw-bolder me-2">Daily Availability</span>
                                <span class="badge badge-success">Yesterday</span>
                            </h3>
                        </div>
                        <div class="card-body d-flex justify-content-between flex-column pt-1 px-0 pb-0">
                            
                            <div class="d-flex flex-wrap px-9 mb-5">
                                
                                <div class="rounded min-w-125px py-3 px-4 my-1 me-3" style="border: 1px dashed ">
                                    
                                    <a href="/availability/report?StartDateTime__date__range=`+report_date+`to`+report_date+`&AvailabilityInPercentage!=100&BusinessType=ZH001;ZH006"><div class="fw-bold fs-3 text-gray opacity-80">Production</div></a>
                                
                                    <div class="d-flex align-items-center">
                                        <div class="text-gray fs-2 fw-bolder" data-kt-countup="true" data-kt-countup-decimal-places="2" data-kt-countup-value="`+get_data.prod_persentage+`" data-kt-countup-suffix="%">`+get_data.prod_persentage+`</div>
                                        <div class="fw-bold fs-6 text-gray opacity-50">&nbsp;Availability</div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="text-gray fs-2 fw-bolder" data-kt-countup="true"  data-kt-countup-value="`+get_data.prod_count+`">`+get_data.prod_count+`</div>
                                        <div class="fw-bold fs-6 text-gray opacity-50">&nbsp;Systems</div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="text-gray fs-2 fw-bolder" data-kt-countup="true"  data-kt-countup-value="`+get_data.prod_sys_down+`">`+get_data.prod_sys_down+`</div>
                                        <div class="fw-bold fs-6 text-gray opacity-50">&nbsp;Systems down</div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="text-gray fs-2 fw-bolder" data-kt-countup="true"  data-kt-countup-value="`+get_data.prod_down_min+`">`+get_data.prod_down_min+`</div>
                                        <div class="fw-bold fs-6 text-gray opacity-50">&nbsp;min down</div>
                                    </div>
                                </div>
                                <div class="rounded min-w-125px py-3 px-4 my-1" style="border: 1px dashed ">
                                    
                                    <a href="/availability/report?StartDateTime__date__range=`+report_date+`to`+report_date+`&AvailabilityInPercentage!=100&BusinessType=ZH029;ZH019;ZH037;ZH040;ZH023;ZH028;ZH032"><div class="fw-bold fs-3 text-gray opacity-80">Non-Production</div></a>
                                    
                                    <div class="d-flex align-items-center">
                                        <div class="text-gray fs-2 fw-bolder" data-kt-countup="true" data-kt-countup-decimal-places="2" data-kt-countup-value="`+get_data.non_prod_persentage+`" data-kt-countup-suffix="%">`+get_data.non_prod_persentage+`</div>
                                        <div class="fw-bold fs-6 text-gray opacity-50">&nbsp;Availability</div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="text-gray fs-2 fw-bolder" data-kt-countup="true"  data-kt-countup-value="`+get_data.non_prod_count+`">`+get_data.non_prod_count+`</div>
                                        <div class="fw-bold fs-6 text-gray opacity-50">&nbsp;Systems</div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="text-gray fs-2 fw-bolder" data-kt-countup="true"  data-kt-countup-value="`+get_data.non_prod_sys_down+`">`+get_data.non_prod_sys_down+`</div>
                                        <div class="fw-bold fs-6 text-gray opacity-50">&nbsp;Systems down</div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="text-gray fs-2 fw-bolder" data-kt-countup="true"  data-kt-countup-value="`+get_data.non_prod_down_min+`">`+get_data.non_prod_down_min+`</div>
                                        <div class="fw-bold fs-6 text-gray opacity-50">&nbsp;min down</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }
        else{

            var card = `<div class="card card-flush border-0 h-md-100" style="min-height:255px">
                        <div class="card-header pt-2">
                            <h3 class="card-title">
                                <span class="fs-4 fw-bolder me-2">Daily Availability</span>
                                <span class="badge badge-success">Yesterday</span>
                            </h3>
                        </div>
                        <div class="card-body rounded min-w-125px py-3 px-4 my-1" style="border: 1px dashed>
                        <div class="text-center mb-20">
                        <h1 class="fs-1tx fw-bolder mb-8">Report yet to
                        <span class="d-inline-block position-relative ms-2">
                            <span class="d-inline-block mb-2">Update</span>
                            <span class="d-inline-block position-absolute h-8px bottom-0 end-0 start-0 bg-warning translate rounded"></span>
                        </span></h1>
                        </div>
                        </div>
                    </div>`;

        }

            $('#daily_availability_div').html(card);

       }

    }

    var dr_customer_tile = function() {

        var endpoint = '/cld/cht/drsystems';
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                dr_customer_tile_init(data);
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function dr_customer_tile_init(data) {

            var card = `<div class="card card-flush border-0 mb-10 bg-primary" style="height:318px">
                            <div class="card-header pt-2">
                                <h3 class="card-title">
                                    <a href="/cld/dr/systems"><span class="text-white fs-3 fw-bolder me-2">Disaster recovery <span class="text-warning fs-3 fw-bolder me-2">licensed customer - ${data.count}</span></span></a>
                                </h3>
                            </div>
                            <div class="card-body d-flex justify-content-between flex-column pt-1 px-0 pb-0">
                                <div class="d-flex flex-wrap px-9 mb-5 ms-5">
                                    <div class="rounded min-w-125px py-3 px-4 my-1 me-10" style="border: 2px dashed white; width:145px;">
                                        <div class="d-flex align-items-center">
                                            <div class="text-white fs-2 fw-bolder" data-kt-countup="true" data-kt-countup-value="${data.data.available.value}">${data.data.available.value}</div>
                                        </div>
                                        <div class="fw-bold fs-6 text-white opacity-90">Available</div>
                                    </div>
                                    <div class="rounded min-w-125px py-3 px-4 my-1" style="border: 2px dashed white; width:145px;">
                                        <div class="d-flex align-items-center">
                                            <div class="text-white fs-2 fw-bolder" data-kt-countup="true" data-kt-countup-value="${data.data.dr_to_be_build.value}">${data.data.dr_to_be_build.value}</div>
                                        </div>
                                        <div class="fw-bold fs-6 text-white opacity-90">DR to be build</div>
                                    </div>
                                </div>
                                <div class="d-flex flex-wrap px-9 mb-5 ms-5">
                                    <div class="rounded min-w-125px py-3 px-4 my-1 me-10" style="border: 2px dashed white">
                                        <div class="d-flex align-items-center">
                                            <div class="text-white fs-2 fw-bolder" data-kt-countup="true" data-kt-countup-value="${data.data.waiting_for_prod.value}">${data.data.waiting_for_prod.value}</div>
                                        </div>
                                        <div class="fw-bold fs-6 text-white opacity-90">Waiting for prod</div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            
            $('#dr_customer_div').html(card);       

        }

    }

    var overall_version = function() {

        var endpoint = '/cld/cht/overall/version'
        var get_data = {};
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                get_data = data
                overall_version_init(data);
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });
        function overall_version_init(data) {
            
            am5.ready(function() {


                // Create root element
                // https://www.amcharts.com/docs/v5/getting-started/#Root_element
                var root = am5.Root.new("overall_version_chartdiv");
                
                root.numberFormatter.set("numberFormat", "####");
                // Set themes
                // https://www.amcharts.com/docs/v5/concepts/themes/
                root.setThemes([am5themes_Animated.new(root)]);
                
                var container = root.container.children.push(
                am5.Container.new(root, {
                    width: am5.p100,
                    height: am5.p100,
                    layout: root.horizontalLayout
                })
                );
                
                
                // Create main chart
                // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
                var chart = container.children.push(
                am5percent.PieChart.new(root, {
                    tooltip: am5.Tooltip.new(root, {})
                })
                );
                
                // Create series
                // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
                var series = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: "value",
                    categoryField: "category",
                    alignLabels: true,
                    layout: root.verticalLayout,
                    legendLabelText: "{category} [{fill}]({value}) - {valuePercentTotal.formatNumber('0.00')}%[/]",
                    legendValueText: ""
                })
                );
                
                series.labels.template.setAll({
                fontSize: 13,
                fontWeight: "700",
                fill: am5.color(0x000000),
                text: "{category}[{fill}]({value})\n{valuePercentTotal.formatNumber('0.00')}%[/]"
                });

                series.slices.template.setAll({
                    fillOpacity: 0.7,
                    stroke: am5.color(0xffffff),
                    strokeWidth: 1
                  });
                  
                  series.ticks.template.set("visible", true);
                  series.slices.template.set("toggleKey", "none");
                
                // add events
                series.slices.template.events.on("click", function(e) {selectSlice(e.target)});
                
                // Create sub chart
                // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
                var subChart = container.children.push(am5percent.PieChart.new(root, {radius: am5.percent(50), tooltip: am5.Tooltip.new(root, {})}));
                
                // Create sub series
                // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
                var subSeries = subChart.series.push(am5percent.PieSeries.new(root, {valueField: "value", categoryField: "category", alignLabels: true}));

                subSeries.labels.template.setAll({
                    fontSize: 13,
                    fontWeight: "700",
                    fill: am5.color(0x000000),
                    text: "{category}[{fill}]({value})\n {valuePercentTotal.formatNumber('0.00')}%[/]"
                });
                
                subSeries.data.setAll([
                { category: "", value: 0 },
                { category: "", value: 0 },
                { category: "", value: 0 },
                { category: "", value: 0 }
                ]);

                subSeries.slices.template.set("toggleKey", "none");
                
                var selectedSlice;
                
                series.on("startAngle", function() {
                updateLines();
                });
                
                container.events.on("boundschanged", function() {
                root.events.on("frameended", function(){
                    updateLines();
                })
                })
                
                function updateLines() {
                if (selectedSlice) {
                    var startAngle = selectedSlice.get("startAngle");
                    var arc = selectedSlice.get("arc");
                    var radius = selectedSlice.get("radius");
                
                    var x00 = radius * am5.math.cos(startAngle);
                    var y00 = radius * am5.math.sin(startAngle);
                
                    var x10 = radius * am5.math.cos(startAngle + arc);
                    var y10 = radius * am5.math.sin(startAngle + arc);
                
                    var subRadius = subSeries.slices.getIndex(0).get("radius");
                    var x01 = 0;
                    var y01 = -subRadius;
                
                    var x11 = 0;
                    var y11 = subRadius;
                
                    var point00 = series.toGlobal({ x: x00, y: y00 });
                    var point10 = series.toGlobal({ x: x10, y: y10 });
                
                    var point01 = subSeries.toGlobal({ x: x01, y: y01 });
                    var point11 = subSeries.toGlobal({ x: x11, y: y11 });
                
                    line0.set("points", [point00, point01]);
                    line1.set("points", [point10, point11]);
                }
                }
                
                // lines
                var line0 = container.children.push(
                am5.Line.new(root, {
                    position: "absolute",
                    stroke: root.interfaceColors.get("text"),
                    strokeDasharray: [2, 2]
                })
                );
                var line1 = container.children.push(
                am5.Line.new(root, {
                    position: "absolute",
                    stroke: root.interfaceColors.get("text"),
                    strokeDasharray: [2, 2]
                })
                );
                
                // Set data
                // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
                series.data.setAll(data.series);
                
                function selectSlice(slice) {
                selectedSlice = slice;
                var dataItem = slice.dataItem;
                var dataContext = dataItem.dataContext;
                
                if (dataContext) {
                    var i = 0;
                    subSeries.data.each(function(dataObject) {
                    var dataObj = dataContext.subData[i];
                    
                    if(dataObj){
                        subSeries.data.setIndex(i, dataObj);
                        if(!subSeries.dataItems[i].get("visible")){
                            subSeries.dataItems[i].show();
                        }
                    }
                    else{
                        subSeries.dataItems[i].hide();
                    }
                    
                    i++;
                    });
                }
                
                var middleAngle = slice.get("startAngle") + slice.get("arc") / 2;
                var firstAngle = series.dataItems[0].get("slice").get("startAngle");
                
                series.animate({
                    key: "startAngle",
                    to: firstAngle - middleAngle,
                    duration: 1000,
                    easing: am5.ease.out(am5.ease.cubic)
                });
                series.animate({
                    key: "endAngle",
                    to: firstAngle - middleAngle + 360,
                    duration: 1000,
                    easing: am5.ease.out(am5.ease.cubic)
                });
                }
                
                container.appear(1000, 10);
                
                series.events.on("datavalidated", function() {
                selectSlice(series.slices.getIndex(0));
                });
                
                // Create legend
                // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
                var legend = chart.children.push(am5.Legend.new(root, {
                    y: am5.percent(0),
                    centerY: am5.percent(0),
                    marginTop: 15,
                    marginBottom: 15,
                    layout: root.horizontalLayout
                }));

                legend.labels.template.setAll({
                    fontSize: 15,
                    fontWeight: "800",
                    marginRight: 10
                  });

                legend.data.setAll(series.dataItems);
                
            }); // end am5.ready()
        }
    }

    var overall_system_role_count = function() {

        var endpoint = '/cld/cht/systemrole/count'
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                overall_system_role_count_init(data);
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function overall_system_role_count_init(data) {
            
            t = KTUtil.getCssVariableValue("--bs-gray-900")
            var options = {
                series: data.data,
                chart: {
                width: 500,
                type: 'pie',
                foreColor: '#373d3f',
                },
                dataLabels: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    formatter: function (val, opts) {
                        var count = opts.w.config.series[opts.seriesIndex]
                        const name = opts.w.globals.labels[opts.seriesIndex]
                        return [name+"("+count+")", val.toFixed(1) + '%']
                    },
                    textAnchor: 'middle',
                    distributed: false,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        fontSize: '24px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 'bolder',
                        colors: undefined
                    },
                    background: {
                    enabled: true,
                    foreColor: KTUtil.getCssVariableValue("text-gray-500"),
                    padding: 4,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: '#fff',
                    opacity: 0.9,
                    dropShadow: {
                        enabled: false,
                        top: 1,
                        left: 1,
                        blur: 1,
                        color: 'red',
                        opacity: 0.45
                    }
                    },
                    dropShadow: {
                        enabled: false,
                        top: 1,
                        left: 1,
                        blur: 1,
                        color: 'red',
                        opacity: 0.45
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
                legend: {
                    position: 'bottom',
                    fontWeight: "bold",
                    horizontalAlign: 'center',
                    formatter: function(seriesName, opts) {
                        return [seriesName, , "("+opts.w.globals.series[opts.seriesIndex]+")"]
                    }
                },
                colors: data.color,
                labels: data.label,
                responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                    width: 200
                    },
                    legend: {
                    position: 'bottom',
                    fontWeight: "bold"
                    }
                }
                }]
            };
      
            var chart = new ApexCharts(document.querySelector("#kt_apexcharts_1"), options);
            chart.render();

        }
    }

    return {
        init: function() {            
            chart_pip();
            chart_dip();
            widget_cust_different_nw();
            widget_sys_different_nw();
            widget_prod_without_ai();
            widget_b_tenant_with_more_than_2_shared_container();
            chart_n_minus();
            widget_invalid_pip_system();
            vm_monthly_created();
            on_stock_widget();
            customer_monthly_onboard();
            daily_availability();
            dr_customer_tile();
            overall_version();
            overall_system_role_count();
        }
    };
}();


jQuery(document).ready(function() {
    
    chart_widgets.init();
});