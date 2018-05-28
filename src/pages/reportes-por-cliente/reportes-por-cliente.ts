import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Movimiento } from '../../clases/movimiento'
import { CurrencyPipe } from '@angular/common'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import { ListaPrestamosPage } from '../lista-prestamos/lista-prestamos'


/**
 * Generated class for the ReportesPorClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reportes-por-cliente',
  templateUrl: 'reportes-por-cliente.html',
})
export class ReportesPorClientePage implements OnInit {
  dataPerClient: { label: string, value: number }[];
  dataPerClient1: { label: string, value: number }[];
  totals: totals;
  listaMovimientos: Movimiento[];
  dataSource: string = "Interest Income";
  dateStart: string = "2017-12-25";
  dateEnd: string = "2018-05-25";
  doughnutChartLabels = ['Interest Income ', 'Capital Income ', 'Capital Outcome'];
  doughnutChartData;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public funcionesComunes: FuncionesComunesProvider, public db: ProvidersDataProvider, public currencyPipe: CurrencyPipe) {
  }
  ngOnInit(): void {
    this.getMovementsByRange("2017-12-25", "2018-05-25")
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  cambioDeFechas(event, tipo) {
    if (tipo == "fechaInicio") { this.getMovementsByRange(event, this.dateEnd); }
    else { this.getMovementsByRange(this.dateStart, event); }
  }

  calculatePercentage(val: number) {
    let dataSource = this.dataSource == "Interest Income" ? this.totals.interest : this.dataSource == "Capital Outcome" ? this.totals.capitalOutcome : this.totals.capitalIncome;
    return this.funcionesComunes.round(val / dataSource * 100, 1)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportesPorClientePage');
  }
  calculateGraphyc() {
    let totals: any = { interest: 0, capitalOutcome: 0, capitalIncome: 0 };
    this.dataPerClient = [{ label: "", value: 0 }];
    let listaClientes: string[] = [];
    let interestIncome: number[] = [];
    let capitalOutcome: number[] = [];
    let capitalIncome: number[] = [];

    this.dataPerClient1 = [];


    this.listaMovimientos.forEach((movimiento) => {
      //Calculate totals
      totals.interest = movimiento.interesDelPago + totals.interest;
      totals.capitalOutcome = movimiento.montoPrestado + totals.capitalOutcome;
      totals.capitalIncome = movimiento.capitalDelPago + totals.capitalIncome;

      if (listaClientes.indexOf(movimiento.cliente) == -1) {
        listaClientes.push(movimiento.cliente)
      }
      let index = listaClientes.indexOf(movimiento.cliente);
      interestIncome[index] = interestIncome[index] ? interestIncome[index] : 0;
      interestIncome[index] = interestIncome[index] + movimiento.interesDelPago;
      capitalOutcome[index] = capitalOutcome[index] ? capitalOutcome[index] : 0;
      capitalIncome[index] = capitalIncome[index] ? capitalIncome[index] : 0;
      capitalOutcome[index] = capitalOutcome[index] + movimiento.montoPrestado;
      capitalIncome[index] = capitalIncome[index] + movimiento.capitalDelPago;
    });
    this.totals = totals;

    while (interestIncome.indexOf(0) != -1) {
      let index = interestIncome.lastIndexOf(0);
      interestIncome.splice(index, 1);
      listaClientes.splice(index, 1);
    }
    interestIncome.forEach((value, i) => {
      this.dataPerClient[i] = { label: listaClientes[i], value: value };
    })
    this.dataPerClient.sort((a, b) => {
      if (a.value > b.value) { return -1 }
      if (a.value < b.value) { return 1 }
      return 0

    })

  }

  calculateGraphyc1() {
    let totals: any = { interest: 0, capitalOutcome: 0, capitalIncome: 0 };
    this.dataPerClient = [{ label: "", value: 0 }];
    let listaClientes: string[] = [];
    let interestIncome: number[] = [];
    let capitalOutcome: number[] = [];
    let capitalIncome: number[] = [];
    this.dataPerClient1 = [];


    this.listaMovimientos.forEach((movimiento) => {
      //Calculate totals
      totals.interest = movimiento.interesDelPago + totals.interest;
      totals.capitalOutcome = movimiento.montoPrestado + totals.capitalOutcome;
      totals.capitalIncome = movimiento.capitalDelPago + totals.capitalIncome;

      if (listaClientes.indexOf(movimiento.cliente) == -1) {
        listaClientes.push(movimiento.cliente)
      }
      let index = listaClientes.indexOf(movimiento.cliente);


      interestIncome[index] = interestIncome[index] ? interestIncome[index] : 0;
      interestIncome[index] = interestIncome[index] + movimiento.interesDelPago;
      capitalOutcome[index] = capitalOutcome[index] ? capitalOutcome[index] : 0;
      capitalIncome[index] = capitalIncome[index] ? capitalIncome[index] : 0;
      capitalOutcome[index] = capitalOutcome[index] + movimiento.montoPrestado;
      capitalIncome[index] = capitalIncome[index] + movimiento.capitalDelPago;
    });
    this.totals = totals; this.doughnutChartData = [this.totals.interest, this.totals.capitalIncome, this.totals.capitalOutcome];

    let data = this.dataSource == "Interest Income" ? interestIncome : this.dataSource == "Capital Outcome" ? capitalOutcome : capitalIncome;
    //let data = interestIncome;
    data.forEach((value, i) => {
      this.dataPerClient1[i] = { label: listaClientes[i], value: value };
    })
    this.dataPerClient1 = this.dataPerClient1.filter((data: { label: string, value: number }) => data.value != 0)
      .sort((a, b) => {
        if (a.value > b.value) { return -1 }
        if (a.value < b.value) { return 1 }
        return 0

      })
  }
  getMovementsByRange(dateStart, dateEnd) {
    this.db.obtenerMovimientosByLapse(dateStart, dateEnd).subscribe((listamovimientos) => {
      this.listaMovimientos = listamovimientos;

      this.calculateGraphyc1();
      this.db.db.firestore.enableNetwork();
    })
  }
  cambioDeChart(event) {
    this.dataSource = event;
    this.calculateGraphyc1();
    console.log(event)
  }
  public doughnutChartOptions: any = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          var label = data.labels[tooltipItem.index] || '';
          label += ': ' + `${this.currencyPipe.transform(data.datasets[0].data[tooltipItem.index], null, null, "2.0-0")}`;
          return label;
        }
      },
    }
  }

  abrirListaDePrestamos(nombreCliente) {
    this.navCtrl.push(ListaPrestamosPage, {
      filterWord: nombreCliente,
      fromClientsDetail: true
    })
  }
}
interface totals {
  interest: number, capitalOutcome: number, capitalIncome: number

}