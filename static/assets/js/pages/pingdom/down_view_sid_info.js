$(document).on('click', '.sid_btn', function () {
    
    var system_number = $(this).attr('system_number');

    var db_sid = $(this).attr('db_sid');

    var sid = $(this).attr('sid');

    var dc = $(this).attr('dc');

    $('#sid_cmd').val(sid);

    $.ajax({
        method: "GET",
        url: `/cld/api/system/list/`+system_number+`/`,
        success: function(data){

          generate_dom_down_system_info(data)
        },
        error: function(error_data){
          
          $('#system_info_table').html("");
        }
    });

    $.ajax({
      method: "GET",
      url: `/cld/api/host/list/?SID__SID_flt=`+sid+`;`+db_sid+`&InstanceType_flt!=DBC&SID__LifeCycleStatus_flt=L;UPG`,
      success: function(data){
        generate_dom_down_host_info(data)
      },
      error: function(error_data){
        
        console.log(error_data);
      }
    });
    
    $.ajax({
      method: "GET",
      url: `/pingdom/view/comment?SID=`+sid,
      success: function(data){
        if(data.length > 0){

          generate_system_down_comment(data[0]);
          
        }
        else{

          $('#system_down_comment').html("");

        }
      },
      error: function(error_data){
        
        console.log(error_data);
        $('#system_down_comment').html("");
      }
    });

    $.ajax({
      method: "GET",
      url: `/pingdom/acknowledge/downtime/system?SID=`+sid,
      success: function(data){
        generate_acknowledge_btn(data);
      },
      error: function(error_data){
        
        console.log(error_data);

      }
    });

});

function generate_acknowledge_btn(data){
  
  var acknowledgement_btn = "";

  if (data.is_acknowledged == false){
    
    acknowledgement_btn = `<a href="#" sid="`+data.SID+`" target="_blank" href="#" class="btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary acknowledge_btn">Acknowledge `+data.SID+`</a>`
  }
  else if (data.is_acknowledged == true){
    acknowledgement_btn = `<a class="btn btn-success">Acknowledged &nbsp;<i class="bi bi-check-circle-fill fs-4"></i></a>`
  }

  $('#sys_view_btn_div').html(acknowledgement_btn);
}

function generate_dom_down_host_info(host_info){

  $('#host_info_table').html("");

  var host_table_body = "";

  host_info.results.forEach(function(item){
    host_table_body += `<tr align="center"><td>`+item.HostName+`</td><td>`+item.InstanceType+`</td><td>`+item.ComputerSystemResourcePool+`</td></tr>`
  });

  if (host_info.results.length > 0) {

    var host_info = `<div class="col-xl-12">
                        <table class="table table-rounded border table-row-dashed gy-2 gs-2">
                          <thead>
                              <tr class="fw-bold fs-6 text-gray-800 border-bottom border-gray-200" align="center">
                                <th colspan="3"> Host Details</th>
                              </tr>
                              <tr class="fw-bold fs-6 text-gray-800 border-bottom border-gray-200" align="center">
                                  <th>Hostname</th>
                                  <th>Type</th>
                                  <th>Resource Pool</th>
                              </tr>
                          </thead>
                          <tbody>
                              `+host_table_body+`
                          </tbody>
                        </table>
                      </div>`;
  }

  $('#host_info_table').html(host_info)

}

function generate_system_down_comment(props){

  $('#system_down_comment').html("");
  
  var system_down_comment = `<div class="alert alert-primary">
                                <div class="d-flex flex-column">
                                  <h4 class="mb-5 text-dark">Comments:</h4>
                                  <span>`+props.comment+`</span>
                                  <blockquote class="blockquote mt-10 mb-1">
                                    <footer class="blockquote-footer">`+props.comment_by_id__first_name+` `+props.comment_by_id__last_name+`</footer>
                                  </blockquote>
                                  <p class="mt-1 1rem mb-0" style="font-">Valid Till: <cite title="Source Title" class="float-left">`+convert_date(props.expry_date)+`</cite></p>
                                </div>
                              </div>`

  $('#system_down_comment').html(system_down_comment);

}

function generate_dom_down_system_info(system_info){

  $('#sys_view_btn_div').html("");

  var hostname = "spc.ondemand.com";

  var vlab_hostname = ['s4vlabhound.rot.s4h.sap.corp', 'ibpvlabhound.rot.s4h.sap.corp']

  if (window.location.hostname in vlab_hostname){
    hostname = "spc-vlab.ondemand.com"
  };

  var SID = system_info.SID;

  var DB_SID = system_info.DBSystemID;
  
  if (system_info.ApplicationHAType != "NA"){
    
      SID = `<a target="_blank" href="https://argus.s4-monitoring.c.eu-de-2.cloud.sap/d/M5EGtNSnk/ha2-0-aegis?orgId=1&var-sid=`+system_info.SID+`&var-hostname=All" class="text-dark fw-bolder text-hover-primary d-block fs-6">`+system_info.SID+`</a>
            <span class="text-muted fw-bold text-muted d-block fs-7">Grafana Link</span>`;
      
      DB_SID = `<a target="_blank" href="https://argus.s4-monitoring.c.eu-de-2.cloud.sap/d/M5EGtNSnk/ha2-0-aegis?orgId=1&var-sid=`+system_info.DBSystemID+`&var-hostname=All" class="text-dark fw-bolder text-hover-primary d-block fs-6">`+system_info.DBSystemID+`</a>
            <span class="text-muted fw-bold text-muted d-block fs-7">Grafana Link</span>`;
  }

  var system_info = `<table class="table table-rounded border table-row-dashed gy-7 gs-7">
                                <thead>
                                    <tr class="fw-bold fs-6 text-gray-800 border-bottom border-gray-200" style="text-align: center;">
                                        <th>System Number</th>
                                        <th>SID</th>
                                        <th>DB System ID</th>
                                        <th>BusinessType</th>
                                        <th>Customer Name</th>
                                        <th>Main URL</th>
                                        <th>Life Cycle Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="text-align: center;" class="fw-bolder fs-6 text-gray-800">
                                    <td><a href="https://`+hostname+`/open?SYS=000000000`+system_info.SystemNumber+`" target="_blank">`+system_info.SystemNumber+`</a></td>
                                    <td>`+SID+`</td>
                                    <td>`+DB_SID+`</td>
                                    <td>`+system_info.BusinessType+`</td>
                                    <td>`+system_info.CustomerName+`</td>
                                    <td><a href="https://`+system_info.CustomerTenantMainURL+`" target="_blank">`+system_info.CustomerTenantMainURL+`</td>
                                    <td>`+system_info.LifeCycleStatus+`</td>
                                  </tr>
                                </tbody>
                      </table>`;
  
$('#system_info_table').html(system_info);

};