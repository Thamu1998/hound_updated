var request_data = ""
var json_ = { "plan": { "S1": { "ADHOC_ACTI_SM": [{ "name": "Soujit Dutta", "inumber": "I565970", "email": "soujit.dutta@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Mukunda Bobburi", "inumber": "I561013", "email": "mukunda.bobburi@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Shainy Blessiya", "inumber": "I563805", "email": "shainy.blessiya.thanumalayan@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }], "SHIFT_LEAD_SM": [{ "name": "Mahammad Vali", "inumber": "I507732", "email": "mahammad.vali.dudekula@sap.com", "task_name": "Global Shift Lead", "status": null }, { "name": "Netti Priyanka", "inumber": "I566275", "email": "netti.priyanka@sap.com", "task_name": "Global Shift Lead", "status": null }, { "name": "Abishek P", "inumber": "I506609", "email": "abishek.p@sap.com", "task_name": "Global Shift Lead", "status": null }] }, "M": {}, "S2": { "ADHOC_ACTI_SM": [{ "name": "Ravikiran Gavigowdanakoppalu", "inumber": "I534851", "email": "ravikiran.gavigowdanakoppalu.krishnegowda@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Garipelli Praveen", "inumber": "I575039", "email": "garipelli.praveen@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Soumya Panigrahy", "inumber": "I531821", "email": "soumya.panigrahy@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Mustaq Ahammed", "inumber": "I534600", "email": "mustaq.ahammed@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Arun Thilakan", "inumber": "I560718", "email": "arun.thilakan@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Chekuru Nimnitha", "inumber": "I558160", "email": "chekuru.nimnitha.reddy@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }] }, "S3": { "ADHOC_ACTI_SM": [{ "name": "Sumit Mehta", "inumber": "I508009", "email": "sumit.mehta@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Hussain Basha", "inumber": "I557969", "email": "hussain.basha.mallempalli@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Mohamed Nafees", "inumber": "I541752", "email": "mohamed.nafees.h@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Ipsita Mazumder", "inumber": "I558930", "email": "ipsita.mazumder@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }, { "name": "Aman Tanwar", "inumber": "I557995", "email": "aman.tanwar@sap.com", "task_name": "Adhoc activity server management Bangalore", "status": null }] }, "O": {} }, "meta": { "S1": { "name": "Morning Shift", "time_info": "00:30  - 09:30 UTC" }, "M": { "name": "Midnoon Shift", "time_info": "06:30 - 15:30 UTC" }, "S2": { "name": "Noon Shift", "time_info": "00:30  - 09:30 UTC" }, "S3": { "name": "Night Shift", "time_info": "17:30 - 00:30 UTC" }, "O": { "name": "On-Call", "time_info": "24:00" } } }

console.log(json_)

var reports={}
$("#submit_btn").on("click", function (e) {
    // $('#model_apply_leave').hide()
    //.log("Hidded")
    var shift = $("#Shift_dropdown").val();

    var selected_date = $("#kt_date").val();
    var end_date_start = $("#kt_date").data('daterangepicker');

    var end_date_end = $("#kt_date").data('daterangepicker');
    console.log(end_date_start)

    request_data = { "shift": shift, "selected_date": selected_date };
    console.log(request_data, "NEW JS")
    shiftData()

    $.ajax({
        method: "GET",
        url: '/shiftpasstool/set_Ticket_count/?created_date=' + selected_date + '&shift='+ shift +'',
        success: function (data) {

            get_counts(data)
        }
    })

    $.ajax({
        method: "GET",
        url: '/shiftpasstool/ticket_comment/?created_date=' + selected_date + '&shift='+ shift +'',
        success: function (data) {
            get_notes(data)
        }
    })

    $.ajax({
        method: "GET",
        url: '/shiftpasstool/Get_all_activity/?created_date=' + selected_date + '&shift=' + shift + '',
        success: function (data) {
            get_activity(data)
        }
    })

    $.ajax({
        method: "GET",
        url: '/shiftpasstool/Get_sm_infra_activate/?created_date=' + selected_date + '&shift=' + shift + '',
        success: function (data) {
            get_activity_infra(data)
        }
    })

    // path('Get_sm_infra_activate/',Get_sm_infra_activate.as_view(),name='Get_sm_infra_activate'),
    // path('sm_infra_activate_obj/',sm_infra_activate_obj.as_view(),name='sm_infra_activate_obj')

});
$.ajax({
    method: "GET",
    url: '/shiftpasstool/Get_all_activity/',
    success: function (data) {
        get_activity(data)
        shiftData()
    }
})

$.ajax({
    method: "GET",
    url: '/shiftpasstool/Get_sm_infra_activate/',
    success: function (data) {
        get_activity_infra(data)
    }
})

function get_infra_activate() {
    $.ajax({
        method: "GET",
        url: '/shiftpasstool/Get_sm_infra_activate/',
        success: function (data) {
            get_activity_infra(data)
        }
    })
}

function get_act_datas() {
    $.ajax({
        method: "GET",
        url: '/shiftpasstool/Get_all_activity/',
        success: function (data) {
            get_activity(data)
        }
    })
}

function get_activity(data) {
    var host_list = "";
    var hostArray = []
    var data1 = []
    console.log("activity data", data)
    if (data) {
        if (data.length != 0) {
            data.forEach(i => {

                if (data1.includes(i.planned_type) == false) {
                    data1.push(i.planned_type);
                }
                console.log(data1)

            })
            if (data1.length > 0) {
                for (let j = 0; j < data1.length; j++) {
                    var s = data.filter(e => (e.planned_type == data1[j]))
                    hostArray.push({ [data1[j]]: s })
                }
                console.log(hostArray)
            }
        }
    }




    if (hostArray.length != 0) {

        hostArray.forEach(function (keyss) {
            console.log(keyss)
            // console.log(value)
            for (const [key, items] of Object.entries(keyss)) {
                console.log(key);
                console.log(items)

                var keyName = `<br>
                          <label style="font-size: small;" class="text-muted fw-bold d-block">`+ key + `</label>`

                var color = ''
                var startDate = ''
                var endDate = ''
                var textData= ''
                var preCheckData=''

                host_list = host_list + keyName
                reports['Host_data']=items
                items.forEach(function (item) {

                    startDate = new Date(item.planned_start_date).toLocaleDateString()
                    startDate = moment(startDate).format("DD-MMM-YYYY")
                    console.log(startDate)
                    if (item.planned_end_date != null) {
                        endDate = new Date(item.planned_end_date).toLocaleDateString()
                        endDate = moment(endDate).format("DD-MMM-YYYY")
                    }
                    else {
                        endDate = ''
                    }

                    if (item.pre_check_status == 'Resolved') {
                        color = `<span class='badge badge-light-success fs-8 fw-bolder' style="font-size: small !important;">` + item.pre_check_status + `</span> `
                    }
                    else if (item.pre_check_status == 'Waiting') {
                        color = `<span class='badge badge-light-danger fs-8 fw-bolder' style="font-size: small !important;">` + item.pre_check_status + `</span> `
                    }
                    else if (item.pre_check_status == 'Inprogress' || item.pre_check_status == 'InProgress') {
                        color = `<span class='badge badge-light-warning fs-8 fw-bolder' style="font-size: small !important;">` + item.pre_check_status + `</span> `
                    }
                    else if (item.pre_check_status == 'New') {
                        color = `<span class='badge badge-light-primary fs-8 fw-bolder' style="font-size: small !important;">` + item.pre_check_status + `</span> `
                    }



                    if(item.subject.length > 200){
                      textData= `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px !important">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.subject + `</label>
                    </div>`
                    }
                   else if(item.subject.length > 100){
                        textData= `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px !important">
                          <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.subject + `</label>
                      </div>`
                      }
                    else{
                        textData= `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.subject + `</label>
                    </div>`
                    }

                    if(item.pre_check_status_text.length > 200){
                       preCheckData=`<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px !important">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.pre_check_status_text + `</label>
                    </div>`
                    }
                    if(item.pre_check_status_text.length > 100){
                        preCheckData=`<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px !important">
                         <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.pre_check_status_text + `</label>
                     </div>`
                     }
                    else{
                        preCheckData=`<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.pre_check_status_text + `</label>
                    </div>`
                    }


                    host_list = host_list +
                        `<tr>
                        <td>
                        <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;text-align: center;">
                            <label style="font-size: small;font-weight:bold" class="text-muted fw-bold d-block">`+ item.region + `</label>
                        </div>
                    </td>
                        <td  id=`+ item.ID + `>
                            <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.ticket_id + `</label>
                            </div>
                        </td>
                        <td style="white-space: initial;">
                           ${textData}

                        </td>
                        <td style="white-space: initial;">
                       ${preCheckData}
                    </td>
                        <td style="text-align:center">
                        <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                            <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.cr_id + `</label>
                        </div>
                    </td>
                    <td style="text-align:center">
                        <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                            <label style="font-size: small;" class="text-muted fw-bold d-block">${item.floatingCmpDate}</label>
                        </div>
                    </td>
                    <td style="text-align:center">
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                    ${color}
                    </div>
                    </td>


                        
                        <td style="text-align: center;">



                        <a href="#" onclick='updateHostList("${item.ID}")' 
                        class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" data-bs-toggle="modal" data-bs-target="#updateViewHost">Update</a>
                       
                           </td>
                        
                        </tr>

                       `
                })
            }

        })

    }

    else {

        host_list = host_list + `
        <h3>No data found</h3>
        `

    }

    $('#host_list_tbody').html(host_list)

}



function get_activity_infra(data) {
    var host_list_infra = "";

    console.log("activity data", data)

    if (data.length != 0) {

        var color = ''
        var startDate = ''
        var endDate = ''
        var textData=''

        // host_list_infra = host_list_infra + keyName
        reports['infra_data']=data
        data.forEach(function (item) {

            startDate = new Date(item.planned_start_date).toLocaleDateString()
            startDate = moment(startDate).format("DD-MMM-YYYY")
            console.log(startDate)
            if (item.planned_end_date != null) {
                endDate = new Date(item.planned_end_date).toLocaleDateString()
                endDate = moment(endDate).format("DD-MMM-YYYY")
            }
            else {
                endDate = ''
            }

            console.log(item.pre_check_status)

            if (item.pre_check_status == 'Resolved') {
                color = `<span class='badge badge-light-success fs-8 fw-bolder' style="font-size:small !important;">` + item.pre_check_status + `</span> `
            }
            else if (item.pre_check_status == 'Waiting') {
                color = `<span class='badge badge-light-danger fs-8 fw-bolder' style="font-size: small !important;">` + item.pre_check_status + `</span> `
            }
            else if (item.pre_check_status == 'Inprogress' || item.pre_check_status == 'InProgress') {
                color = `<span class='badge badge-light-warning fs-8 fw-bolder' style="font-size: small !important;">` + item.pre_check_status + `</span> `
            }
            else if (item.pre_check_status == 'New') {
                color = `<span class='badge badge-light-primary fs-8 fw-bolder' style="font-size: small !important;">` + item.pre_check_status + `</span> `
            }

            if(item.subject.length > 200){
               textData=` <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px !important">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.subject + `</label>
            </div>`
            }
            else if(item.subject.length > 100){
                textData=` <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px !important">
                 <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.subject + `</label>
             </div>`
             }
            else{
                textData=` <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.subject + `</label>
            </div>`
            }

            host_list_infra = host_list_infra +
                `<tr>
  
                        <td id=`+ item.ID + `>
                            <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                                <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.ticket_id + `</label>
                            </div>
                        </td>
                        <td style="white-space: initial;">
                         ${textData}
                        </td>

                    <td>
                        <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                            <label style="font-size: small;" class="text-muted fw-bold d-block">${item.floatingImplementation}</label>
                        </div>
                    </td>

                    <td >
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                    ${color}
                    </div>
                    </td>


                        
                        <td>



                        <a href="#" onclick='updateHostList_infra("${item.id}")' 
                        class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" data-bs-toggle="modal" data-bs-target="#updateViewHost_infra">Update</a>



                            
                           </td>
                        
                        </tr>

                       `
        })
    }



    else {

        host_list_infra = host_list_infra + `
        <h3>No data found</h3>
        `

    }

    $('#host_list_tbody_infra').html(host_list_infra)

}





function get_counts(data) {
    console.log(data, "NEW JSSSS")


    get_chartData(data)


}

{/* <canvas id="chart_dip" width="112" height="112" data-kt-size="70" data-kt-line="11" style="display: block; box-sizing: border-box; height: 99.5556px; width: 99.5556px;"></canvas> */ }


function get_chartData(data) {
    if (data != 'No data') {
        console.log(data)
        var total = parseInt(data.alerts) + parseInt(data.manual_incidents) + parseInt(data.problems) + parseInt(data.service_request)
        console.log(total)
        var upd_chart = ''
        var upd_Btn = ''

        upd_chart = upd_chart +

            ` <div class="row">
    <div class="col-4">
    <div>

    <canvas  id="demoChart"></canvas>
    <span style="position: absolute;
    top: 60%;
    left: 8%;
    font-size: large;
    font-weight: bold;">${total}</span>
   </div>
   </div>

   <div class="col-8">
     <div style="position: relative;left: 20%;top: 10%;">
      <div class="row">
          <div class="col-8">
              <h6 style="color: deepskyblue;"><span style="background-color:#96c8e1;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: large;">Alerts</span></h6>
          </div>
       
          <div class="col-3">
              <span style=font-weight:bold;font-size: initial;>${data.alerts}</span>
          </div>

      </div><br>
      <div class="row">
          <div class="col-8">
              <h6 style="color: deepskyblue;"><span style="background-color:#22536d;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: large;">Manual Incidents</span></h6>
          </div>
          <div class="col-3">
          <span style=font-weight:bold;font-size: initial;>${data.manual_incidents}</span>
          </div>

      </div><br>
      <div class="row">
      <div class="col-8">
          <h6 style="color: deepskyblue;"><span style="background-color:#fadb5e;width: 0px;
          height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: large;">Service Request</span></h6>
      </div>
      <div class="col-3">
          <span style=font-weight:bold;font-size: initial;>${data.service_request}</span>
      </div>

  </div><br>
      <div class="row">
          <div class="col-8">          
              <h6 style="color: deepskyblue;"><span style="background-color:#6f7580;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: large;">Problems</span></h6>
          </div>
          <div class="col-3">
              <span style=font-weight:bold;font-size: initial;>${data.problems}</span>
          </div>

      </div>
  
   </div>
   </div>
  </div>`

        $('#floating_chart ').html(upd_chart)

        upd_Btn = upd_Btn + `
    <a href="#" class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" data-bs-toggle="modal"
    data-bs-target="#model_chart_update" id="create_work_group_request_btn" onclick=upate_counts('${data.alerts}','${data.manual_incidents}','${data.problems}','${data.service_request}','${data.date}','${data.shift}')>Update</a>`

        $('#hideUpdate ').html(upd_Btn)

        // chart_dip();

        var ctxD = document.getElementById("demoChart").getContext('2d');
        console.log(ctxD)



        var myLineChart = new Chart(ctxD, {
            type: 'doughnut',
            data: {
                // labels: ["Alerts", "Manual Ins", "SRs", "Problem",],
                datasets: [{
                    data: [data.alerts, data.manual_incidents, data.service_request, data.problems,],
                    backgroundColor: ["#96c8e1", "#22536d", "#fadb5e", "#6f7580",],
                    hoverBackgroundColor: ["#96c8e1", "#22536d", "#fadb5e", "#6f7580",]
                }],

            },
            options: {
                responsive: true,
            }
        });


    }
    else {
        data = { "alerts": "0", "manual_incidents": "0", "problems": "0", "service_request": "0" }

        var upd_chart = ''

        // var upd_Btn = ''

        // upd_chart = upd_chart + `
        // <a href="#" class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" data-bs-toggle="modal"
        //                 data-bs-target="#model_chart" id="create_work_group_request_btn">Create</a>
        // `

        // $('#floating_chart ').html(upd_chart)

        // $('#hideUpdate ').html(upd_Btn)


        var upd_Btn = ''

        upd_chart = upd_chart +

            ` <div class="row">
    <div class="col-4">
    

    
   </div>
   <div class="col-8">
     <div style="position: relative;left: 20%;top: 10%;">
      <div class="row">
          <div class="col-8">
              <h6 style="color: deepskyblue;"><span style="background-color:#96c8e1;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: large;">Alerts</span></h6>
          </div>
       
          <div class="col-3">
              <span style=font-weight:bold;font-size: initial;>${data.alerts}</span>
          </div>

      </div><br>
      <div class="row">
          <div class="col-8">
              <h6 style="color: deepskyblue;"><span style="background-color:#22536d;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: large;">Manual Incidents</span></h6>
          </div>
          <div class="col-3">
          <span style=font-weight:bold;font-size: initial;>${data.manual_incidents}</span>
          </div>

      </div><br>
      <div class="row">
      <div class="col-8">
          <h6 style="color: deepskyblue;"><span style="background-color:#fadb5e;width: 0px;
          height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: large;">Service Request</span></h6>
      </div>
      <div class="col-3">
          <span style=font-weight:bold;font-size: initial;>${data.service_request}</span>
      </div>

  </div><br>
      <div class="row">
          <div class="col-8">          
              <h6 style="color: deepskyblue;"><span style="background-color:#6f7580;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: large;">Problems</span></h6>
          </div>
          <div class="col-3">
              <span style=font-weight:bold;font-size: initial;>${data.problems}</span>
          </div>

      </div>
  
   </div>
   </div>
  </div>`

        $('#floating_chart ').html(upd_chart)

        upd_Btn = upd_Btn + `
    <a href="#" class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" data-bs-toggle="modal"
    data-bs-target="#model_chart_update" id="create_work_group_request_btn" onclick=upate_counts('${data.alerts}','${data.manual_incidents}','${data.problems}','${data.service_request}','${data.date}','${data.shift}')>Update</a>`

        $('#hideUpdate ').html(upd_Btn)

        // chart_dip();

        var ctxD = document.getElementById("demoChart").getContext('2d');
        console.log(ctxD)



        var myLineChart = new Chart(ctxD, {
            type: 'doughnut',
            data: {
                // labels: ["Alerts", "Manual Ins", "SRs", "Problem",],
                datasets: [{
                    data: [data.alerts, data.manual_incidents, data.service_request, data.problems,],
                    backgroundColor: ["#96c8e1", "#22536d", "#fadb5e", "#6f7580",],
                    hoverBackgroundColor: ["#96c8e1", "#22536d", "#fadb5e", "#6f7580",]
                }]
            },



        });

    }
}

$.ajax({
    method: "GET",
    url: '/shiftpasstool/set_Ticket_count/',
    success: function (data) {

        get_counts(data)
    }
})

function POST_data() {
    // $('#submit_button_chart').on('click', function (e) {

    console.log("clicked")
    var dic = JSON.stringify({
        "alerts": $('#floatingAlerts_update').val(),
        "manual_incidents": $('#floatingManualIncidents_update').val(),
        "problems": $('#floatingProblems_update').val(),
        "service_request": $("#floatingServiceRequest_update").val(),
        "date": request_data['selected_date'],
        "shift": request_data['shift']
    })
    //     var dic=JSON.stringify({"alerts":$('#floatingAlerts').val(),
    //     "manual_incidents":$('#floatingManualIncidents').val(),
    //     "problems":$('#floatingProblems').val(),
    //     "service_request":$("#floatingServiceRequest").val(),

    // })

    var csrftoken = getCookie('csrftoken');
    var settings = {

        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/set_Ticket_count/",
        "method": "POST",
        "processData": false,
        "data": dic

    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        get_all_count()
        // location.reload()
    })

    // })
}


function get_all_count() {
    $.ajax({
        method: "GET",
        url: '/shiftpasstool/set_Ticket_count/',
        success: function (data) {
            get_counts(data)
        }
    })
}

var update_count_ticket = {}
function upate_counts(alerts, manual_incidents, problems, service_request, date, shift) {

    //     console.log("update func clicked")
    //     var dic=JSON.stringify({"alerts":$('#floatingAlerts').val(),
    //     "manual_incidents":$('#floatingManualIncidents').val(),
    //     "problems":$('#floatingProblems').val(),
    //     "service_request":$("#floatingServiceRequest").val(),
    //     "date":request_data['selected_date'],
    //     "shift":request_data['shift']
    // })
    document.getElementById('floatingAlerts_update').value = alerts
    document.getElementById('floatingManualIncidents_update').value = manual_incidents
    document.getElementById('floatingProblems_update').value = problems
    document.getElementById('floatingServiceRequest_update').value = service_request
    update_count_ticket['date'] = request_data['selected_date']
    update_count_ticket['shift'] = request_data['shift']


}



$('#submit_button_chart_update').on('click', function (e) {

    console.log(update_count_ticket, "update_count_ticket")
    if (update_count_ticket['date'] != "undefined") {
        var dic = JSON.stringify({
            "alerts": $('#floatingAlerts_update').val(),
            "manual_incidents": $('#floatingManualIncidents_update').val(),
            "problems": $('#floatingProblems_update').val(),
            "service_request": $("#floatingServiceRequest_update").val(),

            "date": update_count_ticket['date'],
            "shift": update_count_ticket['shift']
        })
        var csrftoken = getCookie('csrftoken');
        var settings = {

            "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
            "async": true,
            "crossDomain": false,
            "url": "/shiftpasstool/set_Ticket_count/",
            "method": "PUT",
            "processData": false,
            "data": dic

        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            get_all_count()
            // location.reload()
        })
    } else {
        POST_data()
    }




})




// Comment notes

// notes

$('#submit_cmd_btn_notes').on('click', function (e) {


})

function get_notes(data) {

    //   document.getElementById('comment_id').value=data.notes
    var upd_notes = ''
    console.log(data, "DATAAAAAAAAAAAAAAAAAAAAAAAAA")
    console.log(Object.keys(data))
    var upd_button = ''
    if (Object.keys(data).length > 0) {

        console.log(typeof data.notes)

        upd_button = upd_button + `
  

    
    <a href="#" class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" onclick=update_notes_CMD('${data.date}','${data.shift}') >Update</a>
    `
        upd_notes = upd_notes + `
  

    <textarea class="form-control" rows="5" cols="40" id="comment_id"
     style="font-size: initial;background: aliceblue;width:85%;margin:auto">${data.notes}</textarea><br><br><br>
    
  `
        $('#update_notes').html(upd_notes)
        $('#Update_button_comment').html(upd_button)
    } else {
        data = { "notes": "", "date": "", "shift": "" }
        upd_button = upd_button + `
  
    <a class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" style="margin-left: 5%" onclick=update_notes_CMD('${data.date}','${data.shift}') >Update</a>
    `
        upd_notes = upd_notes + `

    <textarea class="form-control" rows="5" cols="40" id="comment_id"
     style="font-size: initial;background: aliceblue;width:85%;margin:auto">${data.notes}</textarea><br><br><br>
  `
        $('#update_notes').html(upd_notes)
        $('#Update_button_comment').html(upd_button)


    }
    //   Update_button_comment


}

$.ajax({
    method: "GET",
    url: '/shiftpasstool/ticket_comment/',
    success: function (data) {
        get_notes(data)
    }
})


function updateHostList_infra(id) {
    console.log(reports['infra_data'],"infra")
    var updateSpaData
    console.log(reports['infra_data'])
    // console.log(data,"dates...................")

    updateSpaData=reports['infra_data'].filter(e=>e.id == id)

    updateSpaData=updateSpaData[0]
    console.log(updateSpaData,"updateSpaData")
    var upd_host_infra = ''

    var selectStatus = ''


    if (updateSpaData.pre_check_status == 'Inprogress' || updateSpaData.pre_check_status == 'InProgress') {
        selectStatus = selectStatus + `
        <option selected value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="New">New</option>
        <option value="Resolved">Resolved</option>
        `
    }

    if (updateSpaData.pre_check_status == 'Waiting') {
        selectStatus = selectStatus + `
        <option  value="Inprogress">Inprogress</option>
        <option selected value="Waiting">Waiting</option>
        <option  value="New">New</option>
        <option value="Resolved">Resolved</option>
        `
    }

    if (updateSpaData.pre_check_status == 'New') {
        selectStatus = selectStatus + `
        <option  value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option selected value="New">New</option>
        <option value="Resolved">Resolved</option>
        `
    }

    if (updateSpaData.pre_check_status == 'Resolved') {
        selectStatus = selectStatus + `
        <option  value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="New">New</option>
        <option selected value="Resolved">Resolved</option>
        `
    }

    upd_host_infra = upd_host_infra + `

    <form  class="form" action="#">

    <div class="mb-13 text-center">

        <h1 class="mb-3">Update Infra Ticket</h1>

        <div class="text-gray-400 fw-bold fs-5">If you need more info, please check
        <a href="" class="fw-bolder link-primary">Support Guidelines</a>.</div>

    </div>

    <div class="row g-9 mb-8">

    <div class="col-md-6 fv-row">
       
    <label class="d-flex align-items-center fs-6 fw-bold mb-2">
    <span class="required">Ticket ID</span>
    <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="Ticket ID"></i>
</label>

<input type="text" class="form-control" id="floatingTid_infra_update"  placeholder="Ticket ID" value="`+ updateSpaData.ticket_id + `">

    </div>

    <div class="col-md-6 fv-row">

        <label class="required fs-6 fw-bold mb-2">Status</label>
        <select class="form-select form-select-solid" data-control="select2" data-hide-search="true" 
        data-placeholder="Select a Status"  id="floatingHostStatus_infra_update">
           ${selectStatus}
        </select>


    </div>


</div>

<div class="d-flex flex-column mb-8 fv-row">

<label class="required fs-6 fw-bold mb-2">Implementation Period</label>
<input type="text" class="form-control" id="floatingImplementation_update"
placeholder="Implementation Period" value="${updateSpaData.floatingImplementation}">


</div>

    <div class="d-flex flex-column mb-8 fv-row">

        <label class="required fs-6 fw-bold mb-2">Description</label>

        <textarea class="form-control" rows="3" cols="40" id="floatingSubject_infra_update"placeholder="Description"
                    style="font-size: initial;background: aliceblue;">${updateSpaData.subject}</textarea>

    </div>




    <div class="text-center">
        <button type="reset" onclick="cancelModel()" class="btn btn-light me-3">Cancel</button>
        <button type="submit" class="btn btn-primary" data-kt-menu-dismiss="true"
        data-bs-dismiss="modal" id="submit_button_hostList_infra_upd"
        onclick='submit_button_hostList_infra_update("${updateSpaData.planned_start_date}","${updateSpaData.shift}")'>Submit</button>
    </div>
 
</form>

    `

    $('#modelUpdateHost_infra').html(upd_host_infra)

}


function updateHostList(id) {
    console.log(reports['Host_data'],"HOST")
    var updatehost_data
    console.log(reports['Host_data'])
    // console.log(data,"dates...................")

    updatehost_data=reports['Host_data'].filter(e=>e.ID == id)
    // console.log(cr_approval,"cr_approval...................")
    updatehost_data=updatehost_data[0]
    var upd_host = ''

    var planType = ''

    var selectRegion = ''

    var selectStatus = ''



    if (updatehost_data.planned_type == 'S4H') {
        planType = planType + `
        <option selected value="S4H">S4H</option>
        <option value="IBP">IBP</option>
        <option value="BYD/C4C">BYD/C4C</option>
    `
    }
    else if (updatehost_data.planned_type == 'IBP') {
        planType = planType + `
    <option  value="S4H">S4H</option>
    <option selected value="IBP">IBP</option>
    <option value="BYD/C4C">BYD/C4C</option>
`
    }
    else if (updatehost_data.planned_type == 'BYD/C4C') {
        planType = planType + `
    <option  value="S4H">S4H</option>
    <option value="IBP">IBP</option>
    <option selected value="BYD/C4C">BYD/C4C</option>
`
    }

    if (updatehost_data.region == 'EMEA') {
        selectRegion = selectRegion + `
    <option selected value="EMEA">EMEA</option>
    <option value="APJ">APJ</option>
    <option value="AMER">AMER</option>
    <option value="MENA">MENA</option>
    <option value="OTHERS">OTHERS</option>
`
    }

    if (updatehost_data.region == 'APJ') {
        selectRegion = selectRegion + `
        <option value="EMEA">EMEA</option>
        <option selected value="APJ">APJ</option>
        <option value="AMER">AMER</option>
        <option value="MENA">MENA</option>
        <option value="OTHERS">OTHERS</option>
    ` }

    if (updatehost_data.region == 'AMER') {
        selectRegion = selectRegion + `
            <option value="EMEA">EMEA</option>
            <option value="APJ">APJ</option>
            <option selected value="AMER">AMER</option>
            <option value="MENA">MENA</option>
            <option value="OTHERS">OTHERS</option>

        `
    }

    if (updatehost_data.region == 'MENA') {
        selectRegion = selectRegion + `
                <option value="EMEA">EMEA</option>
                <option value="APJ">APJ</option>
                <option value="AMER">AMER</option>
                <option selected value="MENA">MENA</option>
                <option value="OTHERS">OTHERS</option>
            `
    }

    if (updatehost_data.region == 'OTHERS') {
        selectRegion = selectRegion + `
                    <option value="EMEA">EMEA</option>
                    <option value="APJ">APJ</option>
                    <option value="AMER">AMER</option>
                    <option value="MENA">MENA</option>
                    <option selected value="OTHERS">OTHERS</option>
                `
    }


    if (updatehost_data.pre_check_status == 'Inprogress' || updatehost_data.pre_check_status == 'InProgress') {
        selectStatus = selectStatus + `
                        <option selected value="Inprogress">Inprogress</option>
                        <option value="Waiting">Waiting</option>
                        <option value="New">New</option>
                        <option value="Resolved">Resolved</option>
                        `
    }

    if (updatehost_data.pre_check_status == 'Waiting') {
        selectStatus = selectStatus + `
                        <option  value="Inprogress">Inprogress</option>
                        <option selected value="Waiting">Waiting</option>
                        <option  value="New">New</option>
                        <option value="Resolved">Resolved</option>
                        `
    }

    if (updatehost_data.pre_check_status == 'New') {
        selectStatus = selectStatus + `
                        <option  value="Inprogress">Inprogress</option>
                        <option value="Waiting">Waiting</option>
                        <option selected value="New">New</option>
                        <option value="Resolved">Resolved</option>
                        `
    }

    if (updatehost_data.pre_check_status == 'Resolved') {
        selectStatus = selectStatus + `
                        <option  value="Inprogress">Inprogress</option>
                        <option value="Waiting">Waiting</option>
                        <option value="New">New</option>
                        <option selected value="Resolved">Resolved</option>
                        `
    }

    upd_host = upd_host + `
           
    <form class="form" action="#">

    <div class="mb-13 text-center">

        <h1 class="mb-3">Update Ticket</h1>

        <div class="text-gray-400 fw-bold fs-5">If you need more info, please check
        <a href="" class="fw-bolder link-primary">Support Guidelines</a>.</div>

    </div>

    <div class="row g-9 mb-8">
    <div class="col-md-6 fv-row">
        <label class="d-flex align-items-center fs-6 fw-bold mb-2">
            <span class="required">Ticket ID</span>
            <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="Ticket ID"></i>
        </label>

        <input type="text" class="form-control" id="updatefloatingTid"  placeholder="Ticket ID" value="`+ updatehost_data.ticket_id + `">
    </div>

    <div class="col-md-6 fv-row">
    <label class="d-flex align-items-center fs-6 fw-bold mb-2">
        <span class="required">CMP Date&Time</span>
        <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip"
            title="CMP Date&Time"></i>
    </label>

    <input type="text" class="form-control" id="updatefloatingCmpDate" placeholder="CMP Date&Time" value="${updatehost_data.floatingCmpDate}">
  </div>

  </div>

    <div class="row g-9 mb-8">

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Planned Type</label>
            <select class="form-select form-select-solid" data-control="select2" data-hide-search="true" 
            data-placeholder="Select a Type"  id="updatefloatingPlanned">
            ${planType}
            </select>
        </div>

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Region</label>
            <select class="form-select form-select-solid" data-control="select2" data-hide-search="true" 
            data-placeholder="Select a Region"  id="updatefloatingRegion">
            ${selectRegion}
            </select>

        </div>

    </div>

    <div class="row g-9 mb-8">
   
    <div>
        <label class="required fs-6 fw-bold mb-2">Description</label>

        <textarea class="form-control" rows="3" cols="40" id="updatefloatingSubject"placeholder="Description"
       style="font-size: initial;background: aliceblue;">${updatehost_data.subject}</textarea>

    </div>

</div>

<div class="row g-9 mb-8">
    <div>
        <label class="required fs-6 fw-bold mb-2">Precheck Status</label>
       
        <textarea class="form-control" rows="3" cols="40" id="updatefloatingComment"placeholder="Precheck Status"
        style="font-size: initial;background: aliceblue;">${updatehost_data.pre_check_status_text}</textarea>

    </div>
</div>

    <div class="row g-9 mb-8">

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">CR ID</label>
            <input type="text" class="form-control" id="updatefloatingCR"
            placeholder="CR ID" value="`+ updatehost_data.cr_id + `">


        </div>

        <div class="col-md-6 fv-row">
   
        <label class="required fs-6 fw-bold mb-2">Status</label>
        <select class="form-select form-select-solid" data-control="select2" data-hide-search="true" 
        data-placeholder="Select a Status"  id="updatefloatingHostStatus">
        ${selectStatus}
        </select>


    </div>



    </div>

  

    <div class="text-center">
    <button type="reset" onclick="cancelModel()" class="btn btn-light">Cancel</button>
        <button type="submit" class="btn btn-primary" data-kt-menu-dismiss="true"
        data-bs-dismiss="modal" id="update_button_hostList" 
        onclick='updateHostListData("${updatehost_data.planned_start_date}","${updatehost_data.shift}")'>Submit</button>
    </div>

</form>


                    `


    $('#modelUpdateHost').html(upd_host)

}

function updateHostListData(planned_start_date, shift) {


    console.log("clicked")
    var Updatedic = JSON.stringify({
        "ticket_id": $('#updatefloatingTid').val(),
        "region": $('#updatefloatingRegion').val(),
        "subject": $('#updatefloatingSubject').val(),
        // "comments":$('#updatefloatingComment').val(),
        "cr_id": $('#updatefloatingCR').val(),
        "cr_approval": $('#updatefloatingHostStatus').val(),
        "resource": $('#updatefloatingComment').val(),
        "pre_check_status": $('#updatefloatingHostStatus').val(),
        "pre_check_status_text": $('#updatefloatingComment').val(),
        "planned_type": $('#updatefloatingPlanned').val(),
        "floatingCmpDate": $('#updatefloatingCmpDate').val(),
        "floatingImplementation": $("floatingImplementation_update").val(),
        "planned_start_date": request_data['selected_date'],
        "shift": request_data['shift'],
    })

    console.log(Updatedic, "Updatedic")

    var csrftoken = getCookie('csrftoken');
    var settings = {

        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/Activity_db/",
        "method": "POST",
        "processData": false,
        "data": Updatedic
    }

    $.ajax(settings).done(function (data) {
        console.log(data)
        // get_activity(data)
        get_act_datas()
        // location.reload()
    })


}


function submit_button_hostList_infra_update(planned_start_date, shift) {


    console.log("clicked")


    var dic_infra_update = JSON.stringify({
        "ticket_id": $('#floatingTid_infra_update').val(),
        // "region":$('#floatingRegion_infra').val(),
        "subject": $("#floatingSubject_infra_update").val(),
        // "comments":$("#floatingComment_infra").val(),
        // "cr_id":$("#floatingCR_infra").val(),
        // "cr_approval":$("#floatingCRApproval_infra").val(),
        // "resource":$("#floatingResource_infra").val(),
        "pre_check_status": $("#floatingHostStatus_infra_update").val(),
        'floatingImplementation': $("#floatingImplementation_update").val(),
        // "planned_type":$("#floatingPlanned_infra").val(),
        "planned_start_date": request_data['selected_date'],
        "shift": request_data['shift']  
    })





    console.log(dic_infra_update, "dic_infra_update")

    var csrftoken = getCookie('csrftoken');
    var settings = {

        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/sm_infra_activate_obj/",
        "method": "POST",
        "processData": false,
        "data": dic_infra_update
    }

    $.ajax(settings).done(function (data) {
        console.log(data)
        // get_activity_infra(data)
        get_infra_activate()
        // location.reload()
    })

}



function update_notes_CMD(date, shift) {
    console.log(date, "date")
    console.log($('#comment_id').val())
    // if (date != ""){
    console.log(request_data)
    if (request_data == "") {
        var dic = JSON.stringify({
            "date": request_data['selected_date'],
            "shift": request_data['shift'],
            "notes": $('#comment_id').val()

        })
    } else {


        console.log(dic, "DICTTTTT")

        console.log("NOTES")
        // "date":request_data['selected_date'],
        // "shift":request_data['shift']
        // notes:
        var dic = JSON.stringify({
            "date": request_data['selected_date'],
            "shift": request_data['shift'],
            "notes": $('#comment_id').val()

        })
    }

    var csrftoken = getCookie('csrftoken');
    var settings = {

        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/ticket_comment/",
        "method": "POST",
        "processData": false,
        "data": dic

    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        // get_notes()
        // location.reload()
    })
    // }else{


    // }

}

$('#submit_button_hostList').on('click', function (e) {

    console.log("clicked")
    var dic = JSON.stringify({
        "ticket_id": $('#floatingTid').val(),
        "region": $('#floatingRegion').val(),
        "subject": $("#floatingSubject").val(),
        // "comments":$("#floatingComment").val(),
        "cr_id": $("#floatingCR").val(),
        "cr_approval": $("#floatingHostStatus").val(),
        "resource": $("#floatingComment").val(),
        "pre_check_status_text": $("#floatingComment").val(),
        "planned_type": $("#floatingPlanned").val(),
        "floatingCmpDate": $("#floatingCmpDate").val(),
        "pre_check_status": $("#floatingHostStatus").val(),
        "planned_start_date": request_data['selected_date'],
        "shift": request_data['shift'],
    })
    //     var dic=JSON.stringify({"alerts":$('#floatingAlerts').val(),
    //     "manual_incidents":$('#floatingManualIncidents').val(),
    //     "problems":$('#floatingProblems').val(),
    //     "service_request":$("#floatingServiceRequest").val(),

    // })

    var csrftoken = getCookie('csrftoken');
    var settings = {

        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/Activity_db/",
        "method": "POST",
        "processData": false,
        "data": dic

    }
    $.ajax(settings).done(function (data) {
        console.log(data)
        // get_activity(data)
        get_act_datas()
        // location.reload()
    })



})



$('#submit_button_hostList_infra').on('click', function (e) {

    console.log("clicked")
    var dic_infra = JSON.stringify({
        "ticket_id": $('#floatingTid_infra').val(),
        // "region":$('#floatingRegion_infra').val(),
        "subject": $("#floatingSubject_infra").val(),
        // "comments":$("#floatingComment_infra").val(),
        // "cr_id":$("#floatingCR_infra").val(),
        // "cr_approval":$("#floatingCRApproval_infra").val(),
        // "resource":$("#floatingResource_infra").val(),
        "pre_check_status": $("#floatingHostStatus_infra").val(),
        'floatingImplementation': $("#floatingImplementation").val(),
        // "planned_type":$("#floatingPlanned_infra").val(),
        "planned_start_date": request_data['selected_date'],
        "shift": request_data['shift']
    })
    //     var dic=JSON.stringify({"alerts":$('#floatingAlerts').val(),
    //     "manual_incidents":$('#floatingManualIncidents').val(),
    //     "problems":$('#floatingProblems').val(),
    //     "service_request":$("#floatingServiceRequest").val(),

    // })

    var csrftoken = getCookie('csrftoken');
    var settings = {

        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json", },
        "async": true,
        "crossDomain": false,
        "url": "/shiftpasstool/sm_infra_activate_obj/",
        "method": "POST",
        "processData": false,
        "data": dic_infra

    }
    $.ajax(settings).done(function (data) {
        console.log(data)
        get_infra_activate()
    })



})


function closeAlert_popup() {
    console.log('clicked ')
    var closepopup = ''
    $('#cancelModelView').html(closepopup)
    $('#model_host_list_infra').modal('hide')
    $('#updateViewHost_infra').modal('hide')
    $('#model_host_list').modal('hide')
    $('#updateViewHost').modal('hide')
    $('#model_create_token1').modal('hide')
    $('#updateToken_spa').modal('hide')
    $('#model_create_token').modal('hide')
    $('#updateToken').modal('hide')
}


function closeAlert() {
    console.log('clicked ')
    var viewAlert = ''
    $('#cancelModelView').html(viewAlert)
}


function cancelModel() {
    console.log("click")
    var viewAlert = ''
    viewAlert = viewAlert + `

    <div class="swal2-container swal2-center swal2-backdrop-show" style="overflow-y: auto;">
        <div aria-labelledby="swal2-title" aria-describedby="swal2-html-container"
            class="swal2-popup swal2-modal swal2-icon-warning swal2" tabindex="-1" role="dialog" aria-live="assertive"
            aria-modal="true" style="display: grid;">
            <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: none;">×</button>
            <ul class="swal2-progress-steps" style="display: none;"></ul>
            <div class="swal2-icon swal2-warning swal2-icon-show" style="display: flex;">
                <div class="swal2-icon-content">!
                    
                </div>
            </div>
            <img class="swal2-image" style="display: none;">
            <h2 class="swal2-title" id="swal2-title" style="display: none;"></h2>
            <div class="swal2-html-container" id="swal2-html-container" style="display: block;">Are you sure you would like
                to cancel?</div>
            <input class="swal2-input" style="display: none;">
            <input type="file" class="swal2-file" style="display: none;">
            <div class="swal2-range" style="display: none;">
                <input type="range"><output></output>
            </div>
            <select class="swal2-select" style="display: none;"></select>
            <div class="swal2-radio" style="display: none;"></div>
            <label for="swal2-checkbox" class="swal2-checkbox" style="display: none;">
                <input type="checkbox"><span class="swal2-label"></span></label>
            <textarea class="swal2-textarea" style="display: none;"></textarea>
            <div class="swal2-validation-message" id="swal2-validation-message" style="display: none;"></div>
            <div class="swal2-actions" style="display: flex;">
                <div class="swal2-loader"></div>
                <button type="button" class="btn btn-primary" aria-label="" data-bs-dismiss="modal"
                    style="display: inline-block;"  onclick="closeAlert_popup()">Yes, cancel it!</button>
                <button type="button" class="swal2-deny" aria-label="" style="display: none;">No</button>
                <button type="button" class="btn btn-active-light" aria-label=""
                    style="display: inline-block;" onclick="closeAlert()">No, return</button>
            </div>
            <div class="swal2-footer" style="display: none;"></div>
            <div class="swal2-timer-progress-bar-container">
                <div class="swal2-timer-progress-bar" style="display: none;">
                </div>
            </div>
        </div>
    </div>
    
    `
    $('#cancelModelView').html(viewAlert)
}





// Activity_db API


// var chart_dip = function() {

//     var endpoint = '/cld/cht/dip'
//     var label = [];
//     var value = [];
//     var label_color = [];
//     var total = 0;
//     var text_with_color = "";
//     var text_sub = "";
//     var text_color = "";

//     $.ajax({
//         method: "GET",
//         url: endpoint,
//         success: function(data){
//             label = data.label
//             value = data.value
//             label_color = data.label_color
//             total = data.total
//             text_with_color = data.text_with_color
//             text_sub = data.text_sub
//             text_color = data.text_color
//             init_dip_chart()
//         },
//         error: function(error_data){
//             console.log(JSON.parse(error_data.responseText))
//         }
//     });

//     function init_dip_chart(){
//         if (label !== undefined){

//             url_list = [];

//             label.forEach(function(item, index){

//                 url_list.push("/cld/system?LifeCycleStatus=DIP&SystemRole="+item)

//             })

//             widget_dip = widget_1("chart_dip", "50", text_with_color, text_color, text_sub, total, label, value, label_color, "order-2", url_list)

//             $('#chart_widget_1').append(widget_dip[0]);

//             var ctx = document.getElementById('chart_dip').getContext('2d');

//             ctx.width = 10;
//             ctx.height = 10;      

//             var myDoughnut = new Chart(ctx, widget_dip[1]);
//         }
//     }
// }

/* <canvas id="chart_dip" width="112" height="112" data-kt-size="70" data-kt-line="11" style="display: block; box-sizing: border-box; height: 99.5556px; width: 99.5556px;"></canvas> */


function date_time(x) {

    // x=kwargs['hours']
    if (x >= 6 && x < 14) {
        return 'Morning'
    }
    else if (x >= 14 && x < 23) {
        return 'Afternoon'
    }
    else if ((x >= 23 && 6 < x) || (x >= 0 && x <= 6)) {
        return 'Night'
    }
}

function shiftData() {
    // var check
    // $.ajax({
    //     method: "GET",
    //     url: '/',
    //     success: function (data) {
    //         check = Object.keys(data['plan'])
    //         // get_counts(data)
    //     }
    // })


    var check = Object.keys(json_['plan'])
    var shiftArray = ''
    var ShiftData = ''
    var shiftName = ''
    var shiftShowData = ''
    var shiftArrayEmp = ''
    var shiftNameEmp = ''
    var ShiftDataEmp = ''
    var shiftShowDataEmp = ''
    $('#ShiftKanban').html('')
    $('#ShiftKanban1').html('')

    console.log(request_data.shift)

    if (request_data != '') {
        console.log(json_)

        if (check.length > 0) {
            check.forEach(e => {
                if (e == 'S1' && request_data.shift == 'Morning') {
                    // if(e == 'S1'){
                    if (Object.keys(json_['plan']['S1']).indexOf('SHIFT_LEAD_SM') != -1) {
                        shiftArray = (json_['plan']['S1']['SHIFT_LEAD_SM'])
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    if (Object.keys(json_['plan']['S1']).indexOf('ADHOC_ACTI_SM') != -1) {
                        shiftArrayEmp = (json_['plan']['S1']['ADHOC_ACTI_SM'])
                        shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`
                    }
                }
                if (e == 'S2' && request_data.shift == 'Afternoon') {
                    // else if(e == 'S2'){
                    if (Object.keys(json_['plan']['S2']).indexOf('SHIFT_LEAD_SM') != -1) {
                        shiftArray = (json_['plan']['S2']['SHIFT_LEAD_SM'])
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    if (Object.keys(json_['plan']['S2']).indexOf('ADHOC_ACTI_SM') != -1) {
                        shiftArrayEmp = (json_['plan']['S2']['ADHOC_ACTI_SM'])
                        shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`
                        console.log(shiftArrayEmp)
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`
                    }
                }
                if (e == 'S3' && request_data.shift == 'Night') {
                    // else if(e == 'S3'){
                    if (Object.keys(json_['plan']['S3']).indexOf('SHIFT_LEAD_SM') != -1) {
                        shiftArray = (json_['plan']['S3']['SHIFT_LEAD_SM'])
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    if (Object.keys(json_['plan']['S3']).indexOf('ADHOC_ACTI_SM') != -1) {
                        shiftArrayEmp = (json_['plan']['S3']['ADHOC_ACTI_SM'])
                        shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`
                    }
                }

            })

        }


        if (shiftArray.length > 0) {
            shiftArray.forEach(e => {
                ShiftData = ShiftData + `
            
            <div class="col-4">
                <div class="card container" style="flex-shrink: 0;
                margin:auto;
                background-color: #F3F6F9;
                border-radius: 0.85rem;width: 300px;">
                    <div class=row>
                       <div class=col-4>
                           <img alt="Pic" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png" width="50px">
                       </div>
                       <div class=col-8 style="margin: auto;">
                           <span class="card-label fw-bolder text-dark">${e.name}</span>
                       </div>
                    </div>

               </div><br>
            </div>
            
            `
            })
        }

        if (shiftArrayEmp.length > 0) {
            shiftArrayEmp.forEach(e => {
                ShiftDataEmp = ShiftDataEmp + `
            
            <div class="col-4">
                <div class="card container" style="flex-shrink: 0;
                margin:auto;
                background-color: #F3F6F9;
                border-radius: 0.85rem;width: 300px;">
                    <div class=row>
                       <div class=col-4>
                           <img alt="Pic" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png" width="50px">
                       </div>
                       <div class=col-8 style="margin: auto;">
                           <span class="card-label fw-bolder text-dark">${e.name}</span>
                       </div>
                    </div>

               </div><br>
            </div>
            
            `
            })
        }



        shiftShowData = shiftShowData + `

<div class="card card-flush">
<div class="row">
    <div class="col">
     
                <h3 class="card-title align-items-start flex-column  pt-5" style="margin-left: 2%;">
                    ${shiftName}
                </h3>
           
            <div class="card-body">
                <div class="row">
                    ${ShiftData}
                </div>   
            </div>                          
        
    </div>
 
</div>
</div>

`

        shiftShowDataEmp = shiftShowDataEmp + `

<div class="card card-flush">
<div class="row">
    <div class="col">
     
                <h3 class="card-title align-items-start flex-column  pt-5" style="margin-left: 2%;">
                    ${shiftNameEmp}
                </h3>
           
            <div class="card-body">
                <div class="row">
                    ${ShiftDataEmp}
                </div><br>   
            </div>                          
        
    </div>
 
</div>
</div>

`


        $('#ShiftKanban').html(shiftShowData)
        $('#ShiftKanban1').html(shiftShowDataEmp)


    }

    else {
        var date_ = new Date().getHours()
        console.log(date_)
        var req = date_time(date_)

        console.log(date_time(date_))

        if (check.length > 0) {
            check.forEach(e => {
                if (e == 'S1' && req == 'Morning') {
                    // if(e == 'S1'){
                    if (Object.keys(json_['plan']['S1']).indexOf('SHIFT_LEAD_SM') != -1) {
                        shiftArray = (json_['plan']['S1']['SHIFT_LEAD_SM'])
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    if (Object.keys(json_['plan']['S1']).indexOf('ADHOC_ACTI_SM') != -1) {
                        shiftArrayEmp = (json_['plan']['S1']['ADHOC_ACTI_SM'])
                        shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`
                    }
                }
                if (e == 'S2' && req == 'Afternoon') {
                    // else if(e == 'S2'){
                    if (Object.keys(json_['plan']['S2']).indexOf('SHIFT_LEAD_SM') != -1) {
                        shiftArray = (json_['plan']['S2']['SHIFT_LEAD_SM'])
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    if (Object.keys(json_['plan']['S2']).indexOf('ADHOC_ACTI_SM') != -1) {
                        shiftArrayEmp = (json_['plan']['S2']['ADHOC_ACTI_SM'])
                        shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`
                        console.log(shiftArrayEmp)
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`
                    }
                }
                if (e == 'S3' && req == 'Night') {
                    // else if(e == 'S3'){
                    if (Object.keys(json_['plan']['S3']).indexOf('SHIFT_LEAD_SM') != -1) {
                        shiftArray = (json_['plan']['S3']['SHIFT_LEAD_SM'])
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`
                    }
                    if (Object.keys(json_['plan']['S3']).indexOf('ADHOC_ACTI_SM') != -1) {
                        shiftArrayEmp = (json_['plan']['S3']['ADHOC_ACTI_SM'])
                        shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`
                    }
                    else {
                        shiftName = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`
                    }
                }

            })

        }


        if (shiftArray.length > 0) {
            shiftArray.forEach(e => {
                ShiftData = ShiftData + `
            
            <div class="col-4">
                <div class="card container" style="flex-shrink: 0;
                margin:auto;
                background-color: #F3F6F9;
                border-radius: 0.85rem;width: 300px;">
                    <div class=row>
                       <div class=col-4>
                           <img alt="Pic" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png" width="50px">
                       </div>
                       <div class=col-8 style="margin: auto;">
                           <span class="card-label fw-bolder text-dark">${e.name}</span>
                       </div>
                    </div>

               </div><br>
            </div>
            
            `
            })
        }

        if (shiftArrayEmp.length > 0) {
            shiftArrayEmp.forEach(e => {
                ShiftDataEmp = ShiftDataEmp + `
            
            <div class="col-4">
                <div class="card container" style="flex-shrink: 0;
                margin:auto;
                background-color: #F3F6F9;
                border-radius: 0.85rem;width: 300px;">
                    <div class=row>
                       <div class=col-4>
                           <img alt="Pic" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png" width="50px">
                       </div>
                       <div class=col-8 style="margin: auto;">
                           <span class="card-label fw-bolder text-dark">${e.name}</span>
                       </div>
                    </div>

               </div><br>
            </div>
            
            `
            })
        }



        shiftShowData = shiftShowData + `

<div class="card card-flush">
<div class="row">
    <div class="col">
     
                <h3 class="card-title align-items-start flex-column  pt-5" style="margin-left: 2%;">
                    ${shiftName}
                </h3>
           
            <div class="card-body">
                <div class="row">
                    ${ShiftData}
                </div>   
            </div>                          
        
    </div>
 
</div>
</div>

`

        shiftShowDataEmp = shiftShowDataEmp + `

<div class="card card-flush">
<div class="row">
    <div class="col">
     
                <h3 class="card-title align-items-start flex-column  pt-5"style="margin-left: 2%;">
                    ${shiftNameEmp}
                </h3>
           
            <div class="card-body">
                <div class="row">
                    ${ShiftDataEmp}
                </div><br>   
            </div>                          
        
    </div>
 
</div>
</div>

`


        $('#ShiftKanban').html(shiftShowData)
        $('#ShiftKanban1').html(shiftShowDataEmp)


    }

}
