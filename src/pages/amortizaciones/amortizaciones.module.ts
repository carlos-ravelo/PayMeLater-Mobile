import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmortizacionesPage } from './amortizaciones';

@NgModule({
  declarations: [
    AmortizacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(AmortizacionesPage),
  ],
})
export class AmortizacionesPageModule {}
