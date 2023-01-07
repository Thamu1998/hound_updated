var member_next_plan = function(props) {

    var count = 0;

    var header_div = "";

    var body_div = "";

    const cdate = new Date();

    props.forEach(function(plan){

        var shift_status = "";

        if (plan.plan.status != null){

            shift_status = `<div class="text-gray-700 fw-bold fs-6">status : <span class="text-primary">`+plan.plan.status+`</span></div>`

        }

        var request_status = "";
        
        if (plan.plan.pending_change_request != null) {
            request_status = `<div class="text-gray-400 fw-bold fs-7">`+plan.plan.pending_change_request.status+`</div>`
            
            if (plan.plan.pending_change_request.status__code == "REJECTED") {
                request_status = `<div class="text-gray-400 fw-bold fs-7">`+plan.plan.pending_change_request.status+` <a href="#" class="text-primary opacity-75-hover fw-bold">`+plan.plan.pending_change_request.admin_name+`</a></div>`
            }
        }
        
        if (cdate.getDate() == plan.day) {

            header_div += `<li class="nav-item p-0 ms-0">
                                    <a class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-45px py-4 px-3 btn-active-danger active" data-bs-toggle="tab" href="#kt_`+plan.day+`">
                                        <span class="fs-7 fw-bold">`+plan.date+`</span>
                                        <span class="fs-6 fw-bolder">`+plan.day+`</span>
                                    </a>
                                </li>`;

            body_div += `<div class="tab-pane fade show active" id="kt_`+plan.day+`">
                                <div class="d-flex align-items-center mb-6">
                                    <span data-kt-element="bullet" class="bullet bullet-vertical d-flex align-items-center min-h-70px mh-100 me-4 bg-info"></span>
                                    <div class="flex-grow-1 me-5">
                                        <div class="text-gray-800 fw-bold fs-2">`+plan.plan.shift_name+`
                                        <span class="text-gray-400 fw-bold fs-7">`+plan.plan.shift_code+`</span></div>
                                        `+shift_status+`
                                        <div class="text-gray-700 fw-bold fs-6">`+plan.plan.task_name+`</div>
                                        `+request_status+`   
                                    </div>
                                    <a href="#" class="btn btn-sm btn-light view_shift_info_btn me-5" sdate="`+plan.sdate+`" cshift="`+plan.plan.shift_code+`" data-bs-toggle="modal" data-bs-target="#kt_model_action">Request change</a>
                                    <a href="#" class="btn btn-sm btn-light view_shift_status_change_btn" sdate="`+plan.sdate+`" cshift="`+plan.plan.shift_code+`" data-bs-toggle="modal" data-bs-target="#kt_model_status_change">Update Status</a>
                                </div>
                            </div>`;

        }else{

            header_div += `<li class="nav-item p-0 ms-0">
                    <a class="nav-link btn d-flex flex-column flex-center rounded-pill min-w-45px py-4 px-3 btn-active-danger" data-bs-toggle="tab" href="#kt_`+plan.day+`">
                        <span class="fs-7 fw-bold">`+plan.date+`</span>
                        <span class="fs-6 fw-bolder">`+plan.day+`</span>
                    </a>
                </li>`;

            body_div += `<div class="tab-pane fade" id="kt_`+plan.day+`">
                                <div class="d-flex align-items-center mb-6">
                                    <span data-kt-element="bullet" class="bullet bullet-vertical d-flex align-items-center min-h-70px mh-100 me-4 bg-info"></span>
                                    <div class="flex-grow-1 me-5">
                                        <div class="text-gray-800 fw-bold fs-2">`+plan.plan.shift_name+`
                                        <span class="text-gray-400 fw-bold fs-7">`+plan.plan.shift_code+`</span></div>
                                        `+shift_status+`
                                        <div class="text-gray-700 fw-bold fs-6">`+plan.plan.task_name+`</div>
                                        `+request_status+`
                                    </div>
                                    <a href="#" class="btn btn-sm btn-light view_shift_info_btn me-5" sdate="`+plan.sdate+`" cshift="`+plan.plan.shift_code+`" data-bs-toggle="modal" data-bs-target="#kt_model_action">Request change</a>
                                    <a href="#" class="btn btn-sm btn-light view_shift_status_change_btn" sdate="`+plan.sdate+`" cshift="`+plan.plan.shift_code+`" data-bs-toggle="modal" data-bs-target="#kt_model_status_change">Update Status</a>
                                </div>
                            </div>`;
        }

        count = 1;

    });

    $('#next_plan_header').html(header_div);

    $('#next_plan_body').html(body_div);
}

var swap_request_from_dom = function(props){

    var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

    var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                </svg></span>`;

    var tr_tbody = ``;

    props.forEach(function(item){

        request_from_card = `<div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                <div class="symbol symbol-50px me-5 mt-0 mb-0">
                                    <img src="https://avatars.wdf.sap.corp/avatar/`+item.requested_by.username+`" class="" alt="" />
                                </div>
                                <div class="d-flex justify-content-start flex-column">
                                    <a href="#" class="text-gray-800 fw-bold text-hover-primary mb-1 fs-6">`+item.requested_by.name+`</a>
                                    <span class="text-gray-400 fw-bold d-block fs-6">`+item.requested_by.username+`</span>
                                    <span class="text-gray-400 fw-semibold d-block fs-7">`+item.requested_by.task+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.requested_by.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.requested_by.email+`">`+msg_icon+`</a></span>
                                </div>
                            </div>`
        
        tr_tbody += `<tr valign="middle" class="text-start text-gray-400 fw-bolder fs-6 text-uppercase gs-0">
                        <td valign="top">`+request_from_card+`</td>
                        <td align="center"><span class="badge py-3 px-4 fs-7 badge-light-dark">`+item.date_from+`</span>&nbsp;<i class="las la-arrow-right fs-2"></i>&nbsp;<span class="badge py-3 px-4 fs-7 badge-light-primary">`+item.date_to+`</span></td>
                        <td align="center"><span class="badge py-3 px-4 fs-7 badge-light-dark">`+item.shift_from+`</span>&nbsp;<i class="las la-arrow-right fs-2"></i>&nbsp;<span class="badge py-3 px-4 fs-7 badge-light-primary">`+item.shift_to+`</span></td>
                        <td align="center"><a href="#" class="btn btn-sm btn-secondary view_req_from_btn" request_id="`+item.request_id+`" data-bs-toggle="modal" data-bs-target="#kt_model_r_from_view">View</a>
                    </tr>`;

    });

    return tr_tbody
}

var swap_request_to_dom = function(props){

    var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

    var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                </svg></span>`;

    var tr_tbody = ``;

    props.forEach(function(item){

        request_from_card = `<div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                <div class="symbol symbol-50px me-5 mt-0 mb-0">
                                    <img src="https://avatars.wdf.sap.corp/avatar/`+item.requested_to.username+`" class="" alt="" />
                                </div>
                                <div class="d-flex justify-content-start flex-column">
                                    <a href="#" class="text-gray-800 fw-bold text-hover-primary mb-1 fs-6">`+item.requested_to.name+`</a>
                                    <span class="text-gray-400 fw-bold d-block fs-6">`+item.requested_to.username+`</span>
                                    <span class="text-gray-400 fw-semibold d-block fs-7">`+item.requested_to.task+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.requested_to.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.requested_to.email+`">`+msg_icon+`</a></span>
                                </div>
                            </div>`
        
        tr_tbody += `<tr valign="middle" class="text-start text-gray-400 fw-bolder fs-6 text-uppercase gs-0">
                        <td valign="top">`+request_from_card+`</td>
                        <td align="center"><span class="badge py-3 px-4 fs-7 badge-light-dark">`+item.date_from+`</span>&nbsp;<i class="las la-arrow-right fs-2"></i>&nbsp;<span class="badge py-3 px-4 fs-7 badge-light-primary">`+item.date_to+`</span></td>
                        <td align="center"><span class="badge py-3 px-4 fs-7 badge-light-dark">`+item.shift_from+`</span>&nbsp;<i class="las la-arrow-right fs-2"></i>&nbsp;<span class="badge py-3 px-4 fs-7 badge-light-primary">`+item.shift_to+`</span></td>
                        <td align="center"><a href="#" class="btn btn-sm btn-secondary view_req_to_btn" request_id="`+item.request_id+`" data-bs-toggle="modal" data-bs-target="#kt_model_r_to_view">View</a>
                    </tr>`;

    });

    return tr_tbody
}

var time_line = function(props) {

    var sm_approver_color = "warning";

    var approver_color = "muted";

    var action_btn = `<div class="modal-footer justify-content-between"><button type="button" request_id=`+props.id+` id="reject_sm_btn" code="" class="btn btn-light-danger">Reject</button><button type="button" id="approve_sm_btn" request_id=`+props.id+` code="" class="btn btn-light-primary">Approve</button></div>`

    if (props.is_sm_approved == true) {
        sm_approver_color = "primary";
        action_btn = ``;
    }

    if (props.is_request_completed == true) {
        approver_color = 'primary'
    }

    $('#req_shift_info_title').html(`Requester shift info &nbsp;<span class="badge py-3 px-4 fs-7 badge-light-primary">`+props.from.date+` - `+props.from.shift_name+`</span>`)

    $('#sm_approver_shift_info_title').html(`Your shift info &nbsp;<span class="badge py-3 px-4 fs-7 badge-light-primary">`+props.to.date+` - `+props.to.shift_name+`</span>`)

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
    
    $('#swap_request_action_btn_div').html(action_btn)

    return card;

}

var time_line_to = function(props) {

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