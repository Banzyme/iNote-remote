import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  currentUser: firebase.User;
  isLoggedIn = false;


  constructor(private af_auth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user = this.af_auth.authState;
  }

  googleSignIn() {
    return this.af_auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(res => {
        if (!res.user.emailVerified) {
          // todo: send email verification link
        }
        this.router.navigate(['']);
      })
      .catch(error => {
        // this.err_msg = error.message;
        // this.openDialog();
      });
  }


  logout() {
    this.isLoggedIn = false;
    this.af_auth
      .auth
      .signOut()
      .then(() => { this.router.navigate(['']) })
  }

}
