var shift_info = {};

var get_shift_plan = function () {

    var init_shift_plan = function (url) {
        
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

            $('#member_shift_tbody').html("")

            var shift_plan_body = "";
            
            member_next_plan(data)

            $('#member_shift_tbody').html(shift_plan_body);
            
        }

    }

    var init_shift_type = function() {

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

            $('#change_shift_dropdown').html("");

            $('#leave_dropdown').html("");

            var change_shift_dropdown = "<option>Change Shift</option>";

            var leave_dropdown = "<option>Update Leave</option>";
            
            data.forEach(function(item){
                if (item.is_allow_in_preference == true){
                    change_shift_dropdown += `<option value="`+item.code+`">`+item.code+` - `+item.name+`</option>`
                }

                if(item.is_leave == true){
                    leave_dropdown += `<option value="`+item.code+`">`+item.name+`</option>`
                }
            })

            $('#change_shift_dropdown').html(change_shift_dropdown);
            $('#leave_dropdown').html(leave_dropdown);
            
        }

    }

    var init_status_type = function() {

        $.ajax({
            method: "GET",
            url: "/roster/status/type/info",
            success: function(data){
                generate_dom(data)
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function generate_dom(data){

            $('#status_dropdown').html("");

            var status_dropdown = "<option>Upadte Shift Status</option>";
            
            data.forEach(function(item){
                status_dropdown += `<option value="`+item.code+`">`+item.name+`</option>`
            })

            $('#status_dropdown').html(status_dropdown);
            
        }

    }

    return {
        init: function (url) {
            init_shift_plan(url);
            init_shift_type();
            init_status_type();
        }
    }
}();

KTUtil.onDOMContentLoaded(function () {
    get_shift_plan.init("/roster/work/plan/data");
});

$(document).on('click', '.view_shift_info_btn', function (e) {

    var sdate = $(this).attr('sdate');

    var cshift = $(this).attr('cshift');

    $.ajax({
        method: "GET",
        url: '/roster/member/shift/info?sdate='+sdate+'&cshift='+cshift,
        success: function(data){
            generate_dom(data)
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function generate_dom(data){

        var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                            <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                            </svg></span>`

        var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                    <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                    </svg></span>`;

        var member_list_div = "";

        $('#date_header').html(data.date);

        data.shift_info.forEach(function(item){

        member_list_div +=  `<div class="col-4"><div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                <div class="symbol symbol-60px me-4">
                                 <img src="https://avatars.wdf.sap.corp/avatar/`+item.member__username+`" class="" alt="" />
                             </div>
                                <div class="flex-grow-1 me-2">
                                    <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+item.member__first_name+`&nbsp;`+item.member__last_name+`</a>
                                    <span class="text-gray-400 fw-bold d-block fs-6">`+item.task+`</span>
                                    <span class="text-gray-400 fw-bold d-block fs-6">`+item.member__username+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.member__email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.member__email+`">`+msg_icon+`</a></span>
                                </div>
                            </div></div>`;
        });

        $('#shift_member_div').html(member_list_div)
        
    }

});