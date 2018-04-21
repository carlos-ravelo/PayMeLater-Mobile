import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../clases/prestamo'
import { Movimiento } from '../../clases/movimiento'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { DatePipe } from '@angular/common';
import * as moment from 'moment'

/**
 * Generated class for the FormMovimientoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form-movimiento',
  templateUrl: 'form-movimiento.html',
})
export class FormMovimientoPage {
  prestamo: Prestamo;
  tipoMovimiento: string;
  movimiento: Movimiento;
  errorMontoPrestado: boolean
  errorInteresOCapital: boolean;

  constructor(private datePipe: DatePipe, public data: ProvidersDataProvider, public navCtrl: NavController, public navParams: NavParams, public funcionesComunes: FuncionesComunesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormMovimientoPage');
  }

  clear() {
    this.movimiento = {
      numeroPrestamo: this.prestamo.numeroPrestamo,
      cliente: this.prestamo.cliente,
      tipoMovimiento: this.navParams.get("tipoMovimiento"),
      montoTotal: 0,
      fechaTransaccion: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      fechaCorrespondiente: this.datePipe.transform(new Date(this.prestamo.fechaProximoPago), "yyyy-MM-dd"),
      notas: "",
      interesDelPago: 0,
      capitalDelPago: 0,
      montoPrestado: 0

    }
    if (this.movimiento.tipoMovimiento == 'pago') {
      this.movimiento.interesDelPago = this.round(this.prestamo.capitalPendiente * this.prestamo.tasa / 100 / 12, 2)
      this.movimiento.capitalDelPago = this.round(this.prestamo.montoCuotas - this.movimiento.interesDelPago, 2);
    }
  }


  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  cambioTipoMovimiento() {
    if (this.movimiento.tipoMovimiento == 'pago') { this.movimiento.interesDelPago = this.prestamo.capitalPendiente * this.prestamo.tasa / 100 / 12 }
  }

  ngOnInit() {

    this.prestamo = this.navParams.get("prestamo");
    this.clear();

  }
  insertarMovimiento() {

    if ((this.movimiento.capitalDelPago == 0 && this.movimiento.interesDelPago == 0)
      && this.movimiento.tipoMovimiento == 'pago') {
      this.errorInteresOCapital = true;
      setTimeout(() => {
        this.errorInteresOCapital = false;
      }, 2000)
      return
    }
    if (this.movimiento.montoPrestado == 0 && this.movimiento.tipoMovimiento == 'desembolso') {
      this.errorMontoPrestado = true;
      setTimeout(() => {
        this.errorMontoPrestado = false;
      }, 2000)
      return
    }
    if (this.tipoMovimiento == 'desembolso') { this.movimiento.capitalDelPago = 0; this.movimiento.interesDelPago = 0 }
    else if (this.tipoMovimiento == 'pago') { this.movimiento.montoPrestado = 0 }
    this.data.insertarMovimiento(this.movimiento);
    var subscripcion = this.data.obtenerMovimientosPorPrestamo(this.prestamo.numeroPrestamo).subscribe((listaMovimientos) => {
      var valoresCalculados = this.funcionesComunes.calcularValoresPrestamo(listaMovimientos, this.prestamo);
      this.prestamo.capitalPrestado = valoresCalculados.capitalPrestado;
      this.prestamo.pagadoCapital = valoresCalculados.pagadoCapital;
      this.prestamo.montoCuotas = this.funcionesComunes.calcularMontoCuota(this.prestamo);
      this.prestamo.capitalPendiente = valoresCalculados.capitalPendiente;
      let a = moment(this.prestamo.fechaProximoPago);
      this.prestamo.fechaProximoPago = a.add(1, 'month').format('yyy-MM-dd');
      this.data.modificarPrestamo(this.prestamo);
      subscripcion.unsubscribe();
      this.clear();
    });
  }

  formatFecha(event) {
    console.log(event.value.format())
    return (event.value.format())
  }

}
