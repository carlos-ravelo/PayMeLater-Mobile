import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleClientePage } from './detalle-cliente';

@NgModule({
  declarations: [
    DetalleClientePage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleClientePage),
  ],
})
export class DetalleClientePageModule {}
