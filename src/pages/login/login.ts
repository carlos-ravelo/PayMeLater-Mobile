import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';
import { Storage } from '@ionic/storage';
import { ReportesPage } from '../reportes/reportes'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string = "";
  password: string = "";
  constructor(public nav: NavController, public navParams: NavParams,
    public afAuth: AngularFireAuth, public loadingCtrl: LoadingController, public funcionesComunes: FuncionesComunesProvider,
    private storage: Storage, public db: ProvidersDataProvider) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.afAuth.auth.signInWithEmailAndPassword(this.username, this.password).then(() => {
      this.storage.set('loggedInfo', { account: this.username, logged: true }).then(a => {
        loading.dismiss();
        this.db.loggedAccount = this.username;
        this.nav.setRoot(ReportesPage);
      }
      );
    }, error => {
      loading.dismiss();
      this.funcionesComunes.presenAlert("Error al hacer login", error);
      console.log(error)
    }).catch(error => {
      loading.dismiss();
      this.funcionesComunes.presenAlert("Error al hacer login", error);
      console.log(error)
    });
  }


}
