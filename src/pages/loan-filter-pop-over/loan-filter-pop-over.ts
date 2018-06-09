import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { filter } from 'rxjs/operator/filter';
import { Prestamo } from '../../clases/prestamo'


/**
 * Generated class for the LoanFilterPopOverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loan-filter-pop-over',
  templateUrl: 'loan-filter-pop-over.html',
})
export class LoanFilterPopOverPage {
  filterCondition: any = { property: "" };
  listOfpropertiesToFilter = ["Estado", "Tasa", "Tipo Tasa", "Capital Prestado", "Fecha Proximo Pago", "Fecha Inicio", "Capital pendiente"];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanFilterPopOverPage');
  }
  dismiss() {
    this.viewCtrl.dismiss(this.filterCondition)
  }



}
