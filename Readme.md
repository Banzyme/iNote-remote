# iNOte Prototype App
Angular CLI: 7.0.4
Node: 10.13.0
OS: linux x64
Angular: 7.0.3

* Author: ENDEESA
* Frameworks: Django REST API, Angular 7, Google Calender API, Google Text To Speech API
* **Live demo:** https://inote-222016.firebaseapp.com/

<style>
span{
    color: skyblue;
    font-weight: 500;
}
</style>

## Run instructions

**Angular**
> Make sure your have node and npm installed from [here](https://nodejs.org/en/) 
* Clone the repo and navigate to **frontend/iNOte**
* Install angular cli:\
    * $ <span>npm install -g @angular/cli</span>
* Install app dependencies
    * $ <span> $ npm install</span>
* Once finished, you can run the app by running
    * $ <span>  $ ng serve -o </span>
* The app will run on : **localhost:4200** by default
<br><br>
....




**Django**
<ol>
<li>Running backend with docker</li>
</ol>

* Ensure that you have **docker** and **docker-compose** installed from [here](https://docs.docker.com/get-started/) and [here](https://docs.docker.com/compose/install/) respectively.
* Clone this repo and navigate to **backend/iNote**
* Run project with docker-compose
    * <span>$ docker-compose up</span>
* The server will run on **localhost:5000** by default



> Note that you might need to configure your own GCP project(s) for some features to work properly

* Refere to these guides to get started
    * [Google text to speech API](https://cloud.google.com/text-to-speech/docs/quickstart-protocol)
    * [Google calender API](https://developers.google.com/calendar/overview)
    * [Google firebase storage & authentication](https://firebase.google.com/docs/)

* Inside **frontend/iNote/src/app/providers/auth.service.ts** change the API Key, and clientId to your own
``` javascript
      gapi.client.init({
        apiKey: '',
        clientId: '',
        //........
      })
```
* Next, navigate to **frontend/iNote/src/environments/environment.ts** and change the following
```typescript
export const environment = {
  production: false,
  // Create a google firebase project and go to project settings to obtain your own keys
  firebase : {
    apiKey: "<Your-api-key-here>",
    authDomain: "<Your-auth-domain>",
    databaseURL: "<Your-db-url>",
    projectId: "<Your-project-ID>",
    storageBucket: "<Your-storage-bucket-url>",
    messagingSenderId: "<Your-messaging-id>"
  }

};
```

* Inside **backend/iNOte/api/views.py**, change the following
``` python
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=os.path.join(settings.BASE_DIR, 'YOUR-GCP-')
cred = credentials.Certificate(os.path.join(settings.BASE_DIR, 'YOUR-GCP-FIREBASE-SERVICE-ACCOUNT-KEY'))
fire_admin = firebase_admin.initialize_app(cred,{
    'storageBucket': 'YOUR-GCP-FIREBASE-STORAGE BUCKET'
})
```

<br>
* <i>Let me know if you face any issues</i>