$(document).on('click', '.view_change_request_btn', function (e) {

    var sdate = $(this).attr('sdate');

    var cshift = $(this).attr('cshift');

    var request_id = $(this).attr('request_id');

    $.ajax({
        method: "GET",
        url: '/roster/member/shift/info?sdate='+sdate+'&cshift='+cshift,
        success: function(data){
            console.log(data);
            generate_request_info_dom(data);
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    $.ajax({
        method: "GET",
        url: `/roster/admin/change/request?id=`+request_id,
        success: function(data){
            generate_request_cmd_dom(data, sdate, cshift);
        },
        error: function(error_data){
            $('#kt_request_info_acct').html("");
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

function generate_request_cmd_dom(data, sdate, cshift) {

    var comment_card = ``;

    var cmd_seperator = ``;

    var accord = ``;

    data.comments.forEach(function(cmd){
        var cmd_align = "start";

        var cmd_name_div = `<div class="symbol symbol-35px symbol-circle">
                                <img alt="Pic" src="https://avatars.wdf.sap.corp/avatar/`+cmd.comment_by.username+`" />
                            </div>
                            <div class="ms-3">
                                <a href="#" class="fs-5 fw-bolder text-gray-900 text-hover-primary me-1">`+cmd.comment_by.name+`</a>
                                <span class="text-muted fs-7 mb-1">`+cmd.comment_on+`</span>
                            </div>`;

        if (cmd.comment_by.name == "You"){

            cmd_align = "end";

            cmd_name_div = `<div class="me-3">
                                <span class="text-muted fs-7 mb-1">`+cmd.comment_on+`</span>
                                <a href="#" class="fs-5 fw-bolder text-gray-900 text-hover-primary me-1">`+cmd.comment_by.name+`</a>
                            </div>
                            <div class="symbol symbol-35px symbol-circle">
                                    <img alt="Pic" src="https://avatars.wdf.sap.corp/avatar/`+cmd.comment_by.username+`" />
                            </div>`;

        }
        
        comment_card += `<div class="d-flex justify-content-`+cmd_align+` mb-10">
                            <div class="d-flex flex-column align-items-`+cmd_align+`">
                                <div class="d-flex align-items-center mb-2">
                                    `+cmd_name_div+`
                                </div>
                                <div style="width:750px;" class="p-5 rounded bg-light-info text-dark fw-bold mw-lg-400px text-`+cmd_align+`" data-kt-element="message-text">`+cmd.comment+`</div>
                            </div>
                        </div>`;

    });
        
    if (comment_card.length != 0) {
        cmd_seperator = `<div class="separator separator-dashed border-gray-300 m-0"></div>`
    };

    var comment_card_overall = cmd_seperator+`<div class="card-body" style="width:99.5%;" id="kt_chat_messenger_body">
                                    <div class="scroll-y me-n5 pe-5 h-300px h-lg-auto" data-kt-element="messages" data-kt-scroll="true" data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer" data-kt-scroll-wrappers="#kt_content, #kt_chat_messenger_body" data-kt-scroll-offset="5px">
                                        `+comment_card+`
                                    </div>
                                </div>`
    
    var comment_textarea_card = `<div class="card-footer p-0 m-0" id="kt_chat_messenger_footer">
                                    <div class="input-group input-group-solid">
                                        <textarea class="form-control" id="comment_text_box" placeholder="Type a message" aria-label="With textarea"></textarea>
                                        <button request_id="`+data.request_id+`" sdate="`+sdate+`" cshift="`+cshift+`" class="btn btn-light-primary" id="update_command_btn" type="button" data-kt-element="send">Send</button>
                                    </div>
                                    <div class="d-flex flex-stack">
                                        <div class="d-flex align-items-center me-2"></div>
                                    </div>
                                </div>`;
    
    var approver = "";

    if (data.approver_id != null){
        approver = data.approver_id
    }

    if (data.request_type == "LEAVE_REQUEST"){
            accord = `<div class="p-0 rounded" style="border: 1px dashed #6c757d;">
                        <table class="table table-row-dashed table-row-gray-300 gy-7">
                            <thead>
                                <tr align="center" class="fw-bolder fs-6 text-gray-800">
                                    <th>Requested on</th>
                                    <th>Request Type</th>
                                    <th>Status</th>
                                    <th>Approved/Rejected By</th>
                                    <th>Approved/Rejected On</th> 
                                </tr>
                            </thead>
                            <tbody>
                                <tr align="center">
                                    <td>`+data.request_on+`</td>
                                    <td>`+data.change_to+`</td>
                                    <td>`+data.status+`</td>
                                    <td>`+approver+`</td>
                                    <td>`+data.request_approved_on+`</td>
                                </tr>
                            </tbody>
                        </table>
                        `+comment_card_overall+comment_textarea_card+`
                    </div>`;
    }

    if (data.request_type == "SHIFT_CHANGE"){
        accord = `<div class="p-0 rounded" style="border: 1px dashed #6c757d;">
                    <table class="table table-row-dashed table-row-gray-300 gy-7">
                        <thead>
                            <tr align="center" class="fw-bolder fs-6 text-gray-800">
                                <th>Requested on</th>
                                <th>Current shift</th>
                                <th>Requested shift</th>
                                <th>Status</th>
                                <th>Approved/Rejected By</th>
                                <th>Approved/Rejected On</th> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr align="center">
                                <td>`+data.request_on+`</td>
                                <td>`+data.change_from+`</td>
                                <td>`+data.change_to+`</td>
                                <td>`+data.status+`</td>
                                <td>`+approver+`</td>
                                <td>`+data.request_approved_on+`</td>
                            </tr>
                        </tbody>
                    </table>
                    `+comment_card_overall+comment_textarea_card+`
                </div>`;
}
    var change_request_btn = `<button type="submit" request_id="`+data.request_id+`" sdate="`+sdate+`" cshift="`+cshift+`" action_type="REJECTED" class="btn btn-sm btn-light-danger me-2 btn_action_request">Reject</button>
    <button type="submit" request_id="`+data.request_id+`" action_type="APPROVED" sdate="`+sdate+`" cshift="`+cshift+`" class="btn btn-sm btn-primary btn_action_request" data-kt-menu-dismiss="true">Approve</button>`;

    $('#change_request_btn_div').html(change_request_btn);

    $('#kt_request_info_acct').html(accord);
}