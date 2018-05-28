import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Cliente } from '../../clases/cliente'
import { DetalleClientePage } from '../detalle-cliente/detalle-cliente'
import { FormClientesPage } from '../../pages/form-clientes/form-clientes';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';

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
export class ListaClientesPage implements OnInit {
  @ViewChild('search') search: any;
  listaClientes: Cliente[];
  filteredListaClientes: Cliente[];
  thereIsNoClientWarning: boolean;
  showSearch: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: ProvidersDataProvider, public funcionesComunes: FuncionesComunesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaClientesPage');
  }
  ngOnInit() {
    // this.ObtenerPrestamos();

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.data.obtenerClientes()
      .subscribe(listaClientes => {
        this.listaClientes = listaClientes;
        this.filteredListaClientes = listaClientes;
        this.thereIsNoClientWarning = listaClientes[0] ? false : true;

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

  /*   getItems(ev: any) {
      // Reset items back to all of the items
      this.filteredListaClientes = this.listaClientes;
      // set val to the value of the searchbar
      let val = ev.target.value;
  
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.filteredListaClientes = this.listaClientes.filter((item) => {
          return ((item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1));
        })
      }
    } */

  filterItems(event: any) {
    const query = event.target.value;
    this.filteredListaClientes = this.funcionesComunes.filterArray(this.listaClientes, query);
  }
  displaySearch() {
    this.showSearch = true;
    this.focusButton();
  }
  hideSearch() {
    this.filteredListaClientes = this.listaClientes;
    this.showSearch = false;
  }
  focusButton(): void {
    setTimeout(() => {
      this.search.setFocus();
    }, 50);
  }
}
