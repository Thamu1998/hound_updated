function getDataForDatatables(data){
  
var jsonData= {"data":data};

KTDatatablesDailyAvailability.init(jsonData);

}

var KTDatatablesDailyAvailability = function () {
  // Shared variables
  var table;
  var dt;
  var filterPayment;
  

  // Private functions
  var initDatatable = function (jsonData) {
      
      dt = $("#kt_datatable_example_1").DataTable({
          scrollX: true,
          pageLength: 25,
          order: [[2, 'desc']],
          stateSave: true,
          data: jsonData.data,
          responsive: false,
          columns:[  
                    {"data":"SID"},
                    {"data":"DataCenter"},
                    {"data":"BusinessType"},
                    {"data":"chart_div"},  
                    {"data":"downCount"},  
                    {"data":"totalDown"},
                    {"data":"fromTime"},
          ],
          columnDefs: [
                { targets:'_all', className: 'dt-center'},

                {targets: 'SID', "render": function ( data, type, row ) {

                  var sid_card = `<a href="#" class="btn btn-bg-light btn-color-primary me-5 mb-2" data-bs-toggle="modal" data-bs-target="#kt_modal_`+data+`">`+data+`</a>`;
           
                  return sid_card;

                 },},

                { targets: 'availability_in_min', width:'70%'},

                {targets:'from_time', render: convert_date_only, width:'20%'},

                {targets:'totalDown', render: box_label,},

                {targets:'down_count', render: box_label,}
                
          ],
          
          // Add data-filter attribute
          createdRow: function (row, data, dataIndex) {
              $(row).find('td:eq(4)').attr('data-filter', data.CreditCardType);
          }
      });

      table = dt.$;

  }

  // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
  var handleSearchDatatable = function () {
      const filterSearch = document.querySelector('[data-kt-docs-table-filter="search"]');
      filterSearch.addEventListener('keyup', function (e) {
          dt.search(e.target.value).draw();
      });
  }

  // Public methods
  return {
      init: function (jsonData) {
          initDatatable(jsonData);
          handleSearchDatatable();
      }
  }
}();

function setDataToTable(jsonData){
    $('#kt_datatable_example_1').DataTable( {
        "scrollX": true,
        deferRender: true,
        lengthMenu: [5, 10, 15, 20, 50, 100, 200, 300, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000],
        language: {'lengthMenu': 'Display _MENU_',},
        processing: true,
        data: jsonData.data,
        pageLength: 1000,
        "columns":[  
                {"data":"SID"},
                {"data":"DataCenter"},
                {"data":"BusinessType"},
                {"data":"chart_div"},  
                {"data":"downCount"},  
                {"data":"totalDown"},
                {"data":"fromTime"},
        ],
        "columnDefs": [
            { targets:'_all', className: 'dt-center'},

            { targets: 'availability_in_min', width: "1000px" },

            {targets:'from_time', render: convert_date_only,},

            {targets:'totalDown', render: box_label,},

            {targets:'down_count', render: box_label,},
            
          ]
  } );
}