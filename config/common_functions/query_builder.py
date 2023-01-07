from django.db.models import Q
import datetime

def generate(*args, **kwargs):

    filter_q = Q()

    exclude_q = Q()

    for key, value in kwargs["query"].items():
        
        if key != "col":
            
            if "!" in key:                

                if "__icontains" in key:

                    exclude_q |= Q(**{key[:-1]: value})
                
                elif "__range" in key:

                    exclude_q |= Q(**{key: value.split("to")})

                else:
                    ValueList = value.split(";")

                    exclude_q |= Q(**{key[:-1]+"__in": ValueList})

            else:
                if "__icontains" in key:

                    filter_q &= Q(**{key: value})

                elif "__range" in key:

                    filter_q &= Q(**{key: value.split("to")})
                    
                else:         
                    ValueList = value.split(";")
                            
                    filter_q &= Q(**{key+"__in": ValueList})
        

    return (filter_q, exclude_q)


def generate_datatable(*args, **kwargs):

    filter_q = Q()

    exclude_q = Q()
    
    for key, value in kwargs["query"].items():
        
        if "_flt" in key:
            
            key = key.replace("_flt", "")
            
            if "!" in key:         

                if "__icontains" in key:

                    exclude_q |= Q(**{key[:-1]: value})
                
                elif "__range" in key:

                    exclude_q |= Q(**{key: value.split("to")})

                else:
                    ValueList = value.split(";")

                    exclude_q |= Q(**{key[:-1]+"__in": ValueList})

            else:
                if "__icontains" in key:

                    filter_q &= Q(**{key: value})

                elif "__range" in key:

                    filter_q &= Q(**{key: value.split("to")})

                else:         
                    ValueList = value.split(";")
                            
                    filter_q &= Q(**{key+"__in": ValueList})
     
    return filter_q, exclude_q
