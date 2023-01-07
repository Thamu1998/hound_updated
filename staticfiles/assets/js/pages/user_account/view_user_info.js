var get_sub_team_info = function(team, sub_team){
    
    $.ajax({
        method: "GET",
        "async": false,
        url: `/ua/subteam/list?team=`+team+``,
        success: function(data){
            var options_list = ``;
            
            data.results.forEach(function(item){
                options_list += `<option value="${item.code}">${item.name}</option>`;
            })

            $('#change_sub_team_dropdown').html(options_list);

            if(sub_team != null){
                $("#change_sub_team_dropdown").val(sub_team).trigger('change');
            };
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

}

$(document.body).on("change","#change_team_dropdown",function(){
    var subteam = $("#change_sub_team_dropdown").val()
    get_sub_team_info(this.value,subteam);
});

$(document).on('click', '.view_user_btn', function () {

    var user_id = $(this).attr('user_id')

    $.ajax({
        method: "GET",
        url: `/ua/api/users/`+user_id+`/`,
        success: function(data){
            user_card(data);
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

});

function user_card(data) {
    
    var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                    </svg></span>`

    var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                        <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                        <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                    </svg></span>`;

    var user =  `<div class="d-flex"><div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed pe-5">
                    <div class="symbol symbol-60px me-4">
                        <img src="https://avatars.wdf.sap.corp/avatar/`+data.username+`" class="" alt="" />
                    </div>
                        <div class="d-flex flex-column align-items-start">
                            <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+data.first_name+`&nbsp;`+data.last_name+`</a>
                            <a href="#" class="fw-bolder d-block text-gray-400 text-hover-primary fs-6">`+data.email+`</a>
                            <span class="text-gray-400 fw-bold d-block fs-6">`+data.username+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+data.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+data.email+`">`+msg_icon+`</a></span>
                        </div>                            
                    </div>
                </div>`;

    var get_sub_team_list = get_sub_team_info(data.team, data.sub_team)
    
    $("#change_team_dropdown").val(data.team).trigger('change');
    $("#change_role_dropdown").val(data.role).trigger('change');
    document.getElementById("checkbox_is_active").checked = data.is_active;
    document.getElementById("checkbox_is_blocked").checked = data.is_block;

    var selectedValues = new Array();

    data.groups.forEach(function(group, index) {
        
        selectedValues[index] = group.id;
    })

    $("#change_group_dropdown").val(selectedValues).trigger('change');

    var action_btn = `<button type="button" id="close_model" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                      <button user_id="${data.id}" name="`+data.first_name+`&nbsp;`+data.last_name+`" inumber="${data.username}" type="button" id="delete_user_btn" code="" class="btn btn-danger">Delete</button>
                      <button user_id="${data.id}" name="`+data.first_name+`&nbsp;`+data.last_name+`" inumber="${data.username}" type="button" id="update_user_btn" code="" class="btn btn-primary">Save changes</button>`

    $('#user_info_footer').html(action_btn)

    $('#user_card_div').html(user);
}