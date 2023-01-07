var load_calender = function(){
    

    $.ajax({
        method: "GET",
        url: "/roster/user/shift/info",
        success: function(data){
            init_calender(data)
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function init_calender(data){

        var calendarEl = document.getElementById("kt_docs_fullcalendar_selectable");

        var is_locked = data.is_shift_locked;

        var prefered_shift = data.prefered_shift;

        var calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {left: "", center: "title", right: ""},
            initialDate: data.shift_month,
            navLinks: true, // can click day/week names to navigate views
            selectable: !is_locked,
            selectMirror: true,
            selectOverlap:false,
            showNonCurrentDates: false,
            // Create new event
            select: function (arg) {
                Swal.fire({
                    html: `<div class="mb-7">You want to update Planned Leave on `+arg.start.getDate()+`.`+(arg.start.getMonth()+1)+`.`+arg.start.getFullYear()+`</div>`,
                    icon: "info",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, update",
                    cancelButtonText: "No, return",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-active-light"
                    }
                }).then(function (result) {
                    if (result.value) {
                        calendar.addEvent({
                            title: "Planned Leave",
                            start: arg.start,
                            end: arg.end,
                            color: '#ffb3c1',
                            allDay: arg.allDay
                        })
                        calendar.unselect()
                    } 
                });
            },
            // Delete event
            eventClick: function (arg) {
                if(is_locked==false){

                    var shift_name = prefered_shift.name
                    var shift_code = prefered_shift.shift
                    var shift_color = prefered_shift.color
                    
                    if(arg.event.extendedProps.shift != "PL"){
                        shift_name = "Planned Leave";
                        shift_code = "PL";
                        shift_color = "#ffb3c1";
                    }

                    if(arg.event.extendedProps.shift != "W"){
                        Swal.fire({
                            html: `<div class="mb-7">You want to update `+shift_name+` on `+arg.event.start.getDate()+`.`+(arg.event.start.getMonth()+1)+`.`+arg.event.start.getFullYear()+`</div>`,
                            icon: "warning",
                            showCancelButton: true,
                            buttonsStyling: false,
                            confirmButtonText: "Yes, update it!",
                            cancelButtonText: "No, return",
                            customClass: {
                                confirmButton: "btn btn-primary",
                                cancelButton: "btn btn-active-light"
                            }
                        }).then(function (result) {
                            if (result.value) {
                                arg.event.remove();
                                calendar.addEvent({
                                    title: shift_name,
                                    start: arg.event.start,
                                    end: arg.event.end,
                                    color: shift_color,
                                    shift: shift_code,
                                    allDay: arg.event.allDay
                                })
                                calendar.unselect();

                                update_shift({'selected_shift':shift_code, 'sdate':arg.event.start})
                            }
                        });
                    }
                    else{
                        raise_error_tost("Sorry, You are not allowed to update week off days")
                    }
                }
                else{

                    Swal.fire({
                        text: "Shift roster is locked by admin",
                        icon: "info",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            },
            editable: false,
            dayMaxEvents: false, // allow "more" link when too many events
            events: data.events
        });

        calendar.render();
    }
}

var update_shift = function(props){

    var sdate = props.sdate;

    var selected_shift = props.selected_shift;
    
    var shift_data = JSON.stringify({"sdate":sdate.getDate()+`-`+(sdate.getMonth()+1)+`-`+sdate.getFullYear(), "shift": selected_shift });

    var csrftoken = getCookie('csrftoken');

    $(this).text(selected_shift);

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": false,
        "crossDomain": false,
        "url": "/roster/user/shift/info",
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
}

KTUtil.onDOMContentLoaded(function () {
    load_calender();
});