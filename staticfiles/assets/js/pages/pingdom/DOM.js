var up_dc_card = function(props){

    var is_all = ``;

    if(props.code == "ALL"){
        is_all = `ps-1`;
    }

    var card_width = "col-xl-2"

    if (window.screen.width >= 2050){
        card_width = "col-xl-1"
    }
    
    var card = `<div class="col-md-6 col-lg-6 `+card_width+` mb-5">
                <div class="overflow-hidden position-relative card-rounded">
                    <a href="#" id="`+props.code+`" class="card dc_card_up" data-bs-toggle="modal" data-bs-target="#model_up_dc_info">
                        <div class="card-body p-4" style="min-height:145px;">
                            <div class="row">
                                <div class="fw-bolder fs-3 text-left">`+props.name+`</div>
                            </div>
                            <div class="row mt-5">
                                <div class="col-4 p-0 ps-3">														
                                    <div class="text-gray-600 text-left fw-bolder fs-1">`+props.code+`</div>
                                </div>
                                <div class="col-4 `+is_all+`">														
                                    <h1 class="fs-1 mt-1 text-success fw-bolder">`+props.up+`</h1>
                                </div>                                
                                <div class="col-4 ps-1">
                                    <h1 class="fs-1 mt-1 ms-0 fw-bolder ms-2 text-warning">`+props.paused+`</h1>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="fw-bolder text-primary fs-2 text-left text-gray-700">`+props.infra+`</div>
                            </div>
                        </div>
                    </a>
                    </div>
                </div>`;
    
    return card;
}

var service_card_div = function(props){

    var div = `<div class="row mb-5">
                 <h2 class="anchor fw-bolder mb-5 text-gray-600" data-kt-scroll-offset="85" id="`+props.id+`">
                 <a href="#`+props.id+`" data-kt-scroll-toggle=""></a>`+props.id.charAt(0).toUpperCase() + props.id.slice(1)+` Monitoring</h2>`+
                 props.cards+`
               </div>`;
    
    return div;

}

var anomaly_card = function(props){
    
    var card = `<div class="d-flex align-items-center bg-light-info rounded p-5 mb-2">
                    <span class="svg-icon svg-icon-info me-5">
                    `+props.icon+`
                    </span>
                    <div class="flex-grow-1 me-2">
                        <a href="#" class="fw-bolder text-gray-800 text-hover-primary fs-6">`+props.title+`</a>
                        <span class="text-muted fw-bold d-block">Action Required</span>
                    </div>
                    <span class="fw-bolder text-info py-1">`+props.count+`</span>
                </div>`

    return card;

}

var down_region_card = function(props){

    var card = `<div class="card card-flush mb-5">
                    <div class="card-header">
                        <h1 class="card-title fs-2tx text-gray-600">`+props.region_name+`</h1>
                    </div>
                    <div class="card-body pt-1 pb-1">
                        <div class="row g-5 g-xl-10 mb-xl-10">													
                            `+props.dc_cards+`                                           
                        </div>												
                    </div>
                </div>`;
    return card;
};

var down_dc_card = function(props){
    var card = `<div class="col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                    <div class="card card-flush bg-primary bg-opacity-15" style="max-height:250px;">	
                        <div class="card-header" data-kt-scroll-offset="85" id="`+props.dc_code+`">
                                <h2 class="card-title text-center fs-1 text-gray-700">`+props.dc_code+` - `+props.dc_name+`<span class="badge badge-light-success fs-4 ms-5">
                                <span class="svg-icon svg-icon-5 svg-icon-success ms-n1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path opacity="0.5" d="M11.4343 14.3657L7.25 18.55C6.83579 18.9643 6.16421 18.9643 5.75 18.55C5.33579 18.1358 5.33579 17.4643 5.75 17.05L11.2929 11.5072C11.6834 11.1166 12.3166 11.1166 12.7071 11.5072L18.25 17.05C18.6642 17.4643 18.6642 18.1358 18.25 18.55C17.8358 18.9643 17.1642 18.9643 16.75 18.55L12.5657 14.3657C12.2533 14.0533 11.7467 14.0533 11.4343 14.3657Z" fill="black"/>
                                    <path d="M11.4343 8.36573L7.25 12.55C6.83579 12.9643 6.16421 12.9643 5.75 12.55C5.33579 12.1358 5.33579 11.4643 5.75 11.05L11.2929 5.50716C11.6834 5.11663 12.3166 5.11663 12.7071 5.50715L18.25 11.05C18.6642 11.4643 18.6642 12.1358 18.25 12.55C17.8358 12.9643 17.1642 12.9643 16.75 12.55L12.5657 8.36573C12.2533 8.05331 11.7467 8.05332 11.4343 8.36573Z" fill="black"/>
                                    </svg>
                                </span>`+props.up+`</span>
                                <span class="badge badge-light-danger  fs-4 ms-5">
                                <span class="svg-icon svg-icon-5 svg-icon-danger ms-n1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path opacity="0.5" d="M12.5657 9.63427L16.75 5.44995C17.1642 5.03574 17.8358 5.03574 18.25 5.44995C18.6642 5.86416 18.6642 6.53574 18.25 6.94995L12.7071 12.4928C12.3166 12.8834 11.6834 12.8834 11.2929 12.4928L5.75 6.94995C5.33579 6.53574 5.33579 5.86416 5.75 5.44995C6.16421 5.03574 6.83579 5.03574 7.25 5.44995L11.4343 9.63427C11.7467 9.94669 12.2533 9.94668 12.5657 9.63427Z" fill="black"/>
                                    <path d="M12.5657 15.6343L16.75 11.45C17.1642 11.0357 17.8358 11.0357 18.25 11.45C18.6642 11.8642 18.6642 12.5357 18.25 12.95L12.7071 18.4928C12.3166 18.8834 11.6834 18.8834 11.2929 18.4928L5.75 12.95C5.33579 12.5357 5.33579 11.8642 5.75 11.45C6.16421 11.0357 6.83579 11.0357 7.25 11.45L11.4343 15.6343C11.7467 15.9467 12.2533 15.9467 12.5657 15.6343Z" fill="black"/>
                                    </svg>
                                </span>`+props.down+`</span>
                            </h2>
                            <div class="card-toolbar">
                                <a href="#" data-bs-toggle="modal" dc_name="`+props.dc_code+`" data-bs-target="#model_down_dc_info" class="btn btn-icon btn-active-light-primary me-1 dc_btn"><i class="las la-info-circle fs-1 fw-bolder"></i></a>
                                <a href="#" id="`+props.dc_code+`_copy" class="btn btn-icon btn-active-light-primary btn_copy"><i class="las la-copy fs-1 fw-bolder"></i></a>
                            </div>
                        </div>
                        <div id="`+props.dc_code+`_card" class="card-body hover-scroll h-400px px-1 ms-4 pt-1">
                            `+props.sid_list+`
                        </div>
                    </div>
                </div>`;
    
    return card;
};

var down_sid_card = function(props){

    var sid_div = `<div class="symbol-label fs-1 fw-bolder bg-primary text-inverse-primary">`+props.SID+`</div>`;

    if(props.high_vailability==true){

        sid_div = `<div class="symbol-label fs-1 fw-bolder text-inverse-warning" style="background-color:#f2cc8f">`+props.SID+`</div>`;
    
    }

    var client_badge = ``;

    if(props.is_acknowledged==false){

        client_badge = `<span id="`+props.SID+`_badge" class="symbol-badge badge badge-circle bg-danger top-100 start-0"></span>`
    
    }

    if(props.client_list.length != 0){

        client_badge += `<span class="symbol-badge badge badge-circle bg-dark top-100 start-100">`+props.client_list+`</span>`;
    
    }
    
    var card = `<a href="#" data-bs-toggle="modal" sid="`+props.SID+`" data-bs-target="#model_down_system_info">
                    <div db_sid="`+props.db_sid+`" sid="`+props.SID+`" system_number="`+props.system_number+`" dc="`+props.dc+`" class="symbol symbol-75px ms-2 me-2 mb-5 sid_btn">
                        `+sid_div+client_badge+`
                    </div>
                </a>`;

    return card;

};

var down_dc_info_card =  function(props){

    var card = `<div class="col-md-2 col-lg-2 col-xl-2 col-xxl-1 mb-2" style="margin-right:90px;">
                    <div class="card pb-5" style="width: 200px;height:138px;">
                        <div class="row">
                        <div class="col-md-12 p-5">
                        <p class="card-title fs-5 fw-bolder text-gray-600">`+props.region+` - `+props.infra+`</p>
                            <h5 class="card-title fs-1"><a href="#`+props.dc_code+`" data-kt-scroll-toggle="">`+props.dc_code+`</a></h5>												
                            <span class="symbol symbol-50px pe-3 ps-2">
                                <span class="symbol-label fs-5 fw-bolder bg-light-success text-success border border-dashed border-gray-300">
                                    <span class="svg-icon svg-icon-5 svg-icon-success ms-n1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path opacity="0.5" d="M11.4343 14.3657L7.25 18.55C6.83579 18.9643 6.16421 18.9643 5.75 18.55C5.33579 18.1358 5.33579 17.4643 5.75 17.05L11.2929 11.5072C11.6834 11.1166 12.3166 11.1166 12.7071 11.5072L18.25 17.05C18.6642 17.4643 18.6642 18.1358 18.25 18.55C17.8358 18.9643 17.1642 18.9643 16.75 18.55L12.5657 14.3657C12.2533 14.0533 11.7467 14.0533 11.4343 14.3657Z" fill="black"/>
                                        <path d="M11.4343 8.36573L7.25 12.55C6.83579 12.9643 6.16421 12.9643 5.75 12.55C5.33579 12.1358 5.33579 11.4643 5.75 11.05L11.2929 5.50716C11.6834 5.11663 12.3166 5.11663 12.7071 5.50715L18.25 11.05C18.6642 11.4643 18.6642 12.1358 18.25 12.55C17.8358 12.9643 17.1642 12.9643 16.75 12.55L12.5657 8.36573C12.2533 8.05331 11.7467 8.05332 11.4343 8.36573Z" fill="black"/>
                                        </svg>
                                    </span>
                                    `+props.up+`
                                </span>
                            </span>
                            <span class="symbol symbol-50px">
                                <span class="symbol-label fs-5 fw-bolder bg-light-danger text-danger border border-dashed border-gray-300">
                                    <span class="svg-icon svg-icon-5 svg-icon-danger ms-n1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path opacity="0.5" d="M12.5657 9.63427L16.75 5.44995C17.1642 5.03574 17.8358 5.03574 18.25 5.44995C18.6642 5.86416 18.6642 6.53574 18.25 6.94995L12.7071 12.4928C12.3166 12.8834 11.6834 12.8834 11.2929 12.4928L5.75 6.94995C5.33579 6.53574 5.33579 5.86416 5.75 5.44995C6.16421 5.03574 6.83579 5.03574 7.25 5.44995L11.4343 9.63427C11.7467 9.94669 12.2533 9.94668 12.5657 9.63427Z" fill="black"/>
                                        <path d="M12.5657 15.6343L16.75 11.45C17.1642 11.0357 17.8358 11.0357 18.25 11.45C18.6642 11.8642 18.6642 12.5357 18.25 12.95L12.7071 18.4928C12.3166 18.8834 11.6834 18.8834 11.2929 18.4928L5.75 12.95C5.33579 12.5357 5.33579 11.8642 5.75 11.45C6.16421 11.0357 6.83579 11.0357 7.25 11.45L11.4343 15.6343C11.7467 15.9467 12.2533 15.9467 12.5657 15.6343Z" fill="black"/>
                                        </svg>
                                    </span>
                                    `+props.down+`
                                </span>
                            </span>
                        </div>
                        </div>
                    </div>
                </div>`;
    
    return card;
};