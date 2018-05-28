import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, } from 'ionic-angular';
import * as moment from 'moment'
import { ViewController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Prestamo } from '../../clases/prestamo'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';


/**
 * Generated class for the NotificationsPopOverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications-pop-over',
  templateUrl: 'notifications-pop-over.html',
})
export class NotificationsPopOverPage {
  notificationDate: string;
  notificationTime: string;
  prestamo: Prestamo;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private localNotifications: LocalNotifications, public funcionesComunes: FuncionesComunesProvider) {
  }

  ionViewDidLoad() {
    //this.notificationDate = moment().format();
    console.log('ionViewDidLoad NotificationsPopOverPage');
    this.prestamo = this.navParams.get("prestamo")
    this.notificationDate = this.prestamo.fechaProximoPago;
    this.notificationTime = this.prestamo.fechaProximoPago;


  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  guardar() {

    const hour = this.notificationTime.substr(11, 2)
    const minute = this.notificationTime.substr(14, 2)
    let time = moment(hour + minute, "hhmm")
    let date = moment(this.notificationDate);
    let notificationDate = date.set({ "hour": time.get("hour"), "minute": time.get("minute") }).format()
    this.localNotifications.schedule({
      id: 1,
      title: 'Notificacion de Prestamo',
      text: this.prestamo.numeroPrestamo + " " + this.prestamo.cliente,
      trigger: { at: new Date(notificationDate) },
    });
    this.funcionesComunes.presentToast("se creo la alerta " + notificationDate, 3000, "bottom")
    this.dismiss();
  }

}
