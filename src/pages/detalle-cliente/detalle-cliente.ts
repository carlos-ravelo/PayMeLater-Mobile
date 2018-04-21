import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Cliente } from '../../clases/cliente'
import { Clipboard } from '@ionic-native/clipboard';
import { CallNumber } from '@ionic-native/call-number';
import { FormClientesPage } from '../../pages/form-clientes/form-clientes'

import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';
import { SocialSharing } from '@ionic-native/social-sharing'
import { EmailComposer } from '@ionic-native/email-composer'


/**
 * Generated class for the DetalleClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-cliente',
  templateUrl: 'detalle-cliente.html',
})
export class DetalleClientePage {
  cliente: Cliente;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private clipboard: Clipboard, private callNumber: CallNumber
    , private db: ProvidersDataProvider, private funcionesComunes: FuncionesComunesProvider, private socialSharing: SocialSharing,
    private emailComposer: EmailComposer) {
    this.cliente = navParams.get('cliente');

  }

  copiarAlClipboard(texto) {
    this.clipboard.copy(texto);
    this.funcionesComunes.presentToast(`Se ha copiado el texto ${texto}`, 3000, "")

  }
  llamarAnumero(numero) {
    this.callNumber.callNumber(numero, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
    this.funcionesComunes.presentToast(`Marcando en numero ${numero}`, 3000, "");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleClientePage');
  }

  abrirEditarCliente() {
    this.navCtrl.push(FormClientesPage,
      { cliente: this.cliente });
  }
  borrarCliente() {
    this.db.borrarCliente(this.cliente);
    this.navCtrl.pop();
    this.funcionesComunes.presentToast(`Se Borro el Cliente ${this.cliente.nombre}`, 3000, "")
  }

  share(text) {
    console.log(text)
    this.socialSharing.share(text).catch((error) => console.log(error))

  }
  sendEmail(destination) {
    let email = {
      to: destination,
      cc: '',
      subject: '',
      body: "",
      isHtml: true
    };
    this.emailComposer.open(email).then(() => true)
      .catch((error) => console.log(error))
  }

}
