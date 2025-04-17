import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Contact {
  name: string;
  email: string;
  phone: string;
  id?: number; // Optional ID for tracking
  isEditing?: boolean; // Flag to show/hide edit form
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];
  contacts: Contact[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', isEditing: false },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', isEditing: false }
  ];

  editForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  navigateToAddNewContact() {
    this.router.navigate(['/add-contact']);
  }

  editContact(contact: Contact) {
    // Close any other open edit forms
    this.contacts.forEach(c => {
      if (c.id !== contact.id) {
        c.isEditing = false;
      }
    });
    contact.isEditing = !contact.isEditing;
    this.editForm.patchValue({
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    });
  }

  saveEditedContact(contact: Contact) {
    if (this.editForm.valid) {
      const updatedContact = { ...contact, ...this.editForm.value };
      const index = this.contacts.findIndex(c => c.id === contact.id);
      if (index !== -1) {
        this.contacts[index] = updatedContact;
        contact.isEditing = false;
      }
    }
  }

  deleteContact(contact: Contact) {
    this.contacts = this.contacts.filter(c => c.id !== contact.id);
  }
}