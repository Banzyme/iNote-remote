import { Component, OnInit } from '@angular/core';

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

  events = [
    { title: 'Interview with Isazi', dateTime: this.time_1, venue: 'Skype', attending: 'J Math'  },
    { title: 'Morning scrums', dateTime: this.time_2, venue: 'Rivonia' ,attending: 'G HUnt'   },
    { title: 'Finish assessment', dateTime: this.time_3, venue: 'Home' ,attending: 'N Ndou'   },

  ]

  constructor() { }

  ngOnInit() {
  }

  // setInterval(()=>{ console.log('Now'); }, 300000);
}
