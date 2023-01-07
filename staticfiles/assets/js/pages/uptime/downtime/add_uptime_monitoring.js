$('#add_checks_btn').on('click', function (e){

    var expire_date = $('#expiry_date_checks').val();
    
    var SID = $('#check_sid_value').val();
    console.log(SID.length);
    if (expire_date.length <= 0){

        raise_error("Expire date for the check is mandatory");

    }
    else if (SID.length <= 0){

        raise_error("SID is mandatory");

    }
    else{

        var check_data = JSON.stringify({"SID":SID, "expire_date": expire_date});
    
        var csrftoken = getCookie('csrftoken');

        var settings = {
            
            "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
            "async": true,
            "crossDomain": false,
            "url": "/uptime/set/monitoring",
            "method": "POST",
            "processData": false,
            "data": check_data

            }

        $.ajax(settings).done(function (response) {

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
        
            toastr.success("Monitoring set successfully");

        }).fail(function(xhr, status, error) {
            var error = xhr.responseJSON;
            
            raise_error(error['detail']);
        });	
    }						  
    
});


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

KTUtil.onDOMContentLoaded(function () {
    $(".expiry_date_field").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });
});