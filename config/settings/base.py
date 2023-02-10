from pathlib import Path
import os
import sys
import socket

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..')))

print(BASE_DIR)
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")

STATIC_DIRS = os.path.join(BASE_DIR, "static")

MEDIA_DIR = os.path.join(BASE_DIR, "media")

sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'Key_will_get_override_in_production'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

AUTH_USER_MODEL = "user_account.User" 

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'background_task',
    'rest_framework',
    'django_filters',
    'rest_framework.authtoken',
    'swagger',
    'drf_multiple_model',
    'apps.user_account',
    'apps.system_configuration',
    'apps.spc_cld',
    'apps.gendoc',
    'apps.home',
    'apps.event_notification',
    'apps.daily_availability',
    'apps.pingdom',
    'apps.uptime',
    'apps.roster',
    'apps.link',
    'apps.notification',
    'apps.shiftpasstool',
    'apps.vulnerablity_dashboard'
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'config.middleware.auth.LoginRequiredMiddleware'
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATE_DIR, ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
    }
}

SWAGGER_SETTINGS = {  
    'SUPPORTED_SUBMIT_METHODS':['get', 'post', 'put', 'delete', 'patch'],
    'title': 'StoxUp API Docs',
    'is_superuser': True,
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        # 'rest_framework.renderers.BrowsableAPIRenderer',
        'rest_framework.renderers.JSONRenderer',
        'config.rest_framework_datatables.renderers.DatatablesRenderer',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'config.rest_framework_datatables.filters.DatatablesFilterBackend',
    ), 
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'config.middleware.auth.BearerAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
        'config.middleware.auth.DisableOptionsPermission',
        # 'config.middleware.auth.CustomPermissionCheck'
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework_datatables.pagination.DatatablesPageNumberPagination',
    'PAGE_SIZE': 500,
}

LOGOUT_REDIRECT_URL = '/'

LOGIN_REDIRECT_URL = '/home'

LOGIN_URL = '/ua/login'

LOGOUT_URL = '/ua/logout'

LOGIN_REQUIRED_IGNORE_PATHS = []

LOGIN_REQUIRED_IGNORE_VIEW_NAMES = ['user_account:login_html']

ALLOWED_PAGE_NON_TEAM = [ ]

# Security settings
SECURE_HSTS_SECONDS = 15768000

SECURE_HSTS_INCLUDE_SUBDOMAINS  = True

SECURE_HSTS_PRELOAD = True

X_FRAME_OPTIONS = 'DENY'

REFERRER_POLICY = 'same-origin'

SECURE_BROWSER_XSS_FILTER = True

SECURE_FRAME_DENY = True

SECURE_CONTENT_TYPE_NOSNIFF = True

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATIC_URL = '/static/'

STATICFILES_DIRS = [STATIC_DIRS,]

# Medta files location
MEDIA_ROOT = MEDIA_DIR

MEDIA_URL = '/media/'

ADMIN_SITE_HEADER = "Hound Administration"

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

HANDLER500 = '/ua/test'

Team = os.getenv('TEAM_ID')

CAM_APP_TEAM = os.getenv('CAM_APP_TEAM')

CAM_SM_TEAM = os.getenv('CAM_SM_TEAM')

CAM_APP_READ = os.getenv('CAM_APP_READ')

APPENV = os.getenv('APPENV')

##############BACKGROUND-JOBS##################################
MAX_ATTEMPTS = 1


# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'mail-rot.shp.rot.s4h.sap.corp'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'cisco@shp.rot.s4h.sap.corp'
# EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', 'DummyValue')

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'jeevanom306@gmail.com'
EMAIL_HOST_PASSWORD = 'oagzeisxabtwprcm'
EMAIL_PORT = 587
