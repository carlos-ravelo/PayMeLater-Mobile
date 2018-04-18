import { Component, ViewChild, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Prestamo } from '../../clases/prestamo'
import { Movimiento } from '../../clases/movimiento'
import { ProvidersDataProvider } from '../../providers/providers-data/providers-data'
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes'
import { EditarMovimientoPage } from '../../pages/editar-movimiento/editar-movimiento';
/**
 * Generated class for the MovimientosPorPrestamoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'movimientos-por-prestamo',
  templateUrl: 'movimientos-por-prestamo.html'
})
export class MovimientosPorPrestamoComponent {
  @Input() prestamo: Prestamo;
  listaMovimientos: any[];
  movimientoActual: Movimiento;
  tipoMovimiento: string;
  createFormMovimientos: boolean;
  displayedColumns = ['tipoMovimiento', 'fechaTrasaccion', 'interesDelPago', 'capitalDelPago', 'montoPrestado'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private db: ProvidersDataProvider, private funcionesComunes: FuncionesComunesProvider,
    public navCtrl: NavController, public navParams: NavParams, ) { }


  ngOnInit() {
    this.createFormMovimientos = false;
  }
  ngOnChanges() {
    this.obtenerListaMovimientos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* openInsertarMovimiento(tipoMovimiento: String): void {
    let dialogRef = this.dialog.open(FormMovimientoComponent, {
      // width: '250px',
      data: { prestamo: this.prestamo, tipoMovimiento: tipoMovimiento }
    });
  }
  openModificarMovimiento(): void {
    let dialogRef = this.dialog.open(ModificarMovimientoComponent, {
      // width: '250px',
      data: { movimientoActual: this.movimientoActual }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.actualizarPrestamo();
      }
      console.log(result);
    });
  }
 */
  seleccionarTipoMov(tipo: string) {
    this.tipoMovimiento = tipo;
    this.createFormMovimientos = true;
  }
  cambiarTipoMovimiento(evento) {
    this.tipoMovimiento = evento
  }

  borrarMovimiento() {
    if (this.movimientoActual.tipoMovimiento == 'inicial') {
      alert("no puede borrar el movimiento inicial");
      return
    }
    this.db.borrarMovimiento(this.movimientoActual.id);
    this.movimientoActual = this.listaMovimientos[0];
    this.actualizarPrestamo();

  }

  actualizarPrestamo() {
    let subscripcion = this.db.obtenerMovimientosPorPrestamo(this.prestamo.numeroPrestamo).subscribe((listaMovimientos) => {
      let valoresCalculados = this.funcionesComunes.calcularValoresPrestamo(this.listaMovimientos, this.prestamo);
      this.prestamo.capitalPrestado = valoresCalculados.capitalPrestado;
      this.prestamo.pagadoCapital = valoresCalculados.pagadoCapital;
      this.prestamo.capitalPendiente = valoresCalculados.capitalPendiente;
      this.prestamo.montoCuotas = this.funcionesComunes.calcularMontoCuota(this.prestamo);
      this.db.modificarPrestamo(this.prestamo);
      subscripcion.unsubscribe();
    })
      ;

  }

  modificarMovimiento() {

    this.movimientoActual.fechaTransaccion = new Date(this.movimientoActual.fechaTransaccion)
    this.db.modificarMovimiento(this.movimientoActual);
    this.actualizarPrestamo();
  }

  obtenerListaMovimientos(): void {
    this.db.obtenerMovimientosPorPrestamo(this.prestamo.numeroPrestamo).subscribe(listaMovimientos => {
      this.listaMovimientos = listaMovimientos;
      this.movimientoActual = listaMovimientos[0];
      this.dataSource.data = this.listaMovimientos;
    });
  }
  onSelect(movimiento: Movimiento): void {

    this.movimientoActual = movimiento;
  }
  abrirModificarMovimiento() {
    this.navCtrl.push(EditarMovimientoPage,
      this.prestamo);
  }
}
