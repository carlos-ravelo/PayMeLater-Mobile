import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { Movimiento } from '../../clases/movimiento'
import * as moment from 'moment'
import { CurrencyPipe } from '@angular/common'
import { dateList } from '../../app/appConstantsAndConfig'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'

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
  rangoDeFechaSeleccionado: any;
  showDetailButton: boolean = false;
  page: string = "reportesGenerales";
  currentMonth: { startMonth: string, endMonth } = { startMonth: "", endMonth: "" }

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: ProvidersDataProvider,
    private currencyPipe: CurrencyPipe, public funcionesComunes: FuncionesComunesProvider) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    if (this.navParams.get("page")) {
      this.page = this.navParams.get("page")
      this.dateStart = this.navParams.get("currentMonth").startMonth;
      this.dateEnd = this.navParams.get("currentMonth").endMonth;
    }
    else {
      this.page = "reportesGenerales"
      this.rangoDeFechaSeleccionado = this.listaFechas[0];
      this.dateStart = this.listaFechas[0].fechaInicial;
      this.dateEnd = this.listaFechas[0].fechaFinal;
    }
    this.getMovementsByRange(this.dateStart, this.dateEnd);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportesPage');

  }
  cambioDeFechas(event, tipo) {
    if (tipo == "fechaInicio") { this.getMovementsByRange(event, this.dateEnd); }
    else { this.getMovementsByRange(this.dateStart, event); }
    console.log(event)
  }
  cambioDeChart(event) {
    this.barChartDataSource = event;
    this.getMovementsByRange(this.dateStart, this.dateEnd);
    console.log(event)
  }


  getMovementsByRange(dateStart, dateEnd) {
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.db.obtenerMovimientosByLapse(dateStart, dateEnd).subscribe((listamovimientos) => {
      this.listaMovimientos = listamovimientos
      this.calculateTotals();
      this.doughnutChartLabels = ['Interest Income ', 'Capital Income ', 'Capital Outcome'];
      this.doughnutChartData = [this.totals.interest, this.totals.capitalIncome, this.totals.capitalOutcome];
      this.doughnutChartType = 'doughnut';
      this.showBars(moment(dateStart), moment(dateEnd));
      // this.db.db.firestore.enableNetwork();
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
    let currentMonth = e.active[0] ? e.active[0]._model.label : null;
    this.currentMonth.startMonth = moment(currentMonth, 'MMM, YYYY').startOf("month").format('YYYY-MM-DD');
    this.currentMonth.endMonth = moment(currentMonth, 'MMM, YYYY').endOf("month").format('YYYY-MM-DD');
  }


  //doughnut
  public doughnutChartOptions: any = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          var label = data.labels[tooltipItem.index] || '';
          label += ': ' + `${this.currencyPipe.transform(data.datasets[0].data[tooltipItem.index], null, null, "2.2-2")}`;
          return label;
        }
      },
    }
  }
  colorBlue: Array<any> = [

    { // dark grey
      backgroundColor: 'rgba(54,162,235,0.8)',
      borderColor: 'rgba(77,83,96,1)',
    },
  ];

  colorYellow: Array<any> = [

    { // dark grey
      backgroundColor: 'rgba(255, 197, 51, 0.6)',
      borderColor: 'rgba(77,83,96,1)',
    },
  ];

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
        label: (tooltipItem, data) => `${this.currencyPipe.transform(tooltipItem.yLabel, null, null, "2.2-2")}`
      },
      custom: (tooltipModel) => {

        this.showDetailButton = true;
        if (tooltipModel.opacity === 0) {

          setTimeout(() => {
            this.showDetailButton = false;
          }, 100); return;
        }
      }
    },
  };

  public barChartLabels: string[] = [];
  barChartLabels1: string[] = [];
  public barChartDataSource: string = "Interest Income";
  public barChartDataInterestIncome: any[] = [{ data: [], label: '' }];
  barChartData2: any[] = [{ data: [], label: '' }];

  dataPerClient: { label: string, value: number }[] = [{ label: "", value: 0 }];


  showBars1() {
    this.dataPerClient.length = 0;
    this.barChartLabels1.length = 0;
    let interestIncome: number[] = [];
    let capitalOutcome: number[] = [];
    let capitalIncome: number[] = [];

    this.listaMovimientos.forEach((movimiento) => {
      let index = this.barChartLabels1.indexOf(movimiento.cliente);
      if (this.barChartLabels1.indexOf(movimiento.cliente) == -1) {
        this.barChartLabels1.push(movimiento.cliente)
      }
      index = this.barChartLabels1.indexOf(movimiento.cliente);
      interestIncome[index] = interestIncome[index] ? interestIncome[index] : 0;
      interestIncome[index] = interestIncome[index] + movimiento.interesDelPago;
      capitalOutcome[index] = capitalOutcome[index] ? capitalOutcome[index] : 0;
      capitalIncome[index] = capitalIncome[index] ? capitalIncome[index] : 0;
      capitalOutcome[index] = capitalOutcome[index] + movimiento.montoPrestado;
      capitalIncome[index] = capitalIncome[index] + movimiento.capitalDelPago;
    });
    while (interestIncome.indexOf(0) != -1) {
      let index = interestIncome.lastIndexOf(0);
      interestIncome.splice(index, 1);
      this.barChartLabels1.splice(index, 1);
    }
    interestIncome.forEach((value, i) => {
      this.dataPerClient[i] = { label: this.barChartLabels1[i], value: value };

    })
    this.barChartData2[0].data = interestIncome;
    this.dataPerClient.sort((a, b) => {
      if (a.value > b.value) { return -1 }
      if (a.value < b.value) { return 1 }
      return 0

    })
    console.log(this.dataPerClient)

  }

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
    let clone = JSON.parse(JSON.stringify(this.barChartDataInterestIncome));
    clone[0].label = this.barChartDataSource;
    clone[0].data = this.barChartDataSource == "Interest Income" ? interestIncome : this.barChartDataSource == "Capital Outcome" ? capitalOutcome : capitalIncome;
    this.barChartDataInterestIncome = clone;
    this.showBars1();
  }

  verDetallesMes() {
    if (this.currentMonth.startMonth.trim() == "") {
      this.currentMonth.startMonth = moment().startOf("month").format();
      this.currentMonth.endMonth = moment().endOf("month").format();
    }
    this.navCtrl.push(ReportesPage, {
      page: "detalle", currentMonth: this.currentMonth

    })

    console.log("detalles Mes")

  }

  calculatePercentage(val: number) {

    return this.funcionesComunes.round(val / this.totals.interest * 100, 1)

  }
}

interface totals {
  interest: number, capitalOutcome: number, capitalIncome: number

}


