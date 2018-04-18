import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LoginPage } from '../pages/login/login';
import { ListaPrestamosPage } from '../pages/lista-prestamos/lista-prestamos';
import { ListaClientesPage } from '../pages/lista-clientes/lista-clientes';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any }>;


  constructor(public afAuth: AngularFireAuth, public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private backgroundMode: BackgroundMode) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      /*       { title: 'Home', component: HomePage },
            { title: 'List', component: ListPage }, */
      { title: 'Clientes', component: ListaClientesPage },
      { title: 'Prestamos', component: ListaPrestamosPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();

      this.afAuth.auth.onAuthStateChanged(((a: firebase.User) => {

        if (a) {
          this.nav.setRoot(ListaClientesPage)
        }
        else if (!a) {
          this.nav.setRoot(LoginPage)
        }
      }));
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout() {
    this.nav.setRoot(LoginPage);

    this.afAuth.auth.signOut();

  }
}
