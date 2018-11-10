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
  today = new Date();
  time_1 = new Date(2018, 11,10,4, 12 );
  time_2 = new Date(2018, 11,10,4, 11);
  time_3 = new Date(2018, 11,10,4, 15);

  // Audio object
  audio = new Audio()

  events = [
    { title: 'Interview with Isazi',id:'111', dateTime: this.time_1, venue: 'Skype', attending: 'J Math'  },
    { title: 'Morning scrums',id:'112', dateTime: this.time_2, venue: 'Rivonia' ,attending: 'G HUnt'   },
    { title: 'Finish assessment', id:'113', dateTime: this.time_3, venue: 'Home' ,attending: 'N Ndou'   },

  ]

  constructor(private voiceService: TextToSpeechService, public auth: AuthService) { }

  ngOnInit() {
    this.setInterval();
  }

   setInterval(){
     setInterval( ()=>{
      const now = this.today.getTime();

      for(let event of this.events){
        let res = event.dateTime.getTime() - now;

        if( Math.abs(res)<0) {       /// Play voice not if time-delta < 5 mins
          this.playEventVoiceNote(event);
        }
      }

    },3000 );
  }

  async playerController(){
    await this.audio.play();
  }

   playEventVoiceNote(e){
    const text = 'Reminder, ' + e.title + ' in 5 minutes'

    this.voiceService.fetchSpeechMp3(text, e.id).subscribe( (response: EventVoice)=>{
      console.log(response);
      if( response.status == 200){
        this.audio.src = response.url;
        this.audio.load();
        this.playerController();
        
      }
    }, (error)=>{
      console.log(error);
    });


    
  }
}
