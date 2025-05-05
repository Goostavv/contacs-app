import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { IContact } from '../model/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor() { }

  private dummyContacts: IContact[] = [
    {
      id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890',
      gender: 0,
      birth: '',
      techno: '',
      message: ''
    },
    {
      id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '987-654-3210',
      gender: 0,
      birth: '',
      techno: '',
      message: ''
    },
    {
      id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-123-4567',
      gender: 0,
      birth: '',
      techno: '',
      message: ''
    },
    {
      id: 4, name: 'Maria Garcia', email: 'maria.garcia@example.com', phone: '111-222-3333',
      gender: 0,
      birth: '',
      techno: '',
      message: ''
    },
    {
      id: 5, name: 'David Lee', email: 'david.lee@example.com', phone: '444-555-6666',
      gender: 0,
      birth: '',
      techno: '',
      message: ''
    },
  ];

  // get all contact data
  getAllContact(): Observable<IContact[]> {
    return new Observable<IContact[]>(observer => {
      observer.next(this.dummyContacts);
      observer.complete();
    });
  }

    addContact(BASE_USER_ENDPOINT: string, contact: IContact): Observable<any> {
        return new Observable<any>(observer => {
          contact.id = this.dummyContacts.length + 1;
          this.dummyContacts.push(contact);
          observer.next(contact);
          observer.complete();
        });
      }

  updateContact(id: number, contact: IContact): Observable<any> {
      return new Observable<any>(observer => {
          const index = this.dummyContacts.findIndex(c => c.id === id);
          if (index !== -1) {
            this.dummyContacts[index] = { ...this.dummyContacts[index], ...contact };
          }
          observer.next(this.dummyContacts[index]);
          observer.complete();
        });
      }
    
    deleteContact(id: number): Observable<any> {
        return new Observable<any>(observer => {
          const index = this.dummyContacts.findIndex(c => c.id === id);
          if (index !== -1) {
            this.dummyContacts.splice(index, 1);
          }
          observer.next({});
          observer.complete();
        });
  }
}