import { Component, ViewChild, OnInit, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../clases/prestamo';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import * as moment from 'moment';
import { FabContainer } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { FormMovimientoPage } from '../../pages/form-movimiento/form-movimiento';
import { ActionSheetController } from 'ionic-angular'
import { AlertController } from 'ionic-angular';
import { FormPrestamosPage } from '../form-prestamos/form-prestamos'
import { MovimientosPorPrestamoComponent } from '../../components/movimientos-por-prestamo/movimientos-por-prestamo'
import { TablaAmortizacionComponent } from '../../components/tabla-amortizacion/tabla-amortizacion'
import { Movimiento } from '../../clases/movimiento';


/**
 * Generated class for the DetallePrestamoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-prestamo',
  templateUrl: 'detalle-prestamo.html',
})
export class DetallePrestamoPage implements OnInit, OnChanges {
  @ViewChild(FabContainer) fab;
  @ViewChild(MovimientosPorPrestamoComponent) movimientosPorPrestamo: MovimientosPorPrestamoComponent;
  @ViewChild(TablaAmortizacionComponent) tablaAmortizacion: TablaAmortizacionComponent;

  prestamo: Prestamo;
  montoAtraso: Number;
  fabIsOpen: boolean = false;
  isamortization: boolean = false;
  initialMovement: Movimiento;
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
    private funcionesComunes: FuncionesComunesProvider, public data: ProvidersDataProvider, public alertCtrl: AlertController) {
    this.prestamo = navParams.get('prestamo');
    if (navParams.get("isamortization")) {
      this.isamortization = navParams.get("isamortization");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallePrestamoPage');
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.calculateMontoAtraso();
    this.getInitialMovement();
  }
  ngOnChanges(changes) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.calculateMontoAtraso();

  }
  calculateMontoAtraso() {
    let fechaProximoPago = moment(this.prestamo.fechaProximoPago);
    let hoy = moment();
    let diferencia = 0;
    while (fechaProximoPago < hoy) {
      fechaProximoPago.add(1, 'month')
      diferencia++;
    }
    let montlyOrAnualyRate = this.prestamo.tipoTasa == "Anual" ? 1 : 12;
    let tasaAnualizada = montlyOrAnualyRate * this.prestamo.tasa;
    this.montoAtraso = diferencia * this.prestamo.capitalPendiente * tasaAnualizada / 100 / 12;
  }
  imprimir = (divToPrint) => {
    this.funcionesComunes.imprimir(divToPrint);
    this.cerrarBackDrop();
  }
  cerrarBackDrop() {
    this.fabIsOpen = false;
    this.fab.close();
  }

  openEditLoanPage() {
    if (this.isamortization) { return }
    this.navCtrl.push(FormPrestamosPage,
      { prestamo: this.prestamo, initialMovement: this.initialMovement });
    this.cerrarBackDrop();
  }

  getInitialMovement() {

    var subscripcion = this.data.obtenerMovimientoInicial(this.prestamo).subscribe(movimiento => {
      this.initialMovement = movimiento[0];
      subscripcion.unsubscribe();

    })
  }

  deleteLoan() {
    this.data.deleteLoan(this.prestamo);
    this.data.borrarMovimientosPorPrestamo(this.prestamo);
    this.navCtrl.pop();

  }
  abrirIsnertarMovimientos(tipoMovimiento) {
    this.navCtrl.push(FormMovimientoPage,
      { prestamo: this.prestamo, tipoMovimiento: tipoMovimiento, esNuevoMovimiento: true });
    this.cerrarBackDrop();

  }

  presentPrintActionSheet() {
    if (!this.isamortization) {
      this.actionSheetCtrl.create({
        title: 'Print a section',
        buttons: [
          {
            text: 'Detalle',
            handler: () => {
              this.imprimir('detalle');
            }
          },
          {
            text: 'Todo',
            handler: () => {
              this.imprimir('todo');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Movimientos',
            handler: () => {
              this.imprimir('movimientos');
            }
          }
        ]
      }).present();
    }
    else {
      this.imprimir('todo');

    }
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
