CMPList = {
            'S4PC_AMER':'WEEKEND SUN 04:00 UTC to 08:00 UTC',
            'S4PC_Q_AMER':'WEEKEND SAT 02:00 UTC to 14:00 UTC',
            'S4PC_APJ':'WEEKEND SAT 15:00 UTC to 19:00 UTC',
            'S4PC_Q_APJ':'WEEKEND FRI 13:00 UTC to SAT 01:00 UTC',
            'S4PC_CLT':'WEEKEND FRI 21:00 UTC to SAT 09:00 UTC',
            'S4PC_EMEA':'WEEKEND SAT 22:00 UTC to SUN 02:00 UTC',
            'S4PC_Q_EMEA':'WEEKEND FRI 20:00 UTC to SAT 08:00 UTC',
            'S4PC_MENA':'WEEKDAY FRI 19:00 UTC to 23:00 UTC',
            'S4PC_Q_MENA':'WEEKDAY THU 17:00 UTC to FRI 05:00 UTC',
            'IBP MENA UTC':'IBP DXB + RUH UTC - Starting 19:00 UTC/ Duration 4 hours/ FRI',
            'IBP NSQ UTC':'IBP NSQ + STL UTC - Starting 04:00 UTC/ Duration 4 hours/ SUN',
            'IBP ROT UTC':'IBP ROT + MOW UTC - SAT 22:00 UTC to SUN 02:00 UTC',
            'IBP SYD UTC': 'IBP SYD + SHA3 UTC - SAT/15:00 UTC/ Duration 4 hours'
            }

bg_color_chart = {                   
                    'S4_PC':'#227c9d',
                    'S4_PC_HANA':'#8ecae6',
                    'S4_PC_SC':'#caf0f8',
                    'S4_1C':'#fae588',
                    'S4_1C_HANA':'#f9dc5c',
                    'HMC':'#adb5bd',
                    'HMC_HANA':'#6c757d',
                    'HMC_SC':'#ced4da',
                    'IBP_OD':'#227c9d',
                    'IBP_OD_HANA':'#8ecae6',
                    'IBP_OD_SC':'#caf0f8'
                }

location_list = [
                    {'code': 'BLR','name': 'Bangalore'},
                    {'code': 'EU','name': 'Hungary and Germany'},
                    {'code': 'DE','name': 'Germany'},
                ]

team_list = [
                {'code': 'BRL_APP_OP', 'name': 'Application Bangalore', 'location': 'BLR'},
                {'code': 'BRL_SM_OP', 'name': 'Server Management Bangalore', 'location': 'BLR'},
                {'code': 'EU_APP_OP', 'name': 'Application Hungary and Germany', 'location': 'EU'},
                {'code': 'EU_SM_OP', 'name': 'Server Management Hungary and Germany', 'location': 'EU'},
                {'code': 'NON_OPS', 'name': 'Non Operation Member', 'location': 'DE'},
            ]

user_group_list = [
                        {
                            "code": 'SHIFT_LEAD',
                            "name": 'Global Shift Lead',
                            "team": 'BRL_APP_OP'
                        },
                        {
                            "code": 'CINCI',
                            "name": 'Customer Incident',
                            "team": 'BRL_APP_OP'
                        },
                        {
                            "code": 'CSRV',
                            "name": 'Customer Service Request',
                            "team": 'BRL_APP_OP'
                        },
                        {
                            "code": 'MD_SM',
                            "name": 'Monitoring and Dispatching SM',
                            "team": 'BRL_SM_OP'
                        }
                        ,
                        {
                            "code": 'MD',
                            "name": 'Monitoring and Dispatching',
                            "team": 'BRL_APP_OP'
                        }
                        ,
                        {
                            "code": 'VLAB',
                            "name": ' VLAB Operations',
                            "team": 'BRL_APP_OP'
                        }
                        ,
                        {
                            "code": 'UPG',
                            "name": 'Upgrade | HFC | EP',
                            "team": 'BRL_APP_OP' 
                        },
                        {
                            "code": 'ALERT',
                            "name": 'Alert',
                            "team": 'BRL_SM_OP'
                        }
                        ,
                        {
                            "code": 'ONSTOCK_DECOM',
                            "name": 'On-Stock Provisioning Decom',
                            "team": 'BRL_APP_OP'
                        },
                        {
                            "code": 'ADHOC_ACTI',
                            "name": 'Adhoc activity Application Bangalore',
                            "team": 'BRL_APP_OP'
                        },
                        {
                            "code": 'ADHOC_ACTI_SM',
                            "name": 'Adhoc activity SM Bangalore',
                            "team": 'BRL_SM_OP'
                        },
                        {
                            "code": 'NOT_ASSIGN',
                            "name": 'Not assigned',
                            "team": 'BRL_APP_OP'
                        },
                        {
                            "code": 'ADHOC_ACTI_SM_EU',
                            "name": 'Adhoc activity sm Hungary and Germany',
                            "team": 'EU_SM_OP'
                        },
                        {
                            "code": 'ADHOC_ACTI_APP_EU',
                            "name": 'Adhoc activity Application Hungary and Germany',
                            "team": 'EU_APP_OP'
                        },
                        {
                            "code": 'ADHOC_ACTI_NON_OPS',
                            "name": 'Adhoc activity no ops',
                            "team": 'NON_OPS'
                        },
                    ]

menu_url = [

                {
                    'name':'Dashboard',
                    'icon': '<rect x="2" y="2" width="9" height="9" rx="2" fill="black"/><rect opacity="0.3" x="13" y="2" width="9" height="9" rx="2" fill="black"/><rect opacity="0.3" x="13" y="13" width="9" height="9" rx="2" fill="black"/><rect opacity="0.3" x="2" y="13" width="9" height="9" rx="2" fill="black"/>',
                    'order': 0,
                    'menu_type': '3', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'Home',
                                        'url':'/home',
                                        'access_group': ['ops_member', 'non_ops_member', 'no_access'],
                                        'is_live': True,
                                        'order': 1
                                    }
                                ]
                },
                {
                    'name':'Menu',
                    'icon': '.',
                    'order': 1,
                    'menu_type': '1', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'Menu',
                                        'url':'.',
                                        'access_group': ['ops_member', 'non_ops_member', 'no_access'],
                                        'is_live': True,
                                        'order': 1
                                    }
                                ]
                },
                {
                    'name':'Application',
                    'icon': '<path opacity="0.3" d="M7 20.5L2 17.6V11.8L7 8.90002L12 11.8V17.6L7 20.5ZM21 20.8V18.5L19 17.3L17 18.5V20.8L19 22L21 20.8Z" fill="black"/><path d="M22 14.1V6L15 2L8 6V14.1L15 18.2L22 14.1Z" fill="black"/>',
                    'order': 2,
                    'menu_type': '2', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'System',
                                        'url':'/cld/system?LifeCycleStatus!=D',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 1
                                    },
                                    {
                                        'name':'Host',
                                        'url':'/cld/host?LifeCycleStatus!=D&InstanceType!=DBC',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 2
                                    },
                                    {
                                        'name':'Tenant',
                                        'url':'/cld/tenant?SystemLifeCycleStatus!=D',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 3
                                    },
                                     {
                                        'name':'Dashboard',
                                        'url':'/cld',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 1
                                    }
                                ]
                },
                {
                    'name':'Availability',
                    'icon': '<path d="M15.43 8.56949L10.744 15.1395C10.6422 15.282 10.5804 15.4492 10.5651 15.6236C10.5498 15.7981 10.5815 15.9734 10.657 16.1315L13.194 21.4425C13.2737 21.6097 13.3991 21.751 13.5557 21.8499C13.7123 21.9488 13.8938 22.0014 14.079 22.0015H14.117C14.3087 21.9941 14.4941 21.9307 14.6502 21.8191C14.8062 21.7075 14.9261 21.5526 14.995 21.3735L21.933 3.33649C22.0011 3.15918 22.0164 2.96594 21.977 2.78013C21.9376 2.59432 21.8452 2.4239 21.711 2.28949L15.43 8.56949Z" fill="black"/><path opacity="0.3" d="M20.664 2.06648L2.62602 9.00148C2.44768 9.07085 2.29348 9.19082 2.1824 9.34663C2.07131 9.50244 2.00818 9.68731 2.00074 9.87853C1.99331 10.0697 2.04189 10.259 2.14054 10.4229C2.23919 10.5869 2.38359 10.7185 2.55601 10.8015L7.86601 13.3365C8.02383 13.4126 8.19925 13.4448 8.37382 13.4297C8.54839 13.4145 8.71565 13.3526 8.85801 13.2505L15.43 8.56548L21.711 2.28448C21.5762 2.15096 21.4055 2.05932 21.2198 2.02064C21.034 1.98196 20.8409 1.99788 20.664 2.06648Z" fill="black"/>',
                    'order': 3,
                    'menu_type': '2', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'Dashboard_application',
                                        'url':'/availability',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 1
                                    },
                                ]
                },
                {
                    'name':'Monitoring',
                    'icon': '<path opacity="0.3" d="M12.025 4.725C9.725 2.425 6.025 2.425 3.725 4.725C1.425 7.025 1.425 10.725 3.725 13.025L11.325 20.625C11.725 21.025 12.325 21.025 12.725 20.625L20.325 13.025C22.625 10.725 22.625 7.025 20.325 4.725C18.025 2.425 14.325 2.425 12.025 4.725Z" fill="black"/><path d="M14.025 17.125H13.925C13.525 17.025 13.125 16.725 13.025 16.325L11.925 11.125L11.025 14.325C10.925 14.725 10.625 15.025 10.225 15.025C9.825 15.125 9.425 14.925 9.225 14.625L7.725 12.325L6.525 12.925C6.425 13.025 6.225 13.025 6.125 13.025H3.125C2.525 13.025 2.125 12.625 2.125 12.025C2.125 11.425 2.525 11.025 3.125 11.025H5.925L7.725 10.125C8.225 9.925 8.725 10.025 9.025 10.425L9.825 11.625L11.225 6.72498C11.325 6.32498 11.725 6.02502 12.225 6.02502C12.725 6.02502 13.025 6.32495 13.125 6.82495L14.525 13.025L15.225 11.525C15.425 11.225 15.725 10.925 16.125 10.925H21.125C21.725 10.925 22.125 11.325 22.125 11.925C22.125 12.525 21.725 12.925 21.125 12.925H16.725L15.025 16.325C14.725 16.925 14.425 17.125 14.025 17.125Z" fill="black"/>',
                    'order': 4,
                    'menu_type': '2', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'Pingdom',
                                        'url':'/pingdom',
                                        'access_group': ['ops_member', 'non_ops_member', 'no_access'],
                                        'is_live': True,
                                        'order': 1
                                    },
                                    {
                                        'name':'Pingdom Acknowledgement',
                                        'url':'/pingdom/acknowledgement/data?Status=down',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 2
                                    },

                                    {
                                        'name':'Uptime',
                                        'url':'/uptime',
                                        'access_group': ['ops_member', 'non_ops_member', 'no_access'],
                                        'is_live': True,
                                        'order': 3
                                    },
                                    {
                                        'name':'Uptime Acknowledgement',
                                        'url':'/uptime/acknowledgement/data?Status=down',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 4
                                    },
                                ]
                },
                {
                    'name':'Shift Roster',
                    'icon': '<path opacity="0.3" d="M21 22H3C2.4 22 2 21.6 2 21V5C2 4.4 2.4 4 3 4H21C21.6 4 22 4.4 22 5V21C22 21.6 21.6 22 21 22Z" fill="black"/><path d="M6 6C5.4 6 5 5.6 5 5V3C5 2.4 5.4 2 6 2C6.6 2 7 2.4 7 3V5C7 5.6 6.6 6 6 6ZM11 5V3C11 2.4 10.6 2 10 2C9.4 2 9 2.4 9 3V5C9 5.6 9.4 6 10 6C10.6 6 11 5.6 11 5ZM15 5V3C15 2.4 14.6 2 14 2C13.4 2 13 2.4 13 3V5C13 5.6 13.4 6 14 6C14.6 6 15 5.6 15 5ZM19 5V3C19 2.4 18.6 2 18 2C17.4 2 17 2.4 17 3V5C17 5.6 17.4 6 18 6C18.6 6 19 5.6 19 5Z" fill="black"/><path d="M8.8 13.1C9.2 13.1 9.5 13 9.7 12.8C9.9 12.6 10.1 12.3 10.1 11.9C10.1 11.6 10 11.3 9.8 11.1C9.6 10.9 9.3 10.8 9 10.8C8.8 10.8 8.59999 10.8 8.39999 10.9C8.19999 11 8.1 11.1 8 11.2C7.9 11.3 7.8 11.4 7.7 11.6C7.6 11.8 7.5 11.9 7.5 12.1C7.5 12.2 7.4 12.2 7.3 12.3C7.2 12.4 7.09999 12.4 6.89999 12.4C6.69999 12.4 6.6 12.3 6.5 12.2C6.4 12.1 6.3 11.9 6.3 11.7C6.3 11.5 6.4 11.3 6.5 11.1C6.6 10.9 6.8 10.7 7 10.5C7.2 10.3 7.49999 10.1 7.89999 10C8.29999 9.90003 8.60001 9.80003 9.10001 9.80003C9.50001 9.80003 9.80001 9.90003 10.1 10C10.4 10.1 10.7 10.3 10.9 10.4C11.1 10.5 11.3 10.8 11.4 11.1C11.5 11.4 11.6 11.6 11.6 11.9C11.6 12.3 11.5 12.6 11.3 12.9C11.1 13.2 10.9 13.5 10.6 13.7C10.9 13.9 11.2 14.1 11.4 14.3C11.6 14.5 11.8 14.7 11.9 15C12 15.3 12.1 15.5 12.1 15.8C12.1 16.2 12 16.5 11.9 16.8C11.8 17.1 11.5 17.4 11.3 17.7C11.1 18 10.7 18.2 10.3 18.3C9.9 18.4 9.5 18.5 9 18.5C8.5 18.5 8.1 18.4 7.7 18.2C7.3 18 7 17.8 6.8 17.6C6.6 17.4 6.4 17.1 6.3 16.8C6.2 16.5 6.10001 16.3 6.10001 16.1C6.10001 15.9 6.2 15.7 6.3 15.6C6.4 15.5 6.6 15.4 6.8 15.4C6.9 15.4 7.00001 15.4 7.10001 15.5C7.20001 15.6 7.3 15.6 7.3 15.7C7.5 16.2 7.7 16.6 8 16.9C8.3 17.2 8.6 17.3 9 17.3C9.2 17.3 9.5 17.2 9.7 17.1C9.9 17 10.1 16.8 10.3 16.6C10.5 16.4 10.5 16.1 10.5 15.8C10.5 15.3 10.4 15 10.1 14.7C9.80001 14.4 9.50001 14.3 9.10001 14.3C9.00001 14.3 8.9 14.3 8.7 14.3C8.5 14.3 8.39999 14.3 8.39999 14.3C8.19999 14.3 7.99999 14.2 7.89999 14.1C7.79999 14 7.7 13.8 7.7 13.7C7.7 13.5 7.79999 13.4 7.89999 13.2C7.99999 13 8.2 13 8.5 13H8.8V13.1ZM15.3 17.5V12.2C14.3 13 13.6 13.3 13.3 13.3C13.1 13.3 13 13.2 12.9 13.1C12.8 13 12.7 12.8 12.7 12.6C12.7 12.4 12.8 12.3 12.9 12.2C13 12.1 13.2 12 13.6 11.8C14.1 11.6 14.5 11.3 14.7 11.1C14.9 10.9 15.2 10.6 15.5 10.3C15.8 10 15.9 9.80003 15.9 9.70003C15.9 9.60003 16.1 9.60004 16.3 9.60004C16.5 9.60004 16.7 9.70003 16.8 9.80003C16.9 9.90003 17 10.2 17 10.5V17.2C17 18 16.7 18.4 16.2 18.4C16 18.4 15.8 18.3 15.6 18.2C15.4 18.1 15.3 17.8 15.3 17.5Z" fill="black"/>',
                    'order': 5,
                    'menu_type': '2', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    
                                    
                                    {
                                        'name':'Todays Shift',
                                        'url':'/roster',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 1
                                    },
                                    {
                                        'name':'Monthly Roster',
                                        'url':'/roster/shift/plan',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 2
                                    },
                                    {
                                        'name':'My Workday Plan',
                                        'url':'/roster/work/plan',
                                        'access_group': ['ops_member'],
                                        'is_live': True,
                                        'order': 3
                                    },
                                    {
                                        'name':'Admin',
                                        'url':'/roster/shift/admin',
                                        'access_group': ['shift_planner'],
                                        'is_live': True,
                                        'order': 4
                                    }
                                ]
                },
                {
                    'name':'Notification',
                    'icon': '<path opacity="0.3" d="M5 8.04999L11.8 11.95V19.85L5 15.85V8.04999Z" fill="black"/><path d="M20.1 6.65L12.3 2.15C12 1.95 11.6 1.95 11.3 2.15L3.5 6.65C3.2 6.85 3 7.15 3 7.45V16.45C3 16.75 3.2 17.15 3.5 17.25L11.3 21.75C11.5 21.85 11.6 21.85 11.8 21.85C12 21.85 12.1 21.85 12.3 21.75L20.1 17.25C20.4 17.05 20.6 16.75 20.6 16.45V7.45C20.6 7.15 20.4 6.75 20.1 6.65ZM5 15.85V7.95L11.8 4.05L18.6 7.95L11.8 11.95V19.85L5 15.85Z" fill="black"/>',
                    'order': 6,
                    'menu_type': '2', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'Notification KPI',
                                        'url':'/notification/event/view',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 1
                                    },
                                ]
                },
                {
                    'name':'vulnerablity_dashboard',
                    'icon': '<path opacity="0.3" d="M5 8.04999L11.8 11.95V19.85L5 15.85V8.04999Z" fill="black"/><path d="M20.1 6.65L12.3 2.15C12 1.95 11.6 1.95 11.3 2.15L3.5 6.65C3.2 6.85 3 7.15 3 7.45V16.45C3 16.75 3.2 17.15 3.5 17.25L11.3 21.75C11.5 21.85 11.6 21.85 11.8 21.85C12 21.85 12.1 21.85 12.3 21.75L20.1 17.25C20.4 17.05 20.6 16.75 20.6 16.45V7.45C20.6 7.15 20.4 6.75 20.1 6.65ZM5 15.85V7.95L11.8 4.05L18.6 7.95L11.8 11.95V19.85L5 15.85Z" fill="black"/>',
                    'order': 10,
                    'menu_type': '2', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'vulnerablity_dashboard',
                                        'url':'/vulnerablity_dashboard',
                                        'access_group': ['ops_member', 'non_ops_member'],
                                        'is_live': True,
                                        'order': 1
                                    },
                                ]
                },
                {
                    'name':'Settings',
                    'icon': '..',
                    'order': 7,
                    'menu_type': '1', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'Settings',
                                        'url':'..',
                                        'access_group': ['admin'],
                                        'is_live': True,
                                        'order': 1
                                    }
                                ]
                },
                {
                    'name':'User Accounts',
                    'icon': '<path d="M16.0173 9H15.3945C14.2833 9 13.263 9.61425 12.7431 10.5963L12.154 11.7091C12.0645 11.8781 12.1072 12.0868 12.2559 12.2071L12.6402 12.5183C13.2631 13.0225 13.7556 13.6691 14.0764 14.4035L14.2321 14.7601C14.2957 14.9058 14.4396 15 14.5987 15H18.6747C19.7297 15 20.4057 13.8774 19.912 12.945L18.6686 10.5963C18.1487 9.61425 17.1285 9 16.0173 9Z" fill="black"/><rect opacity="0.3" x="14" y="4" width="4" height="4" rx="2" fill="black"/><path d="M4.65486 14.8559C5.40389 13.1224 7.11161 12 9 12C10.8884 12 12.5961 13.1224 13.3451 14.8559L14.793 18.2067C15.3636 19.5271 14.3955 21 12.9571 21H5.04292C3.60453 21 2.63644 19.5271 3.20698 18.2067L4.65486 14.8559Z" fill="black"/><rect opacity="0.3" x="6" y="5" width="6" height="6" rx="3" fill="black"/>',
                    'order': 8,
                    'menu_type': '3', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    {
                                        'name':'User Accounts',
                                        'url':'/ua/users',
                                        'access_group': ['admin'],
                                        'is_live': True,
                                        'order': 1
                                    }
                                ]
                },
                {
                    'name':'Work Group Owner',
                    'icon': '<path opacity="0.3" d="M20.5543 4.37824L12.1798 2.02473C12.0626 1.99176 11.9376 1.99176 11.8203 2.02473L3.44572 4.37824C3.18118 4.45258 3 4.6807 3 4.93945V13.569C3 14.6914 3.48509 15.8404 4.4417 16.984C5.17231 17.8575 6.18314 18.7345 7.446 19.5909C9.56752 21.0295 11.6566 21.912 11.7445 21.9488C11.8258 21.9829 11.9129 22 12.0001 22C12.0872 22 12.1744 21.983 12.2557 21.9488C12.3435 21.912 14.4326 21.0295 16.5541 19.5909C17.8169 18.7345 18.8277 17.8575 19.5584 16.984C20.515 15.8404 21 14.6914 21 13.569V4.93945C21 4.6807 20.8189 4.45258 20.5543 4.37824Z" fill="black"/><path d="M12.0006 11.1542C13.1434 11.1542 14.0777 10.22 14.0777 9.0771C14.0777 7.93424 13.1434 7 12.0006 7C10.8577 7 9.92348 7.93424 9.92348 9.0771C9.92348 10.22 10.8577 11.1542 12.0006 11.1542Z" fill="black"/><path d="M15.5652 13.814C15.5108 13.6779 15.4382 13.551 15.3566 13.4331C14.9393 12.8163 14.2954 12.4081 13.5697 12.3083C13.479 12.2993 13.3793 12.3174 13.3067 12.3718C12.9257 12.653 12.4722 12.7981 12.0006 12.7981C11.5289 12.7981 11.0754 12.653 10.6944 12.3718C10.6219 12.3174 10.5221 12.2902 10.4314 12.3083C9.70578 12.4081 9.05272 12.8163 8.64456 13.4331C8.56293 13.551 8.49036 13.687 8.43595 13.814C8.40875 13.8684 8.41781 13.9319 8.44502 13.9864C8.51759 14.1133 8.60828 14.2403 8.68991 14.3492C8.81689 14.5215 8.95295 14.6757 9.10715 14.8208C9.23413 14.9478 9.37925 15.0657 9.52439 15.1836C10.2409 15.7188 11.1026 15.9999 11.9915 15.9999C12.8804 15.9999 13.7421 15.7188 14.4586 15.1836C14.6038 15.0748 14.7489 14.9478 14.8759 14.8208C15.021 14.6757 15.1661 14.5215 15.2931 14.3492C15.3838 14.2312 15.4655 14.1133 15.538 13.9864C15.5833 13.9319 15.5924 13.8684 15.5652 13.814Z" fill="black"/>',
                    'order': 9,
                    'menu_type': '3', # ("1", 'BLOCK'), ("2", 'STACK'), ("3", 'SINGLE MENU')
                    'url_list':[
                                    
                                    {
                                        'name':'Work Group Owner',
                                        'url':'/ua/workgroup/owner',
                                        'access_group': ['admin'],
                                        'is_live': True,
                                        'order': 0
                                    }
                                ]
                },
            ]

page_access_list = [
    
                        {
                            'url_name': 'menuOptions', 
                            'space_name': 'system_configuration', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        }, 
                        {
                            'url_name': 'home_html', 
                            'space_name': 'home', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        }, 
                        {
                            'url_name': 'logout', 
                            'space_name': 'user_account', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        }, 
                        {
                            'url_name': 'cht_sys_pip', 
                            'space_name': 'spc_cld', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        }, 
                        {
                            'url_name': 'cht_sys_dip', 
                            'space_name': 'spc_cld', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        }, 
                        {
                            'url_name': 'update_pingdom_check', 
                            'space_name': 'pingdom', 
                            'request_method': 'PUT', 
                            'access_name': 'modify_pingdom_access', 
                            'is_allow_everyone': False
                        }, 
                        {
                            'url_name': 'get_dc_info', 
                            'space_name': 'pingdom', 
                            'request_method': 'GET', 
                            'access_name': 'get_dc_info', 
                            'is_allow_everyone': False
                        }, 
                        {
                            'url_name': 'pingdom_dashboard_html', 
                            'space_name': 'pingdom', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        }, 
                        {
                            'url_name': 'check_status', 
                            'space_name': 'pingdom', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        }, 
                        {
                            'url_name': 'update_comment_view', 
                            'space_name': 'pingdom', 
                            'request_method': 'POST', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        }, 
                        {
                            'url_name': 'acknowledge_downtime_system', 
                            'space_name': 'pingdom', 
                            'request_method': 'POST', 
                            'access_name': 'acknowledge_downtime_access', 
                            'is_allow_everyone': False
                        }, 
                        {
                            'url_name': 'acknowledge_downtime_system', 
                            'space_name': 'pingdom', 
                            'request_method': 'GET', 
                            'access_name': 'view_acknowledge_downtime_access', 
                            'is_allow_everyone': False
                        }, 
                        {
                            'url_name': 'sync_pingdom_status', 
                            'space_name': 'pingdom', 
                            'request_method': 'GET', 
                            'access_name': 'pingdom_sync_access', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'get_dc_info', 
                            'space_name': 'uptime', 
                            'request_method': 'GET', 
                            'access_name': 'get_dc_info', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'uptime_dashboard_html', 
                            'space_name': 'uptime', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        },
                        {
                            'url_name': 'check_status', 
                            'space_name': 'uptime', 
                            'request_method': 'GET', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        },
                        {
                            'url_name': 'update_comment_view', 
                            'space_name': 'uptime', 
                            'request_method': 'POST', 
                            'access_name': None, 
                            'is_allow_everyone': True
                        },
                        {
                            'url_name': 'acknowledge_downtime_system', 
                            'space_name': 'uptime', 
                            'request_method': 'POST', 
                            'access_name': 'acknowledge_downtime_access', 
                            'is_allow_everyone': False
                        }, 
                        {
                            'url_name': 'acknowledge_downtime_system', 
                            'space_name': 'uptime', 
                            'request_method': 'GET', 
                            'access_name': 'view_acknowledge_downtime_access', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'sync_uptime_status', 
                            'space_name': 'uptime', 
                            'request_method': 'GET', 
                            'access_name': 'uptime_sync_access', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'get_shift_plan_admin', 
                            'space_name': 'roster', 
                            'request_method': 'GET', 
                            'access_name': 'shift_planner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'dinamic_url', 
                            'space_name': 'redirect', 
                            'request_method': 'GET', 
                            'access_name': '', 
                            'is_allow_everyone': True
                        },
                        {
                            'url_name': 'shift_type_html', 
                            'space_name': 'roster', 
                            'request_method': 'GET', 
                            'access_name': 'shift_planner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'shift_type-list', 
                            'space_name': 'roster', 
                            'request_method': 'GET', 
                            'access_name': 'view_shift_type', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'shift_type-detail', 
                            'space_name': 'roster', 
                            'request_method': 'GET', 
                            'access_name': 'view_shift_type', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'shift_type-detail', 
                            'space_name': 'roster', 
                            'request_method': 'PATCH', 
                            'access_name': 'update_shift_type', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'shift_type-detail', 
                            'space_name': 'roster', 
                            'request_method': 'DELETE', 
                            'access_name': 'delete_shift_type', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'user-list', 
                            'space_name': 'user_account', 
                            'request_method': 'GET', 
                            'access_name': 'view_user_info', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'user-detail', 
                            'space_name': 'user_account', 
                            'request_method': 'GET', 
                            'access_name': 'view_user_info', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'user-detail', 
                            'space_name': 'user_account', 
                            'request_method': 'PATCH', 
                            'access_name': 'update_user_info', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'update_user_group', 
                            'space_name': 'user_account', 
                            'request_method': 'PATCH', 
                            'access_name': 'update_user_info', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'user-detail', 
                            'space_name': 'user_account', 
                            'request_method': 'DELETE', 
                            'access_name': 'delete_user_info', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'approve_work_group_request', 
                            'space_name': 'user_account', 
                            'request_method': 'POST', 
                            'access_name': 'shift_planner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'reject_work_group_request', 
                            'space_name': 'user_account', 
                            'request_method': 'POST', 
                            'access_name': 'shift_planner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'create_work_group_request', 
                            'space_name': 'user_account', 
                            'request_method': 'POST', 
                            'access_name': 'shift_planner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'update_shift_member_leave', 
                            'space_name': 'roster', 
                            'request_method': 'POST', 
                            'access_name': 'update_member_leave', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'sub_team_owner-list', 
                            'space_name': 'user_account', 
                            'request_method': 'GET', 
                            'access_name': 'view_work_group_owner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'sub_team_owner-detail', 
                            'space_name': 'user_account', 
                            'request_method': 'GET', 
                            'access_name': 'view_work_group_owner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'sub_team_owner-detail', 
                            'space_name': 'user_account', 
                            'request_method': 'PATCH', 
                            'access_name': 'update_work_group_owner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'sub_team_owner-detail', 
                            'space_name': 'user_account', 
                            'request_method': 'DELETE', 
                            'access_name': 'delete_work_group_owner', 
                            'is_allow_everyone': False
                        },
                        {
                            'url_name': 'sub_team_owner-list', 
                            'space_name': 'user_account', 
                            'request_method': 'POST', 
                            'access_name': 'create_work_group_owner', 
                            'is_allow_everyone': False
                        },
                        
                    ]

default_api_urls = [
                        {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemBusinessTypeCollection?$format=json',                         
                         'description': 'Business type Description',
                         'unique_id': 'CLD_SYS_ZHCODE_DESC'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemCollection?%24format=json&%24top=1000&%24skip={0}',
                         
                         'description': 'System collection data',
                         'unique_id': 'CLD_SYSTEM_DATA'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemCollection/$count',
                         
                         'description': 'System Collection count',
                         'unique_id': 'CLD_SYSTEM_COUNT'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemLifeCycleStatusCollection?$format=json',
                         
                         'description': 'Life Cycle Description',
                         'unique_id': 'CLD_STATUS_DESC'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/HostInstanceCollection?%24format=json&%24top=1000&%24skip={0}',
                         
                         'description': 'Host collection data',
                         'unique_id': 'CLD_HOST_DATA'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/HostInstanceCollection/$count',
                         
                         'description': 'Host Collection count',
                         'unique_id': 'CLD_HOST_COUNT'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemDataCenterIDCollection?$format=json',
                         
                         'description': 'Datacenter description',
                         'unique_id': 'CLD_DC_DESC'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemDataBaseHATypeCollection?$format=json',
                         
                         'description': 'Description of System Database HR TypeCollection',
                         'unique_id': 'CLD_DB_HA'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemDataBaseDRTypeCollection?$format=json',
                         
                         'description': 'Description of System Databse DR TypeCollection',
                         'unique_id': 'CLD_DB_DR'
                         },
                         {'end_point':"https://domain_name/sap/byd/odata/v1/communicatedavailability/CommunicatedAvailabilityCollection?$format=json&$filter=StartDateTime eq datetimeoffset'{report_date}T00:00:00.0000000Z'%20and%20AggregationTypeCode%20eq%20%27{type}%27%20and%20SystemRole%20eq%20%27{system_role}%27",
                         
                         'description': 'Daily availability percentage',
                         'unique_id': 'NOTIFICATION_PER'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/TenantTenantBusinessTypeCollection?$format=json',
                         
                         'description': 'Description of Tenant Type',
                         'unique_id': 'CLD_TEN_ZHCODE_DESC'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/TenantCollection?%24format=json&%24top=1000&%24skip={0}',
                         
                         'description': 'Tenant colection data',
                         'unique_id': 'CLD_TENANT_DATA'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/TenantCollection/$count',
                         
                         'description': 'Tenant Collection count endpoint',
                         'unique_id': 'CLD_TENANT_COUNT'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemApplicationHATypeCollection?$format=json',
                         
                         'description': 'Description of System Application HR TypeCollection',
                         'unique_id': 'CLD_APP_HA'
                         },
                         {'end_point':'https://domain_name/sap/spc/odata/v1/cld4s4opsinternaldashboard/SystemApplicationDRTypeCollection?$format=json',
                         
                         'description': 'Description of System Application DR TypeCollection',
                         'unique_id': 'CLD_APP_DR'
                         },
                         {'end_point':'https://api.pingdom.com/api/3.1/checks',                         
                         'description': 'PIngdom API 3',
                         'unique_id': 'PINGDOM_API_3'
                         },
                         {'end_point':'https://uptime.sapcloud.io/b/api/reportservice/uptimereport/monitors',                  
                         'description': 'Uptime Status',
                         'unique_id': 'UPTIME_API'
                         },
                         {'end_point': "https://api.pingdom.com/api/3.1/summary.outage/{id}?order=asc&from={fromdate}&to={todate}",
                         "description": "Get system History",
                         "unique_id": "PINGDOM_API_3_CHECK_HISTORY"
                         },
                         {'end_point': "https://domain_name/sap/spc/odata/v1/notification_events/NTDBMailLogEmailNotificationSubTypeCollection?$format=json",
                         "description": "Notification Sub Type Description",
                         "unique_id": "NOTIFI_SUB_TYPE"
                         },
                         {'end_point': "https://domain_name/sap/spc/odata/v1/notification_events/NotifcationEventNotificationTypeCollection?$format=json",
                         "description": "Notification Type Description",
                         "unique_id": "NOTIFI_TYPE"
                         },
                         {'end_point': "https://domain_name/sap/spc/odata/v1/notification_events/NotifcationEventServiceStatusCollection?$format=json",
                         "description": "Notification Service Status",
                         "unique_id": "SERVICE_STATUS"
                         },
                         {'end_point': "https://domain_name/sap/spc/odata/v1/notification_events/NotifcationEventStatusCollection?$format=json",
                         "description": "Notification Status",
                         "unique_id": "NOTIFI_STATUS"
                         },
                         {'end_point': "https://domain_name/sap/spc/odata/v1/notification_events/NotifcationEventPhaseCollection?$format=json",
                         "description": "Notification Phase",
                         "unique_id": "NOTIFI_PHASE"
                         },
                         {'end_point': "https://spc.ondemand.com/sap/spc/odata/v1/notification_events/NTDBMailLogEmailCollection?$format=json&$expand=NotifcationEvent,NotifcationEvent/NTDBMailLogTenants&$filter=({systemroles})and(EntityLastChangedOn%20ge%20datetimeoffset%27{starttime}%27%20and%20EntityLastChangedOn%20le%20datetimeoffset%27{endtime}%27)%20and%20(NotifcationEvent/ServiceStatus%20eq%20%271%27or%20NotifcationEvent/ServiceStatus%20eq%20%272%27)",
                         "description": "Notification Data",
                         "unique_id": "NOTIFICATION_API"
                         },
                         {'end_point': "https://reporting.ondemand.com/sap/crp/cdo?type=crp_ibp&group_by=src_tenant_id,src_system_id,src_system_role,src_system_lifecycle_status,src_sw_name,db_system_id,db_application_host_fqd_name,cs_name_fqdn&csv=X&csv_id=idET090OW7SH6RKH43G8OEKCNDM&display=cv_ten_db&optional_filter=true&src_external_id=000&src_sw_name={SYSTEM_TYPE}&src_system_lifecycle_status=LIVE,TORN_DOWN&subtype=tile&db_id=__my_dashboard",
                         "description": "Tenant Allocation Limit",
                         "unique_id": "TENANT_AL_LIMIT"
                         },
                         {'end_point': "https://reporting.ondemand.com/sap/crp/cdo?type=crp_ord&list=6&group_by=customer_name,sales_region,country&csv=X&csv_id=crp_ord_6&product_id=0000000000000000000000000000000008005720,0000000000000000000000000000000008012323&sort_by=customer_name&db_id=c9-02",
                         "description": "DR SYSTEMS",
                         "unique_id": "DR_SYSTEMS"
                         },
                         {'end_point': "https://reporting.ondemand.com/sap/crp/cdo?csv&type=crp_cid&add_module_type={SYSTEM_TYPE}&date={start_report_date}&date_to={end_report_date}&db_id=ciddb-01&downtime_type=2&list=30&period_type=dp",
                         "description": "Cloud Report Notification Data",
                         "unique_id": "CR_NOTIFICATION_API"
                         },

]

auth_groups_list = [
    {
        "name": "admin",
        "permissions": [
            "create_work_group_owner", "delete_user_info", "delete_work_group_owner",
            "update_user_info", "update_work_group_owner", "view_user_info", "view_work_group_owner"
        ]
    },
    {
        "name": "no_access",
        "permissions": ["limited_access_cust"]
    },
    {
        "name": "non_ops_member",
        "permissions": ["get_dc_info", "has_access"]
    },
    {
        "name": "ops_member",
        "permissions": ["get_dc_info", "team_member"]
    },
    {
        "name": "shift_planner",
        "permissions": ["shift_planner"]
    }
]