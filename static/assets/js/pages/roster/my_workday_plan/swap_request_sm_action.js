$(document).on('click', '#approve_sm_btn', function(e) {

    var request_id = $(this).attr('request_id')

    var data = JSON.stringify({"request_id":request_id});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/swap/request/t1/sm/approve",
         "method": "POST",
         "processData": false,
         "data": data

        }

    $.ajax(settings).done(function (response) {

        view_request_info_from(request_id);

    }).fail(function(xhr, status, error) {

        view_request_info_from(request_id);

    });	

});

$(document).on('click', '#reject_sm_btn', function(e) {

    var request_id = $(this).attr('request_id')

    var data = JSON.stringify({"request_id":request_id});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/swap/request/t1/sm/reject",
         "method": "POST",
         "processData": false,
         "data": data

        }

    $.ajax(settings).done(function (response) {

        location.reload();

    }).fail(function(xhr, status, error) {

        location.reload();
        
    });	

});

$(document).on('click', '#delete_sm_btn', function(e) {

    var request_id = $(this).attr('request_id')

    var data = JSON.stringify({"request_id":request_id});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/swap/request/t2/delete",
         "method": "DELETE",
         "processData": false,
         "data": data

        }

    $.ajax(settings).done(function (response) {

        location.reload();

    }).fail(function(xhr, status, error) {

        location.reload();

    });	

})