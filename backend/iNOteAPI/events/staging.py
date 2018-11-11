from events.settings import *
import dj_database_url



# # Overide for prod env
ALLOWED_HOSTS = [".herokuapp.com", ".heroku.com"]
DEBUG=False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

DATABASES={}
DATABASES['default'] = dj_database_url.config(default=config('DATABASE_URL'))
