import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportesPorClientePage } from './reportes-por-cliente';
import { ComponentsModule } from '../../components/components.module'
import { ChartsModule } from 'ng2-charts/ng2-charts';


@NgModule({
  declarations: [
    ReportesPorClientePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportesPorClientePage), ComponentsModule, ChartsModule
  ],
})
export class ReportesPorClientePageModule { }
