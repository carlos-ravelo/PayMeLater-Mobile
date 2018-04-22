import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Cliente } from '../../clases/cliente'
import { Prestamo } from '../../clases/prestamo'
import { Movimiento } from '../../clases/movimiento'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import { DatePipe } from '@angular/common';
import * as moment from 'moment'

/**
 * Generated class for the FormPrestamosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-form-prestamos',
  templateUrl: 'form-prestamos.html',
})
export class FormPrestamosPage {
  listaCliente: Cliente[];
  prestamo: Prestamo;
  movimiento: Movimiento;
  errorCapitalInicial: boolean = false;
  errorMontoCuotas: boolean = false;
  errorCliente: boolean = false;
  modificarOnuevo: string;
  esNuevoPrestamo: boolean;
  constructor(private datePipe: DatePipe, public navCtrl: NavController, public navParams: NavParams, public data: ProvidersDataProvider, private funcionesComunes: FuncionesComunesProvider) {
  }
  ngOnInit() {
    this.obtenerClientes();
    if (this.navParams.get("prestamo")) {
      this.prestamo = { ... this.navParams.get("prestamo") };
      this.obtenerMovimientoAmodificar();
      this.esNuevoPrestamo = false
    }
    else {
      this.clear();
      this.ObtenerSiguientePrestamo();
      this.esNuevoPrestamo = true;
    };
    this.modificarOnuevo = this.prestamo.numeroPrestamo ? "Modificar" : "Insertar nuevo"

  }
  obtenerClientes(): void {
    this.data.obtenerClientes().subscribe(listaCliente => { this.listaCliente = listaCliente; });
  }
  clear() {
    this.prestamo = {
      numeroPrestamo: '',
      cliente: 'default',
      capitalPrestado: 0,
      tasa: 0,
      montoCuotas: 0,
      cantidadCuotas: 0,
      fechaProximoPago: moment(new Date()).add(1, 'month').format('YYYY-MM-DD'),
      pagadoCapital: 0,
      fechaInicio: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      capitalPendiente: 0,
      tipoTasa: "Mensual"
    }
    this.movimiento = {
      numeroPrestamo: '',
      cliente: '',
      tipoMovimiento: '',
      montoTotal: 0,
      fechaCorrespondiente: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      fechaTransaccion: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      notas: '',
      interesDelPago: 0,
      capitalDelPago: 0,
      montoPrestado: 0
    }
  }
  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  ObtenerSiguientePrestamo() {
    this.data.ObtenerSiguientePrestamo().subscribe(ultimoPrestamo => {
      if (ultimoPrestamo[0]) {
        ultimoPrestamo[0].numeroPrestamo = parseInt(ultimoPrestamo[0].numeroPrestamo, 10) + 1;
        this.prestamo.numeroPrestamo = this.pad(ultimoPrestamo[0].numeroPrestamo, 5, "0");
      }
      else {
        this.prestamo.numeroPrestamo = "00001"
      }

    })

  }
  obtenerMovimientoAmodificar() {

    var subscripcion = this.data.obtenerMovimientoInicial(this.prestamo).subscribe(movimiento => {
      this.movimiento = movimiento[0];
      console.log(movimiento[0])
      subscripcion.unsubscribe();

    })
  }
  insertarMovimiento() {
    this.movimiento.numeroPrestamo = this.prestamo.numeroPrestamo;
    this.movimiento.cliente = this.prestamo.cliente;
    this.movimiento.tipoMovimiento = "inicial";
    this.movimiento.montoTotal = this.prestamo.capitalPrestado;
    this.movimiento.montoPrestado = this.prestamo.capitalPrestado;
    this.movimiento.fechaTransaccion = this.prestamo.fechaInicio;
    this.movimiento.notas = "Entrada automatica"
    this.data.insertarMovimiento(this.movimiento);
  }

  calcularMontoCuota() {
    this.prestamo.capitalPendiente = this.prestamo.capitalPrestado;
    this.prestamo.montoCuotas = this.funcionesComunes.round(this.funcionesComunes.calcularMontoCuota(this.prestamo), 2);
  }
  abrirModalFormClientes() {
    // this.dialogRef.close("abrirModalFormCliente");
  }
  formatFecha(event) {
    return (event.value.format())
  }
  crearPrestamo() {
    // this.prestamo.fechaInicio = this.prestamo.fechaInicio;
    this.prestamo.capitalPendiente = this.prestamo.capitalPrestado;
    if (this.prestamo.cliente == "default" || this.prestamo.cliente == "") { this.errorCliente = true; setTimeout(() => { this.errorCliente = false; }, 2000); return; }
    if (this.prestamo.capitalPrestado == 0) { this.errorCapitalInicial = true; setTimeout(() => { this.errorCapitalInicial = false; }, 2000); return; }
    if (this.prestamo.montoCuotas == 0) { this.errorMontoCuotas = true; setTimeout(() => { this.errorMontoCuotas = false; }, 2000); return; }
    this.data.insertarPrestamos(this.prestamo);
    if (!this.esNuevoPrestamo) { this.data.modificarMovimiento(this.movimiento) }
    else { this.insertarMovimiento() }
    this.clear();
    this.navCtrl.pop();
  }
  convertToNumber(event): number {
    return +event;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FormPrestamosPage');
  }

}
