import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { Cliente } from '../../clases/cliente'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';
import { Contacts } from '@ionic-native/contacts'
import { TitleCasePipe } from '@angular/common';
import { Prestamo } from '../../clases/prestamo';
import { Movimiento } from '../../clases/movimiento';


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
  originalCliente: Cliente;
  listaBancos: String[];
  fabIsOpen: boolean = false;
  isNewClient: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public data: ProvidersDataProvider,
    private funcionesComunes: FuncionesComunesProvider, private contacts: Contacts, public titleCase: TitleCasePipe) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (!this.navParams.get('cliente')) { this.clear(); this.isNewClient = true; }
    else {
      this.cliente = this.navParams.get('cliente')
      this.originalCliente = this.navParams.get("cliente");
      this.cliente = { ... this.navParams.get("cliente") };
      this.isNewClient = false;
    }
    this.ObtenerListaBancos();
    this.listaBancos = ["Banco Popular", "Banco BHD", "Banco del Progreso"]
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FormClientesPage');
  }
  crearCliente() {
    console.log("agregando")
    if (this.cliente.nombre.trim() == '') {
      this.funcionesComunes.presentToast('El nombre del cliente esta vacio', 3000, "bottom")
      return
    }

    //Borramos los campos Vacios
    if (!this.cliente.id || this.cliente.id.trim() == '') { delete this.cliente.id; }
    if (this.cliente.cuentas) this.cliente.cuentas = this.cliente.cuentas.filter(cuenta => cuenta.numero.length > 0)
    if (this.cliente.telefonos) this.cliente.telefonos = this.cliente.telefonos.filter(telefono => telefono.numero.length > 0)
    if (this.cliente.emails) this.cliente.emails = this.cliente.emails.filter(email => email.length > 0)
    this.cliente.nombre = this.cliente.nombre.replace(/\s+/g, " ").trim();

    if (this.isNewClient) {
      let subscripcion = this.data.getClientByName(this.cliente.nombre).subscribe(
        clientes => {
          if (clientes.length == 0) {
            this.data.insertarClientes(<Cliente>this.cliente.getData());
            this.funcionesComunes.presentToast(`Se creo el cliente ${this.cliente.nombre}`, 3000, "");
            this.navCtrl.pop();
            subscripcion.unsubscribe();
          }
          else {
            this.funcionesComunes.presentToast("Ya existe un cliente con este nombre ", 5000, "bottom")
            subscripcion.unsubscribe();
            return

          }
        }
      )
    }
    else {
      this.data.modificarCliente(this.cliente);
      this.updateLoansAndMovements();
      this.funcionesComunes.copyObject(this.cliente, this.originalCliente);
      this.funcionesComunes.presentToast(`Se actualizo el cliente ${this.cliente.nombre}`, 3000, "")
      this.navCtrl.pop();
    }

  }
  capitalizeFirstLetter(event) {
    return this.titleCase.transform(event.normalize('NFD').replace(/[\u0300-\u036f,.:!"#$%&()=?¡¿']/g, ""))
  }
  updateLoansAndMovements() {
    let loanSub = this.data.getLoansByCustomer(this.originalCliente.nombre).subscribe(loans => {
      loans.forEach((loan: Prestamo) => {
        loan.cliente = this.cliente.nombre;
        this.data.modificarPrestamo(loan)
        let movementSub = this.data.obtenerMovimientosPorPrestamo(loan.numeroPrestamo).subscribe(
          movements => {
            movements.forEach((movement: Movimiento) => {
              movement.cliente = this.cliente.nombre;
              this.data.modificarMovimiento(movement);
            }
            )
            movementSub.unsubscribe();
          }
        )
      })
      loanSub.unsubscribe();
    })
  }

  clear() {
    this.cliente = new Cliente("", [{ tipo: 'Celular', numero: '' }], [{ banco: 'Popular', numero: '' }], [""], "");
  }

  addCuenta() {
    this.cliente.cuentas.push({
      banco: "Popular",
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
