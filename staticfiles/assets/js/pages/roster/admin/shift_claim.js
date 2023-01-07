function get_data(url){

    var endpoint = url;
    var data_set = [];
        
    $.ajax({
        method: "GET",
        url: endpoint,
        async: false,
        cache: false,
        success: function(data){
            data_set = data;
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    return data_set;
}

function load_datatables(url){

    var data = get_data(url);

    var processed_data = [];

    $('#claim_month').html(data.month_name+","+data.year);

    $('#next_btn').attr('month', data.next.month);
    $('#next_btn').attr('year', data.next.year);
    $('#prev_btn').attr('month', data.prev.month);
    $('#prev_btn').attr('year', data.prev.year);

    Object.keys(data.data).forEach(function(item, index){
        processed_data.push([{"username":data.data[item].username,"name":data.data[item].name, "task":data.data[item].task, "email":data.data[item].email}, data.data[item].claim])
    });

    var dTable = $("#kt_datatable_host_nw").DataTable({
        "bPaginate": false,
        "destroy": true,
        data: processed_data,
        columnDefs:[
                    { targets:'_all', className: 'dt-center'},
                    {targets:0, render: shift_member},
                    {targets:1, render: claim},
                   ],
        searching: true
    });

    function claim(data, type, full, meta) {

        if (typeof data === 'undefined') {
            return data;
        }

        return `<p class="fw-bolder fs-2 align-middle">${data}</p>`

    }

    function shift_member(data, type, full, meta) {

        if (typeof data === 'undefined') {
            return data;
        }

        msg_icon = `<span class="svg-icon svg-icon-primary svg-icon-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M21 18H3C2.4 18 2 17.6 2 17V7C2 6.4 2.4 6 3 6H21C21.6 6 22 6.4 22 7V17C22 17.6 21.6 18 21 18Z" fill="black"/>
                        <path d="M11.4 13.5C11.8 13.8 12.3 13.8 12.6 13.5L21.6 6.30005C21.4 6.10005 21.2 6 20.9 6H2.99998C2.69998 6 2.49999 6.10005 2.29999 6.30005L11.4 13.5Z" fill="black"/>
                        </svg></span>`

        chat_icon = `<span class="svg-icon svg-icon-primary svg-icon-2 ms-2 me-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"/>
                    <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"/>
                    </svg></span>`;

        var member_div =  `<div class="col-6"><div class="d-flex align-items-center rounded border-gray-300 border-1 border-gray-300 border-dashed p-0 mb-7">
                <div class="symbol symbol-60px me-4">
                 <img src="https://avatars.wdf.sap.corp/avatar/`+data.username+`" class="" alt="" />
             </div>
                <div class="flex-grow-1 me-2">
                    <a href="#" class="fw-bolder text-gray-400 text-hover-primary fs-6">`+data.name+`</a>
                    <span class="fw-bold d-block fs-6">`+data.task+`</span>
                    <span class="text-gray-400 fw-bold d-block fs-6">`+data.username+`<a target="_blank" href="msteams:/l/chat/0/0?users=`+data.email+`">`+chat_icon+`</a><a target="_blank" href="mailto:`+data.email+`">`+msg_icon+`</a></span>
                </div>
            </div></div>`;

        return member_div;
        
    }

    $('#search_box_input').keyup(function(){
        dTable.search($(this).val()).draw() ;
    })
}

jQuery(document).ready(function() {

    load_datatables('/roster/claim/team')

});

$('#next_btn').on('click', function(e) {

    e.preventDefault();
    var month = $(this).attr('month')
    var year = $(this).attr('year')
    load_datatables(`/roster/claim/team?month=${month}&year=${year}`)
})

$('#prev_btn').on('click', function(e) {

    e.preventDefault();
    var month = $(this).attr('month')
    var year = $(this).attr('year')

    load_datatables(`/roster/claim/team?month=${month}&year=${year}`)
})