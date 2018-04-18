import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListaPrestamosPage } from '../lista-prestamos/lista-prestamos';
import * as firebase from 'firebase/app';
import { LoadingController } from 'ionic-angular';
import { ListaClientesPage } from '../lista-clientes/lista-clientes';



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
  showLogin: boolean = false;

  user: any = {};

  constructor(public nav: NavController, public navParams: NavParams,
    public afAuth: AngularFireAuth, public loadingCtrl: LoadingController
  ) {
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.afAuth.auth.onAuthStateChanged(((a: firebase.User) => {
      if (a) {
        this.nav.setRoot(ListaClientesPage)
      }
      else {
        this.showLogin = true;
      }
    }));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.username, this.password).then(() => {
      this.nav.setRoot(ListaPrestamosPage)
    }, error => {
      console.log(error)
    }).catch(error => { console.log(error) });
  }
  logout() {
    this.afAuth.auth.signOut();
  }
}
