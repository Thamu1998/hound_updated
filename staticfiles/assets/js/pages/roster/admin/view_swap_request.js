$(document).on('click', '.view_swap_req_from_btn', function (e){

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

            var change_request_btn = `<button type="submit" request_id="`+request_id+`" action_type="REJECTED" class="btn btn-sm btn-light-danger me-2 btn_swap_action_request">Reject</button>
                                      <button type="submit" request_id="`+request_id+`" action_type="APPROVED" class="btn btn-sm btn-primary btn_swap_action_request" data-kt-menu-dismiss="true">Approve</button>`;

            $('#swap_request_action_btn_div').html(change_request_btn);

        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    })

};

var time_line = function(props) {

    var sm_approver_color = "warning";

    var approver_color = "muted";

    var action_btn = `<div class="modal-footer justify-content-between"><button type="button" request_id=`+props.id+` id="delete_sm_btn" code="" class="btn btn-light-danger">Delete</button></div>`

    if (props.is_sm_approved == true) {
        sm_approver_color = "primary";
    }

    if (props.is_request_completed == true) {
        action_btn = '';
        approver_color = 'primary'
    }

    $('#req_shift_info_title_from').html(`Your shift info &nbsp;<span class="badge py-3 px-4 fs-7 badge-light-primary">`+props.from.date+` - `+props.from.shift_name+`</span>`)

    $('#req_shift_info_title_to').html(`Requested to shift info &nbsp;<span class="badge py-3 px-4 fs-7 badge-light-primary">`+props.to.date+` - `+props.to.shift_name+`</span>`)

    var card = `<div class="timeline">   
                    <div class="timeline-item align-items-center mb-7">          
                        <div class="timeline-line w-40px mt-6 mb-n12"></div>
                        <div class="timeline-icon" style="margin-left: 11px">
                            <span class="svg-icon svg-icon-2 svg-icon-primary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.3" d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM6.39999 9.89999C6.99999 8.19999 8.40001 6.9 10.1 6.4C10.6 6.2 10.9 5.7 10.7 5.1C10.5 4.6 9.99999 4.3 9.39999 4.5C7.09999 5.3 5.29999 7 4.39999 9.2C4.19999 9.7 4.5 10.3 5 10.5C5.1 10.5 5.19999 10.6 5.39999 10.6C5.89999 10.5 6.19999 10.2 6.39999 9.89999ZM14.8 19.5C17 18.7 18.8 16.9 19.6 14.7C19.8 14.2 19.5 13.6 19 13.4C18.5 13.2 17.9 13.5 17.7 14C17.1 15.7 15.8 17 14.1 17.6C13.6 17.8 13.3 18.4 13.5 18.9C13.6 19.3 14 19.6 14.4 19.6C14.5 19.6 14.6 19.6 14.8 19.5Z" fill="currentColor" />
                                    <path d="M16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor" />
                                </svg>
                            </span>
                        </div>
                        <div class="timeline-content m-0">
                            <span class="fs-6 text-gray-400 fw-semibold d-block">`+props.requester_name+`</span>
                            <span class="fs-6 fw-bold text-gray-800 d-block">`+props.requested_on+`</span>
                            <span class="fs-6 fw-bold text-gray-800"><span class="badge py-3 px-4 fs-7 badge-light-dark">`+props.from.date+` - `+props.from.shift_name+`</span>&nbsp;<i class="las la-arrow-right fs-2"></i><span class="badge py-3 px-4 fs-7 badge-light-primary">`+props.to.date+` - `+props.to.shift_name+`</span></span>
                        </div>
                    </div>
                    
                    
                    <div class="timeline-item align-items-center mb-7">
                        <div class="timeline-line w-40px mt-6 mb-n12"></div>
                        <div class="timeline-icon" style="margin-left: 11px">
                            <span class="svg-icon svg-icon-2 svg-icon-`+sm_approver_color+`">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.3" d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM6.39999 9.89999C6.99999 8.19999 8.40001 6.9 10.1 6.4C10.6 6.2 10.9 5.7 10.7 5.1C10.5 4.6 9.99999 4.3 9.39999 4.5C7.09999 5.3 5.29999 7 4.39999 9.2C4.19999 9.7 4.5 10.3 5 10.5C5.1 10.5 5.19999 10.6 5.39999 10.6C5.89999 10.5 6.19999 10.2 6.39999 9.89999ZM14.8 19.5C17 18.7 18.8 16.9 19.6 14.7C19.8 14.2 19.5 13.6 19 13.4C18.5 13.2 17.9 13.5 17.7 14C17.1 15.7 15.8 17 14.1 17.6C13.6 17.8 13.3 18.4 13.5 18.9C13.6 19.3 14 19.6 14.4 19.6C14.5 19.6 14.6 19.6 14.8 19.5Z" fill="currentColor" />
                                    <path d="M16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor" />
                                </svg>
                            </span>
                        </div>
                        <div class="timeline-content m-0">
                            <span class="fs-6 text-gray-400 fw-semibold d-block">`+props.request_to_name+`</span>
                            <span class="fs-6 fw-bold text-gray-800 d-block">`+props.sm_approved_on+`</span>
                            <span class="fs-6 fw-bold text-gray-800">`+props.sm_status+`</span>
                        </div>
                    </div>
                    <div class="timeline-item align-items-center mb-7">
                        <div class="timeline-line w-40px mt-6 mb-n12"></div>
                        <div class="timeline-icon" style="margin-left: 11px">
                            <span class="svg-icon svg-icon-2 svg-icon-`+approver_color+`">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.3" d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM6.39999 9.89999C6.99999 8.19999 8.40001 6.9 10.1 6.4C10.6 6.2 10.9 5.7 10.7 5.1C10.5 4.6 9.99999 4.3 9.39999 4.5C7.09999 5.3 5.29999 7 4.39999 9.2C4.19999 9.7 4.5 10.3 5 10.5C5.1 10.5 5.19999 10.6 5.39999 10.6C5.89999 10.5 6.19999 10.2 6.39999 9.89999ZM14.8 19.5C17 18.7 18.8 16.9 19.6 14.7C19.8 14.2 19.5 13.6 19 13.4C18.5 13.2 17.9 13.5 17.7 14C17.1 15.7 15.8 17 14.1 17.6C13.6 17.8 13.3 18.4 13.5 18.9C13.6 19.3 14 19.6 14.4 19.6C14.5 19.6 14.6 19.6 14.8 19.5Z" fill="currentColor" />
                                    <path d="M16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="currentColor" />
                                </svg>
                            </span>
                        </div>
                        
                        
                        <div class="timeline-content m-0">
                            <span class="fs-6 text-gray-400 fw-semibold d-block">`+props.approver+`</span>
                            <span class="fs-6 fw-bold text-gray-800 d-block">`+props.approved_on+`</span>
                            <span class="fs-6 fw-bold text-gray-800">`+props.status+`</span>
                        </div>
                        
                    </div>
                    
                </div>`;
    
    $('#swap_request_to_action_btn_div').html(action_btn)

    return card;

}

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