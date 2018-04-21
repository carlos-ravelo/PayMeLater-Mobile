import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Cliente } from '../../clases/cliente'
import { Prestamo } from '../../clases/prestamo'
import { Movimiento } from '../../clases/movimiento'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import { DatePipe } from '@angular/common';

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


  constructor(private datePipe: DatePipe, public navCtrl: NavController, public navParams: NavParams, public data: ProvidersDataProvider, private funcionesComunes: FuncionesComunesProvider) {
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
      fechaProximoPago: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      pagadoCapital: 0,
      fechaInicio: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      capitalPendiente: 0,

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

  ngOnInit() {
    this.obtenerClientes();
    this.clear();

    this.ObtenerSiguientePrestamo();
  }

  NPER(ir: number, per: number, pmt: number, pv: number) {
    /*ir -> Interes anual
    per -> Numero de periodos por año (mensual = 12, quincenal = 24)
    pmt: Pago Fijo Mensual
    pv: Cantidad Prestada
    */
    let fv = 0;
    var nbperiods;
    if (ir != 0)
      ir = ir / (100 * per);
    nbperiods = Math.log((-fv * ir + pmt) / (pmt + ir * pv)) / Math.log(1 + ir)

    return nbperiods;
  }
  calcularMontoCuota() {
    this.prestamo.capitalPendiente = this.prestamo.capitalPrestado;
    this.prestamo.montoCuotas = this.funcionesComunes.calcularMontoCuota(this.prestamo);
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
    this.insertarMovimiento();
    this.clear();
    this.navCtrl.pop();


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormPrestamosPage');
  }

}
