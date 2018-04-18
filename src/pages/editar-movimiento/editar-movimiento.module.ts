import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarMovimientoPage } from './editar-movimiento';

@NgModule({
  declarations: [
    EditarMovimientoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarMovimientoPage),
  ],
})
export class EditarMovimientoPageModule {}
