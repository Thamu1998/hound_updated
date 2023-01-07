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

    var URL = "/ua/api/users/?format=datatables";
    
    var columnDef = ['username', 'first_name', 'last_name', 'email', 'team', 'team_name','sub_team', 'sub_team_name', 'role', 'role_name', 'is_active', 'is_block', 'groups']

    var colums = [
                    {data: 'username', name: 'username'},
                    {data: 'first_name', name: 'first_name'},
                    {data: 'last_name', name: 'last_name'},
                    {data: 'email', name: 'email'},
                    {data: 'team', name: 'team__code'},
                    {data: 'team_name', name: 'team_name'},
                    {data: 'sub_team', name: 'sub_team__code'},
                    {data: 'sub_team_name', name: 'sub_team_name'},
                    {data: 'role', name: 'role__code'},
                    {data: 'role_name', name: 'role_name'},
                    {data: 'is_active', name: 'is_active'},
                    {data: 'is_block', name: 'is_block'},
                    {data: 'groups', name: 'groups__id'},
                    {data: 'id', name: 'id'},
                    {data: null },
                 ]
    
    var columnDefs = [
                        { targets:'_all', className: 'dt-center'},
                        {targets:'user',"width": "20%",className: 'dt-center', render: user_r},
                        {targets:'first_name', visible: false},
                        {targets:'last_name', visible: false},
                        {targets:'email', visible: false},
                        {targets:'team', render: team_r},
                        {targets:'team_name',searchable: false,orderable: false, visible: false},
                        {targets:'sub_team', render: sub_team_r},
                        {targets:'sub_team_name',searchable: false, orderable: false, visible: false},
                        {targets:'role', render: role_r},
                        {targets:'role_name',searchable: false, orderable: false, visible: false},
                        {targets:'id',searchable: false, orderable: false, visible: false},
                        {targets: 'is_active', render: yes_no_label},
                        {targets: 'is_block', render: yes_no_label},
                        {targets:'groups',orderable: false, render: groups_r},
                        {
                            targets: -1,
                            data: null,
                            orderable: false,
                            render: function (data, type, full, meta) {
                                if (full !== undefined){
                                    
                                    return `<a href="#" class="btn btn-sm btn-secondary view_user_btn" user_id=`+full.id+` data-bs-toggle="modal" data-bs-target="#kt_model_view">Update</a>`;
                                
                                }
                            },
                        },
                    ]
    
    var sort_data = [[ 0, "acs" ],[ 2, "acs" ]]

    rowGroup_data = null;

	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDefs, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

    function team_r(data, type, full, meta) {

        if (typeof data === 'undefined') {
            return data;
        }

        return full.team_name
        
    }

    function sub_team_r(data, type, full, meta) {

        if (typeof data === 'undefined') {
            return data;
        }

        return full.sub_team_name
        
    }

    function role_r(data, type, full, meta) {

        if (typeof data === 'undefined') {
            return data;
        }

        return full.role_name
        
    }

    function groups_r(data, type, full, meta) {
        var groups = ``;

        if (typeof data === 'undefined') {
            return data;
        }

        data.forEach(function(group) {
            if(group.name == 'ops_member'){
                var color_code = "primary"
            }
            else if(group.name == 'non_ops_member'){
                var color_code = "warning"
            }
            else if(group.name == 'shift_planner'){
                var color_code = "success"
            }
            else if(group.name == 'no_access'){
                var color_code = "dark"
            }else{
                var color_code = "secondary"
            }
            
            groups += `<span class="font-weight-bold fs-6 text-uppercase d-block mb-4 badge badge-light-`+color_code+` ">` +group.name.replaceAll("_", "  ")+ `</span>`
        })
        return groups;
        
    }

    function user_r(data, type, full, meta) {
        if (typeof data === 'undefined') {
            return data;
        }

        var msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                            <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

        var chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                            <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                            <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                        </svg></span>`;

        var user =  `<div class="d-flex"><div style="background-color:#f8f9fa" class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed pe-5">
                        <div class="symbol symbol-60px me-4">
                            <img src="https://avatars.wdf.sap.corp/avatar/`+data+`" class="" alt="" />
                        </div>
                            <div class="d-flex flex-column align-items-start">
                                <a href="#" class="fw-bolder text-gray-600 text-hover-primary fs-6">`+full.first_name+`&nbsp;`+full.last_name+`</a>
                                <a href="#" class="fw-bolder d-block text-gray-400 text-hover-primary fs-6">`+full.email+`</a>
                                <span class="text-gray-400 fw-bold d-block fs-6">`+data+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+full.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+full.email+`">`+msg_icon+`</a></span>
                            </div>                            
                        </div>
                    </div>`;

        return user;
    }

    // Execute a function when the user releases a key on the keyboard
    $(".kt-input").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#m_search").click();
        }
    });
    

});
