$(document).on('click', '.btn_copy', function (e) {

    e.preventDefault();
    
    var card_id = $(this).attr('id');
    
    card_id = card_id.replace('_copy', '_card')
    
    var copy_text = "";

    var counter = 0;

    $("#" + card_id).children('a').each(function () {
        
        copy_text += $(this).attr('sid')+";"; 
        counter += 1
    });
    
    copyToClipboard(copy_text);

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toastr-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    toastr.success(counter+" - SID's under " + card_id.replace("_card","")+" copied to clipboard");
    
});


function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    
    document.body.appendChild(dummy);
    
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}