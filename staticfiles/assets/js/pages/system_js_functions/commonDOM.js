function text_input_search(size, ttile, placeholder, colindex){
    var input = '<div class="col-lg-'+size+' col-md-'+size+' col-sm-12 top_margin_10">'+
                '<label>'+ttile+':</label>'+
                '<input type="text" class="form-control kt-input" placeholder="E.g: '+placeholder+'" data-col-index="'+colindex+'" /></div>'
    return input
};

function select_input_search(size, ttile, colindex, data){

    var options = ""
    
    $.each(data,function(index,value){
        options = options+'<option value="'+value+'">'+value+'</option>'
    });
    
    var input = '<div class="col-lg-'+size+' col-md-'+size+' col-sm-12 top_margin_10">'+
                '<label>'+ttile+':</label>'+
                '<select class="form-control selectpicker kt-input" >'+
                 options+
                '</select></div>';
    
    return input;
};