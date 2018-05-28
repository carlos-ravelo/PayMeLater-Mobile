import { Injectable } from '@angular/core';

//Angular Fire
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Cliente } from '../../clases/cliente'
import { Prestamo } from '../../clases/prestamo'
import { Movimiento } from '../../clases/movimiento'
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { FuncionesComunesProvider } from '../funciones-comunes/funciones-comunes';

/*
  Generated class for the ProvidersDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProvidersDataProvider {
  private clientesCollection: AngularFirestoreCollection<Cliente>;
  private prestamosCollection: AngularFirestoreCollection<Prestamo>;
  private movimientosCollection: AngularFirestoreCollection<Movimiento>;
  public loggedAccount: string;

  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth, public funcionesComunes: FuncionesComunesProvider) {
    console.log('Hello ProvidersDataProvider Provider', this.loggedAccount);
  }

  //Retorna la lista de clientes completa
  obtenerClientes(): Observable<any[]> {
    this.clientesCollection = this.db.collection<Cliente>(`usuarios/${this.loggedAccount}/clientes`, ref => ref.orderBy('nombre', 'asc'));

    return this.clientesCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Cliente;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })
  }
  getClientByName(nombreCliente: string): Observable<any[]> {
    this.clientesCollection = this.db.collection<Cliente>(`usuarios/${this.loggedAccount}/clientes`, ref => ref.where("nombre", "==", nombreCliente));
    return this.clientesCollection.valueChanges()
  }

  //Retorna la lista de prestamos completa
  obtenerPrestamos = (): Observable<any[]> => {
    this.prestamosCollection = this.db.collection<Prestamo>(`usuarios/${this.loggedAccount}/prestamos`, ref => ref.orderBy('fechaProximoPago', 'asc', ));
    return this.prestamosCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Prestamo;
        const numeroPrestamo = a.payload.doc.id;
        return { numeroPrestamo, ...data };
      })
    })
  }

  //Retorna la lista de prestamos para un cliente
  getLoansByCustomer = (customer: string): Observable<any[]> => {
    this.prestamosCollection = this.db.collection<Prestamo>(`usuarios/${this.loggedAccount}/prestamos`, ref => ref.where("cliente", "==", customer).orderBy('fechaProximoPago', 'asc', ));
    return this.prestamosCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Prestamo;
        const numeroPrestamo = a.payload.doc.id;
        return { numeroPrestamo, ...data };
      })
    })
  }
  //Retorna la lista de movimientos completa 
  obtenerMovimientosByLapse(dateStart, dateEnd): Observable<any> {
    this.movimientosCollection = this.db.collection<Movimiento>(`usuarios/${this.loggedAccount}/movimientos`, ref => ref
      .where('fechaTransaccion', '>=', dateStart).where('fechaTransaccion', '<=', dateEnd).orderBy('fechaTransaccion', 'asc'));
    return this.movimientosCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Movimiento;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })

  }

  //Retorna el siguiente numero de prestamo disponible
  ObtenerSiguientePrestamo(): Observable<any> {
    return this.db.collection(`usuarios/${this.loggedAccount}/prestamos`, ref => ref.orderBy('numeroPrestamo', 'desc', ).limit(1)).valueChanges();
  }

  //Obtiene la lista de movimientos de un prestamo en especifico
  obtenerMovimientosPorPrestamo = (numeroPrestamo: string): Observable<any[]> => {
    return this.db.collection(`usuarios/${this.loggedAccount}/movimientos`, ref => ref.where('numeroPrestamo', '==', numeroPrestamo).orderBy('fechaCorrespondiente', "asc")).snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Movimiento;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
  }
  //Obtiene el movimiento inicial de un prestamo
  obtenerMovimientoInicial(prestamo: Prestamo) {
    console.log("Obteniendo movimiento inicial", prestamo)
    return this.db.collection(`usuarios/${this.loggedAccount}/movimientos`, ref => ref.where('numeroPrestamo', '==', prestamo.numeroPrestamo)
      .where('tipoMovimiento', '==', 'inicial'))
      .snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Movimiento;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })

  }

  //Inserte un cliente nuevo
  insertarClientes(cliente: Cliente) {
    this.clientesCollection.add(cliente);
    console.log("se inserto un cliente", cliente);
  }
  //Inserte un Prestamo nuevo
  insertarPrestamos(prestamo: Prestamo) {
    this.prestamosCollection.doc(prestamo.numeroPrestamo).set(prestamo)
    console.log("se inserto un prestamo", prestamo);
  }

  //Inserta un Movimiento nuevo
  insertarMovimiento = (movimiento: Movimiento) => {
    this.db.collection<Movimiento>(`usuarios/${this.loggedAccount}/movimientos`)
      .add(movimiento);
    console.log("se inserto un movimiento", movimiento);
  }

  //Inserta una lista de Prestamos nuevos
  insertarPrestamosMasivo(prestamo: Prestamo[]) {
    for (let i = 0; i < prestamo.length; i++) {
      this.prestamosCollection.add(prestamo[i]);
      console.log("se inserto un prestamo");
    }
  }
  insertLoanCalculation = (prestamo: Prestamo) => {
    this.db.collection<Prestamo>(`usuarios/${this.loggedAccount}/loansCalculations`)
      .add(prestamo);
    console.log("se inserto un calculo de prestamo", prestamo);
  }
  updateLoanCalculation(prestamo: Prestamo) {
    console.log("Modificando Prestamo", prestamo)
    this.db.collection<Prestamo>(`usuarios/${this.loggedAccount}/loansCalculations`)
      .doc(prestamo.numeroPrestamo).update(prestamo)
  }
  getLoanCalculations = (): Observable<any[]> => {
    let loansCalculationsCollection = this.db.collection<Prestamo>(`usuarios/${this.loggedAccount}/loansCalculations`, ref => ref.orderBy('fechaInicio', 'asc', ));
    return loansCalculationsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Prestamo;
        data.numeroPrestamo = a.payload.doc.id;
        return { ...data };
      })
    })
  }

  //Borra un cliente
  borrarCliente(cliente: Cliente) {

    this.clientesCollection.doc(cliente.id).delete();
    console.log("se borro un cliente");
  }

  //Borra un prestamo
  deleteLoan(prestamo: Prestamo) {
    this.prestamosCollection.doc(prestamo.numeroPrestamo).delete();
    console.log("se borro un prestamo");
  }
  /*   deleteLoan(prestamo: Prestamo) {
      prestamo.estado = "borrado"
      this.prestamosCollection.doc(prestamo.numeroPrestamo).update(prestamo)
    } */
  deleteLoanCalculation(Calculation: Prestamo) {
    this.db.collection<Prestamo>(`usuarios/${this.loggedAccount}/loansCalculations`)
      .doc(Calculation.numeroPrestamo).delete();
    console.log("se borro un calculo");
  }

  //Borra un movimiento
  borrarMovimiento(id: string) {
    this.movimientosCollection.doc(id).delete();
    console.log("se borro un movimiento");
  }
  borrarMovimientosPorPrestamo(prestamo: Prestamo) {
    var subscripcion = this.obtenerMovimientosPorPrestamo(prestamo.numeroPrestamo).subscribe((listaMovimientos) => {
      listaMovimientos.forEach(element => {
        this.borrarMovimiento(element.id);
        subscripcion.unsubscribe();
      });

    })
  }
  //marcarMovimientosBorradosPorPrestamo
  /* 
    borrarMovimientosPorPrestamo(prestamo: Prestamo) {
      var subscripcion = this.obtenerMovimientosPorPrestamo(prestamo.numeroPrestamo).subscribe((listaMovimientos) => {
        listaMovimientos.forEach(movimiento => {
          movimiento.estado = "borrado";
          this.movimientosCollection.doc(movimiento.id).update(movimiento);
          subscripcion.unsubscribe();
        });
  
      })
    } */

  //Modifica un cliente 
  modificarCliente(cliente: Cliente) {
    console.log("Modificando cliente", cliente)
    this.clientesCollection.doc(cliente.id).update(cliente);
  }

  //Modifica un Prestamo 
  modificarPrestamo(prestamo: Prestamo) {
    console.log("Modificando Prestamo", prestamo)
    this.obtenerMovimientosPorPrestamo(prestamo.numeroPrestamo).subscribe((listaMovimientos) => {
      var valoresCalculados = this.funcionesComunes.calcularValoresPrestamo(listaMovimientos, prestamo);
      prestamo.capitalPrestado = valoresCalculados.capitalPrestado;
      prestamo.pagadoCapital = valoresCalculados.pagadoCapital;
      prestamo.montoCuotas = this.funcionesComunes.calculateAmountOfFee(prestamo);
      prestamo.capitalPendiente = valoresCalculados.capitalPendiente;
      this.prestamosCollection.doc(prestamo.numeroPrestamo).update(prestamo);

    })
  }
  //Modifica un Movimiento 
  modificarMovimiento(movimiento: Movimiento, ) {
    this.movimientosCollection.doc(movimiento.id).update(movimiento);
  }



}
