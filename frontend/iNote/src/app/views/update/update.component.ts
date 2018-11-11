import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
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

  constructor(private fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute,
    private auth: AuthService) { }

  ngOnInit() {
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
          this.eventDetails.id = calEvent.id;
          this.eventDetails.summary = calEvent.summary;
          this.eventDetails.start = calEvent.start.dateTime;
          this.eventDetails.end = calEvent.start.dateTime;
          this.eventDetails.attendees = calEvent.attendees.filter( item => item.length != 0 );
          this.eventDetails.description = calEvent.description;
        }
      })

  }

  updateEvent(event){
    const id = event.target.id;
    const formData = this.eventForm.value;

    this.auth.updatevent(id, formData)
      .then(()=>{
        // Todo: Use snackbar to display message to user
        console.log("Event updated");
        this.eventForm.reset();
        this.router.navigateByUrl('/inote/home');
      })
      .catch(error=>{
        console.log("Error updating event. Please try again")
        this.router.navigateByUrl('/inote/home');
      })
  }

  deleteEvent(event){
    const id = event.target.id;
    this.auth.eventDelete(id)
      .then(()=>{
        // Todo: Use snackbar to display message to user
        console.log("Event deleted");
        this.router.navigateByUrl('/inote/home');
      })
      .catch(error=>{
        console.log("Error deleting event. Please try again")
      })
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
