$(document).on('click', '#delete_user_btn', function () {

    var name  = $(this).attr('name');
    var inumber  = $(this).attr('inumber');
    
    Swal.fire({
        html: `Please confirm to <span class="badge badge-danger">delete</span> <strong>`+name+`</strong>&nbsp;-&nbsp;<span class="text-gray">`+inumber+`</span>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {

        if (result.isConfirmed) {
            var user_id = $(this).attr('user_id')
            var endpoint = `/ua/api/users/`+user_id+`/`
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

$(document).on('click', '#update_user_btn', function () {

    var team = $('#change_team_dropdown').val()
    var sub_team = $('#change_sub_team_dropdown').val()
    var role = $('#change_role_dropdown').val()
    var is_active = document.getElementById("checkbox_is_active").checked;
    var is_block = document.getElementById("checkbox_is_blocked").checked;
    var groups = $('#change_group_dropdown').val()
    var user_id = $(this).attr('user_id')
    var endpoint = `/ua/api/users/`+user_id+`/`

    var user_data = JSON.stringify({"team":team, "sub_team":sub_team, "role": role, "is_active":is_active, "is_block":is_block});
  
    var csrftoken_user = getCookie('csrftoken');

    var user_group_data = JSON.stringify({"groups":groups, "user_id":user_id});
  
    var csrftoken_user_group = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken_user, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": endpoint,
         "method": "PATCH",
         "processData": false,
         "data": user_data

    }

    var settings_groups = {
        
        "headers": { "X-CSRFToken": csrftoken_user_group, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": '/ua/update/group',
         "method": "PATCH",
         "processData": false,
         "data": user_group_data

    }

    $.ajax(settings).done(function (response) {
        
        $.ajax(settings_groups).done(function (response) {

            $('#reload_table').click();
            $('#kt_model_view').modal('hide');
            raise_success_tost("Update Successful")
    
        }).fail(function(xhr, status, error) {
            var error = xhr.responseJSON;
            
            Object.keys(error).forEach(function(data){
                raise_error_tost(data+`&nbsp; - &nbsp;`+error[data]);
            });
        });

    }).fail(function(xhr, status, error) {
        
        var error = xhr.responseJSON;
        
        Object.keys(error).forEach(function(data){
            raise_error_tost(data+`&nbsp; - &nbsp;`+error[data]);
        });
    });							  

    
})