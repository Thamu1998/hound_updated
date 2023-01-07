$(document).on('click', '.view_shift_btn', function () {

    var shift_id = $(this).attr('shift_id')

    $.ajax({
        method: "GET",
        url: `/roster/api/shifttype/`+shift_id+`/`,
        success: function(data){
            shift_card(data);
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

});

function shift_card(data) {
    
    
    $("#shift_code_input").val(data.code);
    $("#shift_name_input").val(data.name);
    $("#shift_color_input").val(data.color);
    $('#shift_text_color_input').val(data.text_color);
    $('#shift_time_info_input').val(data.time_info);
    $('#ordering_input').val(data.ordering);
    $('#normal_claim_input').val(data.normal_claim);
    $('#holiday_claim_input').val(data.holiday_claim);
    var element = document.getElementById("color_box");
        element.style.backgroundColor = data.color;
        $("#color_box").html(data.color)
        element.style.color = data.text_color;
    document.getElementById("checkbox_is_allow_in_preference").checked = data.is_allow_in_preference;
    document.getElementById("checkbox_is_allow_in_dashboard").checked = data.is_allow_in_dashboard;
    document.getElementById("checkbox_is_leave").checked = data.is_leave;

    var action_btn = `<button type="button" id="close_model" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                      <button shift_id="${data.id}" name="`+data.name+`" code="${data.code}" type="button" id="delete_shift_btn" code="" class="btn btn-danger">Delete</button>
                      <button shift_id="${data.id}" name="`+data.name+`" code="${data.code}" type="button" id="update_shift_btn" code="" class="btn btn-primary">Save changes</button>`

    $('#shift_info_footer').html(action_btn)
};