import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../clases/prestamo'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import { FormMovimientoPage } from '../../pages/form-movimiento/form-movimiento';
import { Movimiento } from '../../clases/movimiento';

/**
 * Generated class for the MovimientosPorPrestamoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'movimientos-por-prestamo',
  templateUrl: 'movimientos-por-prestamo.html'
})
export class MovimientosPorPrestamoComponent {
  @Input() prestamo: Prestamo;
  listaMovimientos: Movimiento[];
  headerValues: any = {};
  constructor(private db: ProvidersDataProvider, private funcionesComunes: FuncionesComunesProvider,
    public navCtrl: NavController, public navParams: NavParams, ) { }
  ngOnInit() {

  }
  ngOnChanges() {
    this.obtenerListaMovimientos();
  }
  ngAfterViewInit() {
  }
  obtenerListaMovimientos(): void {
    this.db.obtenerMovimientosPorPrestamo(this.prestamo.numeroPrestamo).subscribe(listaMovimientos => {
      this.listaMovimientos = listaMovimientos;
      this.calcularTotales();
    });
  }
  abrirModificarMovimiento(movimiento) {
    this.navCtrl.push(FormMovimientoPage,
      { prestamo: this.prestamo, movimiento: movimiento, esNuevoMovimiento: false });
  }
  calcularTotales = () => {
    this.headerValues.totalInteresGanado = 0;
    this.listaMovimientos.forEach(element => {
      this.headerValues.totalInteresGanado = element.interesDelPago + this.headerValues.totalInteresGanado;
    });

  }
}
