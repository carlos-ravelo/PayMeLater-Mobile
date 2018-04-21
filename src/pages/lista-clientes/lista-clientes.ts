import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Cliente } from '../../clases/cliente'
import { DetalleClientePage } from '../detalle-cliente/detalle-cliente'
import { FormClientesPage } from '../../pages/form-clientes/form-clientes';

/**
 * Generated class for the ListaClientesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-clientes',
  templateUrl: 'lista-clientes.html',
})
export class ListaClientesPage {
  listaClientes: Cliente[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: ProvidersDataProvider, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaClientesPage');
  }
  ngOnInit() {
    // this.ObtenerPrestamos();

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.data.obtenerClientes().subscribe(listaClientes => {
      this.listaClientes = listaClientes;

    });

  }
  irDetalleCliente($event, cliente) {
    this.navCtrl.push(DetalleClientePage, {
      cliente
    });

  }
  abrirInsertarCliente() {
    this.navCtrl.push(FormClientesPage, );
  }
  swipe() {
    console.log("swiped")
  }
}
