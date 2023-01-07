function product_label(data) {
    
    var status = {
        "S4_PC": {'title': 'S4_PC', 'class': 'info'},
        "HMC": {'title': 'HMC', 'class': 'success'},
        "S4_PC_HANA": {'title': 'S4PC_HANA', 'class': 'info'},
        "HMC_HANA": {'title': 'HMC_HANA', 'class': 'success'},
    };
    if (typeof status[data] === 'undefined') {
        return data;
    }

    return '<span class="font-weight-bold text-' + status[data].class + '">' + status[data].title + '</span>';
};

function remove_undersquare(data) {
    
    var status = {
        "S4_PC": {'title': 'S4_PC', 'class': 'info'},
        "HMC": {'title': 'HMC', 'class': 'success'},
        "S4_PC_HANA": {'title': 'S4PC_HANA', 'class': 'info'},
        "HMC_HANA": {'title': 'HMC_HANA', 'class': 'success'},
    };
    if (typeof status[data] === 'undefined') {
        return data;
    }

    return '<span class="font-weight-bold">' + status[data].title + '</span>';
};

function system_lifecycle_status(data, type, full, meta) {
    var status = {
        'L': {'title': 'LIVE', 'state': ' badge badge-success'},
        'PIP': {'title': 'PIP', 'state': ' badge badge-info'},
        'QCIP': {'title': 'QCIP', 'state': ' badge badge-info'},
        'OFFLINE': {'title': 'OFFLINE', 'state': ' lbadge badge-dark'},
        'OFFLINE_AD': {'title': 'OFFLINE_AD', 'state': ' badge badge-dark'},
        'RFC': {'title': 'RFC', 'state': ' badge badge-dark'},
        'DIP': {'title': 'DIP', 'state': ' badge badge-danger'},
        'D': {'title': 'DELETED', 'state': ' badge badge-danger'},
        'UPG': {'title': 'UPGRADE', 'state': ' badge badge-warning'},
        'BACKUP': {'title': 'BACKUP', 'state': ' badge badge-dark'},
        'BACKUP_DR': {'title': 'BACKUP_DR', 'state': ' badge badge-dark'},

        'Live': {'title': 'Live', 'state': ' badge badge-success'},
        'Live - Secondary DB': {'title': 'Live - Secondary DB', 'state': ' badge badge-info'},
        'Live - HADR Secondary': {'title': 'Live - HADR Secondary', 'state': ' badge badge-info'},
        'Live - SW Maintenance': {'title': 'Live - SW Maintenance', 'state': ' badge badge-warning'},
        'System available in pool': {'title': 'System available in pool', 'state': ' badge badge-primary'},
        'Discovered': {'title': 'Discovered', 'state': ' badge badge-info'},
        'In Maintenance': {'title': 'In Maintenance', 'state': ' badge badge-dark'},        
        'In decommission': {'title': 'In decommission', 'state': ' badge badge-dark'},
        'DELETED': {'title': 'DELETED', 'state': ' badge badge-dark'},        
        'Parking system': {'title': 'BACKUP', 'state': ' badge badge-dark'},
        'Currently being disassembled': {'title': 'Currently being disassembled', 'state': ' badge badge-dark'}
    };
    if (typeof status[data] === 'undefined') {
        return data;
    }
    return '<span class="font-weight-bold' + status[data].state + ' ">' + status[data].title + '</span>';
};

function instance_type(data, type, full, meta) {
    var status = {
        'ASCS': {'title': 'ASCS', 'state': ' badge badge-warning'},
        'D': {'title': 'D', 'state': ' badge badge-secondary'},
        'DB': {'title': 'DB', 'state': ' badge badge-info'},
        'DBC': {'title': 'DBC', 'state': ' badge badge-primary'},
        'DEPLOYMENT': {'title': 'DEPLOYMENT', 'state': ' badge badge-dark'},
        'DVEBMGS': {'title': 'DVEBMGS', 'state': ' badge badge-success'}
    };
    if (typeof status[data] === 'undefined') {
        return data;
    }
    return '<span class="font-weight-bold' + status[data].state + ' ">' + status[data].title + '</span>';
};

function open_spc_system_number(data) {

    var hostname = "spc.ondemand.com";

    var vlab_hostname = ['s4vlabhound.rot.s4h.sap.corp', 'ibpvlabhound.rot.s4h.sap.corp']

    if (window.location.hostname in vlab_hostname){
        hostname = "spc-vlab.ondemand.com"
    };

    return '<a class="kt-link"href="https://'+hostname+'/open?SYS='+data+'" target="_blank" >' + data + '</a>';

};

function convert_to_url(data, type, full, meta) {

    return '<a class="kt-link" href="https://'+ data + '" target="_blank" >' + data + '</a>';

};

function convert_date(data, type, full, meta) {

    if (data != null){

    var getdate = new Date(data).toUTCString();

    var DateName = getdate.replace("GMT","UTC");

    var GetMonthNumber = {"Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"}

    var GetDateSplit = getdate.split(" ");

    var getdate = GetDateSplit[3]+GetMonthNumber[GetDateSplit[2]]+GetDateSplit[1]+GetDateSplit[4].replace(/\:/g,"");

    var output = '<div class="kt-user-card-v2"><div class="kt-user-card-v2__details"><span class="kt-user-card-v2__name">'+DateName+'</span></div></div>';

    return output;
    }
    else{
        return null
    }
};

function convert_date_only(data, type, full, meta) {

    if (data != null){

    var getdate = new Date(data).toUTCString();

    var DateName = getdate.replace("00:00:00 GMT","");
    
    var GetMonthNumber = {"Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"}

    var GetDateSplit = getdate.split(" ");

    var getdate = GetDateSplit[3]+GetMonthNumber[GetDateSplit[2]]+GetDateSplit[1]+GetDateSplit[4].replace(/\:/g,"");

    var output = '<div class="kt-user-card-v2"><div class="kt-user-card-v2__details"><span class="kt-user-card-v2__name font-weight-bold text-info">'+DateName+'</span></div></div>';
    
    output = output.replace("GMT", "")

    return output;
    }
    else{
        return null
    }
};

function yes_no_label(data, type, full, meta) {
    var status = {
        false: {'title': 'No', 'class': ' badge badge-square badge-danger'},
        true: {'title': 'Yes', 'class': ' badge badge-square badge-success'},
    };
    if (typeof status[data] === 'undefined') {
        return data;
    }
    return '<span class="font-weight-bolder' + status[data].class + '">' + status[data].title + '</span>'
};

function color_label(data) {    
    return '<span class="font-weight-bold text-info">' + data + '</span>';
};

function box_label(data) {    
    return '<span class="font-weight-bold badge badge-light-danger fs-6">' + data + '</span>';
};