

// function convert_date(data) {
//     console.log(typeof(data))

//     if (data != null){

//     var getdate = new Date(data).toUTCString();

//     var DateName = getdate.replace("GMT","UTC");

//     // var GetMonthNumber = {"Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"}

//     // var GetDateSplit = getdate.split(" ");

//     // var getdate = GetDateSplit[3]+GetMonthNumber[GetDateSplit[2]]+GetDateSplit[1]+GetDateSplit[4].replace(/\:/g,"");
//     // var getdate=getdate
//     var output = DateName

//     return output;
//     }
//     else{
//         return null
//     }
// };
// import flatpickr from 'flatpickr';
var request_data = {};
// flatpickr("#kt_date", {
//     //options go here
//     enableTime: true,
//     dateFormat: "Y-m-dTH:i",
// });



$("#kt_date").flatpickr({
    enableTime: true,
    dateFormat: "Y-m-dTH:i",
});

// function collect_dict(data){
//  console.log(data)
// }

// createDatePicker()
// var queryselector=document.querySelector("#kt_date")
// ////.log(queryselector,"queryselector")



$("#submit_btn").on("click", function (e) {
    var shiftpass={}
    // $('#model_apply_leave').hide()
    //.log("Hidded")
    let jsonData = {
        name: 'John Doe',
        age: 30,
        address: '123 Main St.'
    };
    
    // Send the JSON object to the other script
    
    var shift = $("#Shift_dropdown").val();

    var selected_date = $("#kt_date").val();
    var end_date_start = $("#kt_date").data('daterangepicker');

    var end_date_end = $("#kt_date").data('daterangepicker');
    console.log(end_date_start)
    // selected_date=convert_date(selected_date)
    // end_date_start = end_date_start.format('YYYY-MM-DD.HH:mm');

    // end_date_end = end_date_end.format('YYYY-MM-DD.HH:mm');
    // console.log(end_date_end)
    //.log(shift, selected_date);
    // var leave_type = $("#leave_dropdown").val();
    request_data={ "shift": shift, "selected_date": selected_date };
    console.log(request_data,"REQ")
    shiftpass['shift_date']=request_data
    
    // collect_dict(request_data)
    $.ajax({
        method: "GET",
        url: '/shiftpasstool/outage_get_api/?shift=' + shift + '&created_date=' + selected_date + '',
        success: function (data) {

            generate_change_request_list_dom(data)
            shiftpass['outage_get']=data
            console.log(shiftpass['outage_get'],"OUTAGEEEEEE")
            
        },error: function(xhr, status, error){
            console.log("............... ERRORRRRR")
            
            
        }

    });

    /// SPC TICKET
    $.ajax({
        method: "GET",
        url: '/shiftpasstool/post_tracking/?shift=' + shift + '&created_date=' + selected_date + '',
        success: function (data) {
            generate_change_request_list_SPC(data)
            shiftpass['follow_up']=data
        
            
        },error: function(xhr, status, error){
            console.log("............... ERRORRRRR")
            
            
        }

    })
    setTimeout(() => {
        broadcast_data_transforming(shiftpass)
    }, 3000);
    
    
    
    
    
});
// startTimepicker = form.querySelector('#kt_calendar_datepicker_start_time');
// endTimepicker = form.querySelector('#kt_calendar_datepicker_end_time');

// POST outage
function broadcast_data_transforming(newdata){
    // console.log(newdata.length,"broadcast_data_transforming")
    // if(newdata.length >= 3){
    console.log(newdata,"NEWWWWWWWWWWWWWWW")
    window.postMessage(newdata, '*');
    // }

}
// window.postMessage(shiftpass, '*');
$("#submit_button").on('click', function (e) {
    //.log("clicked")

    //.log(request_data[0]['shift'])




    var floatingShift = request_data['shift']
    var floatingdate = request_data['selected_date']
    var floatingTicket = $("#floatingTicket").val();
    var floatingCause = $("#floatingCause").val()
    var floatingCustomerImp = $("#floatingCustomerImp").val();
    var floatingActionReq = $("#floatingActionReq").val();
    // var floatingAction = $("#floatingAction").val();
    var floatingStatus = $("#floatingStatus").val();
    var date = request_data['selected_date']
    // var floatingdate = $("#floatingdate").val();
    // var floatingdate = $("#floatingdate").val();
    data = JSON.stringify({
        "Ticket_ID": floatingTicket,
        "Subject": floatingCause,
        "customer_impact": floatingCustomerImp,
        "Action_Required": floatingActionReq,
        "created_date": floatingdate,
        "shift": floatingShift,
        "Status": floatingStatus,
        "start_time": date
    })



    var csrftoken = getCookie('csrftoken');
    var settings = {

        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/post_api/",
        "method": "POST",
        "processData": false,

        "data": data

    }
    $.ajax(settings).done(function (response) {
       
        console.log('res')
        getoutageData()
    })
    // $.ajax({
    //     method: "GET",
    //     url: '/shiftpasstool/outage_get_api/',
    //     success: function (data) {
    //         generate_change_request_list_dom(data)

    //     }

    // });

})




$.ajax({
    method: "GET",
    url: '/shiftpasstool/outage_get_api/',
    success: function (data) {
        generate_change_request_list_dom(data)

    }

});


function getoutageData(){
    console.log("outwork")
    $.ajax({
        method: "GET",
        url: '/shiftpasstool/outage_get_api/',
        success: function (data) {
            console.log("outwork")
            generate_change_request_list_dom(data)

        }

    });
}


outage_report={}

function generate_change_request_list_dom(data) {
    var team_options = "";
    var color='';
    var statusHide='';
    var textData=''
    var custom_impact=''
    var ActionRequired=''
    // if (data.length==0){
    //     data=[]
    //     data.push({"Ticket_ID": '', "Subject": '', "customer_impact": '', "Action_Required": ''})
    //     //.log("if condition")
    // }
    console.log(data, "outage data")
    outage_report['outage_data']=data['report']
    if (data['report']){
    if (data['report'].length != 0) {
        data['report'].forEach(function (item) {

            var timeZone= data['timezones'].filter(e=>e.Ticket_ID == item.Ticket_ID)
            timeZone=JSON.stringify(timeZone)

            console.log(item.Status)
            subject=item.Subject.replace(/'/g, '&quot;')

            if(item.Status == 'Resolved'){  
                color= `<span class='badge badge-light-success fs-8 fw-bolder'style="font-size: small !important;">`+ item.Status + `</span> `
                statusHide = ''
            }
            else if(item.Status == 'Waiting'){  
                color= `<span class='badge badge-light-danger fs-8 fw-bolder'style="font-size: small !important;">`+ item.Status + `</span> `
                statusHide=`  <a href=""   onClick='update("${item.ID}")' data-bs-toggle="modal" data-bs-target="#updateToken" 
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update</a>`
            }
           else  if(item.Status == 'Inprogress' || item.Status == 'InProgress'){  
                color= `<span class='badge badge-light-warning fs-8 fw-bolder'style="font-size: small !important;">`+ item.Status + `</span> `
                statusHide=`   <a href=""   onClick='update("${item.ID}")' data-bs-toggle="modal" data-bs-target="#updateToken" 
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update</a>`
           }
            else  if(item.Status == 'New'){  
                color= `<span class='badge badge-light-primary fs-8 fw-bolder'style="font-size: small !important;">`+ item.Status + `</span> `
                statusHide=`  <a href=""   onClick='update("${item.ID}")' data-bs-toggle="modal" data-bs-target="#updateToken" 
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update</a>`

            }

            if(item.Subject.length > 200){
                textData=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Subject + `</label>
            </div>
                `
            }
            else if(item.Subject.length > 100){
                textData=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Subject + `</label>
            </div>
                `
            }
            else{
                textData=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Subject + `</label>
                </div>`
            }
            
            if (item.customer_impact.length > 100){
                custom_impact=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.customer_impact + `</label>
            </div>`
            }else{
                custom_impact=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.customer_impact + `</label>
                </div>`
            }
            // Action_Required
            if (item.Action_Required.length > 100){
                ActionRequired=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Action_Required + `</label>
            </div>`
            }else{
                ActionRequired=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Action_Required + `</label>
                </div>`
            }

            team_options = team_options + `<tr>
            
                <td  id=`+ item.ID + `>
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Ticket_ID + `</label>
                    </div>
                </td>
                <td style="white-space: initial;">
                   ${textData}
                </td>
                <td style="white-space: initial;">
                    ${custom_impact}
                    
                </td>
                <td style="white-space: initial;">
                    ${ActionRequired}
                    
                </td>
                <td style="text-align:center;font-size: medium;">
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        `+ color + `

                    </div>
                </td>

                <td style="text-align: center;">
                   ${statusHide}

            
                    
                </td>
                
            </tr>
            
            `
        //     <a href=""   onClick='view_outage("${item.ID}","${item.Ticket_ID}","${subject}","${item.customer_impact}","${item.Action_Required}","${item.Status}","${item.created_date}","${item.shift}",${timeZone})'  data-bs-toggle="modal" data-bs-target="#viewToken_outages" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" >
        //     <!--begin::Svg Icon | path: icons/duotune/art/art005.svg-->
        //     <span class="svg-icon svg-icon-3">
        //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
        //     <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
        //     <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
        //   </svg>
        //     </span>
            
        // </a>
        })
    } else {

        team_options = team_options + `
            <h3 style="text-align:center">No data found</h3>
        `

    }}else{
        team_options = team_options + `
            <h3 style="text-align:center">No data found</h3>
        `
    }

    $('#swap_request_from_tbody_outages').html(team_options)
}




function update(ID) {
    console.log(outage_report,"outage_report")
    var UpdateData=outage_report['outage_data'].filter(e=>e.ID == ID)
    console.log(UpdateData)
    UpdateData=UpdateData[0]
    // $.ajax({
    //     method: "GET",
    //     url: '/shiftpasstool/Outage_Get_Id/?id='+ID+'',
    //     success: function (data) {
    //         console.log(data,"outwork")
    //         // generate_change_request_list_dom(data)
    //         // for(j in data){
    //         //     Status=j['Status']
    //         // }
    //         UpdateData=data[0]
       

   

    console.log(UpdateData)
    // //.log(customer_impact)
    var upd = ''

    var statusFill= ''

    if(UpdateData['Status'] == 'New'){
        statusFill=statusFill + `
        <option selected value="New">New</option>
        <option value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `
    }
    else if(UpdateData['Status'] == 'Inprogress'){
        statusFill=statusFill + `
        <option  value="New">New</option>
        <option selected value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `
    }
    else if(UpdateData['Status'] == 'Waiting'){
        statusFill=statusFill + `
        <option  value="New">New</option>
        <option  value="Inprogress">Inprogress</option>
        <option selected value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `
    }
    else if(UpdateData['Status'] == 'Resolved'){
        statusFill=statusFill + `
        <option  value="New">New</option>
        <option  value="Inprogress">Inprogress</option>
        <option  value="Waiting">Waiting</option>
        <option selected value="Resolved">Resolved</option>
        `
    }

    // //.log(item,"infunction")
    upd = upd + `
          
    <form class="form" action="#">

    <div class="mb-13 text-center">

        <h1 class="mb-3">Update Outages Ticket</h1>

        <div class="text-gray-400 fw-bold fs-5">If you need more info, please check
        <a href="" class="fw-bolder link-primary">Support Guidelines</a>.</div>

    </div>

    <div class="row g-9 mb-8">

        <div class="col-md-6 fv-row">
        <label class="d-flex align-items-center fs-6 fw-bold mb-2">
            <span class="required">Ticket ID</span>
            <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="Ticket ID"></i>
        </label>

        <input type="text" class="form-control" id="updateTicket" placeholder="Ticket Id" value="`+ UpdateData.Ticket_ID + `">
        </div>

        <div class="col-md-6 fv-row">
        <label class="required fs-6 fw-bold mb-2">Status</label>
        <select class="form-select form-select-solid" data-control="select2" data-hide-search="true" 
        data-placeholder="Select a Status"  id="updateStatus">
        ${statusFill}
        </select>
    </div>

    </div>

    <div class="row g-9 mb-8">

        <div>
            <label class="required fs-6 fw-bold mb-2">Cause</label>
       
            <textarea class="form-control" rows="3" cols="40" id="updateCause"placeholder="Cause"
                            style="font-size: initial;background: aliceblue;">${UpdateData.Subject}</textarea>
        </div>

    </div>
    
    <div  class="row g-9 mb-8">

        <div>
            <label class="required fs-6 fw-bold mb-2">Customer Impact</label>
   
            <textarea class="form-control" rows="3" cols="40" id="updateCustomerImp"placeholder="Customer Impact"
            style="font-size: initial;background: aliceblue;">${UpdateData.customer_impact}</textarea>
        </div>

    </div>

    <div class="row g-9 mb-8">

        <div>
            <label class="required fs-6 fw-bold mb-2">Action Required</label>
             <textarea class="form-control" rows="3" cols="40" id="updateActionReq"placeholder="Action Required"
             style="font-size: initial;background: aliceblue;">${UpdateData.Action_Required}</textarea>
        </div>

    </div>

    <div class="text-center">
        <button type="reset" onclick="cancelModel()" class="btn btn-light">Cancel</button>
        <button type="button" class="btn btn-primary" data-kt-menu-dismiss="true" onclick="update_ticket('${UpdateData.created_date}','${UpdateData.shift}')"
        data-bs-dismiss="modal" >Update</button>
    </div>

</form>


                    `
                    
    $('#floatingTickets').html(upd)




}

// $("#modal .close").click()
function update_ticket(created_date, shift) {
    // $('#updateToken').hide()
    $('#modal').modal('toggle');
    //.log("status")
    // $('#updateToken').modal('hide');

    var Ticket_ID = $('#updateTicket').val()

    var Subject = $('#updateCause').val()

    var customer_impact = $('#updateCustomerImp').val()
    var Action_Required = $('#updateActionReq').val()
    var status = $('#updateStatus').val()
    // var updateStatus=status
    var data = JSON.stringify({
        Ticket_ID: Ticket_ID,
        Subject: Subject,
        customer_impact: customer_impact,
        Action_Required: Action_Required,
        Status: status,
        created_date: request_data['selected_date'],
        shift: request_data['shift']
    })
    //.log(data)

    var csrftoken = getCookie('csrftoken');
    var settings = {
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/post_api/",
        "method": "PUT",
        "processData": false,

        "data": data

    }
    $.ajax(settings).done(function (response) {
        //.log(response)
        // location.reload()
        getoutageData()
    })
    // $.ajax({
    //     method: "GET",
    //     url: '/shiftpasstool/outage_get_api/',
    //     success: function (data) {
    //         generate_change_request_list_dom(data)

    //     }

    // });

}

$('#update_button').on("click", function (e) {
    //.log("CLICKED", e)

    var updateTicket = $('#updateTicket').val()

    var updateCause = $('#updateCause').val()

    var updateCustomerImp = $('#updateCustomerImp').val()
    var updateActionReq = $('#updateActionReq').val()
    var updateStatus = $('#updateStatus').val()

    var data = JSON.stringify({
        Status: updateStatus
    })
    //.log(data)


    var settings = {
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/post_api/",
        "method": "PUT",
        "processData": false,

        "data": data

    }
    $ajax(settings).done(function (response) {
        console.log("response")
        getspcData()
    })
    // $.ajax({
    //     method: "GET",
    //     url: '/shiftpasstool/get_tracking/',
    //     success: function (data) {
    //         generate_change_request_list_SPC(data)

    //     }

    // });

});


/// SPC TICKET





$.ajax({
    method: "GET",
    url: '/shiftpasstool/post_tracking/',
    success: function (data) {
        generate_change_request_list_SPC(data)

    }

});

function generate_change_request_list_SPC(data) {
    var team_options1 = "";
    var resData = data;
    var color = '';
    var statusHide = ''
    var textData=''
    var Action_Taken=''
    var Action_Required=''
    console.log(data, "resData")
    outage_report['SPC_data']=data['new_data1']
    if (data['new_data1']){
    if (data['new_data1'].length != 0) {
        data['new_data1'].forEach(function (item) {
        // for (let item = 0; item <= data['new_data1'].length; item++) {
            // item = data['new_data1'][item]
            // const start_date = item.start_time

            // const new_start_date = new Date(start_date).toLocaleString('en-GB', {
            //     day: 'numeric',
            //     month: 'long',
            //     year: '2-digit',

            // }).split(' ').join('-');
            // const new_time = `${new Date(start_date).getHours()}:${new Date(start_date).getMinutes()}`
            // const new_Date_Time = `${new_start_date},${new_time}`

            // const end_date = item.end_time
            // console.log(end_date, "from item")
            // // if (end_date == null){
            // //     end_date=''
            // // }
            // const new_end_date = new Date(end_date).toLocaleString('en-GB', {
            //     day: 'numeric',
            //     month: 'long',
            //     year: '2-digit',

            // }).split(' ').join('-');
            // const new_end_time = `${new Date(end_date).getHours()}:${new Date(end_date).getMinutes()}`
            // const new_end_Date_Time = `${new_end_date},${new_end_time}`

            // // 29-October,22 12:53   to   05-November,22 12:53

            // console.log(new_Date_Time, 'to', new_end_Date_Time)

            var timeZone= data['new_data2'].filter(e=>e.Ticket_ID == item.Ticket_ID)
            timeZone=JSON.stringify(timeZone)
            console.log(timeZone)

            console.log(item.Status)

            if(item.Status == 'Resolved'){  
                color= `<span class='badge badge-light-success fs-8 fw-bolder'style="font-size: small !important;">`+ item.Status + `</span> `
                statusHide=''
            }
            else if(item.Status == 'Waiting'){  
                color= `<span class='badge badge-light-danger fs-8 fw-bolder'style="font-size: small !important;">`+ item.Status + `</span> `
                statusHide=`     <a href=""   onClick='update_spa("${item.ID}")'  data-bs-toggle="modal" data-bs-target="#updateToken_spa"
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update  </a>`
            }
           else  if(item.Status == 'Inprogress' || item.Status == 'InProgress'){  
                color= `<span class='badge badge-light-warning fs-8 fw-bolder'style="font-size: small !important;">`+ item.Status + `</span> `
                statusHide=`     <a href=""   onClick='update_spa("${item.ID}")'  data-bs-toggle="modal" data-bs-target="#updateToken_spa"
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update  </a>`
            }
            else  if(item.Status == 'New'){  
                color= `<span class='badge badge-light-primary fs-8 fw-bolder'style="font-size: small !important;">`+ item.Status + `</span> `
                statusHide=`    <a href=""   onClick='update_spa("${item.ID}")'  data-bs-toggle="modal" data-bs-target="#updateToken_spa"
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update  </a>`




            }

            if(item.Subject.length > 200){
                textData=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Subject + `</label>
            </div>`
            }
            else if(item.Subject.length > 100){
                textData=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Subject + `</label>
            </div>`
            }
            else{
                textData=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Subject + `</label>
            </div>`
            }

            console.log(color)
            // Action_Taken
            if(item.Action_Taken.length > 100){
                Action_Taken=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Action_Taken + `</label>
            </div>`
            }
            else{
                Action_Taken=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Action_Taken + `</label>
            </div>`
            }
            // Action_Required
            if(item.Action_Required.length > 100){
                Action_Required=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Action_Required + `</label>
            </div>`
            }
            else{
                Action_Required=`
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Action_Required + `</label>
            </div>`
            }
            team_options1 = team_options1 + `<tr>
                <td id=`+ item.ID + `>
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Ticket_ID + `</label>
                    </div>
                </td>
                <td style="white-space: initial;">
                ${textData}
                </td>
                <td style="white-space: initial;">
                ${Action_Taken}
                    
                </td>
                <td style="white-space: initial;">
                    ${Action_Required}
                </td>
                <td style="text-align:center">
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                       `+ color + `
                    </div>
                </td>
                
                <td style="text-align: center;">

                    ${statusHide}

                 


  
                    
                </td>
                
            </tr>
            
            `

        //     <a href=""   onClick='view_spa("${item.ID}","${item.Ticket_ID}","${item.Subject}","${item.Action_Taken}","${item.Action_Required}","${item.Status}","${item.created_date}","${item.shift}",${timeZone})'  data-bs-toggle="modal" data-bs-target="#viewToken_spa" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" >
        //     <!--begin::Svg Icon | path: icons/duotune/art/art005.svg-->
        //     <span class="svg-icon svg-icon-3">
        //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
        //     <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
        //     <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
        //   </svg>
        //     </span>
            
        // </a>


        })
    } else {

        team_options1 = team_options1 + `
            <h3>No data found</h3>
            `

    }}else{
        team_options1 = team_options1 + `
            <h3>No data found</h3>
            `
    }
    $('#swap_request_from_tbody').html(team_options1)

}

$("#submit_button_spc").on('click', function (e) {
    console.log("clicked")
    console.log(request_data)
    console.log(request_data['shift'])

    var floatingShift = request_data['shift']
    var floatingdate = request_data['selected_date']
    var floatingTicket = $("#floatingTicket_spc").val();
    var floatingCause = $("#floatingCause_spc").val()
    var floatingCustomerImp = $("#floatingCustomerImp_spc").val();
    var floatingActionReq = $("#floatingActionReq_spc").val();
    // var floatingAction = $("#floatingAction").val();
    var floatingStatus = $("#floatingStatus_spc").val();
    // "start_time":date
    // var floatingdate = $("#floatingdate").val();
    // var floatingdate = $("#floatingdate").val();
  
    
    // $.ajax({
    //     method: "GET",
    //     url: '/shiftpasstool/post_tracking/',
    //     success: function (data) {
    //         generate_change_request_list_SPC(data)
    
    //     }
    
    // });
    

})

function getspcData(){
    $.ajax({
        method: "GET",
        url: '/shiftpasstool/post_tracking/',
        success: function (data) {
            generate_change_request_list_SPC(data)
    
        }
    
    });
}


function view_spa(ID, Ticket_ID, Subject, Action_Taken, Action_Required, Status, created_date, shift,timezones) {

    var color=''
    var porgressBar = ''

    console.log(timezones)

    var endDate = timezones.filter(e=>e.end_date != null)
        if(endDate.length != 0){
        endDate=endDate[0]['end_date']
        }

        if(Status == 'Resolved'){  
            color= `<span class='badge badge-light-success fs-8 fw-bolder'style="font-size: large !important;">`+ Status + `</span> `
            porgressBar = `<div class="progress-bar bg-success" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>`
        }
        else if(Status == 'Waiting'){  
            color= `<span class='badge badge-light-danger fs-8 fw-bolder'style="font-size: large !important;">`+ Status + `</span> `
            porgressBar = `<div class="progress-bar bg-danger" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>`
        }
       else  if(Status == 'Inprogress'){  
            color= `<span class='badge badge-light-warning fs-8 fw-bolder'style="font-size: large !important;">`+ Status + `</span> `
            porgressBar = `<div class="progress-bar bg-warning" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>`
        }

        else  if(Status == 'New'){  
            color= `<span class='badge badge-light-primary fs-8 fw-bolder'style="font-size: large !important;">`+ Status + `</span> `
       
        porgressBar = `<div class="progress-bar bg-primary" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>`
        }

    var view_spaDetails = ''
    view_spaDetails = view_spaDetails + `
    <table id="" class="table align-middle table-row-dashed fs-6 gy-5 chart_scrol">
    <thead>
    <tr class="text-center text-gray-400 fw-bolder fs-6 text-uppercase gs-0 table_header h1-font-size">
        <th class="SystemNumber" style"font-weight: bold;">Ticket Id</th>
        <th class="sid" style='width: 40%'>Progress</th>
        <th class="db_sid" style"font-weight: bold;">Status</th>
        <th class="Date" style"font-weight: bold;">Start Date</th>
        <th class="Date" style"font-weight: bold;">End Date</th>
        
    </tr>
    </thead>
    
    <tbody>

    <tr class="text-center text-gray-400 fw-bolder fs-6 text-uppercase gs-0">
    <td>`+ Ticket_ID + `</td>
    <td>
    <div class="progress" style="height: 20px;">
    `+porgressBar+`
    </div>
    </td>
    <td>`+ color + `</td>
    <td>`+ created_date + ` </td>
    <td>`+ endDate + ` </td>
    </tr>
    
    </tbody>
   
</table>
    `
    $('#viewTickets_spa').html(view_spaDetails)


}

function view_outage(ID, Ticket_ID, Subject, Action_Taken, Action_Required, Status, created_date, shift,timezones) {

    var color=''
    var porgressBar = ''

    console.log(timezones)

    var endDate = timezones.filter(e=>e.end_date != null)
        if(endDate.length != 0){
        endDate=endDate[0]['end_date']
        }

        if(Status == 'Resolved'){  
            color= `<span class='badge badge-light-success fs-8 fw-bolder'style="font-size: large !important;">`+ Status + `</span> `
            porgressBar = `<div class="progress-bar bg-success" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>`
        }
        else if(Status == 'Waiting'){  
            color= `<span class='badge badge-light-danger fs-8 fw-bolder'style="font-size: large !important;">`+ Status + `</span> `
            porgressBar = `<div class="progress-bar bg-danger" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>`
        }
       else  if(Status == 'Inprogress'){  
            color= `<span class='badge badge-light-warning fs-8 fw-bolder'style="font-size: large !important;">`+ Status + `</span> `
            porgressBar = `<div class="progress-bar bg-warning" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>`
        }

        else  if(Status == 'New'){  
            color= `<span class='badge badge-light-primary fs-8 fw-bolder'style="font-size: large !important;">`+ Status + `</span> `
       
        porgressBar = `<div class="progress-bar bg-primary" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>`
        }



    var view_outageDetails = ''
    view_outageDetails = view_outageDetails + `
     <table id="" class="table align-middle table-row-dashed fs-6 gy-5 chart_scrol">
     <thead>
     <tr class="text-center text-gray-400 fw-bolder fs-6 text-uppercase gs-0 table_header h1-font-size">
         <th class="SystemNumber">Ticket Id</th>
         <th class="sid" style='width: 40%'>Progress</th>
         <th class="db_sid">Status</th>
         <th class="Date">Start Date</th>
         <th class="Date">End Date</th>
     
         
     </tr>
     </thead>
     
     <tbody>
 
     <tr class="text-center text-gray-400 fw-bolder fs-6 text-uppercase gs-0">
     <td>`+ Ticket_ID + `</td>
     <td>
     <div class="progress" style="height: 20px;">
        `+porgressBar+`
   </div>
     </td>
     <td>`+ color + `</td>
     <td>`+ created_date + ` </td>
     <td>`+ endDate + ` </td>
     </tr>
     
     </tbody>
    
 </table>
     `
    $('#viewTickets_outages').html(view_outageDetails)


}



function update_spa(ID) {

    var updateSpaData
    console.log(outage_report['SPC_data'])
    // console.log(data,"dates...................")

    updateSpaData=outage_report['SPC_data'].filter(e=>e.ID == ID)

    updateSpaData=updateSpaData[0]

    console.log(updateSpaData)

    var upd_spa = ''

    var statusFill= ''

    if(updateSpaData['Status'] == 'New'){
        statusFill=statusFill + `
        <option selected value="New">New</option>
        <option value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `
    }
    else if(updateSpaData['Status'] == 'Inprogress'){
        statusFill=statusFill + `
        <option  value="New">New</option>
        <option selected value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `
    }
    else if(updateSpaData['Status'] == 'Waiting'){
        statusFill=statusFill + `
        <option  value="New">New</option>
        <option  value="Inprogress">Inprogress</option>
        <option selected value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `
    }
    else if(updateSpaData['Status'] == 'Resolved'){
        statusFill=statusFill + `
        <option  value="New">New</option>
        <option  value="Inprogress">Inprogress</option>
        <option  value="Waiting">Waiting</option>
        <option selected value="Resolved">Resolved</option>
        `
    }

    upd_spa = upd_spa + `
          
    <form class="form" action="#">
 
    <div class="mb-13 text-center">

        <h1 class="mb-3">Update SPC Ticket</h1>

        <div class="text-gray-400 fw-bold fs-5">If you need more info, please check
        <a href="" class="fw-bolder link-primary">Support Guidelines</a>.</div>

    </div>

    <div class="row g-9 mb-8">

    <div class="col-md-6 fv-row">

        <label class="d-flex align-items-center fs-6 fw-bold mb-2">
            <span class="required">Ticket ID</span>
            <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="Ticket ID"></i>
        </label>

        <input type="text" class="form-control" id="updateTicket_spa" placeholder="Ticket Id" value="`+ updateSpaData.Ticket_ID + `">
      </div>  

      <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Status</label>
            <select class="form-select form-select-solid" data-control="select2" data-hide-search="true" 
            data-placeholder="Select a Status"  id="updateStatus_spa">
              ${statusFill}
            </select>
        </div>

    </div>

    <div class="row g-9 mb-8">

        <div>
            <label class="required fs-6 fw-bold mb-2">Cause</label>

            <textarea class="form-control" rows="3" cols="40" id="updateCause_spa"placeholder="Cause"
            style="font-size: initial;background: aliceblue;">${updateSpaData.Subject}</textarea>
        </div>

    </div>    

    <div class="row g-9 mb-8">

        <div>
            <label class="required fs-6 fw-bold mb-2">Action Taken</label>
   
            <textarea class="form-control" rows="3" cols="40" id="updateCustomerImp_spa"placeholder="Action Taken"
            style="font-size: initial;background: aliceblue;">${updateSpaData.Action_Taken}</textarea>

        </div>

    </div>

    <div class="row g-9 mb-8">

        <div>
            <label class="required fs-6 fw-bold mb-2">Action Required</label>

            <textarea class="form-control" rows="3" cols="40" id="updateActionReq_spa"placeholder="Action Required"
            style="font-size: initial;background: aliceblue;">${updateSpaData.Action_Required}</textarea>
        </div>
 

    </div>

    <div class="text-center">
        <button type="reset" onclick="cancelModel()" class="btn btn-light">Cancel</button>
        <button type="button" class="btn btn-primary" data-kt-menu-dismiss="true"
        data-bs-dismiss="modal" id='update_button_spa' onclick="update_ticket_spa('${updateSpaData.created_date}','${updateSpaData.shift}')">Update</button>
    </div>

</form>

                    `
    $('#floatingTickets_spa ').html(upd_spa)

}

function update_ticket_spa(created_date, shift) {

    var Ticket_ID = $('#updateTicket_spa').val()

    var Subject = $('#updateCause_spa').val()

    var customer_impact = $('#updateCustomerImp_spa').val()
    var Action_Required = $('#updateActionReq_spa').val()
    var status = $('#updateStatus_spa').val()
    // var updateStatus=status
    var data = JSON.stringify({
        Ticket_ID: Ticket_ID,
        Subject: Subject,
        Action_Taken: customer_impact,
        Action_Required: Action_Required,
        Status: status,
        created_date: request_data['selected_date'],
        shift: request_data['shift']
    })

    console.log("update spa", data)

    var csrftoken = getCookie('csrftoken');
    var settings = {
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/update_tracking/",
        "method": "PUT",
        "processData": false,
        "data": data

    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        getspcData()
    })
    // $.ajax({
    //     method: "GET",
    //     url: '/shiftpasstool/post_tracking/',
    //     success: function (data) {
    //         generate_change_request_list_SPC(data)

    //     }

    // });

}


// export default request_data;


