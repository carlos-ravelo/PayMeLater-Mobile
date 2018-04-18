import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallePrestamoPage } from './detalle-prestamo';
import { MatGridListModule } from '@angular/material/grid-list';
import { ComponentsModule } from '../../components/components.module'


@NgModule({
  declarations: [
    DetallePrestamoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallePrestamoPage),
    MatGridListModule,
    ComponentsModule
  ],

})
export class DetallePrestamoPageModule { }
