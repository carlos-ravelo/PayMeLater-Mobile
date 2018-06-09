import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../clases/prestamo'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { DetallePrestamoPage } from '../detalle-prestamo/detalle-prestamo'
import { FormPrestamosPage } from '../../pages/form-prestamos/form-prestamos'
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';
import { PopoverController } from 'ionic-angular';
import { NotificationsPopOverPage } from '../notifications-pop-over/notifications-pop-over'

import { NotificationsPage } from '../notifications/notifications'
import { LoanFilterPopOverPage } from '../loan-filter-pop-over/loan-filter-pop-over'

import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common';



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
  @ViewChild('search') search: any;
  listaPrestamos: Prestamo[];
  filteredListaPrestamos: Prestamo[];
  completedListaPrestamos: Prestamo[];
  filteredCompletedListaPrestamos: Prestamo[];
  shouldShowCancel: boolean = true;
  thereIsNoLoanWarning: boolean;
  totalLoans: number;
  totalInteresMensual: number;
  filterWord: string = '';
  showSearch: boolean = false;
  fromClientsDetail: boolean = false;
  notificationList: Array<number>;


  constructor(public afAuth: AngularFireAuth, public db: AngularFirestore, public navCtrl: NavController,
    public navParams: NavParams, public data: ProvidersDataProvider, public funcionesComunes: FuncionesComunesProvider
    , public popoverCtrl: PopoverController, private localNotifications: LocalNotifications, private datePicker: DatePicker,
    public datepipe: DatePipe
  ) {
  }
  ionViewDidLoad() {
    this.data.obtenerPrestamos()
      .subscribe(listaPrestamos => {
        if (this.navParams.get("fromClientsDetail")) this.fromClientsDetail = this.navParams.get("fromClientsDetail");
        this.thereIsNoLoanWarning = listaPrestamos[0] ? false : true;
        this.listaPrestamos = listaPrestamos.filter((prestamo: Prestamo) => { return prestamo.estado == "activo" });
        this.filteredListaPrestamos = this.funcionesComunes.filterArray(this.listaPrestamos, this.filterWord);

        this.completedListaPrestamos = listaPrestamos.filter((prestamo: Prestamo) => { return prestamo.estado == "completado" });
        this.filteredCompletedListaPrestamos = this.funcionesComunes.filterArray(this.completedListaPrestamos, this.filterWord);
        this.calcularEncabezado();
      });
    console.log('ionViewDidLoad ListaPrestamosPage');
  }
  ngOnInit() {

    this.getNotifications();
    this.filterWord = this.navParams.get("filterWord") || '';
    this.localNotifications.on("add").subscribe(() => this.getNotifications())
    this.localNotifications.on("cancel").subscribe(() => this.getNotifications())
  }
  showDatePicker(event, prestamo) {
    this.datePicker.show({
      date: new Date(),
      mode: 'datetime',
      minDate: new Date(),
      todayText: "Hoy",
      allowOldDates: false,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => { this.createNotification(date, prestamo); },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  createNotification(date: Date, prestamo) {
    if (date.getTime() < new Date().getTime()) {
      this.funcionesComunes.presentToast("Seleccione una fecha futura", 3000, "bottom")
      return
    }
    this.localNotifications.schedule({
      id: Number(prestamo.numeroPrestamo),
      title: 'Notificacion de Prestamo: ' + prestamo.numeroPrestamo,
      text: prestamo.cliente,
      trigger: { at: date },
    });
    this.funcionesComunes.presentToast("Se creo la alerta " + this.datepipe.transform(date, 'medium'), 3000, "bottom")

  }
  getNotifications() {
    this.localNotifications.getScheduledIds().then((notificationList) => {
      this.notificationList = notificationList
    })

  }

  irDetallePrestamo = (event, prestamo): void => {
    this.navCtrl.push(DetallePrestamoPage, { prestamo: prestamo }).then(() => {
      if (this.fromClientsDetail) {
        // this.showSearch = false;
      } else {
        // this.hideSearch() 
      }
    });

  }
  estaEnAtraso = (fecha): boolean => { return new Date(fecha) <= new Date(); }
  abrirInsertarPrestamo = (): void => {
    this.navCtrl.push(FormPrestamosPage, );
    if (this.fromClientsDetail) {
      //this.showSearch = false;
    } else {// this.hideSearch() 
    }
  }
  calcularEncabezado = () => {
    this.totalLoans = 0;
    this.totalInteresMensual = 0;
    this.filteredListaPrestamos.forEach(element => {
      this.totalLoans = element.capitalPendiente + this.totalLoans;
      this.totalInteresMensual = ((element.capitalPendiente) * (element.tasa / (element.tipoTasa == "Anual" ? 12 : 1)) / 100) + this.totalInteresMensual;
    });
  }
  filterItems(event: any) {
    const query = event.target.value;
    this.filteredListaPrestamos = this.funcionesComunes.filterArray(this.listaPrestamos, query);
    this.filteredCompletedListaPrestamos = this.funcionesComunes.filterArray(this.completedListaPrestamos, query);
    this.calcularEncabezado();
  }
  showNotificationMenu(event, prestamo) {
    let notificationPopOver = this.popoverCtrl.create(NotificationsPopOverPage,
      { prestamo: prestamo });
    notificationPopOver.present({ ev: event, animate: true });
    notificationPopOver.onDidDismiss(() => { this.getNotifications() })

  }
  displaySearch() {
    this.filterWord = "";
    this.showSearch = true;
    this.focusButton();
  }
  hideSearch() {
    this.filteredCompletedListaPrestamos = this.completedListaPrestamos;
    this.filteredListaPrestamos = this.listaPrestamos;
    this.showSearch = false;
    this.calcularEncabezado();

  }
  focusButton(): void {
    setTimeout(() => {
      this.search.setFocus();
    }, 50);
  }
  openNotificarionsPage() {
    this.navCtrl.push(NotificationsPage);
  }
  openNotificarionsPageFiltered(notification) {
    this.navCtrl.push(NotificationsPage, { notification: Number(notification) })
  }
  hasNotif(numeroPrestamo): boolean {
    if (this.notificationList.indexOf(Number(numeroPrestamo)) >= 0) {
      return true
    } return false;

  }

  openFilterPopOver(event) {
    let popOver = this.popoverCtrl.create(LoanFilterPopOverPage);
    popOver.present({ ev: event });
    popOver.onDidDismiss((filterCondicions) => {
      alert(filterCondicions)

    })


  }

}




