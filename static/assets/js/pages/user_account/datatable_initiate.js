"use strict";
var col = "";

var q_filter = "";

var KTDatatablesSearchOptionsAdvancedSearch = function() {

	$.fn.dataTable.Api.register('column().title()', function() {

		return $(this.header()).text().trim();

	});

	var initTable = function(URL, columnDef_data, columns_data, columnDefs_data, sort_data, rowGroup_data=null,default_query_filter="") {
		// begin first table
		
		var table = $('#kt_datatable_example_1').DataTable({
			
			"scrollX": true,

			deferRender: true,

			rowGroup: rowGroup_data,

			// scrollY: '500px',

			// scrollCollapse: true,

			// scroller: {loadingIndicator: false,},

			colReorder: true,
			
			"order": sort_data,

			lengthMenu: [5, 10, 15, 20, 50, 100, 200, 300, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000],

			pageLength: 15,

			language: {'lengthMenu': 'Display _MENU_',},

			searchDelay: 500,

			processing: true,

			serverSide: true,

			ajax: {url: URL, type: 'GET', data: {columnsDef: columnDef_data,}, error: function(xhr, status, error){alert(error +" : " + " Please check the query filter")},},

			columns: columns_data,

			columnDefs: columnDefs_data,
		});

		new $.fn.dataTable.Buttons( table, {buttons: ['print', 'copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5', ],});

		var filter = function() {
			var val = $.fn.dataTable.util.escapeRegex($(this).val());
			table.column($(this).data('col-index')).search(val ? val : '', false, false).draw();
		};

		var columns = table.settings().init().columns;

		columns.forEach(function(index) { 
			col = col+index.name+";";
		});

		
		$('#m_search').on('click', function(e) {
			e.preventDefault();

			var params = {};

			q_filter = "";
			
			$('.kt-input').each(function() {
				var i = $(this).data('col-index');
				
				if (params[i]) {
					params[i] += '|' + $(this).val();
				}
				else {
					params[i] = $(this).val();
				}
			});
			$.each(params, function(i, val) {
				// apply search params to datatable				
				var objtyp = jQuery.type(val);
				
				if (objtyp == 'array' && val.length >= 1){
					var tempval = ""
					
					$.each(val, function(key,valueObj){
						tempval=tempval+valueObj+';'
						});
						val = tempval.slice(0,-1);
				}
				
				if (i != "undefined"){
				
					if (val.length != 0){
						if (q_filter != ""){
							q_filter = q_filter+"&"
						}
						q_filter=q_filter+columns[i].name+'='+val;
					};				

				};

				table.column(i).search(val ? val : '', true, false);
			});

			table.table().draw();

			

			
		});

		$('#m_reset').on('click', function(e) {

			e.preventDefault();

			$('.kt-input').val(null).trigger('change');

			$('.kt-input').each(function() {
				$(this).val('');
				table.column($(this).data('col-index')).search('', false, false);
			});
			table.table().draw();
			
			q_filter = "";

			

			
		});
        
        $(document).on('click', '.btn-pill', function (e) {
            e.preventDefault();
    
            var column = table.column( $(this).attr('data-column') );
    
                    $(this).children('i').toggleClass("fa-times fa-plus")
    
                    $(this).toggleClass("btn-light-danger btn-light-primary");
    
            column.visible( ! column.visible() );
        } );

		$('#reload_table').on('click', function(e){
			table.ajax.reload();
		});

		$('#export_print').on('click', function(e) {
			e.preventDefault();
			table.button(0).trigger();
		});

		$('#export_copy').on('click', function(e) {
			e.preventDefault();
			table.button(1).trigger();
		});

		$('#export_excel_btn').on('click', function(e) {
			e.preventDefault();
			
			table.button(2).trigger();
		});

		$('#export_csv').on('click', function(e) {
			e.preventDefault();
			table.button(3).trigger();
		});

		$('#export_pdf').on('click', function(e) {
			e.preventDefault();
			table.button(4).trigger();
		});

	};

	return {

		//main function to initiate the module
		init: function(URL, columnDef_data, columns_data, columnDefs_data, sort_data, rowGroup_data, default_query_filter) {

			initTable(URL, columnDef_data, columns_data, columnDefs_data, sort_data, rowGroup_data, default_query_filter);

		}
	};


}();

