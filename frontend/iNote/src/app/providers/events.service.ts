import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  currentUser: firebase.User;
  errorMsg = '';

  constructor(private afs: AngularFirestore, private authService: AuthService) { 
    this.authService.user.subscribe( (usr)=>{
      if(usr) this.currentUser = usr;
    }, err =>{
      console.log(err.message);
    })
  }


  saveEvent(eventData, eventId : string){
    const userId = this.currentUser.uid;
    
    if(userId){
      this.afs.collection('events').doc(userId).collection('userEvents').doc(eventId).set(eventData)
        .then( ()=> console.log('success!'))
        .catch( error =>{ 
          console.log(error);
        })
    }else{
      this.errorMsg = "Error: You are not authorized to perfom this action, please login and try again."
  
    }
  }


  deleteEvent(requestId: string, eventId: string){
    const userId = this.currentUser.uid;
    
    if( requestId == userId ){
      this.afs.collection('events').doc(userId).collection('userEvents').doc(eventId).delete()
      .then( res=>{
        console.log("Deleted")
      })
      .catch(err => {
        console.log("Error deleting document");
      });
    
       }
    }



    updateEvent(newData, requestId: string, eventId: string){
      const userId = this.currentUser.uid;
      
      if( requestId == userId ){
        this.afs.collection('events').doc(userId).collection('userEvents').doc(eventId).update(newData)
        .then( res=>{
          console.log("Updated")
        })
        .catch(err => {
          console.log("Error updateing doc: ", err.message);
        });
      
         }
      }


}
