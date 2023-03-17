// function generate_toggle_pill(){

//     var toggle_pill = ""

//     $('.table_header th').each(function (index) { 
     
//        var is_show = $(this).attr('is_show')
       
//        var column_name = $(this).text()
        
//        if (is_show=="false"){

//             toggle_pill = toggle_pill+'<button type="button" class="btn btn-light-primary font-weight-bold btn-pill topmorgin" data-column="'+index+'"><i class="fas fa-plus fs-4 me-2"></i> '+column_name+' </button>&nbsp;';
//         }
//         else
//         {
//             toggle_pill = toggle_pill+'<button type="button" class="btn btn-light-danger font-weight-bold btn-pill topmorgin" data-column="'+index+'"><i class="fas fa-times fs-4 me-2"></i> '+column_name+' </button>&nbsp;';
//         }

//     });

//     $("#toggle_pill").html(toggle_pill)

// };

// jQuery(document).ready(function() {

//     generate_toggle_pill();

// 	// var URL = query_api_url.replace(/&amp;/g, '&');
//     var URL='/vulnerablity_API_view/'
//     console.log("URL",URL)
//     // var columnDef = ['SystemNumber','SID','LifeCycleStatus','SystemRole','DBSystemID','BusinessType','CustomerID','CustomerName','CustomerTenantMainURL','DataCenterID','NetworkSegmentID','LeadingProductPPMS','LeadingProductVersionPPMS','HasSharedDBTenant','EUAccess','DatabaseHostFQDN','DatabaseHost','WebdispatcherFarmName','ApplicationHost','ApplicationHostFQDN','LeadingProductName','LeadingProductPatchVersion','LeadingProductSupportPackage','LeadingProductVersionNumber','CMPTemplateID','InfrastructureType','DRActiveSystem','DRSystemType','DRSystemNumber','ApplicationDRType','DataBaseDRType','HAActiveSystem','HASystemType','HASystemNumber','ApplicationHAType','DataBaseHAType','CreationDateTime','EntityLastChangedOn']
//     var columnDef =['Vulnerablity','HostCount','HostName']
//     var colums = [

//                     {data: 'Vulnerablity', name: 'Vulnerablity'},
//                     {data: 'HostCount', name: 'HostCount'},
//                     {data: 'HostName', name: 'HostName'},
                    
//                  ]
    
//     var columnDefs = [
//                         {targets:'_all', className: 'dt-center'},
//                         {targets:'Vulnerablity', render: open_spc_system_number,},                        
//                         {targets:'HostCount', render: open_spc_system_number,},
//                         {targets:'HostName', render: remove_undersquare,},
//                         {targets:'SystemNumber', render: open_spc_system_number,},
//                         {targets:'SystemRole', render: remove_undersquare,},
//                         {targets:'CustomerTenantMainURL', render:convert_to_url,},
//                         {targets:'LifeCycleStatus', render: system_lifecycle_status,},
//                         {targets:'EntityLastChangedOn', render: convert_date,},
//                         {targets:'CreationDateTime', render: convert_date,},
//                         {targets: 'HasSharedDBTenant', render: yes_no_label,},
//                         {targets: 'EUAccess', render: yes_no_label,},
//                         {targets: 'DRActiveSystem', render: yes_no_label,},
//                         {targets: 'HAActiveSystem', render: yes_no_label,},
//                         {targets: 'CustomerID', visible:false,},
//                         {targets: 'LeadingProductPPMS', visible:false,},
//                         {targets: 'LeadingProductVersionPPMS', visible:false,},
//                         {targets: 'DatabaseHostFQDN', visible:false,},
//                         {targets: 'ApplicationHostFQDN', visible:false,},
//                         {targets: 'LeadingProductName', visible:false},
//                         {targets: 'LeadingProductSupportPackage', visible:false},
//                         {targets: 'LeadingProductVersionNumber', visible:false},
                        
//                     ]
    
//     var sort_data = [[ 4, "desc" ],[ 0, "acs" ],[ 9, "acs" ]]

//     rowGroup_data = null,

// 	KTDatatablesSearchOptionsAdvancedSearch.init(URL, columnDef, colums, columnDefs, sort_data, rowGroup_data, default_query_filter);

//     // Execute a function when the user releases a key on the keyboard
//     $(".kt-input").keyup(function(event) {
//         if (event.keyCode === 13) {
//             $("#m_search").click();
//         }
//     });
    

// });


// Initialize the data table
// var table = $('#example').DataTable();

// Initialize the advanced search options
// KTDatatablesSearchOptionsAdvancedSearch.init({
//   searchDelay: 500,
//   searchInputSelector: '#kt_datatable_search_query',
//   searchButtonSelector: '#kt_datatable_search_button',
//   queryFields: ['#name', '#position', '#office', '#age'],
//   additionalQueryFields: ['#gender'],
//   submitButtonSelector: '#kt_datatable_search_submit',
//   cancelTriggerSelector: '#kt_datatable_search_cancel',
//   resetFunction: function() {
//     table.search('').columns().search('').draw();
//   },
//   searchFunction: function(query) {
//     table.search(query).draw();
//     console.log("SEARCH")
//   }
// });

// // Implement custom search logic
// $('#kt_datatable_search_submit').on('click', function() {
//     console.log("CLICKED")
//   var query = '';
//   $.each(KTDatatablesSearchOptionsAdvancedSearch.getQueryFields(), function(i, field) {
//     var value = $(field).val();
//     if (value) {
//       query += value + ' ';
//     }
//   });
//   KTDatatablesSearchOptionsAdvancedSearch.search(query.trim());
// });


// $(document).ready(function() {
    KTDatatablesSearchOptionsAdvancedSearch.init({
      selector: '#example',
      searchInputSelector: '#kt_datatable_search_query',
      searchButtonSelector: '#kt_datatable_search_submit',
      resetButtonSelector: '#kt_datatable_search_reset',
      queryFields: {
        name: '^',
        position: '^',
        office: '^',
        age: '^',
        gender: '='
      },
      searchFunction: function(dataTable, query) {
        var queryStr = JSON.stringify(query);
        dataTable.search(queryStr, false, true).draw();
      },
      resetFunction: function(dataTable) {
        $('#name').val('');
        $('#position').val('');
        $('#office').val('');
        $('#age').val('');
        $('#gender').val('');
        dataTable.search('').draw();
      }
    });
//   });