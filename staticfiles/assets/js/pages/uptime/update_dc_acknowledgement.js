$(document).on('click', '.acknowledge_dc_btn', function (e) {

    e.preventDefault();

    var DC = $(this).attr('DC')

    var ack_data = JSON.stringify({"DC":DC});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/uptime/acknowledge/downtime/datacenter",
         "method": "POST",
         "processData": false,
         "data": ack_data

        }

    $.ajax(settings).done(function (response) {

       location.reload();

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;

        error = JSON.parse(error);

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
    
        toastr.error(error);

    });

});