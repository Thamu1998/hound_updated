$(document).on('click', '.view_work_group_req_approve_btn', function(e) {

    var name = $(this).attr('name');
    var task = $(this).attr('task');

    Swal.fire({
        html: `Please confirm to <span class="badge badge-primary">move</span> <strong>`+name+`</strong>&nbsp; to &nbsp;<span class="text-gray">`+task+`</span>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Confirm!'
    }).then((result) => {

        if (result.isConfirmed) {

            var request_id = $(this).attr('request_id')

            var data = JSON.stringify({"request_id":request_id});
        
            var csrftoken = getCookie('csrftoken');

            var settings = {
                
                "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
                "async": true,
                "crossDomain": false,
                "url": "/ua/approve/workgroup/request",
                "method": "POST",
                "processData": false,
                "data": data

                }

            $.ajax(settings).done(function (response) {

                location.reload();

            }).fail(function(xhr, status, error) {

                var error = xhr.responseJSON;
                raise_error_tost(error);

            });	
        }
            
    })

});

$(document).on('click', '.view_work_group_req_reject_btn', function(e) {

    var name = $(this).attr('name');
    var task = $(this).attr('task');

    Swal.fire({
        html: `Please confirm to reject the request to <span class="badge badge-primary">move</span> <strong>`+name+`</strong>&nbsp; to &nbsp;<span class="text-gray">`+task+`</span>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Reject!'
    }).then((result) => {

        if (result.isConfirmed) {

            var request_id = $(this).attr('request_id')

            var data = JSON.stringify({"request_id":request_id});
        
            var csrftoken = getCookie('csrftoken');

            var settings = {
                
                "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
                "async": true,
                "crossDomain": false,
                "url": "/ua/reject/workgroup/request",
                "method": "POST",
                "processData": false,
                "data": data

                }

            $.ajax(settings).done(function (response) {

                location.reload();

            }).fail(function(xhr, status, error) {

                var error = xhr.responseJSON;
                raise_error_tost(error);

            });	
        }
            
    })	

});

$(document).on('click', '.view_work_group_req_delete_btn', function(e) {

    var name = $(this).attr('name');
    var task = $(this).attr('task');

    Swal.fire({
        html: `Please confirm to delete the request to <span class="badge badge-primary">move</span> <strong>`+name+`</strong>&nbsp; to &nbsp;<span class="text-gray">`+task+`</span>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Confirm!'
    }).then((result) => {

        if (result.isConfirmed) {

            var request_id = $(this).attr('request_id')
        
            var csrftoken = getCookie('csrftoken');

            var settings = {
                
                "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
                "async": true,
                "crossDomain": false,
                "url": "/ua/api/my/workgroup/request/"+request_id,
                "method": "DELETE",
                "processData": false

                }

            $.ajax(settings).done(function (response) {

                location.reload();

            }).fail(function(xhr, status, error) {

                var error = xhr.responseJSON;
                raise_error_tost(error);

            });	
        }
            
    })	

});

$(document).on('click', '#create_work_group_request_btn', function(e) {

    var user_id = $('#user_list_dropdown').val();
    var target = $('#sub_team_list_dropdown').val();

    var data = JSON.stringify({"user_id":user_id, "target":target});
        
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/ua/create/workgroup/request",
        "method": "POST",
        "processData": false,
        "data": data

        }

    $.ajax(settings).done(function (response) {

        location.reload();

    }).fail(function(xhr, status, error) {

        var error = xhr.responseJSON;
        raise_error_tost(error);

    });	

});