function get_work_group_request()
{
    $.ajax({
        method: "GET",
        url: '/ua/api/workgroup/request/',
        success: function(data){
            generate_work_group_request_list_dom(data);
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function generate_work_group_request_list_dom(data){

        var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

        var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                    <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                    </svg></span>`;

        var table_row = "";
        
        data.results.forEach(function(item){
            
            var user_card =  `<div><div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                    <div class="symbol symbol-75px me-4">
                                    <img src="https://avatars.wdf.sap.corp/avatar/`+item.user.username+`" class="" alt="" />
                                </div>
                                    <div class="flex-grow-1 me-2">
                                        <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+item.user.first_name+`&nbsp;`+item.user.last_name+`</a>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.user.sub_team_name+`</span>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.user.username+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.user.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.user.email+`">`+msg_icon+`</a></span>
                                    </div>
                                </div></div>`;
            
            var requested_by =  `<div><div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                    <div class="symbol symbol-75px me-4">
                                    <img src="https://avatars.wdf.sap.corp/avatar/`+item.requested_by.username+`" class="" alt="" />
                                </div>
                                    <div class="flex-grow-1 me-2">
                                        <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+item.requested_by.first_name+`&nbsp;`+item.requested_by.last_name+`</a>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.requested_by.sub_team_name+`</span>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.requested_by.username+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.requested_by.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.requested_by.email+`">`+msg_icon+`</a></span>
                                    </div>
                                </div></div>`;
            
            table_row = table_row + `<tr align="center">
                                      <td style="width:350px;" align="left">`+user_card+`</td>
                                      <td valign="middle">`+item.target+`</td>
                                      <td style="width:350px;" align="left">`+requested_by+`</td>
                                      <td valign="middle">`+item.status+`</td>
                                      <td valign="middle"><table><tr><a href="#" class="btn mb-5 btn-sm btn-light-success view_work_group_req_approve_btn" task="`+item.target+`" name="`+item.user.first_name+`&nbsp;`+item.user.last_name+`" request_id="`+item.id+`">Approve</a></tr><br><tr><a href="#" class="btn btn-sm btn-light-danger view_work_group_req_reject_btn" task="`+item.target+`" name="`+item.user.first_name+`&nbsp;`+item.user.last_name+`" request_id="`+item.id+`">Reject</a></tr></table></td>
                                      <tr>`;

        });

        if (table_row == ""){
            table_row = `<tr><td align="center" valign="middle" colspan=5>No Work Group Change Requests</td></tr>`
        }
        
        $('#work_group_request_table_body_div').html(table_row);

    }
};

function get_work_group_my_request()
{
    $.ajax({
        method: "GET",
        url: '/ua/api/my/workgroup/request/',
        success: function(data){
            generate_work_group_my_request_list_dom(data);
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function generate_work_group_my_request_list_dom(data){

        var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

        var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                    <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                    </svg></span>`;

        var table_row = "";
        
        data.results.forEach(function(item){
            
            var user_card =  `<div><div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                    <div class="symbol symbol-75px me-4">
                                    <img src="https://avatars.wdf.sap.corp/avatar/`+item.user.username+`" class="" alt="" />
                                </div>
                                    <div class="flex-grow-1 me-2">
                                        <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+item.user.first_name+`&nbsp;`+item.user.last_name+`</a>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.user.sub_team_name+`</span>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.user.username+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.user.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.user.email+`">`+msg_icon+`</a></span>
                                    </div>
                                </div></div>`;
            
            var requested_by =  `<div><div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                                    <div class="symbol symbol-75px me-4">
                                    <img src="https://avatars.wdf.sap.corp/avatar/`+item.requested_by.username+`" class="" alt="" />
                                </div>
                                    <div class="flex-grow-1 me-2">
                                        <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+item.requested_by.first_name+`&nbsp;`+item.requested_by.last_name+`</a>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.requested_by.sub_team_name+`</span>
                                        <span class="text-gray-400 fw-bold d-block fs-6">`+item.requested_by.username+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+item.requested_by.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+item.requested_by.email+`">`+msg_icon+`</a></span>
                                    </div>
                                </div></div>`;
            
            table_row = table_row + `<tr align="center">
                                      <td style="width:350px;" align="left">`+user_card+`</td>
                                      <td valign="middle">`+item.target+`</td>
                                      <td style="width:350px;" align="left">`+requested_by+`</td>
                                      <td valign="middle">`+item.status+`</td>
                                      <td valign="middle"><a href="#" class="btn mb-5 btn-sm btn-light-danger view_work_group_req_delete_btn" task="`+item.target+`" name="`+item.user.first_name+`&nbsp;`+item.user.last_name+`" request_id="`+item.id+`">Delete</a></td>
                                      <tr>`;

        });

        if (table_row == ""){
            table_row = `<tr><td align="center" valign="middle" colspan=5>No Work Group Change Requests</td></tr>`
        }
        
        $('#work_group_my_request_table_body_div').html(table_row);

    }
};

$(document).ready(function(){
    get_work_group_request();
    get_work_group_my_request();
})