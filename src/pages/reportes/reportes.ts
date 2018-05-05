import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Movimiento } from '../../clases/movimiento'
import { FacebookAuthProvider_Instance } from '@firebase/auth-types';
import * as moment from 'moment'
import { CurrencyPipe } from '@angular/common'
import { dateList } from '../../app/appConstantsAndConfig'

/**
 * Generated class for the ReportesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reportes',
  templateUrl: 'reportes.html',
})
export class ReportesPage {
  listaMovimientos: Movimiento[];
  dateStart: string;
  dateEnd: string;
  totals: totals;
  listaFechas = dateList;
  rangoDeFecha: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: ProvidersDataProvider, private currencyPipe: CurrencyPipe) {
  }

  ionViewDidLoad() {
    this.rangoDeFecha = this.listaFechas[0];
    this.dateStart = this.listaFechas[0].fechaInicial;
    this.dateEnd = this.listaFechas[0].fechaFinal;
    this.getMovementsByRange(this.dateStart, this.dateEnd);
    console.log('ionViewDidLoad ReportesPage');

  }

  cambioDeFechas(event, tipo) {
    if (tipo == "fechaInicio") { this.getMovementsByRange(event, this.dateEnd); }
    else { this.getMovementsByRange(this.dateStart, event); }
    console.log(event)
  }
  getMovementsByRange(dateStart, dateEnd) {
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.db.obtenerMovimientosByLapse(dateStart, dateEnd).subscribe((listamovimientos) => {
      this.listaMovimientos = listamovimientos
      this.calculateTotals();
      this.doughnutChartLabels = ['Interest-Income ', 'Capital-Income ', 'Capital-Outcome'];
      this.doughnutChartData = [this.totals.interest, this.totals.capitalIncome, this.totals.capitalOutcome];
      this.doughnutChartType = 'doughnut';
      this.showBars(moment(dateStart), moment(dateEnd));
    })
  }
  calculateTotals(listaMovimientos: Movimiento[] = this.listaMovimientos) {
    let totals: any = { interest: 0, capitalOutcome: 0, capitalIncome: 0 };
    listaMovimientos.forEach(movimiento => {
      totals.interest = movimiento.interesDelPago + totals.interest;
      totals.capitalOutcome = movimiento.montoPrestado + totals.capitalOutcome;
      totals.capitalIncome = movimiento.capitalDelPago + totals.capitalIncome;
    });
    this.totals = totals;
  }
  // Doughnut
  public doughnutChartLabels: string[];
  public doughnutChartData: number[];
  public doughnutChartType: string;
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

  //Bars
  public doughnutChartOptions: any = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          var label = data.labels[tooltipItem.index] || '';
          label += ': ' + `${this.currencyPipe.transform(data.datasets[0].data[tooltipItem.index], null, null, "2.0-0")}`;
          return label;
        }
      }
    }
  }
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: label => `${this.currencyPipe.transform(label, null, null, "2.0-0")}`
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => `${this.currencyPipe.transform(tooltipItem.yLabel, null, null, "2.0-0")}`
      }
    }

  };
  //public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartLabels: string[] = []
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartDataSource: string = "Interest Income";

  public barChartData: any[] = [
    { data: [], label: '' },
    //{ data: [], label: '' },
  ];

  showBars(dateStart: moment.Moment = moment(this.dateStart), dateEnd: moment.Moment = moment(this.dateEnd)) {
    this.barChartLabels.length = 0;
    let dateStartCopy = dateStart.startOf('month');
    let dateEndCopy = dateEnd.startOf('month');
    while (dateStartCopy <= dateEndCopy) {
      this.barChartLabels.push(dateStartCopy.format('MMM, YYYY'));
      dateStartCopy.add(1, "month")
    }
    let interestIncome: number[] = [];
    let capitalOutcome: number[] = [];
    let capitalIncome: number[] = [];

    this.listaMovimientos.forEach(element => {
      let monthEntry = moment(element.fechaTransaccion).format('MMM, YYYY');
      let index = this.barChartLabels.indexOf(monthEntry);
      interestIncome[index] = interestIncome[index] ? interestIncome[index] : 0;
      capitalOutcome[index] = capitalOutcome[index] ? capitalOutcome[index] : 0;
      capitalIncome[index] = capitalIncome[index] ? capitalIncome[index] : 0;
      interestIncome[index] = interestIncome[index] + element.interesDelPago;
      capitalOutcome[index] = capitalOutcome[index] + element.montoPrestado;
      capitalIncome[index] = capitalIncome[index] + element.capitalDelPago;
    });
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].label = this.barChartDataSource;
    //  clone[1].label = "Interest income";

    clone[0].data = this.barChartDataSource == "Interest Income" ? interestIncome : capitalOutcome;
    clone[0].data = this.barChartDataSource == "Interest Income" ? interestIncome : this.barChartDataSource == "Capital Outcome" ? capitalOutcome : capitalIncome;
    //clone[1].data = capitalIncome;

    this.barChartData = clone;
  }
  cambioDeChart(event) {
    this.barChartDataSource = event;
    this.getMovementsByRange(this.dateStart, this.dateEnd);
    console.log(event)
  }
}

interface totals {
  interest: number, capitalOutcome: number, capitalIncome: number

}


