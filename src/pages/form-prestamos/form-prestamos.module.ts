import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormPrestamosPage } from './form-prestamos';

@NgModule({
  declarations: [
    FormPrestamosPage,
  ],
  imports: [
    IonicPageModule.forChild(FormPrestamosPage),
  ],
})
export class FormPrestamosPageModule {}
