import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IContact } from '../model/contact';
import { ContactService } from '../services/contact.service';
import { db } from '../data/db';
import { data as dbOperations } from '../data/data';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  msg: string = '';
  indLoading = false;
  contactFrm!: FormGroup;
  listFilter: string = '';
  selectedOption: string = '';
  genders: { name: string; id: number; }[] = [];
  technologies: string[] = [];
  modalTitle: string = 'Add New Contact'; 
  modalBtnTitle: string = 'Save';
  dbops: any = dbOperations.create;

  formErrors = {
    'name': '',
    'email': '',
    'gender': '',
    'birth': '',
    'techno': '',
    'message': ''
  };

  validationMessages = {
    'name': {
      'maxlength': 'Name cannot be more than 50 characters long.',
      'required': 'Name is required.'
    },
    'email': {
      'email': 'Invalid email format.',
      'required': 'Email is required.'
    },
    'gender': {
      'required': 'Gender is required.'
    },
    'techno': {
      'required': 'Technology is required.'
    },
    'birth': {
      'required': 'Birthday is required.'
    },
    'message': {
      'required': 'message is required.'
    }
  };

  constructor(
    private fb: FormBuilder,
    private _contactService: ContactService,
    private router: Router 
  ) { }

  ngOnInit() {
    this.contactFrm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      birth: ['', [Validators.required]],
      techno: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });

    this.genders = db.genders;
    this.technologies = db.technologies;

    this.contactFrm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    this.contactFrm.reset();
    this.setControlsState(true); 
  }

  onValueChanged(data?: any) {
    if (!this.contactFrm) { return; }
    const form = this.contactFrm;

    for (const field in this.formErrors) {
      const key = field as keyof typeof this.formErrors;
      this.formErrors[key] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field as keyof typeof this.validationMessages];
        for (const key in control.errors) {
          this.formErrors[field as keyof typeof this.formErrors] += messages[key as keyof typeof messages] + ' ';
        }
      }
    }
  }

  onSubmit(formData: any) {
    const contactData = this.mapDateData(formData.value);

    this._contactService.addContact(db.BASE_USER_ENDPOINT, contactData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        this.msg = 'Error adding contact.'; 
        console.error(error);
      }
    );
  }

  private setControlsState(isEnable: boolean): void {
    isEnable ? this.contactFrm.enable() : this.contactFrm.disable();
  }

  private mapDateData(contact: IContact): IContact {
    contact.birth = new Date(contact.birth).toISOString();
    return contact;
  }
}