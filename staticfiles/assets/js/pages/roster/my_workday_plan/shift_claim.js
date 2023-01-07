$('#shift_claim_model').on('click', function(e) {

    $.ajax({
        url: "/roster/claim/member",
        method: 'GET',
        success: function(data){
            gen_shift_claim_domain(data)
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    })

})

function gen_shift_claim_domain(data) {
    
    shift_claim_rows = "";

    data.data.forEach(function(item) {
        var is_holiday = `<span class="badge badge-danger">No</span>`;

        if (item.is_holiday == true){
            is_holiday = `<span class="badge badge-success">Yes</span>`;
        }
        shift_claim_rows += `<tr align="center"><td>${item.date}</td><td>${item.day}</td><td>${item.name}</td><td>${is_holiday}</td><td>${item.claim}</td><tr>`
    });

    shift_claim_table = `<table class="table table-row-dashed table-row-gray-300 gy-7">
                            <thead>
                                <tr align="center" class="fw-bolder fs-6 text-gray-800">
                                    <th>Date</th>
                                    <th>Day</th>
                                    <th>Shift</th>
                                    <th>Holiday/Weekend</th>
                                    <th>Claim Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${shift_claim_rows}
                            </tbody>
                        </table>`;
    
    $('#shift_claim_table').html(shift_claim_table);
    $('#claim_month').html(data.month_name+","+data.year);
    $('#total_claim').html(data.total);
    $('#next_btn').attr('month', data.next.month);
    $('#next_btn').attr('year', data.next.year);
    $('#prev_btn').attr('month', data.prev.month);
    $('#prev_btn').attr('year', data.prev.year);

}

$('#next_btn').on('click', function(e) {

    e.preventDefault();
    var month = $(this).attr('month')
    var year = $(this).attr('year')

     $.ajax({
        url: `/roster/claim/member?month=${month}&year=${year}`,
        method: 'GET',
        success: function(data){
            gen_shift_claim_domain(data)
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    })
})

$('#prev_btn').on('click', function(e) {

    e.preventDefault();
    var month = $(this).attr('month')
    var year = $(this).attr('year')

     $.ajax({
        url: `/roster/claim/member?month=${month}&year=${year}`,
        method: 'GET',
        success: function(data){
            gen_shift_claim_domain(data)
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    })
})