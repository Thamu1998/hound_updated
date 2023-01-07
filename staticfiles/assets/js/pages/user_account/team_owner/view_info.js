$(document).on('click', '.view_work_group_btn', function () {

    var work_group_id = $(this).attr('work_group_id')
    
    $.ajax({
        method: "GET",
        url: `/ua/api/subteam/owner/`+work_group_id+`/`,
        success: function(data){
            work_group_popup_dom(data);
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

});

function work_group_popup_dom(data) {
    
    
    
    $("#code_input").val(data.sub_team);
    $("#work_group_input").val(data.work_group);
    $("#team_input").val(data.team);

    var selectedValues = new Array();

    data.owner.forEach(function(s_planner, index) {
        selectedValues[index] = s_planner;
    })

    $("#work_group_owner_dropdown").val(selectedValues).trigger('change');

    var action_btn = `<button type="button" id="close_model" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                    <button work_group_id=${data.id} name=${data.sub_team} type="button" id="delete_work_group_btn" code="" class="btn btn-danger">Delete</button>
                      <button work_group_id=${data.id} type="button" id="update_work_group_btn" code="" class="btn btn-primary">Save changes</button>`

    $('#work_group_info_footer').html(action_btn);
}