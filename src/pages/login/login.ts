import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';



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
  showLogin: boolean = true;

  user: any = {};

  constructor(public nav: NavController, public navParams: NavParams,
    public afAuth: AngularFireAuth, public loadingCtrl: LoadingController, private alertCtrl: AlertController
  ) {
  }
  ngOnInit() {

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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
      this.presenErrortAlert(error);
      console.log(error)
    }).catch(error => {
      loading.dismiss();
      this.presenErrortAlert(error);
      console.log(error)
    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  presenErrortAlert(error) {
    let alert = this.alertCtrl.create({
      title: 'Error al hacer Login',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
