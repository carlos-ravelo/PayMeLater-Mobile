import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarPrestamoPage } from './editar-prestamo';

@NgModule({
  declarations: [
    EditarPrestamoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarPrestamoPage),
  ],
})
export class EditarPrestamoPageModule {}
