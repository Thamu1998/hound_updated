$('.create_request_btn').on('click', function(e){

    Swal.fire({
        title: 'Are you sure?',
        text: "Your previous request for the same date will be overwritten",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Proceed!'
      }).then((result) => {
        if (result.isConfirmed) {

            var request_type = $(this).attr('request_type');

            if (request_type === "SHIFT_CHANGE"){

                var change_to = $('#change_shift_dropdown').val();

            }else{

                var change_to = $('#leave_dropdown').val();

            }

            var sdate = $(this).attr('sdate');

            var cshift = $(this).attr('cshift');

            var cmd_data = JSON.stringify({"sdate":sdate, "cshift":cshift, "change_to": change_to, "request_type":request_type});
        
            var csrftoken = getCookie('csrftoken');

            var settings = {
                
                "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
                "async": true,
                "crossDomain": false,
                "url": "/roster/create/shift/change/request",
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

                Swal.fire({
                    text: "Request created successfully",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });

            }).fail(function(xhr, status, error) {
                var error = xhr.responseJSON;
                console.log("object");
                console.log(error);
            });	
          
        }
      })

})