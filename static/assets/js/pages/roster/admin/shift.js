var header_data = [];

var cmonth = 1;

var cyear = 2022;

var cmonth_name = "NNNN";

var selected_groups_txt = "";

var shift_info = []

var get_shift_plan_temp = function () {

    var init_shift_plan = function (url) {
        
        var endpoint = url;
        
        var shift_data = [];
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                shift_data = data
                generate_dom()
                $('#loading_div').slideUp()
                $('#shift_table_div').slideDown()
                $('#kt_accordion_1').slideDown()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function generate_dom(){

            header_data = shift_data.header
            
            var table_body_div = table_body(shift_data.plan)

            var table_header_div = table_header(shift_data.header)

            var table_div_inst = table_div({'header': table_header_div, 'body':table_body_div});

            $('#shift_month_lbl').attr('month', shift_data.meta_data.month);

            $('#shift_month_lbl').attr('year', shift_data.meta_data.year);

            $('#shift_month_lbl').html(shift_data.meta_data.month_name+"&nbsp;&nbsp;"+shift_data.meta_data.year);

            cmonth = shift_data.meta_data.month;

            cyear = shift_data.meta_data.year;

            cmonth_name = shift_data.meta_data.month_name;

            $('#prev_btn').attr('month', shift_data.meta_data.previous_month.month);

            $('#prev_btn').attr('year', shift_data.meta_data.previous_month.year);

            $('#next_btn').attr('month', shift_data.meta_data.next_month.month);

            $('#next_btn').attr('year', shift_data.meta_data.next_month.year);

            $('#shift_table_div').html(table_div_inst);

            colorTable();

            build_counter_table(); //Build shift counter table
        }

    }

    return {
        init: function (url) {
            init_shift_plan(url);
        }
    }
}();

KTUtil.onDOMContentLoaded(function () {
    generate_group_dropdown();
    generate_shift_info();
    $('#shift_table_div').hide()
    $('#kt_accordion_1').hide()
    get_shift_plan_temp.init('/roster/get/admin/plan');
    document.getElementById("apply_filter_btn").disabled = true;

});

var build_counter_table = function (){
   
    var table_count = {};

    var shift_counter = {'S1':'First-Shift', 'S2':'Second-Shift', 'S3':'Third-Shift'};

    Object.keys(shift_counter).forEach(function(key) {

        var days = {};

        header_data.forEach(function(item, index){
            days[item.date] = 0
        });

        table_count[key] = {'name': shift_counter[key], 'day_count':days}

    })

    $('#shift_body_table tr').each(function(index, tr) {
        
        $(tr).find('td').each (function () {

            var shift = $(this).html();

            var sdate = parseInt($(this).attr('sdate').split('-')[2]);

            var inumber = $(this).attr('inumber');

            if (shift === 'S1') {
                
                table_count['S1']['day_count'][sdate] += 1;

            }else if (shift === 'S2'){
                
                table_count['S2']['day_count'][sdate] += 1;

            }else if (shift === 'S3'){
                
                table_count['S3']['day_count'][sdate] += 1;

            }

        });
        
      });

    var table_header_div = table_header_count(header_data);

    var table_body_div = table_body_count(table_count)

    var table_count_div_inst = table_div_count({'header': table_header_div, 'body':table_body_div});

    $('#shift_table_count_div').html(table_count_div_inst);

    valueColor();
}

$('#prev_btn').on('click', function(e){
    e.preventDefault();

    $('#loading_div').slideDown();
    $('#shift_table_div').slideUp();
    $('#kt_accordion_1').slideUp();

    var month = $(this).attr('month');

    var year = $(this).attr('year');

    var url = `/roster/get/admin/plan?m=`+month+`&y=`+year;

    if (selected_groups_txt != ""){
        var url = `/roster/get/admin/plan?m=`+month+`&y=`+year+`&sg=`+selected_groups_txt;
    }

    get_shift_plan_temp.init(url);
})

$('#next_btn').on('click', function(e){
    e.preventDefault();

    $('#loading_div').slideDown()
    $('#shift_table_div').slideUp()
    $('#kt_accordion_1').slideUp();

    var month = $(this).attr('month');
    var year = $(this).attr('year');

    var url = `/roster/get/admin/plan?m=`+month+`&y=`+year;

    if (selected_groups_txt != ""){
        var url = `/roster/get/admin/plan?m=`+month+`&y=`+year+`&sg=`+selected_groups_txt;
    }

    get_shift_plan_temp.init(url);
});

var generate_group_dropdown = function(){

    $.ajax({
        method: "GET",
        url: "/roster/get/admin/group/list",
        success: function(data){
            gen_group_filter(data)
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function gen_group_filter(data){
        var group_options = "";

        data.forEach(function(item) {
            group_options += `<option value="`+item.sub_team_id+`">`+item.sub_team__name+`</option>`
        })

        $('#group_dropdown_btn').html(group_options)
    }

}

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

$('#apply_filter_btn').on('click', function(e){
    e.preventDefault();
    
    var selected_groups = $('#group_dropdown_btn').val();

    selected_groups.forEach(function(group){

        selected_groups_txt += group + ";"

    })

    var url = `/roster/get/admin/plan?m=`+cmonth+`&y=`+cyear+`&sg=`+selected_groups_txt;

    get_shift_plan_temp.init(url);
});

$('#reset_filter_btn').on('click', function(e){

    $('#group_dropdown_btn').val(null).trigger('change');

    var url = `/roster/get/admin/plan?m=`+cmonth+`&y=`+cyear;

    get_shift_plan_temp.init(url);

    document.getElementById("apply_filter_btn").disabled = true;

    selected_groups_txt = '';

})

$('#group_dropdown_btn').on('change', function(e){

    var selected_groups = $('#group_dropdown_btn').val();

    selected_groups.forEach(function(group){

        selected_groups_txt += group + ";"

    })

    if(selected_groups.length != 0){
        document.getElementById("apply_filter_btn").disabled = false;
    }
    else{
        document.getElementById("apply_filter_btn").disabled = true;
        selected_groups_txt = '';
    };

});

$(document).on('click', '#lock_shift_btn', function (e){
    e.preventDefault();

    var cmd_data = JSON.stringify({"m":cmonth, "y":cyear, "is_locked": true});

    if (selected_groups_txt != ""){
        var cmd_data = JSON.stringify({"m":cmonth, "y":cyear, "sg": selected_groups_txt, "is_locked": true});
    }
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/update/lock/unlock",
         "method": "POST",
         "processData": false,
         "data": cmd_data

        }

    $.ajax(settings).done(function (response) {

        var url = `/roster/get/admin/plan?m=`+cmonth+`&y=`+cyear;

        if (selected_groups_txt != ""){
            var url = `/roster/get/admin/plan?m=`+cmonth+`&y=`+cyear+`&sg=`+selected_groups_txt;
        }

        get_shift_plan_temp.init(url);

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;

        console.log(JSON.parse(error));
    });
})

$(document).on('click', '#unlock_shift_btn', function (e){

    e.preventDefault();

    var cmd_data = JSON.stringify({"m":cmonth, "y":cyear, "is_locked": false});

    if (selected_groups_txt != ""){
        var cmd_data = JSON.stringify({"m":cmonth, "y":cyear, "sg": selected_groups_txt, "is_locked": false});
    }
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/update/lock/unlock",
         "method": "POST",
         "processData": false,
         "data": cmd_data

        }

    $.ajax(settings).done(function (response) {

        var url = `/roster/get/admin/plan?m=`+cmonth+`&y=`+cyear;

        if (selected_groups_txt != ""){
            var url = `/roster/get/admin/plan?m=`+cmonth+`&y=`+cyear+`&sg=`+selected_groups_txt;
        }

        get_shift_plan_temp.init(url);

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;

        console.log(JSON.parse(error));
    });

})