import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MovimientosPorPrestamoComponent } from './movimientos-por-prestamo/movimientos-por-prestamo';
import { CommonModule } from '@angular/common'
import { IonicModule } from 'ionic-angular';
import { TablaAmortizacionComponent } from './tabla-amortizacion/tabla-amortizacion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


@NgModule({
	declarations: [MovimientosPorPrestamoComponent, TablaAmortizacionComponent],
	imports: [CommonModule, IonicModule, MatTableModule, MatPaginatorModule, MatCardModule,],
	exports: [MovimientosPorPrestamoComponent, TablaAmortizacionComponent]
})
export class ComponentsModule { }
