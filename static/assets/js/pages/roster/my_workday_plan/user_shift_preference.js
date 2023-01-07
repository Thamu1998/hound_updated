var get_shift_preference = function () {

    var init_shift_type = function() {

        $.ajax({
            method: "GET",
            url: "/roster/shift/type/info",
            success: function(data){
                generate_dom(data)
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function generate_dom(data){

            $('#shift_pref_type_dropdown').html("");

            var shift_pref_type_dropdown = "<option>Select Shift</option>";
            
            data.forEach(function(item){
                if (item.is_allow_in_preference == true){
                    shift_pref_type_dropdown += `<option value="`+item.code+`">`+item.code+` - `+item.name+`</option>`
                }
            })

            $('#shift_pref_type_dropdown').html(shift_pref_type_dropdown);

            $.ajax({
                method: "GET",
                url: "/roster/user/shift/pref",
                success: function(data){
                    $('#shift_pref_type_dropdown').val(data.shift)
                    $('#shift_pref_weekoff_dropdown').val(data.week_off)
                },
                error: function(error_data){
                    console.log(JSON.parse(error_data.responseText))
                }
            });
            
        }

    }

    return {
        init: function () {
            init_shift_type();
        }
    }
}();

$('#update_shift_preference_btn').on('click', function(e){

    var shift = $('#shift_pref_type_dropdown').val();

    var week_off = $('#shift_pref_weekoff_dropdown').val();

    var prefered_shift_data = JSON.stringify({"shift":shift, "week_off":week_off});

    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": false,
        "crossDomain": false,
        "url": "/roster/user/shift/pref",
        "method": "POST",
        "processData": false,
        "data": prefered_shift_data

        }

    $.ajax(settings).done(function (response) {

        raise_success_tost(response);
        $('#kt_shift_preferance').modal('hide');

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

        raise_error_tost(error);

    });

});

$('#shift_preference_model').on('click', function(e){
    get_shift_preference.init();
})