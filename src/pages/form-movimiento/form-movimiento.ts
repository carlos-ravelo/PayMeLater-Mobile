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
  movimiento: Movimiento;
  errorMontoPrestado: boolean
  errorInteresOCapital: boolean;
  tiposDeMovimiento: string[];
  esNuevoMovimiento: boolean;
  modificarOnuevoLabel: string;
  constructor(private datePipe: DatePipe, public data: ProvidersDataProvider, public navCtrl: NavController, public navParams: NavParams, public funcionesComunes: FuncionesComunesProvider) {
  }
  ngOnInit() {
    this.prestamo = this.navParams.get("prestamo");
    this.esNuevoMovimiento = this.navParams.get("esNuevoMovimiento");
    if (this.navParams.get("movimiento")) { this.movimiento = { ... this.navParams.get("movimiento") } }
    else { this.clear() };
    //this.formatDateToForm();
    this.tiposDeMovimiento = this.movimiento.tipoMovimiento == "inicial" ? ["inicial"] : ["pago", "desembolso"];
    this.modificarOnuevoLabel = this.esNuevoMovimiento ? "Insertar nuevo" : "Modificar"
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
      this.movimiento.interesDelPago = this.funcionesComunes.round(this.prestamo.capitalPendiente * (this.prestamo.tipoTasa == "Anual" ? 1 : 12) * this.prestamo.tasa / 100 / 12, 2)
      this.movimiento.capitalDelPago = this.funcionesComunes.round(this.prestamo.montoCuotas - this.movimiento.interesDelPago, 2);
    }
  }



  cambioTipoMovimiento() {
    if (this.movimiento.tipoMovimiento == 'pago') { this.movimiento.interesDelPago = this.prestamo.capitalPendiente * this.prestamo.tasa / 100 / 12 }
  }


  insertarMovimiento() {
    if ((this.movimiento.capitalDelPago == 0 && this.movimiento.interesDelPago == 0)
      && this.movimiento.tipoMovimiento == 'pago') {
      this.errorInteresOCapital = true;
      return
    }
    if (this.movimiento.montoPrestado == 0 && this.movimiento.tipoMovimiento == 'desembolso') {
      this.errorMontoPrestado = true;
      return
    }
    if (this.movimiento.tipoMovimiento == 'desembolso') { this.movimiento.capitalDelPago = 0; this.movimiento.interesDelPago = 0 }
    else if (this.movimiento.tipoMovimiento == 'pago') { this.movimiento.montoPrestado = 0 }
    //this.formatDateToTimestamp();
    if (!this.esNuevoMovimiento) { this.data.modificarMovimiento(this.movimiento); }
    else { this.data.insertarMovimiento(this.movimiento); }
    var subscripcion = this.data.obtenerMovimientosPorPrestamo(this.prestamo.numeroPrestamo).subscribe((listaMovimientos) => {
      var valoresCalculados = this.funcionesComunes.calcularValoresPrestamo(listaMovimientos, this.prestamo);
      this.prestamo.capitalPrestado = valoresCalculados.capitalPrestado;
      this.prestamo.pagadoCapital = valoresCalculados.pagadoCapital;
      this.prestamo.montoCuotas = this.funcionesComunes.calculateAmountOfFee(this.prestamo);
      this.prestamo.capitalPendiente = valoresCalculados.capitalPendiente;
      let a = moment(this.movimiento.fechaCorrespondiente);
      if (this.esNuevoMovimiento) this.prestamo.fechaProximoPago = a.add(1, 'month').format('YYYY-MM-DD');
      this.prestamo.estado = this.prestamo.capitalPendiente <= 0 ? "completado" : 'activo';
      if (this.prestamo.capitalPendiente <= 0) { this.prestamo.fechaProximoPago = null }
      this.data.modificarPrestamo(this.prestamo);
      subscripcion.unsubscribe();
      this.navCtrl.pop();
    });
  }
  calcularMontoTotal() {
    this.movimiento.montoTotal = this.funcionesComunes.round(this.movimiento.interesDelPago + this.movimiento.capitalDelPago, 2);
  }
  borrarMovimiento() {
    if (this.movimiento.tipoMovimiento == 'inicial') {
      this.funcionesComunes.presenAlert("Warning", "No se puede borrar el movimiento inicial de un prestamo")
      return
    }
    this.data.borrarMovimiento(this.movimiento.id);
    this.actualizarPrestamo();
    this.navCtrl.pop();
  }

  actualizarPrestamo() {
    let subscripcion = this.data.obtenerMovimientosPorPrestamo(this.prestamo.numeroPrestamo).subscribe((listaMovimientos) => {
      let valoresCalculados = this.funcionesComunes.calcularValoresPrestamo(listaMovimientos, this.prestamo);
      this.prestamo.capitalPrestado = valoresCalculados.capitalPrestado;
      this.prestamo.pagadoCapital = valoresCalculados.pagadoCapital;
      this.prestamo.capitalPendiente = valoresCalculados.capitalPendiente;
      this.prestamo.montoCuotas = this.funcionesComunes.calculateAmountOfFee(this.prestamo);
      this.data.modificarPrestamo(this.prestamo);
      subscripcion.unsubscribe();
    })
      ;

  }
  /*   formatDateToForm() {
      this.prestamo.fechaInicio = moment(this.prestamo.fechaInicio).format('YYYY-MM-DD');
      this.prestamo.fechaProximoPago = moment(this.prestamo.fechaProximoPago).format('YYYY-MM-DD');
      this.movimiento.fechaCorrespondiente = moment(this.movimiento.fechaCorrespondiente).format('YYYY-MM-DD');
      this.movimiento.fechaTransaccion = moment(this.movimiento.fechaTransaccion).format('YYYY-MM-DD');
    }
    formatDateToTimestamp() {
      this.prestamo.fechaInicio = new Date(this.prestamo.fechaInicio);
      this.prestamo.fechaProximoPago = new Date(this.prestamo.fechaProximoPago);
      this.movimiento.fechaCorrespondiente = new Date(this.movimiento.fechaCorrespondiente);
      this.movimiento.fechaTransaccion = new Date(this.movimiento.fechaTransaccion);
    } */
  //esta funcion es un workaround, ya que el ngmodel convierte a string mis valores numericos 
  convertToNumber(event): number {
    return +event;
  }

}
