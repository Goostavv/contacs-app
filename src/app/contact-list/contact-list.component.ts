import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog} from '@angular/material/dialog';
import { ContactFormComponent } from '../contact-form/contact-form.component';

import { ContactService } from '../services/contact.service';
import { IContact } from '../model/contact';
import { data } from '../data/data';
import { db } from '../data/db';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: IContact[] = [];
  contact!: IContact;
  loadingState: boolean = false;
  dbops!: data;
  modalTitle: string = '';
  modalBtnTitle: string = '';

  displayedColumns: string[];
  dataSource = new MatTableDataSource<IContact>();
  
  constructor(public snackBar: MatSnackBar, private _contactService: ContactService, private dialog: MatDialog) {
    this.displayedColumns = ['name', 'email', 'gender', 'birth', 'techno', 'message', 'action'];
   }

  ngOnInit() {
    this.loadContacts();
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: '500px',
      data: { dbops: this.dbops, modalTitle: this.modalTitle, modalBtnTitle: this.modalBtnTitle, contact: this.contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'success') {
        this.loadingState = true;
        this.loadContacts();
        switch (this.dbops) {
          case data.create:
            this.showMessage('Data successfully added.');
            break;
          case data.update:
            this.showMessage('Data successfully updated.');
            break;
          case data.delete:
            this.showMessage('Data successfully deleted.');
            break;
        }
      } else if (result === 'error') {
        this.showMessage('There is some issue in saving records, please contact to system administrator!');
      } else {
       this.showMessage('Please try again, something went wrong');
      }
    });
  }

  loadContacts(): void {
    this._contactService.getAllContact().subscribe(contacts => {
      this.contacts = contacts;
      this.dataSource.data = this.contacts;
    });

  }

  getGender(gender: number): string {
    return db.genders.filter(ele => ele.id === gender).map(ele => ele.name)[0];
  }

  addContact() {
    this.dbops = data.create;
    this.modalTitle = 'Add New Contact';
    this.modalBtnTitle = 'Add';
    this.openDialog();
  }
  editContact(id: number) {
    this.dbops = data.update;
    this.modalTitle = 'Edit Contact';
    this.modalBtnTitle = 'Update';
    this.contact = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  deleteContact(id: number) {
    this.dbops = data.delete;
    this.modalTitle = 'Confirm to Delete ?';
    this.modalBtnTitle = 'Delete';
    this.contact = this.dataSource.data.filter(x => x.id === id)[0];
    this.openDialog();
  }
  showMessage(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000
    });
  }
}