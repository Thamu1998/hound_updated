// Class definition
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

var get_link = (function () {
  var menu = function () {
    var endpoint = "/link";
    var cardID = "";
    var tag_name = "";
    var menuData = [];
    var tagData = [];
    $(".select-wrapper").select2();
    $.ajax({
      method: "GET",
      url: endpoint,

      success: function (res) {
        var menuHTML = "";
        var cards = "";
        $.each(res["categorys"], function (index, value) {
          if (value.category_type == "OperationLinks") {
            menuHTML =
              menuHTML +
              `<li class="nav-item me-0 me-5 mb-md-10">
                <a class="nav-link btn btn-flex btn-active-primary" data-bs-toggle="tab" href="#tab_${value.id}">
                    
                    <span class="d-flex category-column align-items-start">
                        <span class="fs-4 fw-bolder category-name">${value.category_name}</span>    
                    </span>
                </a>
            </li>`;
            cards += `<div class="tab-pane fade" id="tab_${value.id}" role="tabpanel">
            <!--begin::Row-->
            <div class="row">`;
            $.each(res.links, function (key, data) {
              if (data.category.id == value.id) {
                cards =
                  cards +
                  `
                        <div class="col-xl-3 cards-wrapper" style="min-width:180px;max-width:180px;">
                            <!--begin::Statistics Widget 5-->
                            <div class="linkstyle">
                            <span data-id="${data.id}" data-name="${data.name}" data-subname="${data.subname}" data-url="${data.url}" class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow edit-card" data-bs-toggle="modal" data-bs-target="#kt_modal_edit_card" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="Eidt Card">
                            <i class="bi bi-pencil-fill fs-7"></i>
                            </span>
                            <span data-id="${data.id}" class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow delete-card" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="Delete Card">
																<i class="bi bi-x fs-2"></i>
															</span>
                              </div>
                            <a href="${data.url}" target="_blank" class="card bg-primary hoverable card-xl-stretch mb-xl-8 naveen">
                                <!--begin::Body-->
                                <div class="card-body">
                                    <div class="text-white fw-bolder fs-2 mb-2 mt-5">${data.name}</div>
                                    <div class="fw-bold text-white">${data.subname}</div>
                                </div>
                                <!--end::Body-->
                            </a>
                            <!--end::Statistics Widget 5-->
                        </div>`;
              }
            });
            cards += `            
            </div>
            <!--end::Row-->
        </div>`;
          }
        });
        menuHTML += `<li><div class="card-toolbar" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover" title="Click to add a Tag">
        <a href="#" class="btn btn-sm btn-light btn-active-primary add_category" data-bs-toggle="modal" data-bs-target="#kt_modal_add_customer">
        <!--begin::Svg Icon | path: icons/duotune/arrows/arr075.svg-->
        <span class="svg-icon svg-icon-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect opacity="0.5" x="11.364" y="20.364" width="16" height="2" rx="1" transform="rotate(-90 11.364 20.364)" fill="black" />
            <rect x="4.36396" y="11.364" width="16" height="2" rx="1" fill="black" />
          </svg>
        </span>
        
      </div></li>`;
        
        $(".menu_opertaionlinks").append(menuHTML);
        setTimeout(function () {
          cards += `<div class="add-card-wrapper col-xl-3 " style="min-width:162px;max-width:162px;">
          <!--begin::Statistics Widget 5-->
          
          <div class="card-toolbar" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover" title="Click to add a Link">
          <a href="#" class="btn btn-sm btn-grey add_category_link" data-bs-toggle="modal" data-bs-target="#kt_modal_add_card">
          <span class="svg-icon svg-icon-muted svg-icon-2hx"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path opacity="0.3" d="M3 13V11C3 10.4 3.4 10 4 10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14H4C3.4 14 3 13.6 3 13Z" fill="black"/>
<path d="M13 21H11C10.4 21 10 20.6 10 20V4C10 3.4 10.4 3 11 3H13C13.6 3 14 3.4 14 4V20C14 20.6 13.6 21 13 21Z" fill="black"/>
</svg></span>
        </div>
      
          
          <!--end::Statistics Widget 5-->
      </div>`;
          $("#operationContent").append(cards);
          $(".cards-wrapper").hover(function () {
            $(".linkstyle").css("display", "none");
            $(this).find(".linkstyle").css("display", "flex");
          });
          $(".edit-card").click(function (e) {
            cardID = $(this).attr("data-id");
            $(".edit_name").val($(this).attr("data-name"));
            $(".edit_subname").val($(this).attr("data-subname"));
            $(".edit_url").val($(this).attr("data-url"));
          });
          $(".delete-card").click(function (e) {
            cardID = $(this).attr("data-id");
            deleteCard(cardID);
          });
        }, 0);
        setTimeout(function () {
          menuHTML = "";
          cards = "";
          $.each(res["categorys"], function (index1, value1) {
            if (value1.category_type == "OtherLinks") {
              menuHTML =
                menuHTML +
                `<li class="nav-item me-0 me-5 mb-md-10">
                  <a class="nav-link btn btn-flex btn-active-primary" data-bs-toggle="tab" href="#tab_${value1.id}">
                      
                      <span class="d-flex category-column align-items-start">
                      <span class="fs-4 fw-bolder category-name">${value1.category_name}</span>                      
                      </span>
                  </a>
              </li>`;
              cards += `<div class="tab-pane fade" id="tab_${value1.id}" role="tabpanel">
              <!--begin::Row-->
              <div class="row">`;
              $.each(res.links, function (key1, data1) {
                if (data1.category.id == value1.id) {
                  cards =
                    cards +
                    `
                    <div class="col-xl-3 cards-wrapper" style="min-width:180px;max-width:180px;">
                    <!--begin::Statistics Widget 5-->
                    <div class="linkstyle">
                    <span data-id="${data1.id}" data-name="${data1.name}" data-subname="${data1.subname}" data-url="${data1.url}" class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow edit-category-card" data-bs-toggle="modal" data-bs-target="#kt_modal_edit_card" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="Eidt Card">
                    <i class="bi bi-pencil-fill fs-7"></i>
                    </span>
                    <span data-id="${data1.id}" class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow delete-category-card" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="Delete Card">
                        <i class="bi bi-x fs-2"></i>
                      </span>
                      </div>
                    <a href="${data1.url}" target="_blank" class="card bg-primary hoverable card-xl-stretch mb-xl-8 naveen">
                        <!--begin::Body-->
                        <div class="card-body">
                            <div class="text-white fw-bolder fs-2 mb-2 mt-5">${data1.name}</div>
                            <div class="fw-bold text-white">${data1.subname}</div>
                        </div>
                        <!--end::Body-->
                    </a>
                    <!--end::Statistics Widget 5-->
                </div>`;
                }
              });
              cards += `</div>
              <!--end::Row-->
          </div>`;
            }
          });
          menuHTML += `<li><div class="card-toolbar" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover" title="Click to add a Tag">
          <a href="#" class="btn btn-sm btn-light btn-active-primary add_category" data-bs-toggle="modal" data-bs-target="#kt_modal_add_customer">
          <!--begin::Svg Icon | path: icons/duotune/arrows/arr075.svg-->
          <span class="svg-icon svg-icon-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect opacity="0.5" x="11.364" y="20.364" width="16" height="2" rx="1" transform="rotate(-90 11.364 20.364)" fill="black" />
              <rect x="4.36396" y="11.364" width="16" height="2" rx="1" fill="black" />
            </svg>
          </span>
          
        </div></li>`;
          
          $(".menu_otherlinks").append(menuHTML);
          setTimeout(function () {
            cards += `<div class="add-card-wrapper col-xl-3 " style="min-width:162px;max-width:162px;">
            <!--begin::Statistics Widget 5-->
            
            <div class="card-toolbar" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover" title="Click to add a Link">
            <a href="#" class="btn btn-sm btn-grey add_category_link" data-bs-toggle="modal" data-bs-target="#kt_modal_add_card">
            <span class="svg-icon svg-icon-muted svg-icon-2hx"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path opacity="0.3" d="M3 13V11C3 10.4 3.4 10 4 10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14H4C3.4 14 3 13.6 3 13Z" fill="black"/>
  <path d="M13 21H11C10.4 21 10 20.6 10 20V4C10 3.4 10.4 3 11 3H13C13.6 3 14 3.4 14 4V20C14 20.6 13.6 21 13 21Z" fill="black"/>
  </svg></span>
          </div>
        
            
            <!--end::Statistics Widget 5-->
        </div>`;
            $("#otherContent").append(cards);
            $(".cards-wrapper").hover(function () {
              $(".linkstyle").css("display", "none");
              $(this).find(".linkstyle").css("display", "flex");
            });
            $(".edit-category-card").click(function (e) {
              cardID = $(this).attr("data-id");
              $(".edit_name").val($(this).attr("data-name"));
              $(".edit_subname").val($(this).attr("data-subname"));
              $(".edit_url").val($(this).attr("data-url"));
            });
            $(".delete-category-card").click(function (e) {
              cardID = $(this).attr("data-id");
              deleteCard(cardID);
            });
          }, 0);
        }, 0);

        InitMenu();
      },
      error: function (error_data) {
        var menuHTML = `<li class="nav-item me-0 me-5 mb-md-10">
        <a class="nav-link active btn btn-flex btn-active-primary" data-bs-toggle="tab" href="#tab_cloud_dashboard">
            <!--begin::Svg Icon | path: assets/media/icons/duotune/abstract/abs046.svg-->
            <span class="svg-icon svg-icon-2 svg-icon-muted svg-icon-2hx"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 22C7.4 22 7 21.6 7 21V9C7 8.4 7.4 8 8 8C8.6 8 9 8.4 9 9V21C9 21.6 8.6 22 8 22Z" fill="muted"/>
                <path opacity="0.3" d="M4 15C3.4 15 3 14.6 3 14V6C3 5.4 3.4 5 4 5C4.6 5 5 5.4 5 6V14C5 14.6 4.6 15 4 15ZM13 19V3C13 2.4 12.6 2 12 2C11.4 2 11 2.4 11 3V19C11 19.6 11.4 20 12 20C12.6 20 13 19.6 13 19ZM17 16V5C17 4.4 16.6 4 16 4C15.4 4 15 4.4 15 5V16C15 16.6 15.4 17 16 17C16.6 17 17 16.6 17 16ZM21 18V10C21 9.4 20.6 9 20 9C19.4 9 19 9.4 19 10V18C19 18.6 19.4 19 20 19C20.6 19 21 18.6 21 18Z" fill="currentColor"/>
                </svg>
            </span>
                <!--end::Svg Icon-->
            <span class="d-flex category-column align-items-start">
                <span class="fs-4 fw-bolder">Converged Cloud</span>
            </span>
        </a>
    </li>`;

        $("#menuList").append(menuHTML);
      },
    });

    function InitMenu() {
      var menuHTML = '<div class="row">';

      $.each(menuData["results"], function (index, value) {
        var menuURL = "";

        if (value) {
          menuHTML =
            menuHTML +
            `<div class="col-xl-1 order-4">
              <!--begin::Statistics Widget 5-->
              <a href=${value.url} target="_blank" class="card bg-primary card-xl-stretch mb-xl-8">
                  <!--begin::Body-->
                  <div class="card-body">
                      
                      <div class="fw-bold text-gray-400 fw-bolder fs-5">${value.name}</div>
                  </div>
                  <!--end::Body-->
              </a>
              <!--end::Statistics Widget 5-->
          </div>`;
        }
      });
      menuHTML += "</div>";
      $(".links_wrapper").append(menuHTML);
    }

    $(".select-wrapper").change(function () {
      var selectedtag = $(this).find("option:selected").text();

      var menuHTML = '<div class="row">';

      $.each(menuData["results"], function (index, value) {
        var menuURL = "";

        if (selectedtag == value.tags[0].tag_name) {
          menuHTML =
            menuHTML +
            `<div class="col-xl-1 order-4">
              <!--begin::Statistics Widget 5-->
              <a href=${value.url} target="_blank" class="card bg-primary card-xl-stretch mb-xl-8">
                  <!--begin::Body-->
                  <div class="card-body">
                      
                      <div class="fw-bold text-gray-400 fw-bolder fs-5">${value.name}</div>
                  </div>
                  <!--end::Body-->
              </a>
              <!--end::Statistics Widget 5-->
          </div>`;
        }
      });
      menuHTML += "</div>";
      $(".links_wrapper").html(menuHTML);
    });
    $(".add_tag").change(function () {
      tag_name = $(this).find("option:selected").val();
    });
    $("#kt_modal_add_category").click(function (e) {
      var link_name = $(".link_name").val();
      tag_name = $(".add_tag").find("option:selected").val();

      var data = {
        name: link_name,
        tags: tag_name,
      };
      var csrftoken = getCookie("csrftoken");
      $.ajax({
        headers: { "X-CSRFToken": csrftoken },
        method: "POST",
        url: "/link/PostData",
        data: data,
        dataType: "json",

        success: function (data) {
          location.reload(true);
        },
        error: function (error_data) {
          location.reload(true);
          var menuHTML = `<div class="menu-item">
                                      <a class="menu-link" href="/home">
                                          <span class="menu-icon svg-icon svg-icon-1 svg-icon-primary">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                              <rect x="2" y="2" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2" fill="black"/>
                                              </svg>
                                          </span>
                                          <span class="menu-title">Dashboard</span>
                                      </a>
                                  </div>`;
        },
      });
      //e.preventDefault();
    });

    $("#kt_modal_submit_card").click(function (e) {
      var link_name = $(".card_name").val();
      var link_subname = $(".card_subname").val();
      var url = $(".url_link").val();
      var type = $(".card-toolbar .nav-item .active").attr("data-id");
      var category_name = "";
      if (type == "OperationLinks") {
        category_name = $(
          "#opertaionlinks .nav-item .active .fw-bolder"
        ).text();
      } else {
        category_name = $("#otherlinks .nav-item .active .fw-bolder").text();
      }

      var data = {
        name: link_name,
        subname: link_subname,
        url: url,
        category: category_name,
      };
      var csrftoken = getCookie("csrftoken");
      $.ajax({
        headers: { "X-CSRFToken": csrftoken },
        method: "POST",
        url: "/link/PostLinkData",
        data: data,
        dataType: "json",

        success: function (data) {
          location.reload(true);
        },
        error: function (error_data) {
          location.reload(true);
          var menuHTML = `<div class="menu-item">
                                      <a class="menu-link" href="/home">
                                          <span class="menu-icon svg-icon svg-icon-1 svg-icon-primary">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                              <rect x="2" y="2" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2" fill="black"/>
                                              </svg>
                                          </span>
                                          <span class="menu-title">Dashboard</span>
                                      </a>
                                  </div>`;
        },
      });
    });

    $("#kt_modal_update_card").click(function (e) {
      var link_name = $(".edit_name").val();
      var link_subname = $(".edit_subname").val();
      var url = $(".edit_url").val();
      var type = $(".card-toolbar .nav-item .active").attr("data-id");
      var category_name = "";
      if (type == "OperationLinks") {
        category_name = $(
          "#opertaionlinks .nav-item .active .fw-bolder"
        ).text();
      } else {
        category_name = $("#otherlinks .nav-item .active .fw-bolder").text();
      }

      var data = {
        id: cardID,
        name: link_name,
        subname: link_subname,
        url: url,
        category: category_name,
      };
      var csrftoken = getCookie("csrftoken");
      $.ajax({
        headers: { "X-CSRFToken": csrftoken },
        method: "PUT",
        url: "/link/UpdateData/",
        data: data,
        dataType: "json",

        success: function (data) {
          location.reload(true);
        },
        error: function (error_data) {
          location.reload(true);
          var menuHTML = `<div class="menu-item">
                                      <a class="menu-link" href="/home">
                                          <span class="menu-icon svg-icon svg-icon-1 svg-icon-primary">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                              <rect x="2" y="2" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2" fill="black"/>
                                              </svg>
                                          </span>
                                          <span class="menu-title">Dashboard</span>
                                      </a>
                                  </div>`;
        },
      });
    });
    function deleteCard(id) {
      var data = {
        id: id,
      };
      var csrftoken = getCookie("csrftoken");
      $.ajax({
        headers: { "X-CSRFToken": csrftoken },
        method: "DELETE",
        url: "/link/DeleteData/",
        data: data,
        dataType: "json",

        success: function (data) {
          location.reload(true);
        },
        error: function (error_data) {
          location.reload(true);
          var menuHTML = `<div class="menu-item">
                                      <a class="menu-link" href="/home">
                                          <span class="menu-icon svg-icon svg-icon-1 svg-icon-primary">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                              <rect x="2" y="2" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2" fill="black"/>
                                              <rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2" fill="black"/>
                                              </svg>
                                          </span>
                                          <span class="menu-title">Dashboard</span>
                                      </a>
                                  </div>`;
        },
      });
    }
    function InitTags() {
      var menuHTML = "<option></option>";

      $.each(tagData["results"], function (index, value) {
        if (value) {
          menuHTML =
            menuHTML +
            `<option value="${value.tag_name}">${value.tag_name}</option>`;
        }
      });

      $(".select-wrapper").append(menuHTML);
      $(".add_tag").append(menuHTML);
    }
  };

  return {
    init: function () {
      menu();
    },
  };
})();

jQuery(document).ready(function () {
  get_link.init();
});
