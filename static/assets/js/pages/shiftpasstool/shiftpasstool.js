var request_data = {};

$("#kt_date").flatpickr({
  enableTime: true,
  dateFormat: "Y-m-dTH:i",
});

// 




$("#submit_btn").on("click", function (e) {
  var shiftpass = {};

  // Send the JSON object to the other script

  var shift = $("#Shift_dropdown").val();

  var selected_date = $("#kt_date").val();
  var end_date_start = $("#kt_date").data("daterangepicker");

  var end_date_end = $("#kt_date").data("daterangepicker");

  request_data = { shift: shift, selected_date: selected_date };

  shiftpass["shift_date"] = request_data;

  // collect_dict(request_data)
  $.ajax({
    method: "GET",
    url:
      "/shiftpasstool/outage_get_api/?shift=" +
      shift +
      "&created_date=" +
      selected_date +
      "",
    success: function (data) {
      generate_change_request_list_dom(data);
      shiftpass["outage_get"] = data;
    },
    error: function (xhr, status, error) {},
  });

  /// SPC TICKET
  $.ajax({
    method: "GET",
    url:
      "/shiftpasstool/post_tracking/?shift=" +
      shift +
      "&created_date=" +
      selected_date +
      "",
    success: function (data) {
      generate_change_request_list_SPC(data);
      shiftpass["follow_up"] = data;
    },
    error: function (xhr, status, error) {},
  });
  setTimeout(() => {
    broadcast_data_transforming(shiftpass);
  }, 3000);
});

// POST outage
function broadcast_data_transforming(newdata) {
  window.postMessage(newdata, "*");
}

$("#submit_button").on("click", function (e) {
  var floatingShift = request_data["shift"];
  var floatingdate = request_data["selected_date"];
  var floatingTicket = $("#floatingTicket").val();
  var floatingCause = $("#floatingCause").val();
  var floatingCustomerImp = $("#floatingCustomerImp").val();
  var floatingActionReq = $("#floatingActionReq").val();
  var floatingStatus = $("#floatingStatus").val();
  var date = request_data["selected_date"];
  data = JSON.stringify({
    Ticket_ID: floatingTicket,
    Subject: floatingCause,
    customer_impact: floatingCustomerImp,
    Action_Required: floatingActionReq,
    created_date: floatingdate,
    shift: floatingShift,
    Status: floatingStatus,
    start_time: date,
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/post_api/",
    method: "POST",
    processData: false,

    data: data,
  };
  $.ajax(settings).done(function (response) {
    getoutageData();
  });
});

$.ajax({
  method: "GET",
  url: "/shiftpasstool/outage_get_api/",
  success: function (data) {
    generate_change_request_list_dom(data);
  },
});

function getoutageData() {
  $.ajax({
    method: "GET",
    url: "/shiftpasstool/outage_get_api/",
    success: function (data) {
      generate_change_request_list_dom(data);
    },
  });
}

outage_report = {};

function generate_change_request_list_dom(data) {
  var team_options = "";
  var color = "";
  var statusHide = "";
  var textData = "";
  var custom_impact = "";
  var ActionRequired = "";

  outage_report["outage_data"] = data["report"];
  if (data["report"]) {
    if (data["report"].length != 0) {
      data["report"].forEach(function (item) {
        var timeZone = data["timezones"].filter(
          (e) => e.Ticket_ID == item.Ticket_ID
        );
        timeZone = JSON.stringify(timeZone);

        subject = item.Subject.replace(/'/g, "&quot;");

        if (item.Status == "Resolved") {
          color =
            `<span class='badge badge-light-success fs-8 fw-bolder'style="font-size: small !important;">` +
            item.Status +
            `</span> `;
          statusHide = "";
        } else if (item.Status == "Waiting") {
          color =
            `<span class='badge badge-light-danger fs-8 fw-bolder'style="font-size: small !important;">` +
            item.Status +
            `</span> `;
          statusHide = `  <a href=""   onClick='update("${item.ID}")' data-bs-toggle="modal" data-bs-target="#updateToken" 
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update</a>`;
        } else if (item.Status == "Inprogress" || item.Status == "InProgress") {
          color =
            `<span class='badge badge-light-warning fs-8 fw-bolder'style="font-size: small !important;">` +
            item.Status +
            `</span> `;
          statusHide = `   <a href=""   onClick='update("${item.ID}")' data-bs-toggle="modal" data-bs-target="#updateToken" 
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update</a>`;
        } else if (item.Status == "New") {
          color =
            `<span class='badge badge-light-primary fs-8 fw-bolder'style="font-size: small !important;">` +
            item.Status +
            `</span> `;
          statusHide = `  <a href=""   onClick='update("${item.ID}")' data-bs-toggle="modal" data-bs-target="#updateToken" 
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update</a>`;
        }

        if (item.Subject.length > 200) {
          textData =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Subject +
            `</label>
            </div>
                `;
        } else if (item.Subject.length > 100) {
          textData =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Subject +
            `</label>
            </div>
                `;
        } else {
          textData =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Subject +
            `</label>
                </div>`;
        }

        if (item.customer_impact.length > 100) {
          custom_impact =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.customer_impact +
            `</label>
            </div>`;
        } else {
          custom_impact =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.customer_impact +
            `</label>
                </div>`;
        }
        // Action_Required
        if (item.Action_Required.length > 100) {
          ActionRequired =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Action_Required +
            `</label>
            </div>`;
        } else {
          ActionRequired =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Action_Required +
            `</label>
                </div>`;
        }

        team_options =
          team_options +
          `<tr>
            
                <td  id=` +
          item.ID +
          `>
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">` +
          item.Ticket_ID +
          `</label>
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
                        ` +
          color +
          `

                    </div>
                </td>

                <td style="text-align: center;">
                   ${statusHide}

            
                    
                </td>
                
            </tr>
            
            `;
      });
    } else {
      team_options =
        team_options +
        `
            <h3 style="text-align:center">No data found</h3>
        `;
    }
  } else {
    team_options =
      team_options +
      `
            <h3 style="text-align:center">No data found</h3>
        `;
  }

  $("#swap_request_from_tbody_outages").html(team_options);
}

function update(ID) {
  var UpdateData = outage_report["outage_data"].filter((e) => e.ID == ID);

  UpdateData = UpdateData[0];

  var upd = "";

  var statusFill = "";

  if (UpdateData["Status"] == "New") {
    statusFill =
      statusFill +
      `
        <option selected value="New">New</option>
        <option value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `;
  } else if (UpdateData["Status"] == "Inprogress") {
    statusFill =
      statusFill +
      `
        <option  value="New">New</option>
        <option selected value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `;
  } else if (UpdateData["Status"] == "Waiting") {
    statusFill =
      statusFill +
      `
        <option  value="New">New</option>
        <option  value="Inprogress">Inprogress</option>
        <option selected value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `;
  } else if (UpdateData["Status"] == "Resolved") {
    statusFill =
      statusFill +
      `
        <option  value="New">New</option>
        <option  value="Inprogress">Inprogress</option>
        <option  value="Waiting">Waiting</option>
        <option selected value="Resolved">Resolved</option>
        `;
  }

  upd =
    upd +
    `
          
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

        <input type="text" class="form-control" id="updateTicket" placeholder="Ticket Id" value="` +
    UpdateData.Ticket_ID +
    `">
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


                    `;

  $("#floatingTickets").html(upd);
}

function update_ticket(created_date, shift) {
  $("#modal").modal("toggle");

  var Ticket_ID = $("#updateTicket").val();

  var Subject = $("#updateCause").val();

  var customer_impact = $("#updateCustomerImp").val();
  var Action_Required = $("#updateActionReq").val();
  var status = $("#updateStatus").val();
  var data = JSON.stringify({
    Ticket_ID: Ticket_ID,
    Subject: Subject,
    customer_impact: customer_impact,
    Action_Required: Action_Required,
    Status: status,
    created_date: request_data["selected_date"],
    shift: request_data["shift"],
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/post_api/",
    method: "PUT",
    processData: false,

    data: data,
  };
  $.ajax(settings).done(function (response) {
    getoutageData();
  });
}

$("#update_button").on("click", function (e) {
  var updateTicket = $("#updateTicket").val();

  var updateCause = $("#updateCause").val();

  var updateCustomerImp = $("#updateCustomerImp").val();
  var updateActionReq = $("#updateActionReq").val();
  var updateStatus = $("#updateStatus").val();

  var data = JSON.stringify({
    Status: updateStatus,
  });

  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/post_api/",
    method: "PUT",
    processData: false,

    data: data,
  };
  $ajax(settings).done(function (response) {
    getspcData();
  });
});

/// SPC TICKET

$.ajax({
  method: "GET",
  url: "/shiftpasstool/post_tracking/",
  success: function (data) {
    generate_change_request_list_SPC(data);
  },
});

function generate_change_request_list_SPC(data) {
  var team_options1 = "";
  var resData = data;
  var color = "";
  var statusHide = "";
  var textData = "";
  var Action_Taken = "";
  var Action_Required = "";

  outage_report["SPC_data"] = data["new_data1"];
  if (data["new_data1"]) {
    if (data["new_data1"].length != 0) {
      data["new_data1"].forEach(function (item) {
        var timeZone = data["new_data2"].filter(
          (e) => e.Ticket_ID == item.Ticket_ID
        );
        timeZone = JSON.stringify(timeZone);

        if (item.Status == "Resolved") {
          color =
            `<span class='badge badge-light-success fs-8 fw-bolder'style="font-size: small !important;">` +
            item.Status +
            `</span> `;
          statusHide = "";
        } else if (item.Status == "Waiting") {
          color =
            `<span class='badge badge-light-danger fs-8 fw-bolder'style="font-size: small !important;">` +
            item.Status +
            `</span> `;
          statusHide = `     <a href=""   onClick='update_spa("${item.ID}")'  data-bs-toggle="modal" data-bs-target="#updateToken_spa"
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update  </a>`;
        } else if (item.Status == "Inprogress" || item.Status == "InProgress") {
          color =
            `<span class='badge badge-light-warning fs-8 fw-bolder'style="font-size: small !important;">` +
            item.Status +
            `</span> `;
          statusHide = `     <a href=""   onClick='update_spa("${item.ID}")'  data-bs-toggle="modal" data-bs-target="#updateToken_spa"
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update  </a>`;
        } else if (item.Status == "New") {
          color =
            `<span class='badge badge-light-primary fs-8 fw-bolder'style="font-size: small !important;">` +
            item.Status +
            `</span> `;
          statusHide = `    <a href=""   onClick='update_spa("${item.ID}")'  data-bs-toggle="modal" data-bs-target="#updateToken_spa"
                class="btn btn-sm btn-flex btn-primary btn-active-primary fw-bolder" >Update  </a>`;
        }

        if (item.Subject.length > 200) {
          textData =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:1000px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Subject +
            `</label>
            </div>`;
        } else if (item.Subject.length > 100) {
          textData =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Subject +
            `</label>
            </div>`;
        } else {
          textData =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Subject +
            `</label>
            </div>`;
        }

        // Action_Taken
        if (item.Action_Taken.length > 100) {
          Action_Taken =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Action_Taken +
            `</label>
            </div>`;
        } else {
          Action_Taken =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Action_Taken +
            `</label>
            </div>`;
        }
        // Action_Required
        if (item.Action_Required.length > 100) {
          Action_Required =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:700px">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Action_Required +
            `</label>
            </div>`;
        } else {
          Action_Required =
            `
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                <label style="font-size: small;" class="text-muted fw-bold d-block">` +
            item.Action_Required +
            `</label>
            </div>`;
        }
        team_options1 =
          team_options1 +
          `<tr>
                <td id=` +
          item.ID +
          `>
                    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
                        <label style="font-size: small;" class="text-muted fw-bold d-block">` +
          item.Ticket_ID +
          `</label>
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
                       ` +
          color +
          `
                    </div>
                </td>
                
                <td style="text-align: center;">

                    ${statusHide}

                 


  
                    
                </td>
                
            </tr>
            
            `;
      });
    } else {
      team_options1 =
        team_options1 +
        `
            <h3>No data found</h3>
            `;
    }
  } else {
    team_options1 =
      team_options1 +
      `
            <h3>No data found</h3>
            `;
  }
  $("#swap_request_from_tbody").html(team_options1);
}

$("#submit_button_spc").on("click", function (e) {
  var floatingShift = request_data["shift"];
  var floatingdate = request_data["selected_date"];
  var floatingTicket = $("#floatingTicket_spc").val();
  var floatingCause = $("#floatingCause_spc").val();
  var floatingCustomerImp = $("#floatingCustomerImp_spc").val();
  var floatingActionReq = $("#floatingActionReq_spc").val();
  var floatingStatus = $("#floatingStatus_spc").val();
  data = JSON.stringify({
    Ticket_ID: floatingTicket,
    Subject: floatingCause,
    Action_Taken: floatingCustomerImp,
    Action_Required: floatingActionReq,
    created_date: floatingdate,
    shift: floatingShift,
    Status: floatingStatus,
    start_time: floatingdate,
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/post_tracking/",
    method: "POST",
    processData: false,
    data: data,
  };
  $.ajax(settings).done(function (response) {
    getspcData();
  });
});

function getspcData() {
  $.ajax({
    method: "GET",
    url: "/shiftpasstool/post_tracking/",
    success: function (data) {
      generate_change_request_list_SPC(data);
    },
  });
}

function view_spa(
  ID,
  Ticket_ID,
  Subject,
  Action_Taken,
  Action_Required,
  Status,
  created_date,
  shift,
  timezones
) {
  var color = "";
  var porgressBar = "";

  var endDate = timezones.filter((e) => e.end_date != null);
  if (endDate.length != 0) {
    endDate = endDate[0]["end_date"];
  }

  if (Status == "Resolved") {
    color =
      `<span class='badge badge-light-success fs-8 fw-bolder'style="font-size: large !important;">` +
      Status +
      `</span> `;
    porgressBar = `<div class="progress-bar bg-success" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>`;
  } else if (Status == "Waiting") {
    color =
      `<span class='badge badge-light-danger fs-8 fw-bolder'style="font-size: large !important;">` +
      Status +
      `</span> `;
    porgressBar = `<div class="progress-bar bg-danger" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>`;
  } else if (Status == "Inprogress") {
    color =
      `<span class='badge badge-light-warning fs-8 fw-bolder'style="font-size: large !important;">` +
      Status +
      `</span> `;
    porgressBar = `<div class="progress-bar bg-warning" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>`;
  } else if (Status == "New") {
    color =
      `<span class='badge badge-light-primary fs-8 fw-bolder'style="font-size: large !important;">` +
      Status +
      `</span> `;

    porgressBar = `<div class="progress-bar bg-primary" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>`;
  }

  var view_spaDetails = "";
  view_spaDetails =
    view_spaDetails +
    `
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
    <td>` +
    Ticket_ID +
    `</td>
    <td>
    <div class="progress" style="height: 20px;">
    ` +
    porgressBar +
    `
    </div>
    </td>
    <td>` +
    color +
    `</td>
    <td>` +
    created_date +
    ` </td>
    <td>` +
    endDate +
    ` </td>
    </tr>
    
    </tbody>
   
</table>
    `;
  $("#viewTickets_spa").html(view_spaDetails);
}

function view_outage(
  ID,
  Ticket_ID,
  Subject,
  Action_Taken,
  Action_Required,
  Status,
  created_date,
  shift,
  timezones
) {
  var color = "";
  var porgressBar = "";

  var endDate = timezones.filter((e) => e.end_date != null);
  if (endDate.length != 0) {
    endDate = endDate[0]["end_date"];
  }

  if (Status == "Resolved") {
    color =
      `<span class='badge badge-light-success fs-8 fw-bolder'style="font-size: large !important;">` +
      Status +
      `</span> `;
    porgressBar = `<div class="progress-bar bg-success" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>`;
  } else if (Status == "Waiting") {
    color =
      `<span class='badge badge-light-danger fs-8 fw-bolder'style="font-size: large !important;">` +
      Status +
      `</span> `;
    porgressBar = `<div class="progress-bar bg-danger" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>`;
  } else if (Status == "Inprogress") {
    color =
      `<span class='badge badge-light-warning fs-8 fw-bolder'style="font-size: large !important;">` +
      Status +
      `</span> `;
    porgressBar = `<div class="progress-bar bg-warning" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>`;
  } else if (Status == "New") {
    color =
      `<span class='badge badge-light-primary fs-8 fw-bolder'style="font-size: large !important;">` +
      Status +
      `</span> `;

    porgressBar = `<div class="progress-bar bg-primary" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>`;
  }

  var view_outageDetails = "";
  view_outageDetails =
    view_outageDetails +
    `
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
     <td>` +
    Ticket_ID +
    `</td>
     <td>
     <div class="progress" style="height: 20px;">
        ` +
    porgressBar +
    `
   </div>
     </td>
     <td>` +
    color +
    `</td>
     <td>` +
    created_date +
    ` </td>
     <td>` +
    endDate +
    ` </td>
     </tr>
     
     </tbody>
    
 </table>
     `;
  $("#viewTickets_outages").html(view_outageDetails);
}

function update_spa(ID) {
  var updateSpaData;

  updateSpaData = outage_report["SPC_data"].filter((e) => e.ID == ID);

  updateSpaData = updateSpaData[0];

  var upd_spa = "";

  var statusFill = "";

  if (updateSpaData["Status"] == "New") {
    statusFill =
      statusFill +
      `
        <option selected value="New">New</option>
        <option value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `;
  } else if (updateSpaData["Status"] == "Inprogress") {
    statusFill =
      statusFill +
      `
        <option  value="New">New</option>
        <option selected value="Inprogress">Inprogress</option>
        <option value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `;
  } else if (updateSpaData["Status"] == "Waiting") {
    statusFill =
      statusFill +
      `
        <option  value="New">New</option>
        <option  value="Inprogress">Inprogress</option>
        <option selected value="Waiting">Waiting</option>
        <option value="Resolved">Resolved</option>
        `;
  } else if (updateSpaData["Status"] == "Resolved") {
    statusFill =
      statusFill +
      `
        <option  value="New">New</option>
        <option  value="Inprogress">Inprogress</option>
        <option  value="Waiting">Waiting</option>
        <option selected value="Resolved">Resolved</option>
        `;
  }

  upd_spa =
    upd_spa +
    `
          
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

        <input type="text" class="form-control" id="updateTicket_spa" placeholder="Ticket Id" value="` +
    updateSpaData.Ticket_ID +
    `">
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

                    `;
  $("#floatingTickets_spa ").html(upd_spa);
}

function update_ticket_spa(created_date, shift) {
  var Ticket_ID = $("#updateTicket_spa").val();

  var Subject = $("#updateCause_spa").val();

  var customer_impact = $("#updateCustomerImp_spa").val();
  var Action_Required = $("#updateActionReq_spa").val();
  var status = $("#updateStatus_spa").val();
  var data = JSON.stringify({
    Ticket_ID: Ticket_ID,
    Subject: Subject,
    Action_Taken: customer_impact,
    Action_Required: Action_Required,
    Status: status,
    created_date: request_data["selected_date"],
    shift: request_data["shift"],
  });

  var csrftoken = getCookie("csrftoken");
  var settings = {
    headers: { "X-CSRFToken": csrftoken, "Content-Type": "application/json" },
    async: true,
    crossDomain: false,
    url: "/shiftpasstool/update_tracking/",
    method: "PUT",
    processData: false,
    data: data,
  };
  $.ajax(settings).done(function (response) {
    getspcData();
  });
}
