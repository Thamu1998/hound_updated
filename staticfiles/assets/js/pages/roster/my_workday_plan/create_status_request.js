$('#create_shift_status_request_btn').on('click', function(e){

    Swal.fire({
        title: 'Are you sure?',
        text: "Your previous status request for the same date will be overwritten",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Proceed!'
      }).then((result) => {
        if (result.isConfirmed) {

            var shift_status_to = $('#status_dropdown').val();
            
            var sdate = $(this).attr('sdate');

            var cshift = $(this).attr('cshift');

            var cmd_data = JSON.stringify({"sdate":sdate, "shift_status_to": shift_status_to});
        
            var csrftoken = getCookie('csrftoken');

            var settings = {
                
                "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
                "async": true,
                "crossDomain": false,
                "url": "/roster/create/status/change/request",
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