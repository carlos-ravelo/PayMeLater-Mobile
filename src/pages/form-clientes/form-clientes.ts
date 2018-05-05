import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { Cliente } from '../../clases/cliente'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';
import { Contacts } from '@ionic-native/contacts'

/**
 * Generated class for the FormClientesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form-clientes',
  templateUrl: 'form-clientes.html',
})
export class FormClientesPage {
  @ViewChild(FabContainer) fab;

  cliente: Cliente;
  listaBancos: String[];
  fabIsOpen: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: ProvidersDataProvider,
    private funcionesComunes: FuncionesComunesProvider, private contacts: Contacts) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (!this.navParams.get('cliente')) { this.clear(); }
    else { this.cliente = this.navParams.get('cliente') }
    this.ObtenerListaBancos();
    this.listaBancos = ["Banco Popular", "Banco BHD", "Banco del Progreso"]
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FormClientesPage');
  }
  crearCliente() {
    console.log("agregando")
    if (this.cliente.nombre.trim() == '') {
      this.funcionesComunes.presentToast('El nombre del cliente esta vacio', 3000, "middle")
      return
    }
    //Borramos los campos Vacios
    if (!this.cliente.id || this.cliente.id.trim() == '') { delete this.cliente.id; }
    if (this.cliente.cuentas) this.cliente.cuentas = this.cliente.cuentas.filter(function (e) { if (e.banco != "") { return e } })
    if (this.cliente.telefonos) this.cliente.telefonos = this.cliente.telefonos.filter(function (e) { return e.numero.trim() != "" })
    if (this.cliente.emails) this.cliente.emails = this.cliente.emails.filter(function (e) { return e != "" })
    if (this.cliente.id) {
      this.data.modificarCliente(this.cliente)
      this.funcionesComunes.presentToast(`Se actualizo el cliente ${this.cliente.nombre}`, 3000, "")
    }
    else {
      this.data.insertarClientes(<Cliente>this.cliente.getData());
      this.funcionesComunes.presentToast(`Se creo el cliente ${this.cliente.nombre}`, 3000, "")
    }
    this.clear();
    this.navCtrl.pop();
  }

  clear() {
    this.cliente = new Cliente("", [{ tipo: 'Celular', numero: '' }], [{ banco: '', numero: '' }], [""], "");
  }

  addCuenta() {
    this.cliente.cuentas.push({
      banco: "default",
      numero: ""
    });
  };

  addTelefono() {
    this.cliente.telefonos.push({ tipo: "Celular", numero: "" });
  };
  addEmail() {
    if (!this.cliente.emails) { this.cliente.emails = [] }
    this.cliente.emails.push("");
  };
  ObtenerListaBancos(): void {
    // this.clientesService.obtenerListaBancos().subscribe(listaBancos => { this.listaBancos = listaBancos; });
  }

  identify() {
    return 0;
  };
  cerrarBackDrop() {
    this.fabIsOpen = false;
    this.fab.close();
  }

  seleccionarContacto() {
    this.contacts.pickContact().then((contacto) => {
      this.cliente.nombre = contacto.name.formatted;
      this.cliente.telefonos = contacto.phoneNumbers.map((telefonos) => {
        return ({ tipo: 'Celular', numero: telefonos.value })
      })

    })
    this.cerrarBackDrop();
  }

}
