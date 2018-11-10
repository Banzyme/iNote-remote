import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { auth } from 'firebase/app';


declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  calenderItems: any[];

  currentUser: firebase.User;
  isLoggedIn = false;
  AccessToken = '';


  constructor(private af_auth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.initClient(); // initialise gapi
    this.user = this.af_auth.authState;
  }


  //  Google api client config
  initClient() {
    gapi.load('client', () => {
      console.log('loaded client');

      gapi.client.init({
        apiKey: 'AIzaSyCHPF4H7hK-MFVERc16sg1eoAlPk4FS8zY',
        clientId: '671395799930-g0npase9um4ad25dg1fdn0msigkndkgt.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      })

      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));
    });
  }


  async login() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;
    console.log("Logged in as: ", googleUser);

    const credential = auth.GoogleAuthProvider.credential(token);
    await this.af_auth.auth.signInAndRetrieveDataWithCredential(credential);
  }



  logout() {
    this.isLoggedIn = false;
    this.af_auth
      .auth
      .signOut()
      .then(() => { this.router.navigate(['']) })
  }


  // Retrive the next 10 events from calender
  async getCalendar() {
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    })
    // console.log(events)

    this.calenderItems = events.result.items;
    return events.result.items;

  }

  async insertEvent(event) {
    const formData = event;
    let data = {
      calendarId: 'primary',
      start: {
        dateTime: formData.start,
        timeZone: 'Africa/Johannesburg'
      },
      end: {
        dateTime: formData.end,
        timeZone: 'Africa/Johannesburg'
      },
      summary: formData.title,
      description: formData.description,
      attendees: formData.attendees
    }
    const insert = await gapi.client.calendar.events.insert(data)

    await this.getCalendar();
  }

  // util functions
  hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60).toISOString();

}
