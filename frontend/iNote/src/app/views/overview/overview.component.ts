import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TextToSpeechService } from '../../providers/text-to-speech.service';
import { AuthService } from '../../providers/auth.service';


class EventVoice {
  status: number;
  id: string;
  url: string
}


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  quedVoice: any[];
  calenderItems: any[];
  today = new Date();

  // Audio object
  audio = new Audio();

  constructor(private voiceService: TextToSpeechService, public auth: AuthService, private router: Router) {

  }

  ngOnInit() {
  }

  async localRetrieve() {
    await this.auth.getCalendar()
      .then((calender) => {
        console.log("Returned cal items: ", calender);
        this.quedVoice = Array.from(this.auth.calenderItems);

        console.log(this.quedVoice[0].start.dateTime)

        this.setInterval();
      });
  }

  setInterval() {
    setInterval(() => {
      let now = new Date();
      for (let event in this.quedVoice.filter((e) => new Date(e.start.dateTime).getHours() == now.getHours())) {


        let res = new Date(this.quedVoice[event].start.dateTime).getMinutes() - now.getMinutes();

        if (res<=5 && res>0) {   /// Play voice not if time-delta < 5 mins
          this.playEventVoiceNote(this.quedVoice[event]);
          this.quedVoice.splice(parseInt(event), 1)
        }

      }

    }, 3000);
  }

  playerController(e) {
    this.audio.play();

    setTimeout(() => {
      e.eventVoiceSrc = null;
    }, 300000);
    //  Delete voice note after 5 mins
  }

  playEventVoiceNote(e) {
    let text = 'Reminder, ' + e.summary + ' in 5 minutes.';
    if (e.attendees.length != 0) {
      let names = e.attendees.map((person) => person.displayName)
      text = text + "Participants, " + names.join(' ,');
    }


    this.voiceService.fetchSpeechMp3(text, e.id).subscribe((response: EventVoice) => {
      console.log(response);
      if (response.status == 200) {
        this.audio.src = e.eventVoiceSrc = response.url;
        this.audio.load();
        this.playerController(e);

      }
    }, (error) => {
      console.log(error);
    });



  }


  navigateToDetail(event){
    let eventId = event.target.id;
    this.router.navigateByUrl('/inote/update/'+ eventId);
  }

}
