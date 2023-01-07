$(document).on('click', '.edit_dc_btn',function(){

    var dc = $(this).attr('code')

    $.ajax({

      method: "GET",
      url: `/cld/api/datacenter/`+dc,
      success: function(data){
        generate_dc_input_info(data)
      },
      error: function(error_data){
        
        console.log(error_data);

      }
    });

    function generate_dc_input_info(data){
        $('#dc_code').val(data.code);
        $('#location_name').val(data.description);
        $('#infra').val(data.infra);
        $('#infra').trigger('change');
        $('#region').val(data.region);
        $('#region').trigger('change');
        $('#cmp_id').val(data.cmp_id);
        $('#cmp_id').trigger('change');
        $('#cmp_timing').val(data.cmp_timing);
        $('#submit_cd_change').attr('code', data.code);
    }
})

$(document).on('click', '#submit_cd_change', function(e) {
    var dc = $(this).attr('code');

    var data = JSON.stringify({"infra":$('#infra').val(), "region":$('#region').val(), "cmp_id": $('#cmp_id').val(), "cmp_timing":$('#cmp_timing').val(), "description": $('#location_name').val()});
    
    var csrftoken = getCookie('csrftoken');

    var settings = {
        
        "headers": { "X-CSRFToken": csrftoken, "Content-Type": "application/json",},
        "async": true,
        "crossDomain": false,
        "url": `/cld/api/datacenter/`+dc+`/`,
         "method": "PUT",
         "processData": false,
         "data": data

        }

    $.ajax(settings).done(function (response) {
        var response = response;

        $('#reload_table').click();

        raise_success_tost("Datacenter detail updated successfully");

        $('#close_model').click();

    }).fail(function(xhr, status, error) {
        var error = xhr.responseJSON;

        console.log(JSON.parse(error));
    });

})