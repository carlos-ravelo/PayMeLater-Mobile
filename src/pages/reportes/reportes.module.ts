import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportesPage } from './reportes';
import { ChartsModule } from 'ng2-charts/ng2-charts';


@NgModule({
  declarations: [
    ReportesPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportesPage), ChartsModule
  ],
})
export class ReportesPageModule { }
