
const fileInput = document.getElementById("chooseFile");
const fileName = document.getElementById("fileName");
const noFile = document.getElementById("noFile");

fileInput.addEventListener("change", function (e) {
    var file = fileInput.files[0];
    //   console.log(file)
    fileName.innerHTML = file.name;
    postFile(file)
});

fileName.addEventListener("click", function (e) {
    fileInput.click();
});

noFile.addEventListener("click", function (e) {
    fileInput.click();
});


function postFile(file) {
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
        console.log(this.responseText);
        // }
    };

    xhr.send(data);
    // $.ajax(settings).done(function (response) {
    //     console.log(response,"RESSSSSSSSSSSSSSSSSSSSSSSSSSS")
    //     getspcData()
    // })


    getExcelData()
}

function getExcelData() {

    $.ajax({
        method: "GET",
        url: 'vulnerablity_API_view/',
        success: function (data) {
            console.log(data)
            loadChart(data)
            Generate_view_list_data(data)
        }

    });

}

function loadChart(chartCount) {
    chartCount = chartCount[0]
    var ctxP = document.getElementById("labelChart").getContext('2d');
    var myPieChart = new Chart(ctxP, {
        type: 'pie',
        data: {
            labels: ["OS", "Sap_rating_critical", "Sap_rating_high", "Sap_rating_low", "Sap_rating_medium", "Software",
                "patch_offline", "patch_online"],
            datasets: [{
                data: [parseInt(chartCount.OS), parseInt(chartCount.Sap_rating_critical), parseInt(chartCount.Sap_rating_high), parseInt(chartCount.Sap_rating_low),
                parseInt(chartCount.Sap_rating_medium), parseInt(chartCount.Software), parseInt(chartCount.patch_offline), parseInt(chartCount.patch_online)],
                backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360", 'green', 'blue', 'pink'],
                //   hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
            }]
        },
        options: {
            responsive: true,
        },
    });
}

function Generate_view_list_data(item) {
    var view_list = ""


    if (item.length != 0) {
        item.forEach(function (item) {
            var date = ""
            date = new Date(item.created_date)
            date = date.toISOString().split('T')[0]
            console.log(date)
            view_list = view_list + `<tr>

    <td>
    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
        <label style="font-size: small;" class="text-muted fw-bold d-block">`+ date + `</label>
    </div>
  </td>
            
    <td>
        <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
            <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.OS + `</label>
        </div>
    </td>
    <td  >
    <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
        <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Sap_rating_critical + `</label>
    </div>
   </td>
   <td  >
   <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
       <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Sap_rating_high + `</label>
   </div>
  </td>
  <td  >
  <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
      <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Sap_rating_low + `</label>
  </div>
 </td>
 <td  >
 <div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
     <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Sap_rating_medium + `</label>
 </div>
</td>
<td  >
<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
    <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.Software + `</label>
</div>
</td>
<td  >
<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
    <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.patch_offline + `</label>
</div>
</td>
<td  >
<div class="form-check form-check-sm form-check-custom form-check-solid" style="display: block;">
    <label style="font-size: small;" class="text-muted fw-bold d-block">`+ item.patch_online + `</label>
</div>
</td>
`
        })
    }
    $('#Generate_view_list').html(view_list)
}

