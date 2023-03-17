
const fileInput = document.getElementById("chooseFile");
const fileName = document.getElementById("fileName");
const noFile = document.getElementById("noFile");
sessionStorage.removeItem('testArray')

  var btn=''
  btn=`Choose file`       
  $('#btnNameDiv').html(btn)      
  
  

fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
      console.log(file)
      var excelName=file.name
    fileName.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;Uploading...`;
    postFile(file,excelName)
});

fileName.addEventListener("click", function (e) {
    fileInput.click();
});

noFile.addEventListener("click", function (e) {
    fileInput.click();
});


function postFile(file,excelName) {
    console.log(file)
    var data = new FormData()
    data.append('excel', file)


    var csrftoken = getCookie('csrftoken');
    // xhr.setRequestHeader('X-Custom-Header', 'custom-value');
    // "content_type":'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' 
    var settings = {

        "headers": { "X-CSRFToken": csrftoken, },
        "async": true,
        "crossDomain": false,
        "url": "vulnerablity_API_view/",
        "method": "POST",
        "processData": false,
        "data": data

    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'vulnerablity_API_view/', true);

    xhr.setRequestHeader("X-CSRFToken", csrftoken);


    xhr.onload = function () {
        // if (this.status === 200) {
        console.log(JSON.parse(this.responseText));
        loadChart(JSON.parse(this.responseText))
        fileName.innerHTML = excelName;
            console.log(JSON.parse(this.responseText))
            var tableData=JSON.parse(this.responseText)[1]
            var excelDatas =[]
                 tableData.forEach(function (item) {
                   Object.keys(item).forEach(function (key) {
                    excelDatas.push({Vulname : key,hostnameLen : item[key].length,hostname : item[key]});
                })
              })
              console.log(excelDatas)

        $('#testtable').DataTable({
            data:excelDatas,
            columns: [
                { data: 'Vulname' },
                { data: 'hostnameLen' },
                { data: 'hostname' },

            ],
        });

        // Generate_view_list_data(JSON.parse(this.responseText))

        // }
    };

    xhr.send(data);
    // $.ajax(settings).done(function (response) {
    //     console.log(response,"RESSSSSSSSSSSSSSSSSSSSSSSSSSS")
    //     getspcData()
    // })


    // getExcelData()

}

// function getExcelData() {

//     $.ajax({
//         method: "GET",
//         url: 'vulnerablity_API_view/',
//         success: function (data) {
//             console.log(data)
//             loadChart(data)
//             // Generate_view_list_data(data)
//         }

//     });

// }

function loadChart(chartCount) {
    data = chartCount[0]

    var total = parseInt(data.OS) + parseInt(data.Sap_rating_critical) + parseInt(data.Sap_rating_high) + parseInt(data.Sap_rating_low) +
        parseInt(data.Sap_rating_medium) + parseInt(data.Software) + parseInt(data.patch_offline) + parseInt(data.patch_online)
    //console.log(total)
    var upd_chart = ''
    var upd_Btn = ''

    upd_chart = upd_chart +

    `
    <div class="row">
      <div class="col-3">
        <canvas id="labelChart"></canvas>
      </div>
    
      <div class="col-8" style="margin:auto">
        <div class="row">
          <div class="col-6">
            <div class="row">
    
              <div class="col-8">
                <h6 style="color: deepskyblue;"><span style="background-color:#F7464A;width: 0px;
               height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span
                    style="font-size: small;">OS</span></h6>
              </div>
    
              <div class="col-3">
                <span style=font-weight:bold;font-size:small;>${data.OS}</span>
              </div>
            </div>
          </div>
    
          <div class="col-6">
            <div class="row">
    
              <div class="col-8">
                <h6 style="color: deepskyblue;"><span style="background-color:#46BFBD;width: 0px;
               height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span
                    style="font-size: small;">Sap_rating_critical</span></h6>
              </div>
    
              <div class="col-3">
                <span style=font-weight:bold;font-size:small;>${data.Sap_rating_critical}</span>
              </div>
    
            </div>
          </div>
    
        </div><br>
    
        <div class="row">
          <div class="col-6">
            <div class="row">
    
              <div class="col-8">
                <h6 style="color: deepskyblue;"><span style="background-color:#FDB45C;width: 0px;
               height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span
                    style="font-size: small;">Sap_rating_high</span></h6>
              </div>
    
              <div class="col-3">
                <span style=font-weight:bold;font-size:small;>${data.Sap_rating_high}</span>
              </div>
            </div>
          </div>
    
          <div class="col-6">
            <div class="row">
    
              <div class="col-8">
                <h6 style="color: deepskyblue;"><span style="background-color:#949FB1;width: 0px;
               height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span
                    style="font-size: small;">Sap_rating_low</span></h6>
              </div>
    
              <div class="col-3">
                <span style=font-weight:bold;font-size:small;>${data.Sap_rating_low}</span>
              </div>
    
            </div>
          </div>
    
        </div><br>
    
    
        <div class="row">
          <div class="col-6">
            <div class="row">
    
              <div class="col-8">
                <h6 style="color: deepskyblue;"><span style="background-color:#4D5360;width: 0px;
               height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span
                    style="font-size: small;">Sap_rating_medium</span></h6>
              </div>
    
              <div class="col-3">
                <span style=font-weight:bold;font-size:small;>${data.Sap_rating_medium}</span>
              </div>
            </div>
          </div>
    
          <div class="col-6">
            <div class="row">
    
              <div class="col-8">
                <h6 style="color: deepskyblue;"><span style="background-color:green;width: 0px;
               height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span
                    style="font-size: small;">Software</span></h6>
              </div>
    
              <div class="col-3">
                <span style=font-weight:bold;font-size:small;>${data.Software}</span>
              </div>
    
            </div>
          </div>
    
        </div><br>
    
    
        <div class="row">
          <div class="col-6">
            <div class="row">
    
              <div class="col-8">
                <h6 style="color: deepskyblue;"><span style="background-color:blue;width: 0px;
               height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span
                    style="font-size: small;">patch_offline</span></h6>
              </div>
    
              <div class="col-3">
                <span style=font-weight:bold;font-size:small;>${data.patch_offline}</span>
              </div>
            </div>
          </div>
    
          <div class="col-6">
            <div class="row">
    
              <div class="col-8">
                <h6 style="color: deepskyblue;"><span style="background-color:pink;width: 0px;
               height: 10px;" class="badge rounded-circle">&nbsp;</span> &nbsp;&nbsp;<span
                    style="font-size: small;">patch_online</span></h6>
              </div>
    
              <div class="col-3">
                <span style=font-weight:bold;font-size:small;>${data.patch_online}</span>
              </div>
    
            </div>
          </div>
    
        </div><br>
    
      </div>
    </div>
    `

    $('#floating_chart_server ').html(upd_chart)






    var ctxP = document.getElementById("labelChart").getContext('2d');
    var myPieChart = new Chart(ctxP, {
        type: 'doughnut',
        data: {
            // labels: ["OS", "Sap_rating_critical", "Sap_rating_high", "Sap_rating_low", "Sap_rating_medium", "Software",
            //     "patch_offline", "patch_online"],
            datasets: [{
                data: [parseInt(data.OS), parseInt(data.Sap_rating_critical), parseInt(data.Sap_rating_high), parseInt(data.Sap_rating_low),
                parseInt(data.Sap_rating_medium), parseInt(data.Software), parseInt(data.patch_offline), parseInt(data.patch_online)],
                backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360", 'green', 'blue', 'pink'],
                //   hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
            }]
        },
        options: {
            // Set the size of the center hole in the chart
            responsive: true,
            cutout:'70%'
        }
    });
}

function paginate(page_number) {
    let page_size = 5
    var array = JSON.parse(sessionStorage.getItem('testArray'))
    console.log(array)
    console.log(page_number)
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    var data = array.slice((page_number - 1) * page_size, page_number * page_size);
    console.log(data)
    if (data.length != 0) {
        view_list = ''
        data.forEach(function (item) {
            Object.keys(item).forEach(function (key) {
                //   console.log("key:" + key + "value:" + item[key]);
              

                view_list = view_list + `<tr>

                <td style="white-space: initial;">
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:300px">
                    <label style="font-size: small;" class="text-muted fw-bold d-block">`+ key + `</label>
                </div>
              </td> 

  <td style="white-space: initial;">
  <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:300px">
      <label style="font-size: small;text-align:center !important" class="text-muted fw-bold d-block">`+ item[key].length + `</label>
  </div>
</td>
            
    <td style="white-space: initial;">
        <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:${item[key].length * 50}px !important;min-width:500px">
            <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item[key] + `</label>
        </div>
    </td>
`
            });
        })

    }

    $('#Generate_view_list').html(view_list)
}




function Generate_view_list_data(item) {
    console.log(item)
    var view_list = ""
    var totalPages = ""
    var currentpage = 1
    var empty_json = item[1]
    console.log(empty_json)
    // if(typeof item === 'string'){
    //  empty_json=JSON.parse(item)
    //  empty_json=empty_json[1]
    //  console.log(empty_json)
    // }
    // else{
    // console.log(JSON.parse(item))
    // sessionStorage.setItem('testArray',JSON.stringify(empty_json))
    // if(item != undefined){
    //     empty_json=item
    // }
    sessionStorage.setItem('testArray', JSON.stringify(empty_json))

    // }

    totalPages = empty_json.length / 10



    paginate_Btn(totalPages, currentpage)

    // paginate(empty_json , 10 , 1)

    empty_json.splice(5);
    console.log(empty_json)

    if (empty_json.length != 0) {
        empty_json.forEach(function (item) {
            Object.keys(item).forEach(function (key) {
                //   console.log("key:" + key + "value:" + item[key]);
              

                view_list = view_list + `<tr>

                <td style="white-space: initial;">
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:300px">
                    <label style="font-size: small;" class="text-muted fw-bold d-block">`+ key + `</label>
                </div>
              </td>

          <td style="white-space: initial;">
          <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:300px">
              <label style="font-size: small;text-align:center !important" class="text-muted fw-bold d-block">`+ item[key].length + `</label>
          </div>
        </td>
                    
            <td style="white-space: initial;">
                <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;width:${item[key].length * 50}px !important;min-width:500px">
                    <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item[key] + `</label>
                </div>
            </td>
`
            });
        })

    }

    $('#Generate_view_list').html(view_list)
}





function paginate_Btn(allPages, page) {
    // console.log(testArray)
    // console.log(empty_json)
    var ul = document.querySelector('ul');
    console.log(allPages)
    console.log(page)

    let li = '';

    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;

    if (page > 1) {
        li += `<li style="cursor:pointer" class="page-item" onclick="paginate_Btn(${allPages}, ${page - 1})"><a class="page-link">Previous</a></li>`;

    }

    for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {

        if (pageLength > allPages) {
            continue;
        }
        if (pageLength == 0) {
            pageLength = pageLength + 1;
        }

        if (page == pageLength) {
            liActive = 'active';
        } else {
            liActive = '';
        }

        li += `<li style="cursor:pointer" class="page-item ${liActive}" onclick="paginate_Btn(${allPages}, ${pageLength})"><a class="page-link">${pageLength}</a></li>`

    }

    if (page < allPages) {
        li += `<li style="cursor:pointer" class="page-item" onclick="paginate_Btn(${allPages}, ${page + 1})"><a class="page-link">Next</a></li>`;

    }

    paginate(page)

    // ul.innerHTML = li;


    $('#pagination_ul').html(li)
}




var empty_json = [
    {
        'Splunk Enterprise and Universal Forwarder < 9.0 Improper Certificate Validation': ['ccd22v007542',
            'gcp43v004851',
            'azr02v001719']
    },
    {
        'TLS Version 1.0 Protocol Detection': ['ccd01v017572',
            '10.1.11.232',
            'ccd01v009740']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ca-certificates-mozilla (SUSE-SU-2023:0037-1)': ['gcp43v001298',
            'gcp43v004962',
            'gcp43v002140']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : systemd (SUSE-SU-2022:4630-1)': ['ccd01v017572',
            'gcp43v004851',
            'ccd01v018224']
    },
    {
        'TLS Version 1.1 Protocol Deprecated': ['ccd01v017572',
            '10.1.11.232',
            'ccd01v009740']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : vim (SUSE-SU-2022:4631-1)': ['ccd22v023606',
            'ccd02v002578',
            'ccd02v002588']
    },
    {
        'SUSE SLES15 Security Update : rubygem-rack (SUSE-SU-2022:3347-1)': ['ccd01v017572',
            'gcp43v004851',
            'ccd01v018224']
    },
    {
        'Splunk Enterprise 8.1 < 8.1.11, 8.2.0 < 8.2.7.1 / Universal Forwarders 8.1 < 8.1.11, 8.2.0 < 8.2.7.1 (SVD-2022-0803)': ['ccd22v007542',
            'gcp43v004851',
            'azr02v001719']
    },
    {
        'SUSE SLES15 Security Update : rubygem-rack (SUSE-SU-2022:2192-1)': ['ccd01v017572',
            'gcp43v004851',
            'ccd01v018224']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : tcl (SUSE-SU-2023:0030-1)': ['ccd01v017572',
            'gcp43v004851',
            'ccd01v018224']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : grub2 (SUSE-SU-2022:4219-1)': ['ccd01v017572',
            'gcp43v004851',
            'ccd01v018224']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:4616-1)': ['ccd01v017572',
            'gcp43v004851',
            'ccd01v018224']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:4053-1)': ['ccd01v017572',
            'gcp43v004851',
            'ccd01v018224']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : systemd (SUSE-SU-2022:4056-1)': ['ccd01v017572',
            'gcp43v004851',
            'ccd01v018224']
    },
    {
        'SSL Medium Strength Cipher Suites Supported (SWEET32)': ['ccd01v019030',
            '10.180.1.62',
            'gcp02v001972']
    },
    {
        'SSL RC4 Cipher Suites Supported (Bar Mitzvah)': ['ccd01v019030',
            'gcp02v001972',
            'ccd01v017453']
    },
    {
        'BMC Server Automation RSCD Agent ACL Bypass': ['ccd05v001365',
            'ccd01v021513',
            '10.180.72.130']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:2875-1)': ['ccd22v000260',
            'ccd01v019936',
            'ccd22v016041']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : dbus-1 (SUSE-SU-2022:3805-1)': ['gcp02v002326',
            'gcp43v001298',
            'ccd01v017572']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:3775-1)': ['gcp02v002326',
            'gcp43v001298',
            'ccd01v017572']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:2549-1)': ['ccd22v000260',
            'ccd01v019936',
            'ccd22v016041']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:2078-1)': ['ccd22v015982',
            'ccd22v014273',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:2173-1)': ['ccd01v019936',
            'ccd22v016041',
            'ccd22v018550']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:3264-1)': ['ccd06v001188.shp.osa.s4h.sap.corp',
            'gcp43v004851',
            'ccd22v014356']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:2422-1)': ['ccd22v000260',
            'ccd01v019936',
            'ccd22v016041']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ucode-intel (SUSE-SU-2022:2960-1)': ['ccd22v000260',
            'ccd01v007594',
            'ccd01v001962']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : systemd-presets-common-SUSE (SUSE-SU-2022:2866-1)': ['ccd22v000260',
            'ccd01v019936',
            'ccd22v016041']
    },
    { 'SSL Certificate Expiry': ['10.180.8.21', 'ccd01v017453', 'ccd01v010250'] },
    {
        'SSL Certificate Cannot Be Trusted': ['10.180.1.62',
            'ccd01v017453',
            'acs15v002362']
    },
    {
        'SUSE SLES15 Security Update : grub2 (SUSE-SU-2022:4142-1)': ['ccd22v023276',
            'ccd01v017994',
            'ccd22v015653']
    },
    {
        'SUSE SLES15 Security Update : kernel-firmware (SUSE-SU-2022:0721-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2022:3693-1)': ['ccd22v017954',
            'gcp02v001972',
            'ccd22v023276']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2022:2827-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'SUSE SLES15 Security Update : kernel-firmware (SUSE-SU-2022:1751-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2022:2111-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2022:0366-1)': ['ccd22v017954',
            'gcp02v001972',
            'ccd01v017994']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2022:2411-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'SUSE SLES15 Security Update : glibc (SUSE-SU-2022:0832-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2022:0768-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2022:3408-1)': ['ccd22v023276',
            'ccd01v017994',
            'ccd22v007542']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2022:1256-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'SUSE SLES15 Security Update : grub2 (SUSE-SU-2022:2041-1)': ['ccd01v017994',
            'ccd22v007542',
            'ccd22v006313']
    },
    {
        'HTTP TRACE / TRACK Methods Allowed': ['gcp02v002326',
            'gcp43v001298',
            '10.180.3.149']
    },
    {
        'SUSE SLES15 Security Update : ucode-intel (SUSE-SU-2022:1728-1)': ['ccd22v007542',
            'ccd01v006965',
            'ccd22v008141']
    },
    {
        'SUSE SLES15 Security Update : ucode-intel (SUSE-SU-2022:2832-1)': ['ccd22v007542',
            'ccd01v006965',
            'ccd22v008141']
    },
    {
        'SUSE SLES15 Security Update : ucode-intel (SUSE-SU-2022:0541-1)': ['ccd22v007542',
            'ccd01v006965',
            'ccd22v008141']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : crash (SUSE-SU-2022:2348-1)': ['ccd01v008935',
            'ccd20v000550',
            'ccd01v009052']
    },
    {
        'SUSE SLES15 Security Update : kernel (SUSE-SU-2021:3876-1)': ['ccd22v017954',
            'gcp02v001972',
            'ccd01v017994']
    },
    {
        'SUSE SLES15 Security Update : crash (SUSE-SU-2022:2410-1)': ['ccd22v007542',
            'ccd22v008141',
            'ccd22v004624']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : samba (SUSE-SU-2023:0014-1)': ['ccd22v006021',
            'ccd24v000429',
            'ccd22v001533']
    },
    {
        'SUSE SLES15 Security Update : ca-certificates-mozilla (SUSE-SU-2023:0003-1)': ['ccd22v023276',
            'ccd22v015653',
            'ccd22v015526']
    },
    { 'Internet Key Exchange (IKE) Aggressive Mode with Pre-Shared Key': ['ccd17v002498'] },
    {
        'Apache mod_status /server-status Information Disclosure': ['gcp43v001298',
            '10.180.1.55',
            '10.238.138.49']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python-paramiko (SUSE-SU-2022:3730-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : vim (SUSE-SU-2022:4282-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : pixman (SUSE-SU-2022:4148-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libdb-4_8 (SUSE-SU-2022:4214-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libX11 (SUSE-SU-2022:3986-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : dhcp (SUSE-SU-2022:3991-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python3 (SUSE-SU-2022:4281-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libksba (SUSE-SU-2022:3683-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : qemu (SUSE-SU-2022:3660-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : sudo (SUSE-SU-2022:4077-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : protobuf (SUSE-SU-2022:3922-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : bind (SUSE-SU-2022:3682-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : dpkg (SUSE-SU-2022:4081-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python-cryptography, python-cryptography-vectors (SUSE-SU-2022:4044-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : expat (SUSE-SU-2022:3597-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libxml2 (SUSE-SU-2022:3871-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : curl (SUSE-SU-2022:3773-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : buildah (SUSE-SU-2022:3766-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : supportutils (SUSE-SU-2022:4278-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python (SUSE-SU-2022:3512-1)': ['ccd22v024915',
            'gcp53v000519',
            'gcp43v004962']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python3 (SUSE-SU-2022:3544-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xen (SUSE-SU-2022:3947-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : net-snmp (SUSE-SU-2022:4205-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : git (SUSE-SU-2022:3931-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : expat (SUSE-SU-2022:3912-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : busybox (SUSE-SU-2022:4309-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xen (SUSE-SU-2022:3665-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : busybox (SUSE-SU-2022:4260-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libtasn1 (SUSE-SU-2022:3784-1)': ['acs15v004216',
            'acs15v004223',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : rubygem-nokogiri (SUSE-SU-2022:4015-1)': ['gcp02v002326',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'HTTP Proxy POST Request Relaying': ['ccd24v001562',
            'ccd01v015746',
            'ccd22v013737']
    },
    {
        'HTTP Proxy Arbitrary Site/Port Relaying': ['ccd24v001562',
            'ccd01v015746',
            'ccd22v013737']
    },
    {
        'HTTP Proxy CONNECT Loop DoS': ['ccd22v013732',
            'ccd07v003825',
            'ccd20v001513']
    },
    {
        'SUSE SLES12 Security Update : sudo (SUSE-SU-2022:4240-1)': ['ccd07v000225',
            'ccd07v004411',
            'ccd07v004890']
    },
    {
        'SUSE SLES12 Security Update : xen (SUSE-SU-2022:4241-1)': ['ccd07v004411',
            'ccd07v004414',
            'ccd07v004415']
    },
    {
        'SUSE SLES12 Security Update : python3 (SUSE-SU-2022:3511-2)': ['ccd07v004411',
            'ccd07v004890',
            'ccd07v004414']
    },
    {
        'SUSE SLES12 Security Update : dbus-1 (SUSE-SU-2022:3804-1)': ['ccd02v001231',
            'ccd01v013642',
            'ccd01v020370']
    },
    {
        'SUSE SLES12 Security Update : python-PyJWT (SUSE-SU-2022:2401-1)': ['ccd07v000225',
            'ccd07v004411',
            'ccd07v004890']
    },
    {
        'SUSE SLES12 Security Update : multipath-tools (SUSE-SU-2022:3713-1)': ['ccd07v000225',
            'ccd07v004411',
            'ccd07v004890']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : python (SUSE-SU-2022:3553-1)': ['ccd01v015678',
            'ccd02v001231',
            'ccd01v020370']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:4615-1)': ['acs15v002491',
            'ccd02v001231',
            'ccd01v013642']
    },
    {
        'SUSE SLES12 Security Update : curl (SUSE-SU-2022:3772-1)': ['ccd07v000225',
            'ccd07v004411',
            'ccd07v004890']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:3586-1)': ['ccd01v020370',
            'ccd07v004410',
            'ccd01v012225']
    },
    {
        'SUSE SLES12 Security Update : python3 (SUSE-SU-2022:3511-1)': ['ccd07v004411',
            'ccd07v004890',
            'ccd07v004414']
    },
    {
        'SUSE SLES12 Security Update : bind (SUSE-SU-2022:3499-1)': ['ccd07v000225',
            'ccd07v004411',
            'ccd07v004890']
    },
    {
        'SUSE SLES12 Security Update : glibc (SUSE-SU-2022:3942-2)': ['acs15v002491',
            'ccd02v001231',
            'ccd01v013642']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:3274-1)': ['ccd01v020370',
            'ccd07v004410',
            'ccd01v012225']
    },
    {
        'SUSE SLES12 Security Update : glib2 (SUSE-SU-2022:1758-2)': ['ccd07v000225',
            'ccd07v004411',
            'ccd07v004890']
    },
    {
        'SUSE SLES12 Security Update : expat (SUSE-SU-2022:3466-1)': ['ccd07v000225',
            'ccd07v004411',
            'ccd07v004890']
    },
    {
        'SUSE SLES12 Security Update : sqlite3 (SUSE-SU-2022:3401-1)': ['ccd07v000225',
            'ccd07v004411',
            'ccd07v004890']
    },
    {
        'SUSE SLES12 Security Update : python3 (SUSE-SU-2022:4251-1)': ['ccd07v004411',
            'ccd07v004890',
            'ccd07v004414']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : tiff (SUSE-SU-2022:4411-1)': ['gcp02v002326',
            'ccd22v002778',
            'ccd22v008134']
    },
    {
        'SUSE SLES15 Security Update : java-1_8_0-openjdk (SUSE-SU-2022:4452-1)': ['ccd02v000188',
            'ccd03v000058',
            'ccd05v000021']
    },
    {
        'DNS Server Cache Snooping Remote Information Disclosure': ['ccd22v014564',
            '10.182.224.8',
            'ccd01v015718']
    },
    {
        'DNS Server Zone Transfer Information Disclosure (AXFR)': ['ccd22v014402',
            'ccd20v001527',
            'ccd17v003832']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ldb, samba (SUSE-SU-2022:2586-1)': ['ccd03v000546',
            'gcp43v004964',
            'acs15v003992']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : samba (SUSE-SU-2022:3955-1)': ['ccd03v000546',
            'ccd05v003325',
            'ccd05v003328']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : samba (SUSE-SU-2022:4395-1)': ['ccd22v008134',
            'ccd17v007780',
            'ccd17v007782']
    },
    { 'IP Forwarding Enabled': ['10.180.2.3', '10.180.80.3', '10.182.224.3'] },
    {
        'Remote Desktop Protocol Server Man-in-the-Middle Weakness': ['gcp02v002326',
            'gcp05v000117',
            'ccd06v001249']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xorg-x11-server (SUSE-SU-2022:4480-1)': ['gcp02v002326',
            'gcp05v000117',
            'ccd06v001249']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : MozillaFirefox (SUSE-SU-2022:4462-1)': ['gcp02v002326',
            'gcp05v000117',
            'ccd06v001249']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xrdp (SUSE-SU-2023:0033-1)': ['gcp02v002326',
            'ccd06v001249',
            'ccd01v021713']
    },
    {
        'Apache Tomcat 8.5.0 < 8.5.84': ['ccd17v000082',
            'ccd22v010129',
            'ccd22v010127']
    },
    {
        'Apache Tomcat 8.5.x < 8.5.83 Request Smuggling Vulnerability': ['ccd15v003754',
            'acs15v002242',
            'ccd24v000457']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : oniguruma (SUSE-SU-2022:3327-1)': ['ccd07v004612',
            'azr02v000010',
            'acs15v004216']
    },
    {
        'SSL Self-Signed Certificate': ['10.180.1.62',
            'acs15v002362',
            'gcp53v000362']
    },
    {
        'SUSE SLES12 Security Update : grub2 (SUSE-SU-2022:2038-1)': ['ccd07v000225',
            'cisprod01-syd',
            'ccd13v101312']
    },
    {
        'SUSE SLES12 Security Update : kernel-firmware (SUSE-SU-2022:1846-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:2808-1)': ['ccd07v000225',
            'ccd07v004890',
            'ccd13v101312']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:2083-1)': ['ccd07v000225',
            'cisprod01-syd',
            'ccd13v101312']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:2393-1)': ['ccd07v000225',
            'cisprod01-syd',
            'ccd13v101312']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python-lxml (SUSE-SU-2022:0803-1)': ['ccd22v024915',
            'gcp53v000519',
            'gcp43v004962']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python (SUSE-SU-2022:1091-1)': ['ccd22v024915',
            'gcp53v000519',
            'gcp43v004962']
    },
    { 'SUSE SLES15 Security Update : 389-ds (SUSE-SU-2022:4124-1)': ['ccd01v019048'] },
    {
        'SUSE SLED15 / SLES15 Security Update : python-lxml (SUSE-SU-2022:2908-1)': ['ccd22v024915',
            'gcp53v000519',
            'gcp43v004962']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python (SUSE-SU-2022:2344-1)': ['ccd07v004612',
            'ccd22v024915',
            'gcp53v000519']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:1183-1)': ['ccd22v015982',
            'ccd22v014273',
            'ccd01m000434']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:1039-1)': ['ccd22v015982',
            'ccd22v014273',
            'ccd01m000434']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel-firmware (SUSE-SU-2022:1065-1)': ['ccd22v015982',
            'ccd22v014273',
            'ccd01m000434']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ucode-intel (SUSE-SU-2022:1727-1)': ['ccd01b000463',
            'ccd01v012093',
            'ccd01v006480']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel-firmware (SUSE-SU-2022:1840-1)': ['ccd01v019936',
            'ccd22v016041',
            'ccd22v018550']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:1687-1)': ['ccd22v015982',
            'ccd22v014273',
            'ccd01v019936']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : grub2 (SUSE-SU-2022:2064-1)': ['ccd01v019936',
            'ccd22v016041',
            'ccd22v018550']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libvirt (SUSE-SU-2022:1549-1)': ['ccd22v015982',
            'ccd22v014273',
            'ccd01m000434']
    },
    {
        'SUSE SLES15 Security Update : python-Babel (SUSE-SU-2022:3590-1)': ['ccd07v004612',
            'acs15v002145',
            'acs15v001770']
    },
    {
        'SUSE SLES15 Security Update : libtirpc (SUSE-SU-2022:2991-1)': ['ccd07v004612',
            'ccd07v003825',
            'ccd13v101310']
    },
    {
        'SUSE SLES15 Security Update : openssl-1_1 (SUSE-SU-2022:2311-1)': ['ccd07v004612',
            'ccd07v003825',
            'ccd13v101310']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : e2fsprogs (SUSE-SU-2022:1688-1)': ['acs15v001548',
            'azr02v000010',
            'ccd15v003487']
    },
    {
        'SUSE SLES15 Security Update : open-vm-tools (SUSE-SU-2022:2986-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : mozilla-nss (SUSE-SU-2022:1149-1)': ['azr02v000010',
            'ccd15v003487',
            'acs15v004021']
    },
    {
        'SUSE SLES15 Security Update : openssl-1_1 (SUSE-SU-2022:0853-1)': ['ccd15v003487',
            'acs15v003417',
            'gcp43v004524']
    },
    {
        'SUSE SLES15 Security Update : git (SUSE-SU-2022:2535-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLES15 Security Update : python3 (SUSE-SU-2022:2351-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ruby2.5 (SUSE-SU-2022:1512-1)': ['azr02v000010',
            'ccd15v003487',
            'acs15v004021']
    },
    {
        'SUSE SLES15 Security Update : sssd (SUSE-SU-2022:0826-1)': ['azr02v000010',
            'ccd15v003487',
            'azr48v000042']
    },
    {
        'SUSE SLES15 Security Update : gzip (SUSE-SU-2022:1674-1)': ['acs15v002145',
            'acs15v001770',
            'acs15v001612']
    },
    {
        'SUSE SLES15 Security Update : gnutls (SUSE-SU-2022:2830-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLES15 Security Update : qemu (SUSE-SU-2022:3768-1)': ['ccd07v004612',
            'ccd13v101310',
            'ccd13v101295']
    },
    {
        'SUSE SLES15 Security Update : bind (SUSE-SU-2022:0946-1)': ['ccd15v003487',
            'acs15v003417',
            'gcp43v004524']
    },
    {
        'SUSE SLES15 Security Update : cyrus-sasl (SUSE-SU-2022:3549-1)': ['ccd07v004612',
            'ccd07v003825',
            'ccd13v101310']
    },
    {
        'SUSE SLES15 Security Update : openssl-1_1 (SUSE-SU-2022:2068-1)': ['ccd13v101310',
            'ccd13v101295',
            'acs15v003420']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : vim (SUSE-SU-2022:2102-1)': ['azr02v000010',
            'ccd13v101310',
            'acs15v004023']
    },
    {
        'SUSE SLES15 Security Update : openssl (SUSE-SU-2022:2179-1)': ['ccd13v101310',
            'ccd13v101295',
            'acs15v003420']
    },
    {
        'SUSE SLES15 Security Update : python-PyJWT (SUSE-SU-2022:2403-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLES15 Security Update : curl (SUSE-SU-2022:2829-1)': ['ccd07v004612',
            'ccd07v003825',
            'ccd13v101310']
    },
    {
        'SUSE SLES15 Security Update : freetype2 (SUSE-SU-2022:3252-2)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : mozilla-nss (SUSE-SU-2022:2533-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLES15 Security Update : gzip (SUSE-SU-2022:1250-1)': ['azr02v000010',
            'ccd15v003487',
            'azr48v000042']
    },
    {
        'SUSE SLES15 Security Update : rsyslog (SUSE-SU-2022:1817-1)': ['ccd13v101310',
            'ccd13v101295',
            'acs15v003420']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : zlib (SUSE-SU-2022:1061-1)': ['azr02v000010',
            'ccd15v003487',
            'acs15v004021']
    },
    {
        'SUSE SLES15 Security Update : libcroco (SUSE-SU-2022:3493-1)': ['ccd07v004612',
            'ccd07v003825',
            'ccd13v101310']
    },
    {
        'SUSE SLES15 Security Update : gpg2 (SUSE-SU-2022:3144-1)': ['ccd07v004612',
            'ccd07v003825',
            'ccd13v101310']
    },
    {
        'SUSE SLES15 Security Update : openldap2 (SUSE-SU-2022:1832-1)': ['acs15v002145',
            'acs15v001770',
            'acs15v001612']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : pcre2 (SUSE-SU-2022:2649-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLES15 Security Update : curl (SUSE-SU-2022:3774-1)': ['ccd07v004612',
            'ccd07v003825',
            'ccd13v101310']
    },
    {
        'SUSE SLES15 Security Update : git (SUSE-SU-2022:1260-1)': ['azr02v000010',
            'ccd15v003487',
            'azr48v000042']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : expat (SUSE-SU-2022:0844-1)': ['ccd15v003487',
            'acs15v004021',
            'acs15v004176']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xz (SUSE-SU-2022:1158-1)': ['azr02v000010',
            'ccd15v003487',
            'acs15v004021']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : rsync (SUSE-SU-2022:2959-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : zlib (SUSE-SU-2022:2947-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLES15 Security Update : libsolv, libzypp, zypper (SUSE-SU-2022:1131-1)': ['acs15v002145',
            'acs15v001770',
            'acs15v001612']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : pcre (SUSE-SU-2022:2361-1)': ['ccd07v004612',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : logrotate (SUSE-SU-2022:2547-1)': ['ccd07v004612',
            'acs15v002145',
            'acs15v001770']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libxml2 (SUSE-SU-2022:1750-1)': ['acs15v001548',
            'azr02v000010',
            'ccd15v003487']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : pcre2 (SUSE-SU-2022:1883-1)': ['azr02v000010',
            'ccd13v101310',
            'acs15v004023']
    },
    {
        'SUSE SLES15 Security Update : icu (SUSE-SU-2022:3141-1)': ['gcp43v004964',
            'ccd03v006123',
            'gcp43v004962']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ldb (SUSE-SU-2022:1576-1)': ['gcp43v004964',
            'gcp43v004962',
            'acs15v004021']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : perl (SUSE-SU-2022:3271-1)': ['gcp43v004964',
            'ccd03v006123',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libyajl (SUSE-SU-2022:3162-1)': ['gcp43v004964',
            'ccd03v006123',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : freetype2 (SUSE-SU-2022:3252-1)': ['gcp43v004964',
            'ccd03v006123',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ruby2.5 (SUSE-SU-2022:3292-1)': ['gcp43v004964',
            'ccd03v006123',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : icu (SUSE-SU-2022:3142-1)': ['gcp43v004964',
            'ccd03v006123',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libtirpc (SUSE-SU-2022:3305-1)': ['gcp43v004964',
            'ccd03v006123',
            'acs15v004023']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : permissions (SUSE-SU-2022:3394-1)': ['acs15v004216',
            'gcp43v004964',
            'ccd03v006123']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : unzip (SUSE-SU-2022:3399-1)': ['acs15v004216',
            'gcp43v004964',
            'ccd03v006123']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : sqlite3 (SUSE-SU-2022:3307-1)': ['gcp43v004964',
            'ccd03v006123',
            'acs15v004023']
    },
    {
        'Apache Tomcat 9.0.0-M1 < 9.0.68 Request Smuggling Vulnerability': ['gcp43v004405',
            'gcp05v000100',
            'gcp43v004451']
    },
    {
        'Apache Tomcat 9.0.40 < 9.0.69': ['gcp43v004405',
            'gcp05v000100',
            'gcp43v004451']
    },
    {
        'SSH Weak Key Exchange Algorithms Enabled': ['10.2.0.79',
            '10.180.67.96',
            '10.1.6.168']
    },
    {
        'SSH Server CBC Mode Ciphers Enabled': ['10.1.6.168',
            '10.184.0.1',
            '10.180.3.32']
    },
    { 'SMB Signing not required': ['10.180.1.62', '10.11.24.14', '10.32.32.19'] },
    {
        'SSL/TLS Diffie-Hellman Modulus <= 1024 Bits (Logjam)': ['10.180.8.21',
            'ccd01v015545',
            'ccd01v008158']
    },
    {
        'Pivotal RabbitMQ < 3.7.18 Cross Site Scripting (XSS) Vulnerability': ['ccd01v001941',
            'ccd07v004418',
            'ccd01v002126']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2021:3972-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : glibc (SUSE-SU-2022:0441-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : util-linux (SUSE-SU-2022:1105-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:0757-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : glibc (SUSE-SU-2021:3290-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:1267-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : kernel-firmware (SUSE-SU-2022:0910-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : dbus-1 (SUSE-SU-2021:2590-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2022:0371-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    {
        'OpenSSL AES-NI Padding Oracle MitM Information Disclosure': ['azr02v000010',
            'ccd05v000021',
            'ccd03v000058']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : MozillaFirefox (SUSE-SU-2022:4058-1)': ['gcp02v002326',
            'gcp05v000117',
            'azr48v000487']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xorg-x11-server (SUSE-SU-2022:3857-1)': ['gcp02v002326',
            'gcp05v000117',
            'azr48v000487']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xterm (SUSE-SU-2022:3953-1)': ['gcp02v002326',
            'gcp05v000117',
            'azr48v000487']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : MozillaFirefox (SUSE-SU-2022:3726-1)': ['ccd01v020621',
            'ccd01v021816']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : colord (SUSE-SU-2022:4170-1)': ['gcp02v002326',
            'gcp05v000117',
            'azr48v000487']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : tiff (SUSE-SU-2022:3690-1)': ['ccd01v020621',
            'ccd01v021816']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : tiff (SUSE-SU-2022:4259-1)': ['gcp02v002326',
            'gcp05v000117',
            'azr48v000487']
    },
    {
        'SUSE SLES12 Security Update : python (SUSE-SU-2020:3765-1)': ['ccd01v015678',
            'ccd02v001231',
            'ccd05v002478']
    },
    {
        'SUSE SLES12 Security Update : python (SUSE-SU-2021:0794-1)': ['ccd01v015678',
            'ccd02v001231',
            'ccd05v002478']
    },
    {
        'SUSE SLES12 Security Update : python (SUSE-SU-2021:0432-1)': ['ccd01v015678',
            'ccd02v001231',
            'ccd05v002478']
    },
    {
        'SUSE SLES12 Security Update : python (SUSE-SU-2020:1524-1)': ['ccd01v015678',
            'ccd02v001231',
            'ccd05v002478']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : python (SUSE-SU-2022:1140-1)': ['ccd01v015678',
            'ccd02v001231',
            'cisprod01-syd']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2021:0434-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : systemd (SUSE-SU-2021:2423-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : grub2 (SUSE-SU-2021:0681-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : systemd (SUSE-SU-2018:3767-2)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : glibc (SUSE-SU-2019:1716-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2021:0736-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : systemd (SUSE-SU-2020:1842-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2021:1891-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : wicked (SUSE-SU-2020:0369-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : systemd (SUSE-SU-2020:0331-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2021:2422-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : systemd (SUSE-SU-2019:0428-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : glibc (SUSE-SU-2019:1102-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : glibc (SUSE-SU-2020:0832-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : systemd (SUSE-SU-2019:0135-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : systemd (SUSE-SU-2019:1265-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : glibc (SUSE-SU-2021:1165-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2021:1596-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd02v000311']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : dbus-1 (SUSE-SU-2019:2820-1)': ['ccd07v000225',
            'ccd13v101312',
            'ccd07v000224']
    },
    { 'SUSE SLES15 Security Update : libvirt (SUSE-SU-2022:0128-1)': ['ccd01v007746'] },
    {
        'SUSE SLED15 / SLES15 Security Update : libinput (SUSE-SU-2022:1305-1)': ['ccd01b000463',
            'ccd01v005886',
            'ccd22b000639']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python-rsa (SUSE-SU-2022:3932-1)': ['acs15v002268',
            'acs15v002362',
            'acs15v002265']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : curl (SUSE-SU-2022:3004-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004137']
    },
    {
        'SUSE SLES15 Security Update : containerd (SUSE-SU-2022:4463-1)': ['acs15v002268',
            'ccd07v003938',
            'acs15v004223']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python-pip (SUSE-SU-2022:1454-1)': ['azr48v000487',
            'azr48v000486',
            'acs15v004220']
    },
    {
        'SUSE SLES12 Security Update : mozilla-nspr, mozilla-nss (SUSE-SU-2022:2536-1)': ['ccd07v000225',
            'ccd07v004890',
            'cisprod01-syd']
    },
    {
        'SUSE SLES12 Security Update : curl (SUSE-SU-2022:2813-1)': ['ccd07v000225',
            'ccd07v004890',
            'cisprod01-syd']
    },
    {
        'SUSE SLES12 Security Update : zlib (SUSE-SU-2022:2846-1)': ['ccd07v000225',
            'ccd07v004890',
            'cisprod01-syd']
    },
    {
        'SUSE SLES12 Security Update : json-c (SUSE-SU-2022:3001-1)': ['ccd07v000225',
            'ccd07v004890',
            'cisprod01-syd']
    },
    {
        'SUSE SLES12 Security Update : samba (SUSE-SU-2022:2598-1)': ['ccd07v000225',
            'ccd07v000224',
            'ccd01v020440']
    },
    {
        'SUSE SLES12 Security Update : rsync (SUSE-SU-2022:2859-1)': ['ccd07v000225',
            'ccd07v004890',
            'cisprod01-syd']
    },
    {
        'SUSE SLES12 Security Update : libcroco (SUSE-SU-2022:2909-1)': ['ccd07v000225',
            'ccd07v004890',
            'cisprod01-syd']
    },
    {
        'SUSE SLES12 Security Update : xen (SUSE-SU-2022:2560-1)': ['ccd01v020440',
            'ccd01v020370']
    },
    {
        'SUSE SLES12 Security Update : gpg2 (SUSE-SU-2022:2529-1)': ['ccd07v000225',
            'ccd07v004890',
            'cisprod01-syd']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : openjpeg2 (SUSE-SU-2022:1252-1)': ['azr02v000010',
            'azr48v000042']
    },
    { 'SUSE SLED15 / SLES15 Security Update : poppler (SUSE-SU-2021:3854-1)': ['azr48v000042'] },
    {
        'SUSE SLES15 Security Update : containerd, docker and runc (SUSE-SU-2022:2341-1)': ['acs15v001548',
            'azr02v000010',
            'ccd07v003825']
    },
    {
        'SUSE SLES15 Security Update : containerd, docker (SUSE-SU-2022:1689-1)': ['acs15v001548',
            'azr02v000010',
            'azr48v000042']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : cups (SUSE-SU-2022:1861-1)': ['azr02v000010',
            'azr48v000042']
    },
    {
        'SUSE SLES15 Security Update : qpdf (SUSE-SU-2022:2670-1)': ['azr02v000010',
            'azr48v000042',
            'ccd07v001995']
    },
    {
        'SUSE SLES15 Security Update : python3 (SUSE-SU-2021:4015-2)': ['ccd15v003487',
            'azr48v000042',
            'acs15v003417']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libexif (SUSE-SU-2022:1148-1)': ['azr02v000010',
            'azr48v000042']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : tiff (SUSE-SU-2022:1882-1)': ['azr02v000010',
            'azr48v000042',
            'ccd22v012408']
    },
    { 'SUSE SLES15 Security Update : containerd, docker, runc (SUSE-SU-2021:3506-1)': ['ccd13m000137'] },
    { 'SUSE SLES15 Security Update : containerd, docker, runc (SUSE-SU-2021:1954-1)': ['ccd13m000137'] },
    {
        'SUSE SLES15 Security Update : cyrus-sasl (SUSE-SU-2022:0702-1)': ['ccd15v003487',
            'acs15v003417',
            'acs15v003886']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : expat (SUSE-SU-2022:0498-1)': ['ccd15v003487',
            'acs15v003417',
            'acs15v003886']
    },
    { 'SUSE SLED15 / SLES15 Security Update : tiff (SUSE-SU-2022:0480-1)': ['ccd22v012408'] },
    {
        'SUSE SLED15 / SLES15 Security Update : vim (SUSE-SU-2022:0736-1)': ['ccd15v003487',
            'acs15v004021',
            'acs15v004176']
    },
    { 'SUSE SLES15 Security Update : nginx (SUSE-SU-2022:4266-1)': ['ccd22v012408'] },
    {
        'SUSE SLES15 Security Update : polkit (SUSE-SU-2022:0191-1)': ['ccd15v003487',
            'acs15v003417',
            'acs15v003886']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : expat (SUSE-SU-2022:0713-1)': ['ccd15v003487',
            'acs15v004021',
            'acs15v004176']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : busybox (SUSE-SU-2022:0135-1)': ['ccd15v003487',
            'acs15v003417',
            'acs15v003886']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : json-c (SUSE-SU-2022:0184-1)': ['ccd15v003487',
            'acs15v003417',
            'acs15v003886']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : expat (SUSE-SU-2022:0178-1)': ['ccd15v003487',
            'acs15v003417',
            'acs15v003886']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : p11-kit (SUSE-SU-2021:4154-1)': ['ccd15v003487',
            'acs15v003417',
            'acs15v003886']
    },
    {
        'SSL Certificate Chain Contains RSA Keys Less Than 2048 bits': ['ccd01v002245',
            'ccd01v004562']
    },
    {
        'SUSE SLES15 Security Update : mariadb (SUSE-SU-2022:0725-1)': ['ccd01v006018',
            'ccd01v006357']
    },
    {
        'SUSE SLES15 Security Update : mariadb (SUSE-SU-2022:2107-1)': ['ccd01v006018',
            'ccd01v006357']
    },
    { 'SUSE SLED15 / SLES15 Security Update : containerd, docker, docker-runc, go, go1.11, go1.12, golang-github-docker-libnetwork (SUSE-SU-2019:1234-2)': ['ccd01v006018'] },
    { 'SSH Weak MAC Algorithms Enabled': ['10.180.1.6', '10.180.50.35'] },
    { 'SSH Weak Algorithms Supported': ['10.180.1.6', '10.180.50.35'] },
    {
        'SUSE SLED15 / SLES15 Security Update : libeconf, shadow and util-linux (SUSE-SU-2022:0727-1)': ['ccd01b000463',
            'acs15v004021',
            'ccd01m000434']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : kernel (SUSE-SU-2022:0760-1)': ['ccd01b000463',
            'acs15v004021',
            'ccd01m000434']
    },
    {
        'SUSE SLES15 Security Update : xorg-x11-server (SUSE-SU-2022:3856-1)': ['ccd01v015106',
            'ccd01v015105']
    },
    {
        'SUSE SLES15 Security Update : MozillaFirefox (SUSE-SU-2022:3272-1)': ['ccd01v015106',
            'ccd01v015105']
    },
    {
        'SUSE SLES15 Security Update : xorg-x11-server (SUSE-SU-2022:4481-1)': ['ccd01v015106',
            'ccd01v015105']
    },
    {
        'SUSE SLES15 Security Update : MozillaFirefox (SUSE-SU-2022:2984-1)': ['ccd01v015106',
            'ccd01v015105']
    },
    { 'SUSE SLES15 Security Update : mariadb (SUSE-SU-2021:3948-1)': ['ccd01v006357'] },
    {
        'SUSE SLED15 / SLES15 Security Update : python2-numpy (SUSE-SU-2022:1064-1)': ['ccd01v022550',
            'acs15v004220']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ucode-intel (SUSE-SU-2022:0574-1)': ['ccd01b000463',
            'ccd01v006480']
    },
    { 'PostgreSQL 11.x < 11.13 / 12.x < 12.8 / 13.x < 13.4 Memory Disclosure': ['ccd01v018578'] },
    { 'PostgreSQL 9.6.x < 9.6.22 / 10.x < 10.17 / 11.x < 11.12 / 12.x < 12.7 / 13.x < 13.3 Multiple Vulnerabilities': ['ccd01v018578'] },
    { 'SUSE SLES15 Security Update : postgresql12 (SUSE-SU-2022:2958-1)': ['ccd01v018578'] },
    {
        'Windows 10 / Windows Server 2016 September 2017 Information Disclosure Vulnerability (CVE-2017-8529)': ['spwdfvm4764',
            'spwdfvm4763']
    },
    {
        'Windows Speculative Execution Configuration Check': ['spwdfvm4764',
            'spwdfvm4763']
    },
    { 'SUSE SLED15 / SLES15 Security Update : libqt5-qtbase (SUSE-SU-2022:0841-1)': ['ccd01b000463'] },
    { 'Apache Multiviews Arbitrary Directory Listing': ['ccd01v007594'] },
    { 'Apache WebDAV Module PROPFIND Arbitrary Directory Listing': ['ccd01v007594'] },
    {
        'SUSE SLES15 Security Update : openssl-1_0_0 (SUSE-SU-2022:2321-1)': ['ccd07v001995',
            'ccd07v000202',
            'ccd07v001998']
    },
    {
        'SUSE SLES15 Security Update : vsftpd (SUSE-SU-2022:3458-1)': ['ccd07v001998',
            'ccd07v001997',
            'ccd07v001995']
    },
    {
        'SUSE SLES15 Security Update : samba (SUSE-SU-2022:2621-1)': ['ccd07v001995',
            'ccd07v000202',
            'ccd07v001998']
    },
    { 'SUSE SLED15 / SLES15 Security Update : python-M2Crypto (SUSE-SU-2022:2562-1)': ['ccd07v000202'] },
    {
        'SUSE SLES15 Security Update : apache2 (SUSE-SU-2022:2338-1)': ['ccd07v003826',
            'ccd07v000202',
            'ccd07v003825']
    },
    {
        'SUSE SLES12 Security Update : kernel (SUSE-SU-2020:3544-1)': ['ccd07v000225',
            'ccd07v000223',
            'ccd07v000224']
    },
    {
        'SUSE SLED12 / SLES12 Security Update : pcre (SUSE-SU-2022:2334-1)': ['ccd07v000225',
            'ccd07v000223',
            'cisprod01-syd']
    },
    {
        'SUSE SLES12 Security Update : python-M2Crypto (SUSE-SU-2022:2527-1)': ['ccd07v000225',
            'ccd07v000223',
            'ccd07v000224']
    },
    {
        'SUSE SLES12 Security Update : rsyslog (SUSE-SU-2022:2331-1)': ['ccd07v000225',
            'ccd07v000223',
            'cisprod01-syd']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : aaa_base (SUSE-SU-2021:3899-1)': ['acs15v001552',
            'acs15v001753',
            'acs15v001770']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : dwarves and elfutils (SUSE-SU-2022:2614-1)': ['acs15v004023',
            'acs15v003395',
            'acs15v004021']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : rsyslog (SUSE-SU-2022:1583-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python-paramiko (SUSE-SU-2022:1446-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : gnutls (SUSE-SU-2022:0717-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ncurses (SUSE-SU-2022:2717-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : qemu (SUSE-SU-2022:0930-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : gnutls (SUSE-SU-2022:2882-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004137']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : gpg2 (SUSE-SU-2022:2546-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : openssl-1_1 (SUSE-SU-2022:2328-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : curl (SUSE-SU-2022:1870-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : glib2 (SUSE-SU-2022:1455-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : curl (SUSE-SU-2022:1657-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : libsolv, libzypp, zypper (SUSE-SU-2022:1157-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : git (SUSE-SU-2022:2550-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : gzip (SUSE-SU-2022:1617-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : patch (SUSE-SU-2022:1925-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : openldap2 (SUSE-SU-2022:1670-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : git (SUSE-SU-2022:1484-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : bind (SUSE-SU-2022:0945-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : perl-HTTP-Daemon (SUSE-SU-2022:2874-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004137']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : openssl-1_1 (SUSE-SU-2022:2251-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : tar (SUSE-SU-2022:1548-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : cyrus-sasl (SUSE-SU-2022:0743-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : curl (SUSE-SU-2022:2327-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : protobuf (SUSE-SU-2022:1040-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python3 (SUSE-SU-2022:2357-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : p11-kit (SUSE-SU-2022:2405-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python-PyJWT (SUSE-SU-2022:2402-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : chrony (SUSE-SU-2022:0845-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : qemu (SUSE-SU-2022:2254-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : python3 (SUSE-SU-2022:0942-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 : Recommended update for aws-efs-utils, python-ansi2html, python-py, python-pytest-html, python-pytest-metadata, python-pytest-rerunfailures, python-coverage, python-oniconfig, python-unittest-mixins (SUSE-SU-2022:2831-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004137']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : yaml-cpp (SUSE-SU-2022:1073-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : krb5 (SUSE-SU-2022:4167-1)': ['acs15v004021',
            'acs15v004176',
            'acs15v004204']
    },
    {
        'SUSE SLES15 Security Update : nginx (SUSE-SU-2022:4201-1)': ['acs15v003785',
            'acs15v003786']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : net-snmp (SUSE-SU-2022:0050-1)': ['acs15v003886',
            'ccd15v003487',
            'acs15v003417']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : harfbuzz (SUSE-SU-2022:2663-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xen (SUSE-SU-2022:2065-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : xen (SUSE-SU-2022:2599-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : fribidi (SUSE-SU-2022:1844-1)': ['acs15v004023',
            'acs15v004021',
            'acs15v004003']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : ruby2.5 (SUSE-SU-2021:3838-1)': ['ccd15v003487',
            'acs15v003886']
    },
    {
        'SUSE SLED15 / SLES15 Security Update : mozilla-nss (SUSE-SU-2021:3934-1)': ['ccd15v003487',
            'acs15v003886']
    },
    {
        'SUSE SLES15 Security Update : openssh (SUSE-SU-2021:3947-1)': ['ccd15v003487',
            'acs15v003886']
    },
    {
        'SUSE SLES15 Security Update : glib-networking (SUSE-SU-2021:3997-1)': ['ccd15v003487',
            'acs15v003886']
    },
    { 'SUSE SLED15 / SLES15 Security Update : aws-cli, python-boto3, python-botocore, python-service_identity, python-trustme, python-urllib3 (SUSE-SU-2021:2817-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : curl (SUSE-SU-2021:2440-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : polkit (SUSE-SU-2021:1844-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : libnettle (SUSE-SU-2021:2143-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : krb5 (SUSE-SU-2021:2800-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : curl (SUSE-SU-2021:3297-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : qemu (SUSE-SU-2021:1918-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : busybox (SUSE-SU-2021:3531-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : openssl-1_1 (SUSE-SU-2021:2968-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : cpio (SUSE-SU-2021:2689-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : openssl-1_1 (SUSE-SU-2021:2831-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : dbus-1 (SUSE-SU-2021:2292-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : libgcrypt (SUSE-SU-2021:2157-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : dhcp (SUSE-SU-2021:1841-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : avahi (SUSE-SU-2021:1493-2)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : c-ares (SUSE-SU-2021:2760-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : kernel (SUSE-SU-2021:1912-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : sqlite3 (SUSE-SU-2021:2320-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : qemu (SUSE-SU-2021:2591-1)': ['acs15v003886'] },
    {
        'SUSE SLED15 / SLES15 Security Update : glibc (SUSE-SU-2021:3385-1)': ['acs15v003347',
            'acs15v003886']
    },
    { 'SUSE SLES15 Security Update : kernel (SUSE-SU-2021:2427-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : qemu (SUSE-SU-2021:3614-1)': ['acs15v003886'] },
    { 'SUSE SLES15 Security Update : curl (SUSE-SU-2021:1809-1)': ['acs15v003886'] },
    { 'SUSE SLED15 / SLES15 Security Update : python39 (SUSE-SU-2022:4071-1)': ['acs15v003785'] },
    {
        'SUSE SLED15 / SLES15 Security Update : telnet (SUSE-SU-2022:3783-1)': ['acs15v004176',
            'acs15v004181']
    },
    { 'SUSE SLED15 / SLES15 Security Update : open-vm-tools (SUSE-SU-2022:2936-1)': ['acs15v004137'] },
    {
        'SUSE SLES12 Security Update : git (SUSE-SU-2022:2537-1)': ['ccd07v004892',
            'ccd07v004890']
    },
    {
        'SUSE SLES12 Security Update : pcre2 (SUSE-SU-2022:2565-1)': ['ccd07v004892',
            'ccd07v004890']
    },
    { 'SUSE SLES12 Security Update : libxml2 (SUSE-SU-2022:1308-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : cifs-utils (SUSE-SU-2022:1429-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : libtasn1 (SUSE-SU-2022:3817-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : libxml2 (SUSE-SU-2022:3717-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : expat (SUSE-SU-2022:3874-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : apache2 (SUSE-SU-2022:0065-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : openssl-1_1 (SUSE-SU-2022:2312-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : ruby2.1 (SUSE-SU-2020:1570-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : supportutils (SUSE-SU-2022:4294-1)': ['cisprod01-syd'] },
    { 'SUSE SLED12 / SLES12 Security Update : python (SUSE-SU-2022:4275-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : tcpdump (SUSE-SU-2022:0505-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : openssl-1_1 (SUSE-SU-2022:2182-1)': ['cisprod01-syd'] },
    { 'SUSE SLED12 / SLES12 Security Update : expat (SUSE-SU-2022:0179-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : python3 (SUSE-SU-2022:1044-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : java-1_8_0-openjdk (SUSE-SU-2022:2819-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : openssl-1_0_0 (SUSE-SU-2022:2106-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : openssl-1_1 (SUSE-SU-2022:0860-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : expat (SUSE-SU-2022:0698-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : gzip (SUSE-SU-2022:1673-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : apache2 (SUSE-SU-2022:0918-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : java-1_8_0-openjdk (SUSE-SU-2022:0871-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : openssl-1_0_0 (SUSE-SU-2022:0857-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : binutils (SUSE-SU-2022:4277-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : zsh (SUSE-SU-2022:0733-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : krb5 (SUSE-SU-2022:4335-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : expat (SUSE-SU-2022:0842-1)': ['cisprod01-syd'] },
    { 'SUSE SLED12 / SLES12 Security Update : polkit (SUSE-SU-2022:0189-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : openldap2 (SUSE-SU-2022:1771-1)': ['cisprod01-syd'] },
    { 'SUSE SLED12 / SLES12 Security Update : ruby2.1 (SUSE-SU-2021:3837-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : e2fsprogs (SUSE-SU-2022:1695-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : libksba (SUSE-SU-2022:3681-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : java-1_8_0-openjdk (SUSE-SU-2022:2531-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : xz (SUSE-SU-2022:1160-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : zlib (SUSE-SU-2022:1062-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : mozilla-nss (SUSE-SU-2022:2031-1)': ['cisprod01-syd'] },
    { 'SUSE SLED12 / SLES12 Security Update : cyrus-sasl (SUSE-SU-2022:0693-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : gzip (SUSE-SU-2022:1275-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : telnet (SUSE-SU-2022:3735-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : libtirpc (SUSE-SU-2022:3791-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : zsh (SUSE-SU-2022:0161-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : grub2 (SUSE-SU-2022:4302-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : java-1_8_0-openjdk (SUSE-SU-2022:4373-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : python3 (SUSE-SU-2022:0882-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : libxml2 (SUSE-SU-2022:1833-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : python3 (SUSE-SU-2022:2166-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : mozilla-nss (SUSE-SU-2022:1113-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : samba (SUSE-SU-2022:0271-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : ca-certificates-mozilla (SUSE-SU-2022:4625-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : expat (SUSE-SU-2022:0495-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : openssl (SUSE-SU-2022:2181-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : apache2 (SUSE-SU-2022:2099-1)': ['cisprod01-syd'] },
    { 'SUSE SLES12 Security Update : bind (SUSE-SU-2022:0908-1)': ['cisprod01-syd'] },
    { 'OS': [108073] },
    { 'Software': [20547] },
    { 'Sap_rating_high': [62857] },
    { 'Sap_rating_low': [264] },
    { 'Sap_rating_medium': [46854] },
    { 'Sap_rating_critical': [18764] },
    { 'patch_online': [71354] },
    { 'patch_offline': [57385] }]


console.log("json", empty_json)