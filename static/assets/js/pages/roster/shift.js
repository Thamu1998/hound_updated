var header_data = [];

var cmonth = 1;

var cyear = 2022;

var cmonth_name = "NNNN";

var selected_groups_txt = "";

var selected_team = current_user_team;

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
    generate_group_dropdown("/roster/get/group/list");
    generate_team_dropdown();
    $('#shift_table_div').hide()
    $('#kt_accordion_1').hide()
    get_shift_plan_temp.init('/roster/get/plan');
    gen_holiday_info(`/roster/holiday/list/month`);

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

    var url = `/roster/get/plan?m=`+month+`&y=`+year+`&tm=`+selected_team;

    var holiday_url = `/roster/holiday/list/month?m=`+month+`&y=`+year+`&tm=`+selected_team;

    if (selected_groups_txt != ""){
        url += `&sg=`+selected_groups_txt;
        holiday_url += `&sg=`+selected_groups_txt;
    }

    get_shift_plan_temp.init(url);

    gen_holiday_info(holiday_url);
})

$('#next_btn').on('click', function(e){
    e.preventDefault();

    $('#loading_div').slideDown()
    $('#shift_table_div').slideUp()
    $('#kt_accordion_1').slideUp();

    var month = $(this).attr('month');
    var year = $(this).attr('year');

    var url = `/roster/get/plan?m=`+month+`&y=`+year+`&tm=`+selected_team;

    var holiday_url = `/roster/holiday/list/month?m=`+month+`&y=`+year+`&tm=`+selected_team;

    if (selected_groups_txt != ""){
        url += `&sg=`+selected_groups_txt;
        holiday_url += `&sg=`+selected_groups_txt;
    }

    get_shift_plan_temp.init(url);

    gen_holiday_info(holiday_url);
});

var generate_group_dropdown = function(url){

    $.ajax({
        method: "GET",
        url: url,
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
            group_options += `<option value="`+item.code+`">`+item.name+`</option>`
        })

        $('#group_dropdown_btn').html(group_options)
    }

}

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

}

$('#apply_filter_btn').on('click', function(e){
    e.preventDefault();
    
    var selected_groups = $('#group_dropdown_btn').val();

    var url = `/roster/get/plan?m=`+cmonth+`&y=`+cyear+`&tm=`+selected_team;

    var holiday_url = `/roster/holiday/list/month?m=`+cmonth+`&y=`+cyear+`&tm=`+selected_team;

    selected_groups_txt = "";

    selected_groups.forEach(function(group){

        selected_groups_txt += group + ";"

    })
    
    if(selected_groups_txt.length!=0){
        url += `&sg=`+selected_groups_txt;
        holiday_url += `&sg=`+selected_groups_txt
    }

    get_shift_plan_temp.init(url);

    gen_holiday_info(holiday_url);
});

$('#reset_filter_btn').on('click', function(e){

    $('#group_dropdown_btn').val(null).trigger('change');

    $('#team_dropdown_btn').val(null).trigger('change');

    var url = `/roster/get/plan?m=`+cmonth+`&y=`+cyear;

    var holiday_url = `/roster/holiday/list/month?m=`+cmonth+`&y=`+cyear;

    get_shift_plan_temp.init(url);

    selected_groups_txt = '';

    selected_team = current_user_team;

    generate_group_dropdown("/roster/get/group/list");

    generate_team_dropdown();

    gen_holiday_info(holiday_url);

})

$('#team_dropdown_btn').on('change', function(e){

    var selected_team_var = $('#team_dropdown_btn').val();

    selected_groups_txt = '';

    selected_team = selected_team_var;

    generate_group_dropdown("/roster/get/group/list?tm="+selected_team_var);
});

var gen_holiday_info = function(url){

    $.ajax({
        method: "GET",
        url: url,
        success: function(data){

            if(data.length != 0){
                
                var card_body = "";

                data.forEach(function(item){
                    if (card_body.length != 0){
                        card_body += `<div class="separator separator-dashed border-gray-400 my-10"></div>` 
                    }
                    card_body += holiday_body(item);
                });

                var card = holiday_div({'body': card_body});

                $('#holiday_div').html(card);

                $('#table_overall_body').attr('class', 'col-xl-9');

                $('#holiday_div_overall').attr('class', 'col-xl-3');

            }
            else{
                $('#table_overall_body').attr('class', 'col-xl-12');

                $('#holiday_div_overall').attr('class', '');

                $('#holiday_div').html('')
            };
            
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

}