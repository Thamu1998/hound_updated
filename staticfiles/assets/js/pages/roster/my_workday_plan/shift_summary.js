function shift_summary(){

    $.ajax({
        url: '/roster/summary',
        method: "GET",
        success: function(data){
            generate_summary_dom(data)
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(textStatus);
        }
    });

    function generate_summary_dom(data){

        summary_tbody = "";
        
        data.summary.forEach(function(item){
            summary_tbody += `<tr><td>`+item.shift__name+`</td><td>`+item.count+`</td></tr>`
        });

        $('#summary_body_tbody').html(summary_tbody);

        $('#month_name').html(data.month);
    };

};

$(document).ready(function(){
    shift_summary();
})