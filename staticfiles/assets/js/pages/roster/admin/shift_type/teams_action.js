$(document).on('click', '#delete_shift_btn', function () {

    var name  = $(this).attr('name');
    var code  = $(this).attr('code');
    
    Swal.fire({
        html: `Please confirm to <span class="badge badge-danger">delete</span> <strong>`+code+`</strong>&nbsp;-&nbsp;<span class="text-gray">`+name+`</span>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {

        if (result.isConfirmed) {
            var shift_id = $(this).attr('shift_id')
            var endpoint = `/roster/api/shifttype/`+shift_id+`/`
            var csrftoken = getCookie('csrftoken');
            
            $.ajax({
                method: "DELETE",
                headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
                url: endpoint,
                success: function(data){
                    $('#reload_table').click();
                    $('#kt_model_view').modal('hide');
                    raise_success_tost("Delete Successful")
                },
                error: function(xhr, status, error){
                    var error = xhr.responseJSON;
        
                    Object.keys(error).forEach(function(data){
                        raise_error_tost(data+`&nbsp; - &nbsp;`+error[data]);
                    });
                }
            });
        }
            
    })

});

$(document).on('click', '#update_shift_btn', function () {

    var data = {}

    var code = $('#shift_code_input').val()
    if (code != '') {data["code"] = code}

    var name = $('#shift_name_input').val()
    if (name != '') {data["name"] = name}

    var color = $('#shift_color_input').val()
    if (color != '') {data["color"] = '#'+color.replace("#", "")}

    var text_color = $('#shift_text_color_input').val()
    if (text_color != '') {data["text_color"] = text_color}

    var is_allow_in_preference = document.getElementById("checkbox_is_allow_in_preference").checked;
    data["is_allow_in_preference"] = is_allow_in_preference

    var is_allow_in_dashboard = document.getElementById("checkbox_is_allow_in_dashboard").checked;
    data["is_allow_in_dashboard"] = is_allow_in_dashboard

    var is_leave = document.getElementById("checkbox_is_leave").checked;
    data["is_leave"] = is_leave

    var time_info = $('#shift_time_info_input').val()
    if (time_info != '') {data["time_info"] = time_info}

    var ordering = $('#ordering_input').val()
    if (ordering != '') {data["ordering"] = ordering}

    var shift_id = $(this).attr('shift_id')
    
    var endpoint = `/roster/api/shifttype/`+shift_id+`/`

    var shift_data = JSON.stringify(data);
  
    var csrftoken_user = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken_user, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": endpoint,
         "method": "PATCH",
         "processData": false,
         "data": shift_data

    }

    $.ajax(settings).done(function (response) {
        
        $('#reload_table').click();
        $('#kt_model_view').modal('hide');
        raise_success_tost("Update Successful")

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;
        
        Object.keys(error).forEach(function(data){
            raise_error_tost(data+`&nbsp; - &nbsp;`+error[data]);
        });
    });							  
 
});

$(document).on('click', '#create_shift_btn', function () {

    var data = {}

    var code = $('#shift_code_input_cr').val()
    if (code != '') {data["code"] = code}

    var name = $('#shift_name_input_cr').val()
    if (name != '') {data["name"] = name}

    var color = $('#shift_color_input_cr').val()
    if (color != '') {data["color"] = '#'+color.replace("#", "")}

    var text_color = $('#shift_text_color_input_cr').val()
    if (text_color != '') {data["text_color"] = text_color}

    var is_allow_in_preference = document.getElementById("checkbox_is_allow_in_preference_cr").checked;
    data["is_allow_in_preference"] = is_allow_in_preference

    var is_allow_in_dashboard = document.getElementById("checkbox_is_allow_in_dashboard_cr").checked;
    data["is_allow_in_dashboard"] = is_allow_in_dashboard

    var is_leave = document.getElementById("checkbox_is_leave_cr").checked;
    data["is_leave"] = is_leave

    var time_info = $('#shift_time_info_input_cr').val()
    if (time_info != '') {data["time_info"] = time_info}

    var ordering = $('#ordering_input_cr').val()
    if (ordering != '') {data["ordering"] = ordering}

    data["location"] = admin_location;
    
    var endpoint = `/roster/api/shifttype/`;

    var shift_data = JSON.stringify(data);
  
    var csrftoken_user = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken_user, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": endpoint,
         "method": "POST",
         "processData": false,
         "data": shift_data

    }

    $.ajax(settings).done(function (response) {
        
        $('#reload_table').click();
        $('#kt_model_create').modal('hide');
        raise_success_tost("Create Successful")

    }).fail(function(xhr, status, error) {
        
        var error = xhr.responseJSON;

        Object.keys(error).forEach(function(data){
            raise_error_tost(data+`&nbsp; - &nbsp;`+error[data]);
        });
    });							  
 
});

$("#shift_color_input").on('change keydown paste input', function(){
    var color = $(this).val().replace("#", "");
    var element = document.getElementById("color_box");
        element.style.backgroundColor = "#"+color;
        $("#color_box").html("#"+color)
        element.style.color = $('#shift_text_color_input').val();
});

document.getElementById('shift_text_color_input').addEventListener('change', function() {
    var color = $('#shift_color_input').val().replace("#", "");
    var element = document.getElementById("color_box");
        element.style.backgroundColor = "#"+color;
        $("#color_box").html("#"+color)
        element.style.color = $(this).val();
});

$("#shift_color_input_cr").on('change keydown paste input', function(){
    var color = $(this).val().replace("#", "");
    var element = document.getElementById("color_box_cr");
        element.style.backgroundColor = "#"+color;
        $("#color_box_cr").html("#"+color)
        element.style.color = $('#shift_text_color_input_cr').val();
});

document.getElementById('shift_text_color_input_cr').addEventListener('change', function() {
    var color = $('#shift_color_input_cr').val().replace("#", "");
    var element = document.getElementById("color_box_cr");
        element.style.backgroundColor = "#"+color;
        $("#color_box_cr").html("#"+color)
        element.style.color = $(this).val();
});