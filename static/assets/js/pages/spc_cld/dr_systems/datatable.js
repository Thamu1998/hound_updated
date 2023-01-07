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

    var URL = "/cld/api/drsystems/?format=datatables";
    
    var columnDef = []

    var colums = [
                    {data: 'CustomerID', name: 'CustomerID'},
                    {data: 'CustomerName', name: 'CustomerName'},
                    {data: 'quantity', name: 'quantity'},
                    {data: 'PrimaryDC', name: 'PrimaryDC'},
                    {data: 'SID', name: 'SID'},
                    {data: 'SystemRole', name: 'SystemRole'},
                    {data: 'has_prod', name: 'has_prod'},
                    {data: 'has_dr', name: 'has_dr'},
                    {data: 'SecondaryDC', name: 'SecondaryDC'},
                    {data: 'DBSID', name: 'DBSID'},
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},
                        {targets: 'has_prod', render: yes_no_label},
                        {targets: 'has_dr', render: yes_no_label},
                    ]
    
    function owner_column(data, type, full, meta) {

        var owners = ``;

        if (typeof data === 'undefined') {
            return data;
        }

        data.forEach(function(owner) {
            owners += `<span class="font-weight-bold fs-6 text-uppercase d-block mb-4 badge badge-primary ">` +owner.name+ `</span>`
        })
        return owners;
        
    }
    
    var sort_data = [[ 0, "acs" ],]

    rowGroup_data = null;

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});
