function up_dashboard(pingdom_data){
    
    Object.keys(pingdom_data).forEach(function(data){

        var final_div = "";

        var dc_card = "";

        monitoring = pingdom_data[data];
        
        monitoring.forEach(function(status){
            
            dc_card += up_dc_card(status)

        });
        
        if (pingdom_data[data].length != 0){
            var service_card = service_card_div({'id': data, 'cards': dc_card})

            $('#up_card_div').append(service_card);
        }
         

    });
};