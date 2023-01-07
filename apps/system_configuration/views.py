from rest_framework.views import APIView
from rest_framework.response import Response
from .models import menu

# Create your views here.
class menuOptions(APIView):

    def get(self, request):

        check_useraccess = [gp for gp in self.request.user.groups.all()]

        menuList = {}
        
        getMenu = menu.objects.filter(access_group__in=check_useraccess, is_live=True)

        getCategory = {catgry[0]:{"name":catgry[1], "icon":catgry[2], "urls":[], "id":catgry[3], "menu_type":catgry[4]} for catgry in getMenu.values_list("category__order", "category__name", "category__icon", "category", "category__menu_type").filter(access_group__in=check_useraccess).distinct("name")}
        
        for catgry in getCategory:
            
            getMenuData = getMenu.values("name", "url", "order").filter(category=getCategory[catgry]['id']).order_by('order').distinct('order','name')
            
            getCategory[catgry]["urls"] = getMenuData
                            
        return Response(getCategory)