import { NgModule } from '@angular/core';
import { MovimientosPorPrestamoComponent } from './movimientos-por-prestamo/movimientos-por-prestamo';
import { CommonModule } from '@angular/common'
import { IonicModule } from 'ionic-angular';
import { TablaAmortizacionComponent } from './tabla-amortizacion/tabla-amortizacion';
import { ProgressBarComponent } from './progress-bar/progress-bar';
@NgModule({
	declarations: [MovimientosPorPrestamoComponent, TablaAmortizacionComponent,
		ProgressBarComponent,

	],
	imports: [CommonModule, IonicModule],
	exports: [MovimientosPorPrestamoComponent, TablaAmortizacionComponent,
		ProgressBarComponent,

	]
})
export class ComponentsModule {

}