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

    var columnDef = ["code","infra","region","is_used","cmp_id","cmp_timing","description"]

    var colums = [
                    {data: 'code', name: 'code'},
                    {data: 'description', name: 'description'},
                    {data: 'infra', name: 'infra'},
                    {data: 'region', name: 'region'},
                    {data: 'cmp_id', name: 'cmp_id'},
                    {data: 'cmp_timing', name: 'cmp_timing'},
                    {data: null },
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},                        
                        {targets:'code'},
                        {targets:'infra'},
                        {targets:'region'},
                        {targets:'is_used'},
                        {targets:'cmp_id'},
                        {targets: 'cmp_timing'},
                        {targets: 'description'},
                        {
                            targets: -1,
                            data: null,
                            orderable: false,
                            render: function (data, type, full, meta) {
                                if (full !== undefined){

                                    return `<a href="#" class="btn btn-sm btn-secondary edit_dc_btn" code=`+full.code+` data-bs-toggle="modal" data-bs-target="#kt_model_edit">Edit</a>`;
                                
                                }
                            },
                        },
                    ]
    
    var sort_data = [[ 3, "asc" ]]

    rowGroup_data = null,

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});