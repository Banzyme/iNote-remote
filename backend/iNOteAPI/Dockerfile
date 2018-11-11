#  Main container
 FROM python:3
 MAINTAINER endeesa
 ENV PYTHONUNBUFFERED 1
 ENV PORT 5000
 RUN mkdir /src
 WORKDIR /src
 ADD entrypoint.sh /src/
 ADD requirements.txt /src/
 RUN pip install --upgrade pip
 RUN pip install --upgrade -r requirements.txt
 ADD . /src
 
# Uncomment this line to use django native server localy
#  RUN ["chmod", "+x", "/src/entrypoint.sh"]
#  # ENTRYPOINT ["bash", "./entrypoint.sh"]


#  Prod environment run command
 CMD python3 manage.py makemigrations &&\
     python3 manage.py migrate &&\
     gunicorn --env DJANGO_SETTINGS_MODULE=events.staging events.wsgi -b 0.0.0.0:$PORT --log-file -
