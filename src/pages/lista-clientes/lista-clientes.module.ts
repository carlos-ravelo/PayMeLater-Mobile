import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaClientesPage } from './lista-clientes';

@NgModule({
  declarations: [
    ListaClientesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaClientesPage),
  ],
})
export class ListaClientesPageModule { }
