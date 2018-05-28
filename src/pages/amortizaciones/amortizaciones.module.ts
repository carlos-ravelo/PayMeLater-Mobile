import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmortizacionesPage } from './amortizaciones';
import { ComponentsModule } from '../../components/components.module'


@NgModule({
  declarations: [
    AmortizacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(AmortizacionesPage), ComponentsModule
  ],
})
export class AmortizacionesPageModule { }
