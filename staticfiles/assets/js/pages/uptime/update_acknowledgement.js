$(document).on('click', '.acknowledge_btn', function (e) {

    e.preventDefault();

    var SID = $(this).attr('SID')

    var ack_data = JSON.stringify({"SID":SID});
  
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": "/uptime/acknowledge/downtime/system",
         "method": "POST",
         "processData": false,
         "data": ack_data

        }

    $.ajax(settings).done(function (response) {

        button_dc.removeAttribute("data-kt-indicator");

        generate_acknowledge_btn({'SID':SID, 'is_acknowledged':true})

        const _badge = document.getElementById(SID+'_badge');
        
        _badge.removeAttribute("class");

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