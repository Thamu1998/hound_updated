const finalize_btn = document.getElementById('init_finalize_shift_btn');

finalize_btn.addEventListener('click', e =>{
    e.preventDefault();

    Swal.fire({
        html: `You are trying to finalize the shift for <strong>`+cmonth_name+`</strong>?`,
        icon: "info",
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: "Yes, Proceed!",
        cancelButtonText: 'Nope, cancel it',
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: 'btn btn-danger'
        }
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {

            $('#loading_div').slideDown();
            $('#shift_table_div').slideUp();
            $('#kt_accordion_1').slideUp();

            finalize_shift();
            
        } 
      });
});

var finalize_shift = function (){

    var final_data = []

    $('#shift_body_table tr').each(function(index, tr) {
        
        $(tr).find('td').each (function () {

            var shift = $(this).html();

            var sdate = $(this).attr('sdate');

            var inumber = $(this).attr('inumber');

            final_data.push({'sdate': sdate, 'inumber': inumber, 'shift':shift})

        });
        
      });

        var shift_data = JSON.stringify(final_data);
  
        var csrftoken = getCookie('csrftoken');

        var settings = {
            
            "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
            "async": false,
            "crossDomain": false,
            "url": "/roster/finalize/shift",
            "method": "POST",
            "processData": false,
            "data": shift_data

            }

        $.ajax(settings).done(function (response) {

            var url = `/roster/get/admin/plan?m=`+cmonth+`&y=`+cyear;

            if (selected_groups_txt != ""){
                var url = `/roster/get/admin/plan?m=`+cmonth+`&y=`+cyear+`&sg=`+selected_groups_txt;
            }

            get_shift_plan_temp.init(url);

            Swal.fire('Shift saved successfully', '', 'success')

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
}