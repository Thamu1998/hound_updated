var request_data = "";
var selectvalues=''
var reports = {};
var json_data = [];
var all_dict_send_api = {};
var all_dict_array = [];
var all_dict_from_before_js = [];


$("#submit_btn").on("click", function (e) {
  var shift = $("#Shift_dropdown").val();

  var selected_date = $("#kt_date").val();
  var end_date_start = $("#kt_date").data("daterangepicker");

  var end_date_end = $("#kt_date").data("daterangepicker");

  request_data = { shift: shift, selected_date: selected_date };

  shiftData();

  $.ajax({
    method: "GET",
    url:
      "/shiftpasstool/set_Ticket_count/?created_date=" +
      selected_date +
      "&shift=" +
      shift +
      "",
    success: function (data) {
      all_dict_send_api["quer_chart"] = data;
      get_counts(data);
    },
  });

  $.ajax({
    method: "GET",
    url:
      "/shiftpasstool/ticket_comment/?created_date=" +
      selected_date +
      "&shift=" +
      shift +
      "",
    success: function (data) {
      get_notes(data);
      all_dict_send_api["ticket_comment"] = data;
    },
  });

  $.ajax({
    method: "GET",
    url:
      "/shiftpasstool/Get_all_activity/?created_date=" +
      selected_date +
      "&shift=" +
      shift +
      "",
    success: function (data) {
      get_activity(data);
      all_dict_send_api["activity_data"] = data;
    },
  });

  $.ajax({
    method: "GET",
    url:
      "/shiftpasstool/Get_sm_infra_activate/?created_date=" +
      selected_date +
      "&shift=" +
      shift +
      "",
    success: function (data) {
      get_activity_infra(data);
      all_dict_send_api["sm_infra_data"] = data;
    },
  });
  all_dict_array.push(all_dict_send_api);

});
$.ajax({
  method: "GET",
  url: "/shiftpasstool/Get_all_activity/",
  success: function (data) {
    get_activity(data);
    shiftData();
  },
});

$.ajax({
  method: "GET",
  url: "/shiftpasstool/Get_sm_infra_activate/",
  success: function (data) {
    get_activity_infra(data);
  },
});

$.ajax({
  method: "GET",
  url:
    "/shiftpasstool/shift/admin",
  success: function (data) {
        getselectEmployeeData(data.user_list)
  },
})

function getselectEmployeeData(data){
var selectEmp=''
  if(data.length > 0){
   
    data.forEach(e=>
/* <img src="https://avatars.wdf.sap.corp/avatar/${e.id}" alt=""  class="rounded-circle me-2" width='40'></img> */

      selectvalues=selectvalues + 
      `<option data-tokens="${e.username}-${e.first_name} ${e.last_name}" value="${e.username}-${e.first_name} ${e.last_name}">
      ${e.username}-${e.first_name} ${e.last_name}</option>`
      )

      selectEmp=selectEmp + `
     
      <option value="">Select a Assignee...</option>
             ${selectvalues}
    `
  }



$("#selectEmployee").html(selectEmp);
$("#selectEmployee_infra").html(selectEmp);
}



function get_infra_activate() {
  $.ajax({
    method: "GET",
    url: "/shiftpasstool/Get_sm_infra_activate/",
    success: function (data) {
      get_activity_infra(data);
    },
  });
}

function get_act_datas() {
  $.ajax({
    method: "GET",
    url: "/shiftpasstool/Get_all_activity/",
    success: function (data) {
      get_activity(data);
    },
  });
}
window.addEventListener("message", (event) => {
  all_dict_from_before_js.push(event.data);
  
});

function mail_trigger() {
  var mail_dic = JSON.stringify({
    shifpassjs: all_dict_from_before_js,
    shiftpasschartjs: all_dict_send_api,
  });
  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/MailAPI/",
    method: "POST",
    processData: false,
    data: mail_dic,
  };

  $.ajax(settings).done(function (data) {

	 if(data){
        $('#exampleModalCenter').modal('show')
        }

  });
}

function closeModal(){
    $('#exampleModalCenter').modal('hide')
    all_dict_from_before_js=[]
}

function closeModal_date_and_shift(){
  console.log("asdlklfhasjkdhf")
  $('#check_alert_changes').modal('hide')
  // all_dict_from_before_js=[]
}
function get_activity(data) {
  var host_list = "";
  var hostArray = [];
  var data1 = [];

  if (data) {
    if (data.length != 0) {
      reports["Host_data"] = data;
      data.forEach((i) => {
        if (data1.includes(i.planned_type) == false) {
          data1.push(i.planned_type);
        }
      });
      if (data1.length > 0) {
        for (let j = 0; j < data1.length; j++) {
          var s = data.filter((e) => e.planned_type == data1[j]);
          hostArray.push({ [data1[j]]: s });
        }
      }
    }
  }

  if (hostArray.length != 0) {
    hostArray.forEach(function (keyss) {
      for (const [key, items] of Object.entries(keyss)) {
        var keyName =
          `<br>
            <label style="font-size: small;" class="text-muted fw-bold d-block">` +
          key +
          `</label>`;

        var color = "";
        var startDate = "";
        var endDate = "";
        var textData = "";
        var preCheckData = "";

        host_list = host_list + keyName;
        items.sort((a, b) => a.region.localeCompare(b.region));
        items.forEach(function (item) {
          startDate = new Date(item.planned_start_date).toLocaleDateString();
          startDate = moment(startDate).format("DD-MMM-YYYY");
          if (item.planned_end_date != null) {
            endDate = new Date(item.planned_end_date).toLocaleDateString();
            endDate = moment(endDate).format("DD-MMM-YYYY");
          } else {
            endDate = "";
          }

          if (item.pre_check_status == "Resolved") {
            color =
              `<span class='badge badge-light-success fs-8 fw-bolder' style="font-size: small !important;">` +
              item.pre_check_status +
              `</span> `;
          } else if (item.pre_check_status == "Waiting") {
            color =
              `<span class='badge badge-light-danger fs-8 fw-bolder' style="font-size: small !important;">` +
              item.pre_check_status +
              `</span> `;
          } else if (
            item.pre_check_status == "Inprogress" ||
            item.pre_check_status == "InProgress"
          ) {
            color =
              `<span class='badge badge-light-warning fs-8 fw-bolder' style="font-size: small !important;">` +
              item.pre_check_status +
              `</span> `;
          } else if (item.pre_check_status == "New") {
            color =
              `<span class='badge badge-light-primary fs-8 fw-bolder' style="font-size: small !important;">` +
              item.pre_check_status +
              `</span> `;
          }

          if (item.subject.length > 200) {
            textData =
              `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px !important">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">` +
              item.subject +
              `</label>
                    </div>`;
          } else if (item.subject.length > 100) {
            textData =
              `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px !important">
                          <label style="font-size: small;" class="text-muted fw-bold d-block">` +
              item.subject +
              `</label>
                      </div>`;
          } else {
            textData =
              `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">` +
              item.subject +
              `</label>
                    </div>`;
          }

          if (item.pre_check_status_text.length > 200) {
            preCheckData =
              `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px !important">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">` +
              item.pre_check_status_text +
              `</label>
                    </div>`;
          }
          if (item.pre_check_status_text.length > 100) {
            preCheckData =
              `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px !important">
                         <label style="font-size: small;" class="text-muted fw-bold d-block">` +
              item.pre_check_status_text +
              `</label>
                     </div>`;
          } else {
            preCheckData =
              `<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">` +
              item.pre_check_status_text +
              `</label>
                    </div>`;
          }

          host_list =
            host_list +
            `<tr>
                        <td>
                        <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;text-align: center;">
                            <label style="font-size: small;font-weight:bold" class="text-muted fw-bold d-block">` +
            item.region +
            `</label>
                        </div>
                    </td>
                        <td  id=` + item.ID +  `>
                            <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                                <label style="font-size: small;" class="text-muted fw-bold d-block">` + item.ticket_id + `</label>
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
                            <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.cr_id +
            `</label>
                        </div>
                    </td>
                    <td style="text-align:center">
                        <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                            <label style="font-size: small;" class="text-muted fw-bold d-block">${item.floatingCmpDate}</label>
                        </div>
                    </td>
                    <td>
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">` + item.assigned + `</label>
                    </div>
                </td>
                    <td style="white-space: initial;">
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">${item.remarks}</label>
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

                       `;
        });
      }
    });
  } else {
    host_list =
      host_list +
      `
        <h3>No data found</h3>
        `;
  }

  $("#host_list_tbody").html(host_list);
}

function get_activity_infra(data) {
  var host_list_infra = "";

  if (data.length != 0) {
    var color = "";
    var startDate = "";
    var endDate = "";
    var textData = "";
    reports["infra_data"] = data;
    data.forEach(function (item) {
      startDate = new Date(item.planned_start_date).toLocaleDateString();
      startDate = moment(startDate).format("DD-MMM-YYYY");
      if (item.planned_end_date != null) {
        endDate = new Date(item.planned_end_date).toLocaleDateString();
        endDate = moment(endDate).format("DD-MMM-YYYY");
      } else {
        endDate = "";
      }

      if (item.pre_check_status == "Resolved") {
        color =
          `<span class='badge badge-light-success fs-8 fw-bolder' style="font-size:small !important;">` +
          item.pre_check_status +
          `</span> `;
      } else if (item.pre_check_status == "Waiting") {
        color =
          `<span class='badge badge-light-danger fs-8 fw-bolder' style="font-size: small !important;">` +
          item.pre_check_status +
          `</span> `;
      } else if (
        item.pre_check_status == "Inprogress" ||
        item.pre_check_status == "InProgress"
      ) {
        color =
          `<span class='badge badge-light-warning fs-8 fw-bolder' style="font-size: small !important;">` +
          item.pre_check_status +
          `</span> `;
      } else if (item.pre_check_status == "New") {
        color =
          `<span class='badge badge-light-primary fs-8 fw-bolder' style="font-size: small !important;">` +
          item.pre_check_status +
          `</span> `;
      }

      if (item.subject.length > 200) {
        textData =
          ` <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px !important">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
          item.subject +
          `</label>
            </div>`;
      } else if (item.subject.length > 100) {
        textData =
          ` <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px !important">
                 <label style="font-size: small;" class="text-muted fw-bold d-block">` +
          item.subject +
          `</label>
             </div>`;
      } else {
        textData =
          ` <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
          item.subject +
          `</label>
            </div>`;
      }

      host_list_infra =
        host_list_infra +
        `<tr>
  
                        <td id=` +
        item.ID +
        `>
                            <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
        item.ticket_id +
        `</label>
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

                    <td>
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">${item.assigned}</label>
                    </div>
                </td>

                <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                    <label style="font-size: small;" class="text-muted fw-bold d-block">${item.remarks}</label>
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

                       `;
    });
  } else {
    host_list_infra =
      host_list_infra +
      `
        <h3>No data found</h3>
        `;
  }

  $("#host_list_tbody_infra").html(host_list_infra);
}

function get_counts(data) {
  get_chartData(data);
}

{
  /* <canvas id="chart_dip" width="112" height="112" data-kt-size="70" data-kt-line="11" style="display: block; box-sizing: border-box; height: 99.5556px; width: 99.5556px;"></canvas> */
}

function get_chartData(data) {
  if (data != "No data") {
    var total =
      parseInt(data.alerts) +
      parseInt(data.manual_incidents) +
      parseInt(data.problems) +
      parseInt(data.service_request);
    var upd_chart = "";
    var upd_Btn = "";

    upd_chart =
      upd_chart +
      ` <div class="row">

   <div class="col-3">
    <div style="float: left; position: relative;">
    <div
        style="width: 100%; height: 40px; position: absolute; top: 60%; left: 0; 
        margin-top: -20px; line-height:19px; text-align: center;font-size: x-large;
        font-weight: bold;">
        ${total}
    </div>
    <canvas  width="200" height="200" id="demoChart"></canvas>
  
  </div
  
   </div>

   <div class="col-8" style="position: absolute;left: 25%;margin-top: 3%;">
     <div>
      <div class="row">
          <div class="col-3">
              <h6 style="color: deepskyblue;"><span style="background-color:#96c8e1;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: small;">Alerts</span></h6>
          </div>
       
          <div class="col-3">
              <span style=font-weight:bold;font-size: initial;>${data.alerts}</span>
          </div>

      </div><br>
      <div class="row">
          <div class="col-3">
              <h6 style="color: deepskyblue;"><span style="background-color:#22536d;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: small;">Manual Incidents</span></h6>
          </div>
          <div class="col-3">
          <span style=font-weight:bold;font-size: initial;>${data.manual_incidents}</span>
          </div>

      </div><br>
      <div class="row">
      <div class="col-3">
          <h6 style="color: deepskyblue;"><span style="background-color:#fadb5e;width: 0px;
          height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: small;">Service Request</span></h6>
      </div>
      <div class="col-3">
          <span style=font-weight:bold;font-size: initial;>${data.service_request}</span>
      </div>

  </div><br>
      <div class="row">
          <div class="col-3">          
              <h6 style="color: deepskyblue;"><span style="background-color:#6f7580;width: 0px;
              height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span style="font-size: small;">Problems</span></h6>
          </div>
          <div class="col-3">
              <span style=font-weight:bold;font-size: initial;>${data.problems}</span>
          </div>

      </div>
  
   </div>
   </div>
  </div>`;

    $("#floating_chart ").html(upd_chart);

    upd_Btn =
      upd_Btn +
      `
    <a href="#" class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" data-bs-toggle="modal"
    data-bs-target="#model_chart_update" id="create_work_group_request_btn" onclick=upate_counts('${data.alerts}','${data.manual_incidents}','${data.problems}','${data.service_request}','${data.date}','${data.shift}')>Update</a>`;

    $("#hideUpdate ").html(upd_Btn);

    var ctxD = document.getElementById("demoChart").getContext("2d");
    var myLineChart = new Chart(ctxD, {
      type: "doughnut",
      data: {
        // labels: ["Alerts", "Manual Ins", "SRs", "Problem",],
        datasets: [
          {
            data: [
              data.alerts,
              data.manual_incidents,
              data.service_request,
              data.problems,
            ],
            backgroundColor: ["#96c8e1", "#22536d", "#fadb5e", "#6f7580"],
            hoverBackgroundColor: ["#96c8e1", "#22536d", "#fadb5e", "#6f7580"],
          },
        ],
      },
      options: {
        responsive: true,
        cutout:'70%'
      },
    });
  } else {
    data = {
      alerts: "0",
      manual_incidents: "0",
      problems: "0",
      service_request: "0",
    };

    var upd_chart = "";
    var upd_Btn = "";

    upd_chart =
      upd_chart +
      ` <div class="row">
    <div class="col-3">
    

    
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
  </div>`;

    $("#floating_chart ").html(upd_chart);

    upd_Btn =
      upd_Btn +
      `
    <a href="#" class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" data-bs-toggle="modal"
    data-bs-target="#model_chart_update" id="create_work_group_request_btn" onclick=upate_counts('${data.alerts}','${data.manual_incidents}','${data.problems}','${data.service_request}','${data.date}','${data.shift}')>Update</a>`;

    $("#hideUpdate ").html(upd_Btn);

    var ctxD = document.getElementById("demoChart").getContext("2d");
    var myLineChart = new Chart(ctxD, {
      type: "doughnut",
      data: {
        // labels: ["Alerts", "Manual Ins", "SRs", "Problem",],
        datasets: [
          {
            data: [
              data.alerts,
              data.manual_incidents,
              data.service_request,
              data.problems,
            ],
            backgroundColor: ["#96c8e1", "#22536d", "#fadb5e", "#6f7580"],
            hoverBackgroundColor: ["#96c8e1", "#22536d", "#fadb5e", "#6f7580"],
          },
        ],
      },
    });
  }
}

$.ajax({
  method: "GET",
  url: "/shiftpasstool/set_Ticket_count/",
  success: function (data) {
    get_counts(data);
  },
});

function POST_data() {
  var dic = JSON.stringify({
    alerts: $("#floatingAlerts_update").val(),
    manual_incidents: $("#floatingManualIncidents_update").val(),
    problems: $("#floatingProblems_update").val(),
    service_request: $("#floatingServiceRequest_update").val(),
    date: request_data["selected_date"],
    shift: request_data["shift"],
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/set_Ticket_count/",
    method: "POST",
    processData: false,
    data: dic,
  };
  $.ajax(settings).done(function (response) {
    get_all_count();
  });
}

function get_all_count() {
  $.ajax({
    method: "GET",
    url: "/shiftpasstool/set_Ticket_count/",
    success: function (data) {
      get_counts(data);
    },
  });
}

var update_count_ticket = {};
function upate_counts(
  alerts,
  manual_incidents,
  problems,
  service_request,
  date,
  shift
) {
  document.getElementById("floatingAlerts_update").value = alerts;
  document.getElementById("floatingManualIncidents_update").value =
    manual_incidents;
  document.getElementById("floatingProblems_update").value = problems;
  document.getElementById("floatingServiceRequest_update").value =
    service_request;
  update_count_ticket["date"] = request_data["selected_date"];
  update_count_ticket["shift"] = request_data["shift"];
}

$("#submit_button_chart_update").on("click", function (e) {
  if (update_count_ticket["date"] != "undefined") {
    var dic = JSON.stringify({
      alerts: $("#floatingAlerts_update").val(),
      manual_incidents: $("#floatingManualIncidents_update").val(),
      problems: $("#floatingProblems_update").val(),
      service_request: $("#floatingServiceRequest_update").val(),

      date: update_count_ticket["date"],
      shift: update_count_ticket["shift"],
    });
    var csrftoken = getCookie("csrftoken");
    var settings = {
      headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
      async: true,
      crossDomain: false,
      url: "/shiftpasstool/set_Ticket_count/",
      method: "PUT",
      processData: false,
      data: dic,
    };
    $.ajax(settings).done(function (response) {
      get_all_count();
    });
  } else {
    POST_data();
  }
});

// Comment notes

// notes

$("#submit_cmd_btn_notes").on("click", function (e) {});

function get_notes(data) {
  var upd_notes = "";

  var upd_button = "";
  if (Object.keys(data).length > 0) {
    upd_button =
      upd_button +
      `
  

    
    <a href="#" class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" onclick=update_notes_CMD('${data.date}','${data.shift}') >Update</a>
    `;
    upd_notes =
      upd_notes +
      `
  

    <textarea class="form-control" rows="5" cols="40" id="comment_id"
     style="font-size: initial;background: aliceblue;width:85%;margin:auto">${data.notes}</textarea><br><br><br>
    
  `;
    $("#update_notes").html(upd_notes);
    $("#Update_button_comment").html(upd_button);
  } else {
    data = { notes: "", date: "", shift: "" };
    upd_button =
      upd_button +
      `
  
    <a class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" style="margin-left: 5%" onclick=update_notes_CMD('${data.date}','${data.shift}') >Update</a>
    `;
    upd_notes =
      upd_notes +
      `

    <textarea class="form-control" rows="5" cols="40" id="comment_id"
     style="font-size: initial;background: aliceblue;width:85%;margin:auto">${data.notes}</textarea><br><br><br>
  `;
    $("#update_notes").html(upd_notes);
    $("#Update_button_comment").html(upd_button);
  }
  //   Update_button_comment
}

$.ajax({
  method: "GET",
  url: "/shiftpasstool/ticket_comment/",
  success: function (data) {
    get_notes(data);
  },
});

function updateHostList_infra(id) {
  var updateSpaData;
  updateSpaData = reports["infra_data"].filter((e) => e.id == id);

  updateSpaData = updateSpaData[0];
  var upd_host_infra = "";

  var selectStatus = "";

  if (
    updateSpaData.pre_check_status == "Inprogress" ||
    updateSpaData.pre_check_status == "InProgress"
  ) {
    selectStatus =
      selectStatus +
      `
        <option value="New">New</option>
        <option value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `;
  }

  if (updateSpaData.pre_check_status == "Waiting") {
    selectStatus =
      selectStatus +
      `
      <option value="New">New</option>
      <option value="Inprogress">Inprogress</option>
      <option value="Waiting">Waiting</option>
      <option value="Resolved">Resolved</option>
        `;
  }

  if (updateSpaData.pre_check_status == "New") {
    selectStatus =
      selectStatus +
      `
      <option value="New">New</option>
      <option value="Inprogress">Inprogress</option>
      <option value="Waiting">Waiting</option>
      <option value="Resolved">Resolved</option>
        `;
  }

  if (updateSpaData.pre_check_status == "Resolved") {
    selectStatus =
      selectStatus +
      `
      <option value="New">New</option>
      <option value="Inprogress">Inprogress</option>
      <option value="Waiting">Waiting</option>
      <option value="Resolved">Resolved</option>
        `;
  }

  selectvalues=selectvalues + `<option selected value="${updateSpaData.assigned}">${updateSpaData.assigned}</option>`

  upd_host_infra =
    upd_host_infra +
    `

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

<input type="text" class="form-control" id="floatingTid_infra_update"  placeholder="Ticket ID" value="` +
    updateSpaData.ticket_id +
    `">

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


    <div class="row g-9 mb-8">

    <div class="col-md-6 fv-row">
      <label class="required fs-6 fw-bold mb-2">Remarks</label>

      <textarea class="form-control" rows="1" cols="10" id="updatefloatingRemarks_infra" placeholder="Remarks"
          style="font-size: initial;background: aliceblue;">${updateSpaData.remarks}</textarea>

  </div>

    <div class="col-md-6 fv-row">
        <label class="required fs-6 fw-bold mb-2">Assignee</label>
        <select class="form-select form-select-solid" data-control="select2" data-placeholder="Select a Assignee"
            id="updateAssignee_infra" data-dropdown-parent="#updateViewHost_infra">
            <option value="">Select a Assignee...</option>
            ${selectvalues}
        </select>
    </div>

  </div>



    <div class="text-center">
        <button type="reset" onclick="cancelModel()" class="btn btn-light me-3">Cancel</button>
        <button type="button" class="btn btn-primary" data-kt-menu-dismiss="true"
        data-bs-dismiss="modal" id="submit_button_hostList_infra_upd"
        onclick='submit_button_hostList_infra_update("${updateSpaData.planned_start_date}","${updateSpaData.shift}")'>Submit</button>
    </div>
 
</form>

    `;

  $("#modelUpdateHost_infra").html(upd_host_infra);
  $("#updateAssignee_infra").select2();
}

function updateHostList(id) {

  var updatehost_data;
  updatehost_data = reports["Host_data"].filter((e) => e.ID == id);
  updatehost_data = updatehost_data[0];
  var upd_host = "";

  var planType = "";

  var selectRegion = "";

  var selectStatus = "";



  if (updatehost_data.planned_type == "S4H") {
    planType =
      planType +
      `
        <option selected value="S4H">S4H</option>
        <option value="IBP">IBP</option>
        <option value="BYD">BYD</option>
        <option value="C4C">C4C</option>
    `;
  } else if (updatehost_data.planned_type == "IBP") {
    planType =
      planType +
      `
    <option  value="S4H">S4H</option>
    <option selected value="IBP">IBP</option>
    <option value="BYD">BYD</option>
    <option value="C4C">C4C</option>
`;
  } 
  else if (updatehost_data.planned_type == "BYD") {
    planType =
      planType +
      `
    <option  value="S4H">S4H</option>
    <option value="IBP">IBP</option>
    <option selected value="BYD">BYD</option>
    <option value="C4C">C4C</option>
`
  }

  else if (updatehost_data.planned_type == "C4C") {
    planType =
      planType +
      `
    <option  value="S4H">S4H</option>
    <option value="IBP">IBP</option>
    <option value="BYD">BYD</option>
    <option selected value="C4C">C4C</option>
`
  }

  if (updatehost_data.region == "EMEA") {
    selectRegion =
      selectRegion +
      `
    <option selected value="EMEA">EMEA</option>
    <option value="APJ">APJ</option>
    <option value="AMER">AMER</option>
    <option value="MENA">MENA</option>
    <option value="OTHERS">OTHERS</option>
`;
  }

  if (updatehost_data.region == "APJ") {
    selectRegion =
      selectRegion +
      `
        <option value="EMEA">EMEA</option>
        <option selected value="APJ">APJ</option>
        <option value="AMER">AMER</option>
        <option value="MENA">MENA</option>
        <option value="OTHERS">OTHERS</option>
    `;
  }

  if (updatehost_data.region == "AMER") {
    selectRegion =
      selectRegion +
      `
            <option value="EMEA">EMEA</option>
            <option value="APJ">APJ</option>
            <option selected value="AMER">AMER</option>
            <option value="MENA">MENA</option>
            <option value="OTHERS">OTHERS</option>

        `;
  }

  if (updatehost_data.region == "MENA") {
    selectRegion =
      selectRegion +
      `
                <option value="EMEA">EMEA</option>
                <option value="APJ">APJ</option>
                <option value="AMER">AMER</option>
                <option selected value="MENA">MENA</option>
                <option value="OTHERS">OTHERS</option>
            `;
  }

  if (updatehost_data.region == "OTHERS") {
    selectRegion =
      selectRegion +
      `
                    <option value="EMEA">EMEA</option>
                    <option value="APJ">APJ</option>
                    <option value="AMER">AMER</option>
                    <option value="MENA">MENA</option>
                    <option selected value="OTHERS">OTHERS</option>
                `;
  }

  if (
    updatehost_data.pre_check_status == "Inprogress" ||
    updatehost_data.pre_check_status == "InProgress"
  ) {
    selectStatus =
      selectStatus +
      `
      <option value="New">New</option>
      <option value="Inprogress">Inprogress</option>
      <option value="Waiting">Waiting</option>
      <option value="Resolved">Resolved</option>
                        `;
  }

  if (updatehost_data.pre_check_status == "Waiting") {
    selectStatus =
      selectStatus +
      `
      <option value="New">New</option>
      <option value="Inprogress">Inprogress</option>
      <option value="Waiting">Waiting</option>
      <option value="Resolved">Resolved</option>
                        `;
  }

  if (updatehost_data.pre_check_status == "New") {
    selectStatus =
      selectStatus +
      `
      <option value="New">New</option>
      <option value="Inprogress">Inprogress</option>
      <option value="Waiting">Waiting</option>
      <option value="Resolved">Resolved</option>
                        `;
  }

  if (updatehost_data.pre_check_status == "Resolved") {
    selectStatus =
      selectStatus +
      `
      <option value="New">New</option>
      <option value="Inprogress">Inprogress</option>
      <option value="Waiting">Waiting</option>
      <option value="Resolved">Resolved</option>
                        `;
  }

   selectvalues=selectvalues + `<option selected value="${updatehost_data.assigned}">${updatehost_data.assigned}</option>`

 

  upd_host =
    upd_host +
    `
    <form class="form" action="#">

    <div class="mb-13 text-center">

        <h1 class="mb-3">Update Ticket</h1>

        <div class="text-gray-400 fw-bold fs-5">If you need more info, please check
            <a href="" class="fw-bolder link-primary">Support Guidelines</a>.
        </div>

    </div>

    <div class="row g-9 mb-8">
        <div class="col-md-6 fv-row">
            <label class="d-flex align-items-center fs-6 fw-bold mb-2">
                <span class="required">Ticket ID</span>
                <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="Ticket ID"></i>
            </label>

            <input type="text" class="form-control" id="updatefloatingTid" placeholder="Ticket ID" value="` +
    updatehost_data.ticket_id +
    `">
        </div>

        <div class="col-md-6 fv-row">
            <label class="d-flex align-items-center fs-6 fw-bold mb-2">
                <span class="required">CMP Date&Time</span>
                <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="CMP Date&Time"></i>
            </label>

            <input type="text" class="form-control" id="updatefloatingCmpDate" placeholder="CMP Date&Time"
                value="${updatehost_data.floatingCmpDate}">
        </div>

    </div>

    <div class="row g-9 mb-8">

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Planned Type</label>
            <select class="form-select form-select-solid" data-control="select2" data-hide-search="true"
                data-placeholder="Select a Type" id="updatefloatingPlanned">
                ${planType}
            </select>
        </div>

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Region</label>
            <select class="form-select form-select-solid" data-control="select2" data-hide-search="true"
                data-placeholder="Select a Region" id="updatefloatingRegion">
                ${selectRegion}
            </select>

        </div>

    </div>

    <div class="row g-9 mb-8">

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Description</label>

            <textarea class="form-control" rows="3" cols="40" id="updatefloatingSubject" placeholder="Description"
                style="font-size: initial;background: aliceblue;">${updatehost_data.subject}</textarea>

        </div>

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Precheck Status</label>

            <textarea class="form-control" rows="3" cols="40" id="updatefloatingComment" placeholder="Precheck Status"
                style="font-size: initial;background: aliceblue;">${updatehost_data.pre_check_status_text}</textarea>

        </div>

    </div>

    <div class="row g-9 mb-8">
        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">CR ID</label>
            <input type="text" class="form-control" id="updatefloatingCR" placeholder="CR ID" 
            value="` + updatehost_data.cr_id +`">
        </div>

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Remarks</label>

            <textarea class="form-control" rows="1" cols="10" id="updatefloatingRemarks" placeholder="Remarks"
                style="font-size: initial;background: aliceblue;">${updatehost_data.remarks}</textarea>

        </div>

       

    </div>

    <div class="row g-9 mb-8">

        <div class="col-md-6 fv-row">
            <label class="required fs-6 fw-bold mb-2">Assignee</label>
            <select class="form-select form-select-solid" data-control="select2" data-placeholder="Select a Assignee"
                id="updateAssignee" data-dropdown-parent="#updateViewHost">
                <option value="">Select a Assignee...</option>
                ${selectvalues}
            </select>
        </div>

        <div class="col-md-6 fv-row">

            <label class="required fs-6 fw-bold mb-2">Status</label>
            <select class="form-select form-select-solid" data-control="select2" data-hide-search="true"
                data-placeholder="Select a Status" id="updatefloatingHostStatus">
                ${selectStatus}
            </select>


        </div>



    </div>



    <div class="text-center">
        <button type="reset" onclick="cancelModel()" class="btn btn-light">Cancel</button>
        <button type="button" class="btn btn-primary" data-kt-menu-dismiss="true" data-bs-dismiss="modal"
            id="update_button_hostList" onclick='updateHostListData()'>Submit</button>
    </div>

</form>


                    `;

  $("#modelUpdateHost").html(upd_host);
  $("#updateAssignee").select2();
}

function updateHostListData() {
  var Updatedic = JSON.stringify({
    ticket_id: $("#updatefloatingTid").val(),
    region: $("#updatefloatingRegion").val(),
    subject: $("#updatefloatingSubject").val(),
    cr_id: $("#updatefloatingCR").val(),
    cr_approval: $("#updatefloatingHostStatus").val(),
    resource: $("#updatefloatingComment").val(),
    pre_check_status: $("#updatefloatingHostStatus").val(),
    pre_check_status_text: $("#updatefloatingComment").val(),
    planned_type: $("#updatefloatingPlanned").val(),
    floatingCmpDate: $("#updatefloatingCmpDate").val(),
    floatingImplementation: $("#floatingImplementation_update").val(),
    assigned:$("#updateAssignee").val(),
    remarks:$("#updatefloatingRemarks").val(),
    planned_start_date: request_data["selected_date"],
    shift: request_data["shift"],
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/Activity_db/",
    method: "POST",
    processData: false,
    data: Updatedic,
  };

  $.ajax(settings).done(function (data) {
    get_act_datas();
  });
}

function submit_button_hostList_infra_update(planned_start_date, shift) {
  var dic_infra_update = JSON.stringify({
    ticket_id: $("#floatingTid_infra_update").val(),
    subject: $("#floatingSubject_infra_update").val(),
    pre_check_status: $("#floatingHostStatus_infra_update").val(),
    floatingImplementation: $("#floatingImplementation_update").val(),
    remarks: $("#updatefloatingRemarks_infra").val(),
    assigned: $("#updateAssignee_infra").val(),
    planned_start_date: request_data["selected_date"],
    shift: request_data["shift"],
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/sm_infra_activate_obj/",
    method: "POST",
    processData: false,
    data: dic_infra_update,
  };

  $.ajax(settings).done(function (data) {
    get_infra_activate();
  });
}
function alert_messages(dic){
  if (Object.keys(dic).includes('selected_date') && Object.keys(dic).includes('shift')) {
    // do something here
    console.log("pass")
  }else{
    
    // if(data){
      $('#check_alert_changes').modal('show')
      // }
  }

}

function update_notes_CMD(date, shift) {
  
    var dic = JSON.stringify({
      date: request_data["selected_date"],
      shift: request_data["shift"],
      notes: $("#comment_id").val(),
    });

  alert_messages(dic)
  console.log("alert")
  
  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/ticket_comment/",
    method: "POST",
    processData: false,
    data: dic,
  };
  // $.ajax(settings).done(function (response) {});
}

$("#submit_button_hostList").on("click", function (e) {
  var dic = JSON.stringify({
    ticket_id: $("#floatingTid").val(),
    region: $("#floatingRegion").val(),
    subject: $("#floatingSubject").val(),
    cr_id: $("#floatingCR").val(),
    cr_approval: $("#floatingHostStatus").val(),
    resource: $("#floatingComment").val(),
    pre_check_status_text: $("#floatingComment").val(),
    planned_type: $("#floatingPlanned").val(),
    floatingCmpDate: $("#floatingCmpDate").val(),
    pre_check_status: $("#floatingHostStatus").val(),
    assigned: $("#selectEmployee").val(),
    remarks: $("#floatingRemarks").val(),
    planned_start_date: request_data["selected_date"],
    shift: request_data["shift"],
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/Activity_db/",
    method: "POST",
    processData: false,
    data: dic,
  };
  $.ajax(settings).done(function (data) {
    get_act_datas();
  });
});

$("#submit_button_hostList_infra").on("click", function (e) {
  var dic_infra = JSON.stringify({
    ticket_id: $("#floatingTid_infra").val(),
    subject: $("#floatingSubject_infra").val(),
    pre_check_status: $("#floatingHostStatus_infra").val(),
    floatingImplementation: $("#floatingImplementation").val(),
    assigned: $("#selectEmployee_infra").val(),
    remarks: $("#floatingRemarks_infra").val(),
    planned_start_date: request_data["selected_date"],
    shift: request_data["shift"],
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/sm_infra_activate_obj/",
    method: "POST",
    processData: false,
    data: dic_infra,
  };
  $.ajax(settings).done(function (data) {
    get_infra_activate();
  });
});

function closeAlert_popup() {
  var closepopup = "";
  $("#cancelModelView").html(closepopup);
  $("#model_host_list_infra").modal("hide");
  $("#updateViewHost_infra").modal("hide");
  $("#model_host_list").modal("hide");
  $("#updateViewHost").modal("hide");
  $("#model_create_token1").modal("hide");
  $("#updateToken_spa").modal("hide");
  $("#model_create_token").modal("hide");
  $("#updateToken").modal("hide");
}

function closeAlert() {
  var viewAlert = "";
  $("#cancelModelView").html(viewAlert);
}

function cancelModel() {
  var viewAlert = "";
  viewAlert =
    viewAlert +
    `

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
    
    `;
  $("#cancelModelView").html(viewAlert);
}

/* <canvas id="chart_dip" width="112" height="112" data-kt-size="70" data-kt-line="11" style="display: block; box-sizing: border-box; height: 99.5556px; width: 99.5556px;"></canvas> */

function date_time(x) {
  if (x >= 6 && x < 14) {
    return "Morning";
  } else if (x >= 14 && x < 23) {
    return "Afternoon";
  } else if ((x >= 23 && 6 < x) || (x >= 0 && x <= 6)) {
    return "Night";
  }
}

function shiftData() {
  var check=[]
  $.ajax({
    method: "GET",
    url: "today_shift_planer_info_for_tickets/",
    success: function (data) {        
      if (Object.keys(data).length != 0){
      check =data['plan'];
      }else{
        check=[]
      }
      // userData(json_['plan'])
      userData(check)
    },
    error:function(err){
      check =[]
      // userData(json_['plan'])
      userData(check)
    }
    
  });
 
}
function userData(check){
  if (check == []) {
    var json_ = {
      plan: {
        S1: {
          ADHOC_ACTI_SM: [],
          SHIFT_LEAD_SM: [],
        },
        M: {},
        S2: {
          ADHOC_ACTI_SM: [],
        },
        S3: {
          ADHOC_ACTI_SM: [],
        },
        O: {},
      },
      meta: {
        S1: { name: "Morning Shift", time_info: "00:30  - 09:30 UTC" },
        M: { name: "Midnoon Shift", time_info: "06:30 - 15:30 UTC" },
        S2: { name: "Noon Shift", time_info: "00:30  - 09:30 UTC" },
        S3: { name: "Night Shift", time_info: "17:30 - 00:30 UTC" },
        O: { name: "On-Call", time_info: "24:00" },
      },
    };
    check = Object.keys(json_["plan"]);
  }
  else{
    json_ =check
  }
 

  var shiftArray = "";
  var ShiftData = "";
  var shiftName = "";
  var shiftShowData = "";
  var shiftArrayEmp = "";
  var shiftNameEmp = "";
  var ShiftDataEmp = "";
  var shiftShowDataEmp = "";
  var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
    <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
    </svg></span>`;

  var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
     <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
     <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
     </svg></span>`;
  $("#ShiftKanban").html("");
  $("#ShiftKanban1").html("");

  if (request_data != "") {

    if (Object.keys(check).length > 0) {

      Object.keys(check).forEach((e) => {

        if (e == "S1" && request_data.shift == "Morning") {
          if (Object.keys(json_["S1"]).indexOf("SHIFT_LEAD_SM") != -1) {
            shiftArray = json_["S1"]["SHIFT_LEAD_SM"];
            all_dict_send_api["Userdetails_lead"] =
              json_["S1"]["SHIFT_LEAD_SM"];
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          }
          if (Object.keys(json_["S1"]).indexOf("ADHOC_ACTI_SM") != -1) {
            shiftArrayEmp = json_["S1"]["ADHOC_ACTI_SM"];
            all_dict_send_api["Userdetails_employee"] =
              json_["S1"]["ADHOC_ACTI_SM"];
            shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`;
          }
        }
        if (e == "S2" && request_data.shift == "Afternoon") {

          if (Object.keys(json_["S2"]).indexOf("SHIFT_LEAD_SM") != -1) {
            shiftArray = json_["S2"]["SHIFT_LEAD_SM"];
            all_dict_send_api["Userdetails_lead"] =
              json_["S2"]["SHIFT_LEAD_SM"];
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          }
          if (Object.keys(json_["S2"]).indexOf("ADHOC_ACTI_SM") != -1) {
            shiftArrayEmp = json_["S2"]["ADHOC_ACTI_SM"];
            all_dict_send_api["Userdetails_employee"] =
              json_["S2"]["ADHOC_ACTI_SM"];
            shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`;
          }
        }
        if (e == "S3" && request_data.shift == "Night") {
          if (Object.keys(json_["S3"]).indexOf("SHIFT_LEAD_SM") != -1) {
            shiftArray = json_["S3"]["SHIFT_LEAD_SM"];
            all_dict_send_api["Userdetails_lead"] =
              json_["S3"]["SHIFT_LEAD_SM"];
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          }
          if (Object.keys(json_["S3"]).indexOf("ADHOC_ACTI_SM") != -1) {
            shiftArrayEmp = json_["S3"]["ADHOC_ACTI_SM"];
            all_dict_send_api["Userdetails_employee"] =
              json_["S3"]["ADHOC_ACTI_SM"];
            shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`;
          }
        }
      });
    }

    if (shiftArray.length > 0) {
      shiftArray.forEach((e) => {
        ShiftData =
          ShiftData +
          `
            
            <div class="col-3">
               
       
             <div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                   <div class="symbol symbol-60px me-4">
                    <img src="https://avatars.wdf.sap.corp/avatar/` +
          e.inumber +
          `" class="" alt="" />
                </div>
                   <div class="flex-grow-1 me-2">
                       <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">` +
          e.name +
          `</a>
                       <span class="text-gray-400 fw-bold d-block fs-6">` +
          e.inumber +
          `<a target="_blank" href="msteams:/l/chat/0/0?users=` +
          e.email +
          `">` +
          chat_icon +
          `</a><a target="_blank" href="mailto:` +
          e.email +
          `">` +
          msg_icon +
          `</a></span>
                   </div>
               </div>


            </div>
            
            `;
      });
    }

    if (shiftArrayEmp.length > 0) {
      shiftArrayEmp.forEach((e) => {
        ShiftDataEmp =
          ShiftDataEmp +
          `
            
                <div class="col-3">
               
       
                <div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                      <div class="symbol symbol-60px me-4">
                       <img src="https://avatars.wdf.sap.corp/avatar/` +
          e.inumber +
          `" class="" alt="" />
                   </div>
                      <div class="flex-grow-1 me-2">
                          <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">` +
          e.name +
          `</a>
                          <span class="text-gray-400 fw-bold d-block fs-6">` +
          e.inumber +
          `<a target="_blank" href="msteams:/l/chat/0/0?users=` +
          e.email +
          `">` +
          chat_icon +
          `</a><a target="_blank" href="mailto:` +
          e.email +
          `">` +
          msg_icon +
          `</a></span>
                      </div>
                  </div>
   
   
               </div>
            
            `;
      });
    }

    shiftShowData =
      shiftShowData +
      `

<div class="card card-flush">
<div class="row">
    <div class="col">
     
                <h3 class="card-title align-items-start flex-column  pt-5" style="margin-left: 2%;">
                <span class="card-label fw-bolder text-dark">Shift Lead</span>
                </h3>
           
            <div class="card-body">
                <div class="row">
                    ${ShiftData}
                </div>   
            </div>                          
        
    </div>
 
</div>
</div>

`;

    shiftShowDataEmp =
      shiftShowDataEmp +
      `

<div class="card card-flush">
<div class="row">
    <div class="col">
     
                <h3 class="card-title align-items-start flex-column  pt-5" style="margin-left: 2%;">
                <span class="card-label fw-bolder text-dark">Shift Employee</span>
                </h3>
           
            <div class="card-body">
                <div class="row">
                    ${ShiftDataEmp}
                </div><br>   
            </div>                          
        
    </div>
    
</div>
</div>

`;

    $("#ShiftKanban").html(shiftShowData);
    $("#ShiftKanban1").html(shiftShowDataEmp);
  } else {
    var date_ = new Date().getHours();
    var req = date_time(date_);

    if (Object.keys(check).length > 0) {
      Object.keys(check).forEach((e) => {
        if (e == "S1" && req == "Morning") {
          if (Object.keys(json_["S1"]).indexOf("SHIFT_LEAD_SM") != -1) {
            shiftArray = json_["S1"]["SHIFT_LEAD_SM"];
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          }
          if (Object.keys(json_["S1"]).indexOf("ADHOC_ACTI_SM") != -1) {
            shiftArrayEmp = json_["S1"]["ADHOC_ACTI_SM"];
            shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`;
          }
        }
        if (e == "S2" && req == "Afternoon") {
          if (Object.keys(json_["S2"]).indexOf("SHIFT_LEAD_SM") != -1) {
            shiftArray = json_["S2"]["SHIFT_LEAD_SM"];
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          }
          if (Object.keys(json_["S2"]).indexOf("ADHOC_ACTI_SM") != -1) {
            shiftArrayEmp = json_["S2"]["ADHOC_ACTI_SM"];
            shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`;
          }
        }
        if (e == "S3" && req == "Night") {
          if (Object.keys(json_["S3"]).indexOf("SHIFT_LEAD_SM") != -1) {
            shiftArray = json_["S3"]["SHIFT_LEAD_SM"];
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Lead</span>`;
          }
          if (Object.keys(json_["S3"]).indexOf("ADHOC_ACTI_SM") != -1) {
            shiftArrayEmp = json_["S3"]["ADHOC_ACTI_SM"];
            shiftNameEmp = `<span class="card-label fw-bolder text-dark">Shift Employees</span>`;
          } else {
            shiftName = `<span class="card-label fw-bolder text-dark">Shift Employee</span>`;
          }
        }
      });
    }

    if (shiftArray.length > 0) {
      shiftArray.forEach((e) => {
        ShiftData =
          ShiftData +
          `
            
    
                <div class="col-3">
               
       
                <div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                      <div class="symbol symbol-60px me-4">
                       <img src="https://avatars.wdf.sap.corp/avatar/` +
          e.inumber +
          `" class="" alt="" />
                   </div>
                      <div class="flex-grow-1 me-2">
                          <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">` +
          e.name +
          `</a>
                          <span class="text-gray-400 fw-bold d-block fs-6">` +
          e.inumber +
          `<a target="_blank" href="msteams:/l/chat/0/0?users=` +
          e.email +
          `">` +
          chat_icon +
          `</a><a target="_blank" href="mailto:` +
          e.email +
          `">` +
          msg_icon +
          `</a></span>
                      </div>
                  </div>
   
   
               </div>
            
            `;
      });
    }

    if (shiftArrayEmp.length > 0) {
      shiftArrayEmp.forEach((e) => {
        ShiftDataEmp =
          ShiftDataEmp +
          `
            
       
                <div class="col-3">
               
       
                <div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                      <div class="symbol symbol-60px me-4">
                       <img src="https://avatars.wdf.sap.corp/avatar/` +
          e.inumber +
          `" class="" alt="" />
                   </div>
                      <div class="flex-grow-1 me-2">
                          <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">` +
          e.name +
          `</a>
                          <span class="text-gray-400 fw-bold d-block fs-6">` +
          e.inumber +
          `<a target="_blank" href="msteams:/l/chat/0/0?users=` +
          e.email +
          `">` +
          chat_icon +
          `</a><a target="_blank" href="mailto:` +
          e.email +
          `">` +
          msg_icon +
          `</a></span>
                      </div>
                  </div>
   
   
               </div>
            
            `;
      });
    }

    shiftShowData =
      shiftShowData +
      `

<div class="card card-flush">
<div class="row">
    <div class="col">
     
                <h3 class="card-title align-items-start flex-column  pt-5" style="margin-left: 2%;">
                <span class="card-label fw-bolder text-dark">Shift Lead</span>
                </h3>
           
            <div class="card-body">
                <div class="row">
                    ${ShiftData}
                </div>   
            </div>                          
        
    </div>
 
</div>
</div>

`;

    shiftShowDataEmp =
      shiftShowDataEmp +
      `

<div class="card card-flush">
<div class="row">
    <div class="col">
     
                <h3 class="card-title align-items-start flex-column  pt-5"style="margin-left: 2%;">
                <span class="card-label fw-bolder text-dark">Shift Employee</span>
                </h3>
           
            <div class="card-body">
                <div class="row">
                    ${ShiftDataEmp}
                </div><br>   
            </div>                          
        
    </div>
 
</div>
</div>

`;

    $("#ShiftKanban").html(shiftShowData);
    $("#ShiftKanban1").html(shiftShowDataEmp);
  }
}


// $(document).ready(function () {
  
// });

