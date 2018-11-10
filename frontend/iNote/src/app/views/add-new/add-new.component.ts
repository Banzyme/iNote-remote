import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from '../../providers/events.service';

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


  constructor(private fb: FormBuilder, private eventService: EventsService) { }

  ngOnInit() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      highPriority: [false]
    });

  }


  createEvent(){
    const formData = this.eventForm.value;
    const eventId = Math.random().toString(36).substring(2);;

    this.eventService.saveEvent(formData, eventId );
  }

}
