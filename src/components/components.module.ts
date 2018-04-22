import { NgModule } from '@angular/core';
import { MovimientosPorPrestamoComponent } from './movimientos-por-prestamo/movimientos-por-prestamo';
import { CommonModule } from '@angular/common'
import { IonicModule } from 'ionic-angular';
import { TablaAmortizacionComponent } from './tabla-amortizacion/tabla-amortizacion';
@NgModule({
	declarations: [MovimientosPorPrestamoComponent, TablaAmortizacionComponent],
	imports: [CommonModule, IonicModule],
	exports: [MovimientosPorPrestamoComponent, TablaAmortizacionComponent]
})
export class ComponentsModule { }
