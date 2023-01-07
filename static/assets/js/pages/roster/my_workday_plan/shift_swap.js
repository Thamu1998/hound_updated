
var currentTime = new Date() 
var minDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), +currentTime.getDate()); //one day next before month
var maxDate =  new Date(currentTime.getFullYear(), currentTime.getMonth() +1, +0); // one day before next month

$(".datepickers").daterangepicker({
    singleDatePicker: true,
    showDropdowns: false,
    autoApply: true,
    minDate: minDate, 
    maxDate: maxDate,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"),10),
    locale: {format: 'MMMM DD, YYYY'},
});

$('#from_swap_date_picker').daterangepicker({
    singleDatePicker: true,
    showDropdowns: false,
    autoApply: true,
    minDate: minDate, 
    maxDate: maxDate,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"),10),
    locale: {format: 'MMMM DD, YYYY'},
}).on('apply.daterangepicker', function (e, picker) {
    var swap_req_date = $("#from_swap_date_picker").data('daterangepicker').startDate;

    swap_req_date = swap_req_date.format('DD,MMMM YY');

    $('#kt_model_create_swap_request').modal('show');

    $('#selected_from_date').html(swap_req_date);
})

function request_from_shift_member(){

    $.ajax({
        url: "/roster/swap/request/t1",
        method: 'GET',
        success: function(data){
            var dom = swap_request_from_dom(data);
            $('#swap_request_from_tbody').html(dom);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    })
};

function request_to_shift_member(){

    $.ajax({
        url: "/roster/swap/request/t2",
        method: 'GET',
        success: function(data){
            var dom = swap_request_to_dom(data);
            $('#swap_request_to_tbody').html(dom);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    })
};

var generate_shift_info= function(){

    $.ajax({
        method: "GET",
        url: "/roster/shift/type/info",
        success: function(data){
            shift_info = data;
            create_wand()
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

}

$('#kt_model_create_swap_request').on('hidden.bs.modal', function () {
    $(".datepickers").data('daterangepicker').setStartDate(minDate); 
    $(".datepickers").data('daterangepicker').setEndDate(minDate);
    $('#shift_member_create_swap_div').html("")
    $('#shift_member_shift_detail_swap').html("")
});

$('#get_shift_info_btn').on('click', function(e){

    e.preventDefault();

    var swap_date = $("#to_swap_date_picker").data('daterangepicker').startDate;

    swap_date = swap_date.format('YYYY-MM-DD');

    selected_shift = $('#select_wand').val();

    $.ajax({
        method: "GET",
        url: '/roster/member/shift/info?sdate='+swap_date+'&cshift='+selected_shift,
        success: function(data){
            generate_request_info_dom(data)
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

});

function generate_request_info_dom(data){
    
    var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

    var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                </svg></span>`;

    var member_list_div = "";
    
    data.shift_info.forEach(function(item){
        if (inumber != item.member__username){
            member_list_div +=  `<div class="col-10 m-5"><div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                    <div class="symbol symbol-60px me-4">
                                    <img src="https://avatars.wdf.sap.corp/avatar/`+item.member__username+`" class="" alt="" />
                                </div>
                                    <div class="flex-grow-1 me-2">
                                        <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+item.member__first_name+`&nbsp;`+item.member__last_name+`</a>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.task+`</span>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.member__username+`<a target="_blank" href="#"><span class="badge badge-primary m-2 select_swap_member_btn" inumber="`+item.member__username+`">Select</span></a></span>
                                    </div>
                                </div></div>`;
        }
    });
    
    $('#shift_member_create_swap_div').html(member_list_div)
    
};

$(document).on('click', '.select_swap_member_btn', function (e){

    e.preventDefault();

    var inumber = $(this).attr('inumber');

    var swap_date = $("#to_swap_date_picker").data('daterangepicker').startDate;

    swap_date = swap_date.format('YYYY-MM-DD');

    $.ajax({
        method: "GET",
        url: '/roster/member/shift/info/swap?swap_date='+swap_date+'&inumber='+inumber,
        success: function(data){
            generate_member_shift_info(data,swap_date,inumber);
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

});

function generate_member_shift_info(data,swap_date,inumber){

    var lshift_header = "<th class='ps-3'>Date</th>";

    var lshift_body = "<th class='ps-3'>Shift</th>";

    var action_button = `<button href="#" inumber=`+inumber+` swap_date=`+swap_date+` class="btn btn-primary confirm_swap_btn mt-5">Confirm</button>`

    data.lshift.forEach(function(item){

        if (item.is_holiday == false){
            lshift_header += `<th class="bg-white"><p class="m-0 p-0 ">`+item.date+`</p><p class="m-0 p-0" style="font-size: 8px;">`+item.day+`</p></th>`;
        }
        else{
            lshift_header += `<th style="background-color:#e9c46a;"><p class="m-0 p-0">`+item.date+`</p><p class="m-0 p-0" style="font-size: 8px;">`+item.day+`</p></th>`
        }

        lshift_body += `<td>`+item.shift+`</td>`;
    });

    var shift_info_table = `<h3 class="fw-bolder text-gray-700 mb-5">Shift Info :</h3><div style="border:dashed #6c757d 1px;border-radius:10px;height:93px;">
                                <table class="table table-row-dashed table-row-gray-600 gt-5 gb-5 table_history">
                                    <thead class="text-start fw-bolder text-gray-900 fw-bolder text-uppercase gs-0">
                                        <tr>
                                            `+lshift_header+`
                                        </tr>    
                                    </thead>
                                    <tbody class="text-gray-600 fw-bolder">
                                        <tr>
                                            `+lshift_body+`
                                        </tr>   
                                    </tbody>
                                </table>
                            </div>`;
    
    if (data.is_swap_request_available == true){
        action_button = `<button href="#" inumber=`+inumber+` swap_date=`+swap_date+` disabled class="btn btn-primary confirm_swap_btn mt-5">swap not possible</button>`
    }
    $('#shift_member_shift_detail_swap').html(shift_info_table);
    $('#shift_member_shift_detail_swap').append(action_button);

    colorTable();
};

$(document).on('click', '.confirm_swap_btn', function (e){
    e.preventDefault();

    var requested_to = $(this).attr('inumber');

    var swap_date_from = $("#from_swap_date_picker").data('daterangepicker').startDate;

    swap_date_from = swap_date_from.format('YYYY-MM-DD');

    var swap_date_to = $("#to_swap_date_picker").data('daterangepicker').startDate;

    swap_date_to = swap_date_to.format('YYYY-MM-DD');

    var data = JSON.stringify({"requested_to":requested_to, "swap_date_from":swap_date_from, "swap_date_to":swap_date_to});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/swap/request/create",
         "method": "POST",
         "processData": false,
         "data": data

        }

    $.ajax(settings).done(function (response) {

        location.reload();

    }).fail(function(error_data) {
        console.log(JSON.parse(error_data.responseText))
        raise_error_tost("Something went wrong")

    });	
})

$(document).ready(function(){
    request_to_shift_member();
    request_from_shift_member();
    generate_shift_info();
});