function down_dashboard(pingdom_data){

    var region_card = "";

    var dc_down_info_card = "";
    
    Object.keys(pingdom_data).forEach(function(data){

        var dc_down_card = "";

        pingdom_data[data].forEach(function(dc_info, index){

            var system_down_card = "";
            
            dc_info.systems.forEach(function(system_detail){
                system_detail['dc'] =  dc_info.code
                system_down_card += down_sid_card(system_detail);
            });

            dc_down_card += down_dc_card({'dc_code': dc_info.code, 'dc_name': dc_info.name,'sid_list': system_down_card, 'up':dc_info.up, 'down':dc_info.down})

            dc_down_info_card += down_dc_info_card({'region': data, 'infra': dc_info.infra,'dc_code': dc_info.code, 'up':dc_info.up, 'down':dc_info.down})
        });

        region_card += down_region_card({'region_name': data, 'dc_cards': dc_down_card})

        

    });

    $('#down_card_div').html(region_card);
    $('#dc_info_down_card_div').html(dc_down_info_card)
};