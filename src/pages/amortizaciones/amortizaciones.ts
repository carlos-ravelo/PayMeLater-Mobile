import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Prestamo } from '../../clases/prestamo'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import { FormClientesPage } from '../form-clientes/form-clientes'
import * as moment from 'moment'
import { AlertController } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { DetallePrestamoPage } from '../detalle-prestamo/detalle-prestamo'


@IonicPage()
@Component({
  selector: 'page-amortizaciones',
  templateUrl: 'amortizaciones.html',
})
export class AmortizacionesPage {
  prestamo: Prestamo;
  page: string = "savedCalculations";
  calculationsList: Prestamo[];
  thereIsNoCalculationWarning: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private funcionesComunes: FuncionesComunesProvider
    , public alertCtrl: AlertController, public db: ProvidersDataProvider) {
    this.clear()
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCalculationsList();

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AmortizacionesPage');
  }
  clear() {
    this.prestamo = {
      numeroPrestamo: '',
      estado: "activo",
      cliente: '',
      capitalPrestado: 0,
      tasa: 0,
      montoCuotas: 0,
      cantidadCuotas: 0,
      fechaProximoPago: moment().add(1, 'month').format('YYYY-MM-DD'),
      pagadoCapital: 0,
      fechaInicio: moment().format('YYYY-MM-DD'),
      capitalPendiente: 0,
      tipoTasa: "Mensual"
    }
  }
  calculateAmountOfFee() {
    this.prestamo.capitalPendiente = this.prestamo.capitalPrestado;
    this.prestamo.montoCuotas = this.funcionesComunes.round(this.funcionesComunes.calculateAmountOfFee(this.prestamo), 2);
  }
  saveCalculation() {
    if (this.prestamo.montoCuotas) {
      if (!this.prestamo.numeroPrestamo) { this.db.insertLoanCalculation(this.prestamo) }
      else { this.db.updateLoanCalculation(this.prestamo) }
      this.page = "savedCalculations";
    }
    else {
      this.funcionesComunes.presentToast("Los datos no son suficientes para el calculo", 3000, "bottom")
    }
  }

  gotoNew() {
    this.page = "addCalculation";
    this.clear()
  }
  showConfirmSaveCalculation() {
    let confirm = this.alertCtrl.create({
      title: 'Guardar el calculo?',
      message: 'Introduzca una descripcion para identificar este calculo entre los guardados',
      inputs: [
        {
          name: "notas",
          placeholder: ""
        }
      ],

      buttons: [

        {
          text: 'Cancelar',
          role: "cancel",
          handler: () => {
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.prestamo.notas = data.notas;
            console.log(data);
            this.saveCalculation();
          }
        }
      ]
    });
    confirm.present();
  }

  getCalculationsList() {
    this.db.getLoanCalculations().subscribe((calculations) => {
      this.thereIsNoCalculationWarning = calculations[0] ? false : true;


      this.calculationsList = calculations;
      console.log(calculations);
    })
  }

  openFormNewClient() {
    this.navCtrl.push(FormClientesPage)
  }
  deleteCalculation(loan) {
    this.db.deleteLoanCalculation(loan)
  }
  loadCalculation(calculation) {
    this.prestamo = calculation;
    this.page = "addCalculation";
    this.funcionesComunes.presentToast("Se cargo el calculo", 3000, "bottom")

  }
  openLoanDetails = (prestamo: Prestamo = this.prestamo): void => {
    if (prestamo.montoCuotas) {
      this.navCtrl.push(DetallePrestamoPage, { prestamo: prestamo, isamortization: true });
      this.page = "savedCalculations";
      this.clear();
    }
    else {
      this.funcionesComunes.presentToast("Los datos no son suficientes para el calculo", 3000, "bottom")
    }

  }
}

