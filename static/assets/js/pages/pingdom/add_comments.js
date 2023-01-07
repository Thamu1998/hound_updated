// Element to indecate
var button_sid = document.querySelector("#update_cmd_sid_btn");

var button_dc = document.querySelector("#update_cmd_dc_btn");

// Handle button_sid click event
button_sid.addEventListener("click", function() {
    
    var expire_date = $('#expiry_date_comment_sid').val();
    
    var sid = $('#sid_cmd').val();
    var comment = $('#comment_sid').val();

    if(expire_date.length > 0) {

        update_sid_cmd(sid, expire_date, comment)

    }
    else {
        
        button_sid.removeAttribute("data-kt-indicator");
        raise_error("Expire date for the comment is mandatory")
        
    }
    button_sid.setAttribute("data-kt-indicator", "on");
    
    setTimeout(function() {
        button_sid.removeAttribute("data-kt-indicator");
    }, 2000);
});

// Handle button_dc click event
button_dc.addEventListener("click", function() {
    
    var expire_date = $('#expiry_date_comment_dc').val();
    
    var dc = $('#dc_cmd').val();

    var comment = $('#comment_dc').val();

    if(expire_date.length > 0) {

        update_dc_cmd(dc, expire_date, comment)

    }
    else {
        
        button_dc.removeAttribute("data-kt-indicator");
        raise_error("Expire date for the comment is mandatory")
        
    }

    button_dc.setAttribute("data-kt-indicator", "on");
    
    setTimeout(function() {
        
        button_dc.removeAttribute("data-kt-indicator");

    }, 2000);
});

KTUtil.onDOMContentLoaded(function () {
    $(".expiry_date_field").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });
});

function update_sid_cmd(sid, expire_date, comment){

    var cmd_data = JSON.stringify({"comment":comment, "SID":sid, "expry_date": expire_date});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/pingdom/update/comment",
         "method": "POST",
         "processData": false,
         "data": cmd_data

        }

    $.ajax(settings).done(function (response) {
        button_sid.removeAttribute("data-kt-indicator");

        var response = response[0];

        generate_system_down_comment(response);

        $('#comment_sid').val("");

        $('#expiry_date_comment_sid').val("");

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;

        console.log(JSON.parse(error));

        button_sid.removeAttribute("data-kt-indicator");
    });							  
    
};

function update_dc_cmd(dc, expire_date, comment){

    var cmd_data = JSON.stringify({"comment":comment, "DC":dc, "expry_date": expire_date});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/pingdom/update/comment",
         "method": "POST",
         "processData": false,
         "data": cmd_data

        }

    $.ajax(settings).done(function (response) {
        button_dc.removeAttribute("data-kt-indicator");

        var response = response[0];

        generate_dc_down_comment(response);

        $('#comment_dc').val("");

        $('#expiry_date_comment_dc').val("");

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;

        console.log(JSON.parse(error));

        button_dc.removeAttribute("data-kt-indicator");
    });							  
    
};

function raise_error(message){

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toastr-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    toastr.error(message);
}