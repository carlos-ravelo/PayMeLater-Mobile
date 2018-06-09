import { Component, ViewChild, OnInit, OnDestroy, } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Cliente } from '../../clases/cliente'
import { Prestamo } from '../../clases/prestamo'
import { Movimiento } from '../../clases/movimiento'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import * as moment from 'moment'
import { AlertController } from 'ionic-angular';
import { FormClientesPage } from '../form-clientes/form-clientes'
import { Platform } from 'ionic-angular';


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
export class FormPrestamosPage implements OnInit {
  listaCliente: Cliente[];
  prestamo: Prestamo;
  originalPrestamo: Prestamo;
  movimiento: Movimiento;
  modificarOnuevo: string;
  esNuevoPrestamo: boolean;
  capitalInicial: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: ProvidersDataProvider, private funcionesComunes: FuncionesComunesProvider, public alertCtrl: AlertController
    , public platform: Platform) {
  }
  ngOnInit() {

    this.getClientList();
    if (this.navParams.get("prestamo")) {
      this.originalPrestamo = this.navParams.get("prestamo");
      this.prestamo = { ... this.navParams.get("prestamo") };
      this.movimiento = this.navParams.get("initialMovement");
      this.prestamo.capitalPrestado = this.movimiento.montoPrestado;
      this.esNuevoPrestamo = false
    }
    else {
      this.clear();
      this.ObtenerSiguientePrestamo();
      this.esNuevoPrestamo = true;
    };
    this.modificarOnuevo = this.esNuevoPrestamo ? "Insertar nuevo" : "Modificar"
  }

  getClientList(): void {
    this.data.obtenerClientes().subscribe(listaCliente => { this.listaCliente = listaCliente; });
  }
  clear() {
    this.prestamo = {
      numeroPrestamo: '',
      estado: "activo",
      cliente: '',
      capitalPrestado: 0,
      tasa: 0,
      montoCuotas: 0,
      cantidadCuotas: 0,
      fechaProximoPago: moment().add(1, 'month').format('YYYY-MM-DD'),
      pagadoCapital: 0,
      fechaInicio: moment().format('YYYY-MM-DD'),
      capitalPendiente: 0,
      tipoTasa: "Mensual"
    }
    this.movimiento = {
      numeroPrestamo: '',
      cliente: '',
      tipoMovimiento: '',
      montoTotal: 0,
      fechaCorrespondiente: moment().format('YYYY-MM-DD'),
      fechaTransaccion: moment().format('YYYY-MM-DD'),
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

  calculateAmountOfFee() {
    if (this.esNuevoPrestamo) { this.prestamo.capitalPendiente = this.prestamo.capitalPrestado }
    this.prestamo.montoCuotas = this.funcionesComunes.round(this.funcionesComunes.calculateAmountOfFee(this.prestamo), 2);
  }

  formatFecha(event) {
    return (event.value.format())
  }
  createLoan() {
    if (this.prestamo.capitalPrestado == 0 || this.prestamo.montoCuotas == 0) {
      this.funcionesComunes.presentToast("El capital prestado y el monto de cuotas no puede ser 0", 3000, "bottom");
      return;
    }
    if (!this.esNuevoPrestamo) {
      this.funcionesComunes.copyObject(this.prestamo, this.originalPrestamo)
      this.data.modificarPrestamo(this.originalPrestamo);
      this.movimiento.numeroPrestamo = this.prestamo.numeroPrestamo;
      this.movimiento.cliente = this.prestamo.cliente;
      this.movimiento.tipoMovimiento = "inicial";
      this.movimiento.montoTotal = this.prestamo.capitalPrestado;
      this.movimiento.montoPrestado = this.prestamo.capitalPrestado;
      this.movimiento.fechaTransaccion = this.prestamo.fechaInicio;
      this.movimiento.notas = "Entrada automatica"
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

  openFormNewClient() {
    this.navCtrl.push(FormClientesPage)
  }
}
