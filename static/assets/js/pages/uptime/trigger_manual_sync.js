$(document).on('click', '#triger_manul_sync', function (e) {


    blockUI.block();

    $.ajax({
        method: "GET",
        url: "/uptime/sync/status",
        success: function(data, textStatus, xhr){
            if (blockUI.isBlocked()) {

                blockUI.release();
                window.location.reload();

            }
        },
        error: function(error_data){

            if (blockUI.isBlocked()) {

                blockUI.release();
                
            }

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
        
            toastr.error(JSON.parse(error_data.responseText)['detail']);
        }
    });

});