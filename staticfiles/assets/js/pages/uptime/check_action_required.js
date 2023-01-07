function check_action_required(){

    var endpoint = '/uptime/get/anomaly/data';
    var anomaly_data = [];

    $.ajax({
        method: "GET",
        url: endpoint,
        success: function(data){
            anomaly_data = data
            
            generate_anomaly_data()
        },
        error: function(error_data){
            console.log(JSON.parse(error_data.responseText))
        }
    });

    function generate_anomaly_data(){

        $('#notifications_body').html("");

        var button_html = `<span class="svg-icon svg-icon-1 text-muted">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-app-indicator" viewBox="0 0 16 16">
                                    <path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z"/>
                                    <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                </svg>
                            </span>
                            <span class="pulse-ring"></span>`

        var anomaly_cards = "";

        anomaly_data.forEach(function(anomaly){

            anomaly_cards += anomaly_card(anomaly)
            
        });

        $('#notifications_body').append(anomaly_cards);
        
        if(anomaly_data.length != 0){
            $('#action_required_button').html(button_html)
        }
    }
}