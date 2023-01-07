$(document).on('click', '.btn_swap_action_request', function(e) {

    e.preventDefault();

    var request_id = $(this).attr('request_id');

    var action_type = $(this).attr('action_type');

    var cmd_data = JSON.stringify({"request_id":request_id, "action_type":action_type});
    
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/admin/swap/request/action",
         "method": "POST",
         "processData": false,
         "data": cmd_data

        }

        $.ajax(settings).done(function (response) {
            
            location.reload()
    
        }).fail(function(xhr, status, error) {
            var error = xhr.responseJSON;
    
            console.log(JSON.parse(error));
    
            button_dc.removeAttribute("data-kt-indicator");
        });
})