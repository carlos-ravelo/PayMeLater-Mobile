import { Component, OnInit, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../clases/prestamo'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { DetallePrestamoPage } from '../detalle-prestamo/detalle-prestamo'
import { FormPrestamosPage } from '../../pages/form-prestamos/form-prestamos'
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';

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
  listaPrestamos: Prestamo[];
  filteredListaPrestamos: Prestamo[];
  thereIsNoLoanWarning: boolean;
  totalLoans: number;
  totalInteresMensual: number;
  filterWord: string = '';


  constructor(public afAuth: AngularFireAuth, public db: AngularFirestore, public navCtrl: NavController,
    public navParams: NavParams, public data: ProvidersDataProvider, public funcionesComunes: FuncionesComunesProvider
  ) {
  }
  ionViewDidLoad() {
    this.data.obtenerPrestamos()
      .subscribe(listaPrestamos => {
        this.thereIsNoLoanWarning = listaPrestamos[0] ? false : true;
        this.listaPrestamos = listaPrestamos;
        //  this.filteredListaPrestamos = listaPrestamos;
        this.filteredListaPrestamos = this.funcionesComunes.filterArray(this.listaPrestamos, this.filterWord);
        this.calcularEncabezado();


      });
    console.log('ionViewDidLoad ListaPrestamosPage');
  }
  ngOnInit() {
    this.filterWord = this.navParams.get("filterWord") || '';
  }

  irDetallePrestamo = (event, prestamo): void => {
    this.navCtrl.push(DetallePrestamoPage, { prestamo: prestamo });
  }
  estaEnAtraso = (fecha): boolean => { return new Date(fecha) <= new Date(); }
  abrirInsertarPrestamo = (): void => { this.navCtrl.push(FormPrestamosPage, ); }
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
    this.calcularEncabezado();
  }

}




