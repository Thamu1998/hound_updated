// Class definition
var get_menu = function() {

    var menu = function() {


        var endpoint = '/sy/get/menu'

        var menuData = [];
        
        $.ajax({
            method: "GET",
            url: endpoint,
            success: function(data){
                menuData = data
                InitMenu()
            },
            error: function(error_data){
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
                
                $('#menuList').append(menuHTML)
            }
        });

        function InitMenu(){
            
            var menuHTML = "";

                $.each(menuData,function(index,value){

                    var menuURL = "";
                    
                    if (value['menu_type'] == 3){

                        $.each(value['urls'],function(URLindex,url){
                            
                            menuHTML = menuHTML + `<div class="menu-item">
                                                    <a class="menu-link" href="`+url['url']+`">
                                                        <span class="menu-icon svg-icon svg-icon-1 svg-icon-primary">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none">
                                                            `+value['icon']+`
                                                            </svg>
                                                        </span>
                                                        <span class="menu-title">`+url['name'].split("_")[0]+`</span>
                                                    </a>
                                                </div>`;
                        });
                        
                    }
                    else if(value['menu_type'] == 1){

                        
                        menuHTML = menuHTML + `<div class="menu-item">
                                                    <div class="menu-content pt-8 pb-2">
                                                        <span class="menu-section text-muted text-uppercase fs-8 ls-1">`+value['name']+`</span>
                                                    </div>
                                                </div>`

                    }
                    else if(value['menu_type'] == 2) {
                        
                        $.each(value['urls'],function(URLindex,url){

                            menuURL = menuURL + `<div class="menu-item">
                                                    <a class="menu-link" href="`+url['url']+`">
                                                        <span class="menu-bullet">
                                                            <span class="bullet bullet-dot"></span>
                                                        </span>
                                                        <span class="menu-title">`+url['name'].split("_")[0]+`</span>
                                                    </a>
                                                </div>`;

                        });
                    
                            menuHTML = menuHTML + `<div data-kt-menu-trigger="click" class="menu-item menu-accordion">
                                                        <span class="menu-link">
                                                            <span class="menu-icon svg-icon svg-icon-1 svg-icon-primary">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                    `+value['icon']+`
                                                                </svg>
                                                            </span>
                                                            <span class="menu-title">`+value['name']+`</span>
                                                            <span class="menu-arrow"></span>
                                                        </span>
                                                        <div class="menu-sub menu-sub-accordion menu-active-bg">
                                                            `+menuURL+`
                                                        </div>
                                                    </div>`;
                    }
                    
                });
                
                $('#menuList').append(menuHTML)
            }                       
    }

    return {
        init: function() {
            menu();            
        }
    };
}();


jQuery(document).ready(function() {
    get_menu.init();
});
