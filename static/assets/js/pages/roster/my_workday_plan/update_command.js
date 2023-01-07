$(document).on('click', '#update_command_btn', function(e) {

    e.preventDefault();

    var change_request_id = $(this).attr('request_id');

    var comment = $('#comment_text_box').val();

    var sdate = $(this).attr('sdate');

    var cshift = $(this).attr('cshift');

    var cmd_data = JSON.stringify({"comment":comment, "change_request_id":change_request_id});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/update/shift/change/request/comment",
         "method": "POST",
         "processData": false,
         "data": cmd_data

        }

    $.ajax(settings).done(function (response) {
        $.ajax({
            method: "GET",
            url: '/roster/member/shift/info?sdate='+sdate+'&cshift='+cshift,
            success: function(data){
                generate_request_info_dom(data, sdate, cshift)
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });
    
        $.ajax({
            method: "GET",
            url: '/roster/get/shift/change/request?sdate='+sdate+'&cshift='+cshift,
            success: function(data){
                generate_request_cmd_dom(data, sdate, cshift)
            },
            error: function(error_data){
                $('#kt_request_info_acct').html("");
                console.log(JSON.parse(error_data.responseText))
            }
        });

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;

        console.log(JSON.parse(error));

        button_dc.removeAttribute("data-kt-indicator");
    });	
});

$(document).on('click', '#update_status_command_btn', function(e) {

    e.preventDefault();

    var status_change_request_id = $(this).attr('request_id');

    var comment = $('#comment_status_text_box').val();

    var sdate = $(this).attr('sdate');

    var cshift = $(this).attr('cshift');

    var cmd_data = JSON.stringify({"comment":comment, "status_change_request_id":status_change_request_id});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/roster/update/status/change/request/comment",
         "method": "POST",
         "processData": false,
         "data": cmd_data

        }

    $.ajax(settings).done(function (response) {
        $.ajax({
            method: "GET",
            url: '/roster/member/shift/info?sdate='+sdate+'&cshift='+cshift,
            success: function(data){
                generate_status_request_info_dom(data, sdate, cshift)
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });
    
        $.ajax({
            method: "GET",
            url: '/roster/get/status/change/request?sdate='+sdate+'&cshift='+cshift,
            success: function(data){
                generate_status_request_cmd_dom(data, sdate, cshift)
            },
            error: function(error_data){
                $('#kt_request_info_acct').html("");
                console.log(JSON.parse(error_data.responseText))
            }
        });

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;

        console.log(JSON.parse(error));

        button_dc.removeAttribute("data-kt-indicator");
    });	
})