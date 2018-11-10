import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EventsService } from '../../providers/events.service';
import { AuthService } from '../../providers/auth.service';
import { from } from 'rxjs';

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


  constructor(private fb: FormBuilder, private eventService: EventsService,
    public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', Validators.required],
      description: ['', [Validators.required]],
      attendees: this.fb.array([]),
      locked: [false]
    });

  }


  createEvent() {
    const formData = this.eventForm.value;
    console.log(formData);
    formData.start = new Date(formData.start.split().map( (item)=> parseInt(item)  ) ).toISOString();
    formData.end = new Date(formData.end.split().map( (item)=> parseInt(item)  )  ).toISOString();

    if (this.eventForm.valid){
      this.auth.insertEvent(formData)
        .then(()=>{
          console.log("Event saved!");
          this.eventForm.reset();
          this.router.navigate(['']);
        })
        .catch( error=>{
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
