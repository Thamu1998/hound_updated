function generate_toggle_pill(){

    var toggle_pill = ""

    $('.table_header th').each(function (index) { 
     
       var is_show = $(this).attr('is_show')
       
       var column_name = $(this).text()
        
       if (is_show=="false"){

            toggle_pill = toggle_pill+'<button type="button" class="btn btn-light-primary font-weight-bold btn-pill topmorgin" data-column="'+index+'"><i class="fas fa-plus fs-4 me-2"></i> '+column_name+' </button>&nbsp;';
        }
        else
        {
            toggle_pill = toggle_pill+'<button type="button" class="btn btn-light-danger font-weight-bold btn-pill topmorgin" data-column="'+index+'"><i class="fas fa-times fs-4 me-2"></i> '+column_name+' </button>&nbsp;';
        }

    });

    $("#toggle_pill").html(toggle_pill)

};

jQuery(document).ready(function() {

    generate_toggle_pill();

	var URL = query_api_url.replace(/&amp;/g, '&');

    var columnDef = ["SID","systemNumber","errorStartTime", "acknowledgedAt", "IsAcknowledged", "acknowledgedBy", "acknowledgedWithin", "Product_Area"]

    var colums = [
                    {data: 'systemNumber', name: 'systemNumber'},
                    {data: 'SID', name: 'SID'},
                    {data: 'errorStartTime', name: 'errorStartTime'},
                    {data: 'acknowledgedAt', name: 'acknowledgedAt'},
                    {data: 'IsAcknowledged', name: 'IsAcknowledged'},
                    {data: 'acknowledgedBy', name: 'acknowledgedBy'},
                    {data: 'acknowledgedWithin', name: 'acknowledgedWithin'},
                    {data: 'Product_Area', name: 'Product_Area'},
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},                        
                        {targets:'SystemNumber', render: open_spc_system_number,},
                        {targets: 'IsAcknowledged', render: yes_no_label,},
                        {targets:'SystemRole', render: remove_undersquare,},
                    ]
    
    var sort_data = [[ 2, "desc" ]]

    rowGroup_data = null,

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});