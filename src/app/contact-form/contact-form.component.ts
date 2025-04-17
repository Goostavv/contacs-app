import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ContactListComponent } from '../contact-list/contact-list.component';

import { IContact } from '../model/contact';
import { ContactService } from '../services/contact.service';
import { data } from '../data/data';
import { db } from '../data/db';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})

export class ContactFormComponent implements OnInit {
  msg: string = '';
  indLoading = false;
  contactFrm!: FormGroup;
  // dbops: data;
  // modalTitle: string;
  // modalBtnTitle: string;
  listFilter: string = '';
  selectedOption: string = '';
  // contact: IContact;
  genders: { name: string; id: number; }[] = [];
  technologies: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _contactService: ContactService,
    public dialogRef: MatDialogRef<ContactListComponent>) { }

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

    // subscribe on value changed event of form to show validation message
    this.contactFrm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    if (this.data.dbops === data.create) {
      this.contactFrm.reset();
    } else {
      this.contactFrm.setValue(this.data.contact);
    }
    this.SetControlsState(this.data.dbops === data.delete ? false : true);
  }
  // form value change event
  onValueChanged(data?: any) {
    if (!this.contactFrm) { return; }
    const form = this.contactFrm;
    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      const key = field as keyof typeof this.formErrors;
      // clear previous error message (if any)
      this.formErrors[key] = '';
      const control = form.get(field);
      // setup custom validation message to form
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field as keyof typeof this.validationMessages];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field as keyof typeof this.formErrors] += messages[key as keyof typeof messages] + ' ';
        }
      }
    }
  }
  // form errors model
  // tslint:disable-next-line:member-ordering
  formErrors = {
    'name': '',
    'email': '',
    'gender': '',
    'birth': '',
    'techno': '',
    'message': ''
  };
  // custom valdiation messages
  // tslint:disable-next-line:member-ordering
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
  onSubmit(formData: any) {
    const contactData = this.mapDateData(formData.value);
    switch (this.data.dbops) {
      case data.create:
        this._contactService.addContact(db.BASE_USER_ENDPOINT + 'addContact', contactData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case data.update:
        this._contactService.updateContact(db.BASE_USER_ENDPOINT + 'updateContact', contactData.id, contactData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case data.delete:
        this._contactService.deleteContact(db.BASE_USER_ENDPOINT + 'deleteContact', contactData.id).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
    }
  }
  SetControlsState(isEnable: boolean) {
    isEnable ? this.contactFrm.enable() : this.contactFrm.disable();
  }

  mapDateData(contact: IContact): IContact {
    contact.birth = new Date(contact.birth).toISOString();
    return contact;
  }
}