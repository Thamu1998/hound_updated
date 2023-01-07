$(document).on('click', '.shift_td_click', function (e) {

    e.preventDefault();
    
    var selected_shift = $('#select_wand').val();
    
    if (selected_shift != "null"){

        var member = $(this).attr('inumber');

        var sdate = $(this).attr('sdate');

        var shift_data = JSON.stringify({"member":member, "sdate":sdate, "shift": selected_shift});
  
        var csrftoken = getCookie('csrftoken');

        $(this).text(selected_shift);

        var settings = {
            
            "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
            "async": false,
            "crossDomain": false,
            "url": "/roster/save/temp/shift",
            "method": "POST",
            "processData": false,
            "data": shift_data

            }

        $.ajax(settings).done(function (response) {

            console.log("Updated Successful");

        }).fail(function(xhr, status, error) {
            
            var error = xhr.responseJSON;

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

        colorTable();

        build_counter_table();

    }
    else{

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
    
        toastr.error("Please select a shift to update.");

    }
});