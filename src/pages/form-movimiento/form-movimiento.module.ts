import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormMovimientoPage } from './form-movimiento';

@NgModule({
  declarations: [
    FormMovimientoPage,
  ],
  imports: [
    IonicPageModule.forChild(FormMovimientoPage),
  ],
})
export class FormMovimientoPageModule {}
