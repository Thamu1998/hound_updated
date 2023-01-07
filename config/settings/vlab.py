print("Importing vlab settings")
from config.settings.base import *

#override base.py settings here

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = False

USE_CERT = True

ALLOWED_HOSTS = [os.getenv('ALLOWED_HOSTS'),]

DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': os.getenv('DATABASE_NAME'),
            'USER': os.getenv('DATABASE_USERNAME'),
            'PASSWORD': os.getenv('DATABASE_PASSWORD'),
            'HOST': os.getenv('DATABASE_HOST'),
            'PORT': '5432',
        },
}

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CORS_REPLACE_HTTPS_REFERER = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')