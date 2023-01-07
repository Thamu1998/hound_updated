$(document).on('click', '.dc_btn', function () {
    
    var dc = $(this).attr('dc_name');

    $('#dc_cmd').val(dc);
    
    $.ajax({
      method: "GET",
      url: `/uptime/view/comment?DC=`+dc,
      success: function(data){
        if(data.length > 0){

          generate_dc_down_comment(data[0]);
          
        }
        else{

          $('#dc_down_comment').html("");

        }
      },
      error: function(error_data){
        
        console.log(error_data);

      }
    });

    $.ajax({
      method: "GET",
      url: `/uptime/get/down/dc/info?dc=`+dc,
      success: function(data){
        generate_dc_down_info(data, dc)
      },
      error: function(error_data){
        
        console.log(error_data);

      }
    });

});

function generate_dc_down_comment(props){

  $('#dc_down_comment').html("");
  
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

  $('#dc_down_comment').html(system_down_comment);

};

function generate_dc_down_info(data, dc) {

  var dc_info_tr = "";

  $('#dc_down_view_btn_div').html(`<a href="#" DC="`+dc+`" target="_blank" href="#" class="btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary acknowledge_dc_btn">Acknowledge `+dc+`</a>`)

  data.data.forEach(function(item, index) {
    dc_info_tr += `<tr align="center"><td width="10%">`+item.db+`</td><td>`+item.up+`</td><td>`+item.down+`</td></tr>`
  });

  var dc_info_body = `<div class="col-xl-12">
                      <table class="table table-rounded border table-row-dashed gy-2 gs-2">
                        <thead>
                            <tr class="fw-bold fs-6 text-gray-800 border-bottom border-gray-200" align="center">
                                <th width="10px">Database</th>
                                <th>Tenants in UP status</th>
                                <th>Tenants in DOWN status</th>
                            </tr>
                        </thead>
                        <tbody>
                            `+dc_info_tr+`
                        </tbody>
                      </table>
                    </div>`;
    
  var dc_info = `<div class="col-md-6 col-lg-6 col-xl-6 col-xxl-12 card-rounded h-lg-100 border-primary border-dotted" id="system_type_div">
                    <div class="card card-rounded h-lg-100 border-primary border-dotted">
                        <div class="card-header pt-2">
                            <h3 class="card-title align-items-start flex-column">
                                <span class="card-label fw-bolder text-dark">`+dc+`</span>
                            </h3>
                        </div>
                        <div class="card-body pt-5">

                        <div class="d-flex flex-stack">
                                <div class="text-gray-700 fw-bold fs-6 me-2">Location</div>
                                <div class="d-flex align-items-senter">
                                    <span class="text-gray-900 fw-boldest fs-6">`+data.details.name+`</span>
                                </div>
                            </div>
                            <div class="separator separator-dashed border-primary my-3"></div>

                        <div class="d-flex flex-stack">
                                <div class="text-gray-700 fw-bold fs-6 me-2">CMP ID</div>
                                <div class="d-flex align-items-senter">
                                    <span class="text-gray-900 fw-boldest fs-6">`+data.details.cmp_id+`</span>
                                </div>
                            </div>
                            <div class="separator separator-dashed border-primary my-3"></div>
                        
                        <div class="d-flex flex-stack">
                                <div class="text-gray-700 fw-bold fs-6 me-2">CMP Time</div>
                                <div class="d-flex align-items-senter">
                                    <span class="text-gray-900 fw-boldest fs-7">`+data.details.cmp_time+`</span>
                                </div>
                            </div>
                            <div class="separator separator-dashed border-primary my-3"></div>

                        <div class="d-flex flex-stack">
                                <div class="text-gray-700 fw-bold fs-6 me-2">Intra</div>
                                <div class="d-flex align-items-senter">
                                    <span class="text-gray-900 fw-boldest fs-6">`+data.details.infra+`</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

  $('#dc_info_table').html(dc_info_body);
  $('#dc_info_card').html(dc_info);
}