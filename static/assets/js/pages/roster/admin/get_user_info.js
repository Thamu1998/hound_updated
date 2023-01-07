$(document).on('click', '.view_member_info_btn', function (e) {

    e.preventDefault();
    
    var member = $(this).attr('inumber')

    var month = $('#prev_btn').attr('month');

    var year = $('#prev_btn').attr('year');

    var lshift_header = "<th>Month</th>";

    var lshift_body = "";

    var planned_leaves = "";

    var member_pic = document.getElementById('member_pic_src');

    member_pic.src = `https://avatars.wdf.sap.corp/avatar/`+member;

    $.ajax({
        method: "GET",
        url: `/roster/get/member/info?inumber=`+member+`&m=`+cmonth+`&y=`+cyear+`&pm=`+month+`&py=`+year,
        success: function(data){
            $('#member_shift_info_container').show();
            $('#shift_pref_lbl').html(data.shift_pref);
            $('#pref_weekoff_lbl').html(data.weekoff);
            $('#member_cmd_lbl').html(data.shift_cmd);

            $('#member_name_lbl').html(data.full_name);

            $('#member_work_group').html(data.work_group);

            lshift_body = `<th>`+data.lmonth+`</th>`;

           if (data.planned_leaves.length == 0) {
                planned_leaves = `<tr><td>No Planned Leaves</td></tr>`;
           }
            
            data.planned_leaves.forEach(function(p_leave){
                planned_leaves += `<tr><td>`+p_leave+`</td></tr>`
            });

            data.lshift.forEach(function(item){
                if (item.is_holiday == false){
                    lshift_header += `<th class="bg-white"><p class="m-0 p-0 ">`+item.date+`</p><p class="m-0 p-0" style="font-size: 8px;">`+item.day+`</p></th>`;
                }
                else{
                    lshift_header += `<th style="background-color:#e9c46a"><p class="m-0 p-0">`+item.date+`</p><p class="m-0 p-0" style="font-size: 8px;">`+item.day+`</p></th>`
                }

                lshift_body += `<td class="p-2">`+item.shift+`</td>`;
            });

            $('#lshift_day_date').html(lshift_header);

            $('#lshift_day_shift').html(lshift_body);

            $('#planned_leave_div').html(planned_leaves);

            colorTable();
            
        },
        error: function(error_data){
            $('#member_shift_info_container').hide();
            $('#model_member_info').modal('hide');
            raise_error_tost("Something went wrong")
        }
    });

})