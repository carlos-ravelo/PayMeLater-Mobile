import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormMovimientosPage } from './form-movimientos';

@NgModule({
  declarations: [
    FormMovimientosPage,
  ],
  imports: [
    IonicPageModule.forChild(FormMovimientosPage),
  ],
})
export class FormMovimientosPageModule {}
