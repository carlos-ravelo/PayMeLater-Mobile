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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, component: any }>;


  constructor(public afAuth: AngularFireAuth, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private backgroundMode: BackgroundMode, private storage: Storage,
    private db: ProvidersDataProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      /*       { title: 'Home', component: HomePage },
            { title: 'List', component: ListPage }, */
      { title: 'Clientes', component: ListaClientesPage },
      { title: 'Prestamos', component: ListaPrestamosPage },
      { title: 'Reportes', component: ReportesPage },
      { title: 'Amortizaciones', component: AmortizacionesPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      this.storage.get('loggedInfo').then((loggedInfo: LoggedInfo) => {
        if (!loggedInfo) {
          this.nav.setRoot(LoginPage)
          console.log('Not Logged info');

        }
        else if (loggedInfo.logged) {
          this.db.loggedAccount = loggedInfo.account;
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
