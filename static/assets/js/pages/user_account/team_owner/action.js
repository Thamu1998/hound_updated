$(document).on('click', '#delete_work_group_btn', function () {

    var name  = $(this).attr('name');
    
    Swal.fire({
        html: `Please confirm to <span class="badge badge-danger">delete</span> <strong>`+name+`</strong>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {

        if (result.isConfirmed) {
            var work_group_id = $(this).attr('work_group_id');
            var endpoint = `/ua/api/subteam/owner/`+work_group_id+`/`;
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

$(document).on('click', '#update_work_group_btn', function () {

    var owners = $('#work_group_owner_dropdown').val();
    
    var work_group_id = $(this).attr('work_group_id');

    var endpoint = `/ua/api/subteam/owner/`+work_group_id+`/`;

    var work_group_owner_data = JSON.stringify({"owner":owners});
  
    var csrftoken_user = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken_user, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": endpoint,
        "method": "PATCH",
        "processData": false,
        "data": work_group_owner_data

    }

    $.ajax(settings).done(function (response) {
        
        $('#reload_table').click();
        $('#kt_model_view').modal('hide');

    }).fail(function(xhr, status, error) {
        
        var error = xhr.responseJSON;
        
        Object.keys(error).forEach(function(data){
            raise_error_tost(data+`&nbsp; - &nbsp;`+error[data]);
        });
    });							  

    
});

$(document).on('click', '#create_work_group_btn', function () {

    var sub_team = $('#work_group_sub_team_dropdown_create').val()

    var owners = $('#work_group_owner_dropdown_create').val();

    var endpoint = `/ua/api/subteam/owner/`;

    var work_group_owner_data = JSON.stringify({"owner":owners, "sub_team":sub_team});
  
    var csrftoken_user = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken_user, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": endpoint,
        "method": "POST",
        "processData": false,
        "data": work_group_owner_data

    }

    $.ajax(settings).done(function (response) {
        
        $('#reload_table').click();
        $('#kt_model_create').modal('hide');

    }).fail(function(xhr, status, error) {
        
        var error = xhr.responseJSON;
        
        Object.keys(error).forEach(function(data){
            raise_error_tost(data+`&nbsp; - &nbsp;`+error[data]);
        });
    });							  

    
});