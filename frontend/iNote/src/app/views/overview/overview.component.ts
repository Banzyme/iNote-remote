import { Component, OnInit } from '@angular/core';
import { TextToSpeechService } from '../../providers/text-to-speech.service';


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
  time_1 = new Date();
  time_2 = new Date();
  time_3 = new Date();

  // Audio object
  audio = new Audio()

  events = [
    { title: 'Interview with Isazi',id:'111', dateTime: this.time_1, venue: 'Skype', attending: 'J Math'  },
    { title: 'Morning scrums',id:'112', dateTime: this.time_2, venue: 'Rivonia' ,attending: 'G HUnt'   },
    { title: 'Finish assessment', id:'113', dateTime: this.time_3, venue: 'Home' ,attending: 'N Ndou'   },

  ]

  constructor(private voiceService: TextToSpeechService) { }

  ngOnInit() {
    this.setInterval();
  }

  setInterval(){
    setInterval( ()=>{},3000 );
  }

  playEventVoiceNote(e){
    this.voiceService.fetchSpeechMp3(e.title, e.id).subscribe( (response: EventVoice)=>{
      console.log(response);
    } )

    // this.audio.src = "../../../assets/sounds/button_1.mp3";
    // this.audio.load();
    // this.audio.play();
  }
}
