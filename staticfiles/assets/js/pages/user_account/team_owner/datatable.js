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

    var URL = "/ua/api/subteam/owner/?format=datatables";
    
    var columnDef = []

    var colums = [
                    {data: 'sub_team', name: 'sub_team__code'},
                    {data: 'work_group', name: 'work_group'},
                    {data: 'team', name: 'sub_team__team__code'},
                    {data: 'owner', name: 'owner__username'},
                    {data: 'user_info', name: 'user_info'},
                    {data: 'id', name: 'id'},
                    {data: null },
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},
                        {targets:'work_group',searchable: false,orderable: false},
                        {targets:'team'},
                        {targets:'owner',searchable: false,orderable: false},
                        {targets:'owners',orderable: false, visible: false},
                        {targets:'id',searchable: false,orderable: false, visible: false},
                        {targets:'owner',render: owner_column},
                        {
                            targets: -1,
                            data: null,
                            orderable: false,
                            render: function (data, type, full, meta) {
                                if (full !== undefined){
                                    
                                    return `<a href="#" class="btn btn-sm btn-secondary view_work_group_btn" work_group_id=`+full.id+` data-bs-toggle="modal" data-bs-target="#kt_model_view">Update</a>`;
                                
                                }
                            },
                        },
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
    
    var sort_data = [[ 2, "acs" ],]

    rowGroup_data = null;

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});
