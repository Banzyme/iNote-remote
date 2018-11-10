import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

class EventVoice{
  status:number;
  id:string;
  url:string
}

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }


  fetchSpeechMp3(msg : string, id: string): Observable<any>{
    const params = new HttpParams().set('message', msg).set('id', id);

    return this.http.get(this.apiUrl, {params});
  }
}
