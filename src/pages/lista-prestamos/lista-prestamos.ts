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

  constructor(public navCtrl: NavController, public navParams: NavParams, public data: ProvidersDataProvider,
  ) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaPrestamosPage');
  }
  ngOnInit() {
    // this.ObtenerPrestamos();

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.data.obtenerPrestamos().subscribe(listaPrestamos => {

      this.listaPrestamos = listaPrestamos;

    });

  }

  ObtenerPrestamos(): void {
    this.data.obtenerPrestamos().subscribe(listaPrestamos => {

      this.listaPrestamos = listaPrestamos;
      console.log(listaPrestamos)

    });
  }


  irDetallePrestamo(event, prestamo) {
    // That's right, we're pushing to ourselves!
    console.log(prestamo)
    this.navCtrl.push(DetallePrestamoPage, {
      prestamo
    });
  }

  estaEnAtraso(fecha) {
    return new Date(fecha) <= new Date()
  }

  abrirInsertarPrestamo() {
    this.navCtrl.push(FormPrestamosPage, );

  }
}




