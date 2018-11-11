import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EventsService } from '../../providers/events.service';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss']
})
export class AddNewComponent implements OnInit {
  submitted = false;
  formLoading = false;
  user: firebase.User;

  eventForm: FormGroup;
  eventID: string;
  eventDetails = {
    id: '',
    start: '',
    end: '',
    summary: '',
    description: '',
    attendees: []

  }


  constructor(private fb: FormBuilder, private eventService: EventsService,
    public auth: AuthService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    // Initialise form
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', Validators.required],
      description: ['', [Validators.required]],
      attendees: this.fb.array([]),
      locked: [false]
    });

    // Retrive ID of the selected event from home page
    this.eventID = this.activeRoute.snapshot.paramMap.get('id');
    this.getEventFromGapi();

  }

  getEventFromGapi() {
    this.auth.getEvent(this.eventID)
      .then(calEvent => {
        if (calEvent) {
          this.eventDetails.summary = calEvent.summary;
          this.eventDetails.start = calEvent.start.dateTime;
          this.eventDetails.end = calEvent.start.dateTime;
          this.eventDetails.attendees = calEvent.attendees;
          this.eventDetails.description = calEvent.description;
        }
      })

  }

  createEvent() {
    const formData = this.eventForm.value;
    console.log(formData);
    formData.start = new Date(formData.start.split().map((item) => parseInt(item))).toISOString();
    formData.end = new Date(formData.end.split().map((item) => parseInt(item))).toISOString();

    if (this.eventForm.valid) {
      this.auth.insertEvent(formData)
        .then(() => {
          console.log("Event saved!");
          this.eventForm.reset();
          this.router.navigate(['']);
        })
        .catch(error => {
          console.log("Something bad happened: ", error);
        });
    }
  }

  // Helpers
  get attendeeForm() {
    return this.eventForm.get('attendees') as FormArray
  }

  addAttendee() {
    const p = this.fb.group({
      email: [],
      displayName: [],
      organiser: [false],
    })

    this.attendeeForm.push(p);
  }

  deleteAttendee(i) {
    this.attendeeForm.removeAt(i)
  }


}
