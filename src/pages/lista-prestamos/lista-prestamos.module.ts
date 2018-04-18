import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaPrestamosPage } from './lista-prestamos';

@NgModule({
  declarations: [
    ListaPrestamosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaPrestamosPage),
  ],
})
export class ListaPrestamosPageModule { }
