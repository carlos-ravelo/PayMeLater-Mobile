import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';
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
    public afAuth: AngularFireAuth, public loadingCtrl: LoadingController, public funcionesComunes: FuncionesComunesProvider) {
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
      loading.dismiss();
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
  logout() {
    this.afAuth.auth.signOut();
  }

}
