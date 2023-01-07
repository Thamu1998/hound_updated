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

    var URL = "/roster/api/shifttype/?format=datatables";
    
    var columnDef = ['id', 'code', 'name', 'color', 'text_color', 'is_allow_in_preference', 'is_allow_in_dashboard', 'is_leave', 'time_info', 'location', 'ordering']

    var colums = [
                    {data: 'id', name: 'id'},
                    {data: 'code', name: 'code'},
                    {data: 'name', name: 'name'},
                    {data: 'color', name: 'color'},
                    {data: 'text_color', name: 'text_color'},
                    {data: 'is_allow_in_preference', name: 'is_allow_in_preference'},
                    {data: 'is_allow_in_dashboard', name: 'is_allow_in_dashboard'},
                    {data: 'is_leave', name: 'is_leave'},
                    {data: 'time_info', name: 'time_info'},
                    {data: 'location', name: 'location'},
                    {data: 'ordering', name: 'ordering'},
                    {data: null },
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},
                        {targets: 'color', render: color_card},
                        {targets: 'text_color', render: text_color_card},
                        {targets: 'is_allow_in_preference', render: yes_no_label},
                        {targets: 'is_allow_in_dashboard', render: yes_no_label},
                        {targets: 'is_leave', render: yes_no_label},
                        {
                            targets: -1,
                            data: null,
                            orderable: false,
                            render: function (data, type, full, meta) {
                                if (full !== undefined){
                                    
                                    return `<a href="#" class="btn btn-sm btn-secondary view_shift_btn" shift_id=`+full.id+` data-bs-toggle="modal" data-bs-target="#kt_model_view">Update</a>`;
                                
                                }
                            },
                        },
                    ]
    
    var sort_data = [[ 0, "acs" ],[ 2, "acs" ]]

    rowGroup_data = null;

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    function color_card(data, type, full, meta) {

        if (typeof data === 'undefined') {
            return data;
        }

        return `<span style="background-color:`+data+`;" class="badge">`+data+`</span>`
        
    }

    function text_color_card(data, type, full, meta) {

        if (typeof data === 'undefined') {
            return data;
        }

        return `<span style="background-color:`+full.color+`;color:`+data+`;" class="badge">`+data+`</span>`
        
    }

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});
