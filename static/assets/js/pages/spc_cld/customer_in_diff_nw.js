function get_data(){

    var endpoint = '/cld/customer/different/nw/api';
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
            console.log(error_data)
            console.log(JSON.parse(error_data.responseText))
        }
    });

    return data_set;
}

jQuery(document).ready(function() {

    var data = get_data();

    var finalDom = "";

    data.forEach(function(sys_row, index){
        
        sys_row.forEach(function(item, index){
            
            finalDom = finalDom+`<tr id="`+item.CustomerID+`">
                                        <td align="center" style="vertical-align: middle;">`+item.CustomerID+`</td>
                                        <td align="center" style="vertical-align: middle;">`+item.CustomerName+`</td>
                                        <td align="center"><span class="badge badge-primary fs-6">`+item.NetworkSegmentID+`</span></td>
                                        <td align="center"><span class="fw-bolder text-hover-primary fs-3">`+item.count+`</span></td>
                                    </tr>`;
            
        });
    });
    
    $('#tabel_body').html(finalDom);

    var dTable = $("#kt_datatable_customer_nw").DataTable({
                        'rowsGroup': [0,1],
                        "bPaginate": false,
                        searching: true
                    });

    $('#search_box_input').keyup(function(){
        dTable.search($(this).val()).draw() ;
  })

});