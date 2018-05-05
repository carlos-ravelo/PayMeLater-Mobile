import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Cliente } from '../../clases/cliente'
import { Prestamo } from '../../clases/prestamo'
import { Movimiento } from '../../clases/movimiento'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import { DatePipe } from '@angular/common';
import * as moment from 'moment'
import { AlertController } from 'ionic-angular';

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
  originalPrestamo: Prestamo;
  movimiento: Movimiento;
  modificarOnuevo: string;
  esNuevoPrestamo: boolean;

  constructor(private datePipe: DatePipe, public navCtrl: NavController, public navParams: NavParams,
    public data: ProvidersDataProvider, private funcionesComunes: FuncionesComunesProvider, public alertCtrl: AlertController) {
  }
  ngOnInit() {
    this.getClientList();
    if (this.navParams.get("prestamo")) {
      this.originalPrestamo = this.navParams.get("prestamo");
      this.prestamo = { ... this.navParams.get("prestamo") };
      let sonIguales = this.originalPrestamo == this.prestamo;

      this.getInitialMovement();
      this.esNuevoPrestamo = false
    }
    else {
      this.clear();
      this.ObtenerSiguientePrestamo();
      this.esNuevoPrestamo = true;
    };
    this.modificarOnuevo = this.prestamo.numeroPrestamo ? "Modificar" : "Insertar nuevo"
  }
  getClientList(): void {
    this.data.obtenerClientes().subscribe(listaCliente => { this.listaCliente = listaCliente; });
  }
  clear() {
    this.prestamo = {
      numeroPrestamo: '',
      estado: "activo",
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
  getInitialMovement() {

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

  calculateAmountOfFee() {
    this.prestamo.capitalPendiente = this.prestamo.capitalPrestado;
    this.prestamo.montoCuotas = this.funcionesComunes.round(this.funcionesComunes.calculateAmountOfFee(this.prestamo), 2);
  }

  formatFecha(event) {
    return (event.value.format())
  }
  createLoan() {
    if (this.prestamo.capitalPrestado == 0 || this.prestamo.montoCuotas == 0) { return; }
    if (!this.esNuevoPrestamo) {
      this.funcionesComunes.copyObject(this.prestamo, this.originalPrestamo)
      this.data.modificarPrestamo(this.originalPrestamo);
      this.data.modificarMovimiento(this.movimiento);
    }
    else {
      this.prestamo.capitalPendiente = this.prestamo.capitalPrestado;
      this.insertarMovimiento();
      this.data.insertarPrestamos(this.prestamo);
    }
    this.clear();
    this.navCtrl.pop();
  }
  convertToNumber(event): number {
    return +event;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FormPrestamosPage');
  }
  deleteLoan() {
    this.data.deleteLoan(this.prestamo);
    this.data.borrarMovimientosPorPrestamo(this.prestamo);
    this.navCtrl.pop();

  }
  ShowconfirmDelete() {
    let confirm = this.alertCtrl.create({
      title: 'Eliminar el prestamo?',
      message: 'Esta seguro que desea eliminar el prestamo y todos los movimientos asociados?',
      buttons: [
        {
          text: 'Cancelar',
          role: "cancel",
          handler: () => {
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteLoan();
          }
        }
      ]
    });
    confirm.present();
  }


}
