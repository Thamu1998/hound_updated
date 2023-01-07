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
                    <th class="bg-white p-2" style="border: 0px dashed">NWD</th>
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
        
        var is_locked_icon = "";

        var is_comment = "";

        if (item.is_shift_locked === true){
            is_locked_icon = `<i class="bi bi-lock-fill fs-6 ms-1 text-primary"></i>`;
        }

        if (item.iscomment === true){
            is_comment = `<i class="bi bi-chat-left-text-fill fs-6 ms-1 text-primary"></i>`;
        }

        tr_list += `<tr class="text-gray-900 fw-bolder fs-6">
                        <th class="bg-white"><p inumber="`+item.username+`" class="ps-2 m-0 p-0 fw-bolder text-gray-800 member_click_pointer view_member_info_btn" data-bs-toggle="modal" data-bs-target="#model_member_info">`+item.name+`</p><p class="m-0 p-0 text-primary fw-bolder" style="font-size: 10px;">`+item.username+is_locked_icon+is_comment+`</p></th>
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