import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../clases/prestamo';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import * as moment from 'moment';
import { FabContainer } from 'ionic-angular';
import { EditarPrestamoPage } from '../../pages/editar-prestamo/editar-prestamo';




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
export class DetallePrestamoPage {
  @ViewChild(FabContainer) fab;
  prestamo: Prestamo;
  montoAtraso: Number;
  fabIsOpen: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private funcionesComunes: FuncionesComunesProvider) {
    this.prestamo = navParams.get('prestamo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallePrestamoPage');


  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.calculateMontoAtraso();

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
    this.montoAtraso = diferencia * this.prestamo.capitalPendiente * this.prestamo.tasa / 100 / 12;
  }
  imprimir = (divToPrint) => {
    this.funcionesComunes.imprimir(divToPrint);
    this.cerrarBackDrop;
  }


  cerrarBackDrop() {
    this.fabIsOpen = false;
    this.fab.close();
  }

  abrirEditarPrestamo() {
    this.navCtrl.push(EditarPrestamoPage,
      this.prestamo);

  }
}
