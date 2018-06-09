import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LoginPage } from '../pages/login/login';
import { ListaPrestamosPage } from '../pages/lista-prestamos/lista-prestamos';
import { ListaClientesPage } from '../pages/lista-clientes/lista-clientes';
import { Storage } from '@ionic/storage';
import { ProvidersDataProvider } from '../providers/providers-data/providers-data'
import { AmortizacionesPage } from '../pages/amortizaciones/amortizaciones'
import { ReportesPage } from '../pages/reportes/reportes'
import { LoggedInfo } from '../clases/loggedInfo'
import { AlertController } from 'ionic-angular';
import { ReportesPorClientePage } from '../pages/reportes-por-cliente/reportes-por-cliente';
import { ConfigurationsPage } from '../pages/configurations/configurations';
import { LoanFilterPopOverPage } from '../pages/loan-filter-pop-over/loan-filter-pop-over';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any, icon: string, color: string, class: string }>;
  reportesPages: Array<{ title: string, component: any, icon: string, color: string, class: string }>;
  alert: any;

  constructor(public afAuth: AngularFireAuth, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private backgroundMode: BackgroundMode, private storage: Storage,
    private db: ProvidersDataProvider, private alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Clientes', component: ListaClientesPage, icon: '', color: "", class: "fas fa-users" },
      { title: 'Prestamos', component: ListaPrestamosPage, icon: '', color: "", class: "fas fa-university" },
      { title: 'Amortizaciones', component: AmortizacionesPage, icon: '', color: "", class: "fas fa-chart-line" },
      { title: 'Configuraciones', component: ConfigurationsPage, icon: '', color: "", class: "fas fa-cogs" },
      { title: 'Loan Filter', component: LoanFilterPopOverPage, icon: '', color: "", class: "fas fa-cogs" },


    ];


    this.reportesPages = [
      { title: 'Reportes por mes', component: ReportesPage, icon: '', color: "", class: "far fa-chart-bar" },
      { title: 'Reporte por Clientes', component: ReportesPorClientePage, icon: '', color: "", class: "fas fa-chart-pie" },
    ];
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {

        if (this.nav.canGoBack()) {
          this.nav.pop();
        }
        else {
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlert();
          }
        }
      })
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.backgroundMode.enable();
      this.storage.get('loggedInfo').then((loggedInfo: LoggedInfo) => {
        if (!loggedInfo) {
          this.nav.setRoot(LoginPage)
          console.log('Not Logged info');

        }
        else if (loggedInfo.logged) {
          this.db.loggedAccount = loggedInfo.account;
          this.db.db.firestore.disableNetwork();
          this.nav.setRoot(ReportesPage)
          console.log('Is Logged', loggedInfo.logged, loggedInfo.account);

        }
        else {
          this.nav.setRoot(LoginPage)
          console.log('Is Not Logged');

        }
      });
    });
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }

  openPage(page) {

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout() {
    this.storage.set('loggedInfo', { account: "", logged: false });
    this.afAuth.auth.signOut();
    this.nav.setRoot(LoginPage)
  }

}
