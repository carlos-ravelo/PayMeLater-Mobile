import { Component, Input, ViewChild } from '@angular/core';

import { Prestamo } from '../../clases/prestamo'
import { MatTableDataSource, MatPaginator } from '@angular/material';
import * as moment from 'moment';

/**
 * Generated class for the TablaAmortizacionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tabla-amortizacion',
  templateUrl: 'tabla-amortizacion.html'
})
export class TablaAmortizacionComponent {

  text: string;

  constructor() {

  }

  @Input() prestamo: Prestamo;
  displayedColumns = ['position', 'interes', 'capital', 'saldo'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  calendario: any[];

  calcularCalendario(loan_amount, interest_rate, payments_per_year, years, payment, fechaInicial) {
    var schedule = [];
    var remaining = loan_amount;
    var number_of_payments = payments_per_year * years;
    let nextDate = moment(fechaInicial);

    for (var i = 1; i <= number_of_payments; i++) {
      var interest = remaining * (interest_rate / 100 / payments_per_year);
      var principle = (payment - interest);
      remaining = remaining - principle
      var row = [nextDate.format(), principle > 0 ? (principle < payment ? principle : payment) : 0, interest > 0 ? interest : 0, remaining > 0 ? remaining : 0];
      nextDate.add(1, 'month')
      if (interest > 1) { schedule.push(row); }

    }
    return schedule;
  }

  calcularPmt(rate, nper, pv) {
    var pvif, pmt;

    pvif = Math.pow(1 + rate, nper);
    pmt = rate / (pvif - 1) * -(pv * pvif);

    return pmt;
  }

  ngOnChanges(changes) {
    this.calendario = this.calcularCalendario(
      this.prestamo.capitalPendiente,
      this.prestamo.tasa,
      12,
      this.prestamo.cantidadCuotas / 12,
      this.prestamo.montoCuotas
      , this.prestamo.fechaProximoPago
    );

    this.dataSource.data = this.calendario;
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }
  ngOnInit() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.


  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.dataSource.paginator = this.paginator;
  }

}
