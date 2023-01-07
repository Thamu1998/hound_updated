var check_pingdom_status = function () {

    var initCheck = function () {
        
        var endpoint = '/pingdom/check/status';
        var pingdom_data = [];
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                pingdom_data = data
                generate_dom()
            },
            error: function(error_data){
                console.log(JSON.parse(error_data.responseText))
            }
        });

        function generate_dom(){

            if(pingdom_data.status == "UP"){

                $('.last_sync_at').html(`<span class="text-gray-600">`+pingdom_data.last_sync+'</span>');
                
                up_dashboard(pingdom_data.data);

                check_action_required();

                setTimeout(function() {
        
                    $('#loading_div').slideUp();
            
                }, 3000);

                setTimeout(function() {
        
                    $('#up_card_div').slideDown();
                    $('#chart_card').slideDown();
            
                }, 3400);
                
                
            }
            else if(pingdom_data.status == "DOWN"){

                $('.last_sync_at').html(`<span class="text-gray-600">`+pingdom_data.last_sync+'</span>');

                down_dashboard(pingdom_data.data);

                check_action_required();

                setTimeout(function() {
        
                    $('#loading_div').slideUp();
            
                }, 3000);
                
                setTimeout(function() {
        
                    $('#dc_info_down_card_div').slideDown();
                    $('#down_card_div').slideDown();
                    play_warning_sound();
            
                }, 3400);
            
                
            }
            else{

                $('#check_status_title').html("Refresh page in 5 sec, Due to data load issue in backend")

                setTimeout(function() {
        
                    location.reload();
            
                }, 5000);

            }
        }

    }

    return {
        init: function () {
            initCheck();
            timer();
            window.setInterval(function(){
                $('#check_status_title').html("Checking status ...")
                $('#loading_div').slideDown();
                $('#dc_info_down_card_div').slideUp();
                $('#down_card_div').slideUp();
                $('#up_card_div').slideUp();
                $('#chart_card').slideUp();
                $('#up_card_div').html("");
                $('#dc_info_down_card_div').html("");
                $('#down_card_div').html("");
                clearInterval(interval);
				timer();
                initCheck();
            },60000)
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    check_pingdom_status.init();
    $('#chart_card').hide();
    $('#up_card_div').hide();
    $('#dc_info_down_card_div').hide();
    $('#down_card_div').hide();
});