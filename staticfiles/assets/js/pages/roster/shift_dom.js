var table_div = function (props) {

    var table_card = `<table class="table table-row-dashed table-row-gray-600 gt-5 gb-5 shiftTable">
                            <thead class="text-start fw-bolder text-gray-900 fw-bolder text-uppercase gs-0 table_header">
                                `+props.header+`        
                            </thead>
                            <tbody class="text-gray-600 fw-bolder" id="shift_body_table">
                                `+props.body+` 
                            </tbody>
                        </table>`;
    
    return table_card;

}

var table_header = function (props) {

    var th_list = "";

    props.forEach(function (item){
        if (item.is_holiday == false){
            th_list += `<th class="bg-white"><p class="m-0 p-0 ">`+item.date+`</p><p class="m-0 p-0" style="font-size: 8px;">`+item.day+`</p></th>`;
        }
        else{
            th_list += `<th style="background-color:#e9c46a"><p class="m-0 p-0">`+item.date+`</p><p class="m-0 p-0" style="font-size: 8px;">`+item.day+`</p></th>`
        }
    })

    var header = `<tr>
                    <th class="ms-5 bg-white">Date/User</th>
                    `+th_list+`
                </tr>`;
    
    return header;

}

var table_body = function (props) {

    var tr_list = "";

    props.forEach(function (item){

        var td_list = "";

        item.plan.forEach(function (sft){
            td_list += `<td class="shift_td_click" inumber="`+item.username+`" sdate="`+sft.sdate+`">`+sft.shift__code+`</td>`;
        })

        tr_list += `<tr class="text-gray-900 fw-bolder fs-6">
                        <th class="bg-white"><p inumber="`+item.username+`" class="ps-2 m-0 p-0 fw-bolder text-gray-800 member_click_pointer view_member_info_btn" data-bs-toggle="modal" data-bs-target="#model_member_info">`+item.name+`</p><p class="m-0 p-0 text-primary fw-bolder" style="font-size: 10px;">`+item.username+`</p></th>
                        `+td_list+`
                    </tr>`;
            })

    return tr_list;

};

var create_wand = function () {

    daySelect = document.getElementById('select_wand');

    shift_info.forEach(function (item){
        daySelect.options[daySelect.options.length] = new Option(item['code']+" - "+item['name'], item['code']);
    })

};

var colorTable  = function (){
    
    $("tbody td:not(:first-child):contains('W')").css({'background-color':'#e9c46a', 'color': 'black'});
    $("tbody td:not(:first-child):contains('SL')").css({'background-color':'#cc7f6c', 'color': 'White'});
    $("tbody td:not(:first-child):contains('PL')").css({'background-color':'#cc7f6c', 'color': 'White'});
    $("tbody td:not(:first-child):contains('S1')").css({'background-color':'#5bc8af', 'color': 'White'});
    $("tbody td:not(:first-child):contains('O')").css('background-color','#0077b6');
    $("tbody td:not(:first-child):contains(M)").css({'background-color':'#cbc0d3', 'color': 'black'});
    $('tbody td:not(:first-child):contains(G)').css({'background-color':'#8e9aaf', 'color': 'black'});
    $("tbody td:not(:first-child):contains('S2')").css({'background-color':'#457b9d', 'color': 'White'});
    $("tbody td:not(:first-child):contains('S3')").css({'background-color':'#264653', 'color': 'white'});
    $("tbody td:not(:first-child):contains('Sat')").css('background-color','#e3ca10');
    $("tbody td:not(:first-child):contains('Sun')").css('background-color','#e3ca10');

    shift_info.forEach(function (item){
        $(`tbody td:not(:first-child):contains('`+item.code+`')`).css({'background-color':item.color, 'color': item.text_color});
    })

};

var valueColor = function (){

        $('.shiftTable_counter tbody tr td').each(
            function() {
                var good = 8,
                    ok = 4,
                    bad = 0,
                    score = $(this).text();                       

                if (score >= good) {
                    $(this).addClass("good");
                }
                else if (score < good && score >= ok) {
                    $(this).addClass("ok");
                }
                else if (score < ok && score >= bad) {
                    $(this).addClass("bad");
                }                
        });
}

var table_div_count = function (props) {

    var table_card = `<table class="table table-row-dashed table-row-gray-600 gt-5 gb-5 shiftTable_counter">
                            <thead class="text-start fw-bolder text-gray-900 fw-bolder text-uppercase gs-0 table_header">
                                `+props.header+`        
                            </thead>
                            <tbody class="text-gray-600 fw-bolder">
                                `+props.body+` 
                            </tbody>
                        </table>`;
    
    return table_card;

};

var table_header_count = function (props) {

    var th_list = "";

    props.forEach(function (item){

        if (item.is_holiday == false){
            th_list += `<th class="p-1"><p class="m-0 p-0 ">`+item.date+`</p><p class="m-0 p-0" style="font-size: 8px;">`+item.day+`</p></th>`;
        }
        else{
            th_list += `<th style="background-color:#e9c46a"><p class="m-0 p-0">`+item.date+`</p><p class="m-0 p-0" style="font-size: 8px;">`+item.day+`</p></th>`
        }

    })

    var header = `<tr>
                    <th style="width:10px;" class="ms-5">Shift</th>
                    `+th_list+`
                </tr>`;
    
    return header;

};

var table_body_count = function (props) {

    var tr_list = "";

    Object.keys(props).forEach(function(key) {

        var td_list = "";

        Object.keys(props[key]['day_count']).forEach(function (day){
            td_list += `<td>`+props[key]['day_count'][day]+`</td>`;
        })

        tr_list += `<tr class="text-gray-900 fw-bolder fs-6 p-1">
                        <th>`+key+`</th>
                        `+td_list+`
                    </tr>`;
            })

    return tr_list;

};

var daily_header = function(props){
    var card = `<div class="col-xl-3 mb-5">
                <div class="card hover-scroll" id="kt_list_widget_24" style="height:99%">
                    <div class="card-header border-0 pt-5">
                        <h3 class="card-title align-items-start flex-column">
                            <span class="card-label fw-bolder text-gray-800">`+props.title+`</span>
                            <span class="text-gray-400 mt-1 fw-bolder fs-7">`+props.time_info+`</span>
                        </h3>
                    </div>
                    <div class="card-body pt-6">
                        `+props.body+`
                    </div>
                </div>
            </div>`;
    
    return card;
}

var daily_shift_body = function(props){

    var card = "";

    Object.keys(props).forEach(function(key){

        var item_card = "";

        var task_name = "";
        
        props[key].forEach(function(item){

            var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                            <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                            </svg></span>`

            var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                        <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                        <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                        </svg></span>`;

            item_card += `<div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                <div class="symbol symbol-60px me-4">
                                 <img src="https://avatars.wdf.sap.corp/avatar/`+item.inumber+`" class="" alt="" />
                             </div>
                                <div class="flex-grow-1 me-2">
                                    <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+item.name+`</a>
                                    <span class="text-gray-400 fw-bold d-block fs-6">`+item.inumber+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.email+`">`+msg_icon+`</a></span>
                                </div>
                            </div>`
            
            task_name = item.task_name;
        });

        card += `<div class="kt-divider text-gray-500 fw-bolder mt-0"><span></span><span>`+task_name+`</span><span></span></div>`+item_card;
    });

    

    return card;
};

var holiday_div = function(props){

    var card = `<div class="row gy-5 g-xl-8">
                        <div class="card card-xl-stretch mb-xl-8 rounded border-gray-400 border-1 border-gray-300 border-dashed">
                            <div class="card-header border-0">
                                <h3 class="card-title fw-bolder text-dark">Holidays of the month</h3>
                            </div>
                            <div class="card-body pt-2">
                                   
                                    `+props.body+`                               
                                
                            </div>
                        </div>
                </div>`;
    
    return card;
};

var holiday_body = function(props){

    var card = `<div class="col-12">
                    <div class="d-flex align-items-center mb-7">
                        <div class="symbol symbol-100px me-5">
                            <img src="/static/assets/media/holiday_img/`+props.img+`.gif" class="" alt="" />
                        </div>
                        <div class="flex-grow-1">
                            <a href="#" class="text-dark fw-bolder text-hover-primary fs-6">`+props.name+`</a>
                            <span class="text-muted d-block fw-bold">`+props.date+`</span>
                        </div>
                    </div>
                </div>`

    return card;
}

var holiday_card_today = function(props){

    var card = `<div class="col-3 card mb-5 p-5" style="width: 335px;">
                    <div class="d-flex align-items-center">
                        <div class="symbol symbol-100px me-5">
                            <img src="/static/assets/media/holiday_img/`+props.img+`.gif" class="" alt="" />
                        </div>
                        <div class="flex-grow-1">
                            <a href="#" class="text-dark fw-bolder text-hover-primary fs-6">`+props.name+`</a>
                            <span class="text-muted d-block fw-bold">`+props.date+`</span>
                        </div>
                    </div>
                </div>`

    return card;
}