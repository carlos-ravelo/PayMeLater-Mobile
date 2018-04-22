import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormClientesPage } from './form-clientes';


//Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    FormClientesPage,
  ],
  imports: [
    IonicPageModule.forChild(FormClientesPage),
    BrowserAnimationsModule,

  ],
})
export class FormClientesPageModule { }
