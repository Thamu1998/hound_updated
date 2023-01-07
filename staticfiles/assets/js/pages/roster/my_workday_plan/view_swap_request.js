$(document).on('click', '.view_req_from_btn', function (e){

    e.preventDefault();

    var request_id = $(this).attr('request_id');

    view_request_info_from(request_id);
    
});

$(document).on('click', '.view_req_to_btn', function (e){

    e.preventDefault();

    var request_id = $(this).attr('request_id');

    view_request_info_to(request_id);
    
});

function view_request_info_from(request_id){

    $.ajax({
        url: "/roster/swap/request/view?swap_request_id="+request_id,
        method: 'GET',
        success: function(data){
            var dom = time_line(data.request_info);

            $('#time_line').html(dom);
            var requested_from_shift_info = requested_shift_info_dom(data.requested_from_shift_info);
            $('#requested_from_shift_info').html(requested_from_shift_info)
            var requested_to_shift_info = requested_shift_info_dom(data.requested_to_shift_info);
            $('#requested_to_shift_info').html(requested_to_shift_info)
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    })

};

function view_request_info_to(request_id){

    $.ajax({
        url: "/roster/swap/request/view?swap_request_id="+request_id,
        method: 'GET',
        success: function(data){
            var dom = time_line_to(data.request_info);
            $('#time_line_to').html(dom);
            var requested_from_shift_info = requested_shift_info_dom(data.requested_from_shift_info);
            $('#requested_from_shift_info_to').html(requested_from_shift_info)
            var requested_to_shift_info = requested_shift_info_dom(data.requested_to_shift_info);
            $('#requested_to_shift_info_to').html(requested_to_shift_info)
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    })

}

function requested_shift_info_dom(data){

    var member_list_div = "";
    
    data.forEach(function(item){

    if (item.mark == true){
        bg_col = "#009EF7";
        txt_col = "text-white";
        txt_col_name = "text-white";
        msg_icon = `<span class="svg-icon svg-icon-light svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

        chat_icon = `<span class="svg-icon svg-icon-light svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                </svg></span>`;
    }else{

        var bg_col = "#f8f9fa";

        var txt_col = "text-gray-400";

        var txt_col_name = "text-gray-600";

        var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

        var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                    <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                    </svg></span>`;

    }

    member_list_div +=  `<div class="col-6"><div style="background-color:`+bg_col+`" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                            <div class="symbol symbol-60px me-4">
                             <img src="https://avatars.wdf.sap.corp/avatar/`+item.member__username+`" class="" alt="" />
                         </div>
                            <div class="flex-grow-1 me-2">
                                <a href="#" class="fw-bolder `+txt_col_name+` text-hover-primary fs-6">`+item.member__first_name+`&nbsp;`+item.member__last_name+`</a>
                                <span class="`+txt_col+` fw-bold d-block fs-6">`+item.task+`</span>
                                <span class="`+txt_col+` fw-bold d-block fs-6">`+item.member__username+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.member__email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.member__email+`">`+msg_icon+`</a></span>
                            </div>
                        </div></div>`;
    });

    
    return member_list_div;
}