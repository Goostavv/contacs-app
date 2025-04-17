import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { data } from './data/data';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ContactListComponent },
  { path: 'add-contact', component: ContactFormComponent, data: { dbops: data.create } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }