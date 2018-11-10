import { Component, OnInit } from '@angular/core';
import { TextToSpeechService } from '../../providers/text-to-speech.service';
import { AuthService } from '../../providers/auth.service';


class EventVoice{
  status:number;
  id:string;
  url:string
}


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  quedVoice = [];
  today = new Date();
  time_1 = new Date(2018, 11,10,14, 30  );
  time_2 = new Date(2018, 11,10,14, 59);
  time_3 = new Date(2018, 11,10,14, 25);

  // Audio object
  audio = new Audio()

  events = [
    { title: 'Interview with Isazi',id:'111', dateTime: this.time_1, venue: 'Skype', attending: 'J Math', eventVoiceSrc: ""  },
    { title: 'Morning scrums',id:'112', dateTime: this.time_2, venue: 'Rivonia' ,attending: 'G HUnt', eventVoiceSrc: ""    },
    { title: 'Finish assessment', id:'113', dateTime: this.time_3, venue: 'Home' ,attending: 'N Ndou', eventVoiceSrc: ""   },

  ]
    // copy events array
  constructor(private voiceService: TextToSpeechService, public auth: AuthService) { 
    
  }

  ngOnInit() {
    this.setInterval();
    this.quedVoice = Array.from(this.events);
    
  }

  async getEvents(){
    await this.auth.getCalendar();
  }

   setInterval(){
     setInterval( ()=>{
      let now = new Date();
      for( let event in this.quedVoice.filter( (e)=> e.dateTime.getHours() == now.getHours() ) ){
        

        let res = this.quedVoice[event].dateTime.getMinutes() - now.getMinutes();

        if( Math.abs(res)<=5) {   /// Play voice not if time-delta < 5 mins
          console.log(res);
                   
          this.playEventVoiceNote(  this.quedVoice[event] );
          this.quedVoice.splice( parseInt(event) , 1)
        }

      }

    },3000 );
  }

  playerController(e){
     this.audio.play();

     setTimeout(()=>{
       e.eventVoiceSrc = null;
     }, 300000); 
    //  Delete voice note after 5 mins
  }

   playEventVoiceNote(e){
    const text = 'Reminder, ' + e.title + ' in 5 minutes'

    this.voiceService.fetchSpeechMp3(text, e.id).subscribe( (response: EventVoice)=>{
      console.log(response);
      if( response.status == 200){
        this.audio.src = e.eventVoiceSrc = response.url;
        this.audio.load();
        this.playerController(e);
        
      }
    }, (error)=>{
      console.log(error);
    });


    
  }
}
