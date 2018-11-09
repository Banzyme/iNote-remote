import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  apiUrl = 'https://us-central1-inote-222016.cloudfunctions.net/getTextToSpeechMP3';

  constructor(private http: HttpClient) { }


  fetchSpeechMp3(){
    const params = new HttpParams().set('message', "Isazi consulting interview").set('venue', "Skype");
    const result = this.http.get(this.apiUrl, {params});
  }
}
