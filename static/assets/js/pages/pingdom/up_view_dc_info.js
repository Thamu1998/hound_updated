$(document).on('click', '.dc_card_up', function (e) {

    e.preventDefault();

    var dc = $(this).attr('id');

    $('#dc_up_overview_title_h5').html("Overview - "+dc)

    if (dc == "ALL") {
        var endpoint = '/pingdom/get/dc/info';
    }
    else{
        var endpoint = `/pingdom/get/dc/info?DataCenter=`+dc;
    }
    
    var paused_system = [];
        
    $.ajax({
        method: "GET",
        url: endpoint,
        success: function(data){
            paused_system = data
            generate_dc_info_dom();
        },
        error: function(error_data){
            console.log("object");
            generate_permissions_denied_dom();
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function generate_permissions_denied_dom() {

        var card = `<div class="text-center m-5">
                        <h3 class="fs-1 fw-bolder">You don't have permission to access this
                        <span class="d-inline-block position-relative ms-2">
                            <span class="d-inline-block mb-2">resource</span>
                            <span class="d-inline-block position-absolute h-5px bottom-0 end-0 start-0 bg-danger translate rounded"></span>
                        </span></h3>
                    </div>`;
        
        $('#dc_info_up_body').html(card)

    }

    function generate_dc_info_dom() {
        
        $('#dc_info_up_body').html("")

        var paused_system_table_body = "";

        if (dc == "ALL") {
            var sys_view_url = `/cld/system?LifeCycleStatus=L&SystemRole__icontains!=_HANA&CustomerID!=%22%22&BusinessType=ZH001;ZH006`;
        }
        else{
            var sys_view_url = `/cld/system?LifeCycleStatus=L&DataCenterID=`+dc+`&SystemRole__icontains!=_HANA&CustomerID!=%22%22&BusinessType=ZH001;ZH006`;
        }
        
        paused_system.paused_systems.forEach(function(system_info){
            paused_system_table_body += `<tr style="text-align: center;">
                                         <td>`+system_info.SID+`</td>
                                         <td>`+system_info.DBSystemID+`</td>
                                         <td>`+system_info.BusinessType+`</td>
                                         <td>`+system_info.CustomerName+`</td>
                                         <td><a href="https://`+system_info.hostname+`">`+system_info.hostname+`</td>
                                         <td>`+system_info.LifeCycleStatus+`</td>
                                        </tr>`
        });
        
        var sys_typ_card = "";

        paused_system.system_type_details.forEach(function(item, index){
            
            sys_typ_card += `<div class="d-flex flex-stack">
                                <div class="text-gray-700 fw-bold fs-6 me-2">`+item.system_info__SystemRole+`</div>
                                <div class="d-flex align-items-senter">
                                    <span class="svg-icon svg-icon-2 svg-icon-success me-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <rect opacity="0.5" x="16.9497" y="8.46448" width="13" height="2" rx="1" transform="rotate(135 16.9497 8.46448)" fill="currentColor" />
                                            <path d="M14.8284 9.97157L14.8284 15.8891C14.8284 16.4749 15.3033 16.9497 15.8891 16.9497C16.4749 16.9497 16.9497 16.4749 16.9497 15.8891L16.9497 8.05025C16.9497 7.49797 16.502 7.05025 15.9497 7.05025L8.11091 7.05025C7.52512 7.05025 7.05025 7.52513 7.05025 8.11091C7.05025 8.6967 7.52512 9.17157 8.11091 9.17157L14.0284 9.17157C14.4703 9.17157 14.8284 9.52975 14.8284 9.97157Z" fill="currentColor" />
                                        </svg>
                                    </span>
                                    <span class="text-gray-900 fw-boldest fs-6">`+item.total+`</span>
                                </div>
                            </div>
                            <div class="separator separator-dashed border-primary my-3"></div>`;
        });

        var sys_typ = `<div class="col-sm-3 mb-5 card-rounded h-lg-100 border-primary border-dotted" id="system_type_div">
                            <div class="card card-rounded h-lg-100 border-primary border-dotted">
                                <div class="card-header pt-2">
                                    <h3 class="card-title align-items-start flex-column">
                                        <span class="card-label fw-bolder text-dark">System Type</span>
                                        <span class="text-gray-400 mt-1 fw-bold fs-6">available in `+dc+`</span>
                                    </h3>
                                </div>
                                <div class="card-body pt-5">`+
                                sys_typ_card+`
                                </div>
                            </div>
                        </div>`;
        
        var paused_table = `<table id="paused_system_table" class="table table-rounded border gy-7 gs-7">
                                <thead>
                                    <tr class="fw-bold fs-6 text-gray-800 border-bottom border-gray-200" style="text-align: center;">
                                        <th>SID</th>
                                        <th>DB System ID</th>
                                        <th>BusinessType</th>
                                        <th>Customer Name</th>
                                        <th>Main URL</th>
                                        <th>Life Cycle Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    `+paused_system_table_body+`
                                </tbody>
                            </table>`

        

        $('#dc_info_up_body').append(sys_typ)
        
        if (paused_system.paused_systems.length != 0){
            $('#dc_info_up_body').append(paused_table);
        }
        var sys_view_btn = `<a href="`+sys_view_url+`" target="_blank" href="#" class="btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary">View Systems</a>`
        $('#dc_up_view_btn_div').html(sys_view_btn)
    };

});