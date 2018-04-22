import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallePrestamoPage } from './detalle-prestamo';
import { ComponentsModule } from '../../components/components.module'


@NgModule({
  declarations: [
    DetallePrestamoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallePrestamoPage),
    ComponentsModule
  ],

})
export class DetallePrestamoPageModule { }
