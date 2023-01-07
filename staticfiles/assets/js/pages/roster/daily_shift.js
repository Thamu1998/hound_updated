var shift_info = {};

$("#kt_leave_data").flatpickr();

var get_leave_shift_info = function() {

    $.ajax({
        method: "GET",
        url: "/roster/shift/type/info",
        success: function(data){
            generate_dom(data)
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function generate_dom(data){

        $('#leave_dropdown').html("");

        var leave_dropdown = "<option></option>";
        
        data.forEach(function(item){
            if(item.is_leave == true){
                leave_dropdown += `<option value="`+item.code+`">`+item.name+`</option>`
            }
        })

        $('#leave_dropdown').html(leave_dropdown);
        
    }
}

var get_daily_shift_plan = function () {

    var init_daily_shift_plan = function (url) {
        
        var endpoint = url;
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                generate_dom(data)
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function generate_dom(data){

            $('#data_div').html("")

            shift_info = data.meta;
            
            Object.keys(data.plan).forEach(function(key){
                // daily_shift_body()
                var body_dom = daily_shift_body(data.plan[key]);

                var card_dom = daily_header({'body': body_dom, 'title': shift_info[key]["name"], 'time_info': shift_info[key]["time_info"] })

                $('#data_div').append(card_dom);
            })
            
        }

    }

    return {
        init: function (url) {
            init_daily_shift_plan(url);
        }
    }
}();

var generate_team_dropdown = function(){

    $.ajax({
        method: "GET",
        url: "/roster/get/team/list",
        success: function(data){
            gen_team_filter(data)
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function gen_team_filter(data){
        var team_options = "";

        data.forEach(function(item) {
            if (item.code == current_user_team){
                team_options += `<option selected value="`+item.code+`">`+item.name+`</option>`;
            }
            else{
                team_options += `<option value="`+item.code+`">`+item.name+`</option>`;
            }
        })

        $('#team_dropdown_btn').html(team_options)
    }

};

var gen_holiday_info = function(url){

    $.ajax({
        method: "GET",
        url: url,
        success: function(data){

            if(data.length != 0){
                
                var card = holiday_card_today(data);

                $('#holiday_info_div').html(card)

            }
            
        },
        error: function(error_data){
            $('#holiday_info_div').html("")
        }
    });

}

$('#team_dropdown_btn').on('change', function(e){

    var selected_team_var = $('#team_dropdown_btn').val();

    get_daily_shift_plan.init("/roster/get/today/shift?tm="+selected_team_var);

    gen_holiday_info('/roster/holiday/today?tm='+selected_team_var);

});

KTUtil.onDOMContentLoaded(function () {
    get_daily_shift_plan.init("/roster/get/today/shift");
    generate_team_dropdown();
    gen_holiday_info('/roster/holiday/today');
    get_leave_shift_info();
});

$('#update_leave_btn').on('click', function(e){

    var username = $('#user_list_dropdown').val();

    var leave_data = $('#kt_leave_data').val();

    var leave_type = $('#leave_dropdown').val();

    var leave_request_data = JSON.stringify({"username":username, "leave_data":leave_data, "leave_type":leave_type});

    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": false,
        "crossDomain": false,
        "url": "/roster/leave/update",
        "method": "POST",
        "processData": false,
        "data": leave_request_data

        }

    $.ajax(settings).done(function (response) {

        raise_success_tost(response['detail']);

    }).fail(function(xhr, status, error) {
        
        var error = xhr.responseJSON;

        toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toastr-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
        };

        raise_error_tost(error);

    });

})


// Format options
const format = (item) => {
    if (!item.id) {
        return item.text;
    }

    var url = 'https://avatars.wdf.sap.corp/avatar/' + item.id;
    var img = $("<img>", {
        class: "rounded-circle me-2",
        width: 40,
        src: url
    });
    var span = $("<span>", {
        text: " " + item.text
    });
    span.prepend(img);
    return span;
}

// Init Select2 --- more info: https://select2.org/
$('#user_list_dropdown').select2({
    templateResult: function (item) {
        return format(item);
    }
});
