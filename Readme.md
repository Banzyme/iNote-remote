# iNOte Prototype App
Angular CLI: 7.0.4
Node: 10.13.0
OS: linux x64
Angular: 7.0.3

* Author: ENDEESA
* Frameworks: Django REST API, Angular 7, Google Calender API, Google Text To Speech API
* **Live demo:** https://inote-222016.firebaseapp.com/


## Run instructions
> You need to setup both django and angular on your machine to run the app locally

**Angular**
> Make sure your have node and npm installed from [here](https://nodejs.org/en/) 
* Clone the repo and navigate to **frontend/iNOte**
* Install angular cli:  $ npm install -g @angular/cli
* Install app dependencies:  $ npm install
* Once finished, you can run the app by running:  $ ng serve -o
* The app will run on : **localhost:4200** by default
....
> Note that you might need to configure your own GCP project(s) for some features to work properly
* Let me know if you face any issues, 


**Django**
Option 1(Not recommended):        Create a virtual environment and run django locally as follows
* sudo apt install virtualenv
.......
* Clone repo and navigate to **backend/iNOte**
* Delete any .venv folder inside this directory
* Create a new virtual environment:   $ virtual .venv -p python3

* Activate environment:  $ . .venv/bin/activate
..
>Install project dependancies
* $ pip install -r requirements.text
* Now: run the django rest api as follows:  $ python manage.py runserver --settings=events.settings