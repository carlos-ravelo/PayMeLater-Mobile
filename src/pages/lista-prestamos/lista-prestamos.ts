import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../clases/prestamo'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { DetallePrestamoPage } from '../detalle-prestamo/detalle-prestamo'
import { FormPrestamosPage } from '../../pages/form-prestamos/form-prestamos'


/**
 * Generated class for the ListaPrestamosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-prestamos',
  templateUrl: 'lista-prestamos.html',
})
export class ListaPrestamosPage implements OnInit {
  listaPrestamos: Prestamo[];
  thereIsNoLoanWarning: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public data: ProvidersDataProvider,
  ) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaPrestamosPage');
  }
  ngOnInit() {
    this.data.obtenerPrestamos()
      .subscribe(listaPrestamos => {
        this.thereIsNoLoanWarning = listaPrestamos[0] ? false : true;
        this.listaPrestamos = listaPrestamos;
      });
  }
  irDetallePrestamo = (event, prestamo): void => {
    this.navCtrl.push(DetallePrestamoPage, { prestamo: prestamo });
  }
  estaEnAtraso = (fecha): boolean => { return new Date(fecha) <= new Date(); }
  abrirInsertarPrestamo = (): void => { this.navCtrl.push(FormPrestamosPage, ); }
}




