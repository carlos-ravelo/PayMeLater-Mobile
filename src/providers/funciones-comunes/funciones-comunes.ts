import { Injectable } from '@angular/core';
import { Movimiento } from '../../clases/movimiento'
import { Prestamo } from '../../clases/prestamo'
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener'
import html2canvas from 'html2canvas'
import { LoadingController, ToastController } from 'ionic-angular';



/*
  Generated class for the FuncionesComunesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FuncionesComunesProvider {

  constructor(private file: File, private fileOpener: FileOpener
    , public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    console.log('Hello FuncionesComunesProvider Provider');
  }
  calcularMontoCuota(prestamo: Prestamo) {
    let montoCuota: number
    if (prestamo.capitalPrestado > 0 && prestamo.tasa > 0 && prestamo.cantidadCuotas == 0) {
      montoCuota = prestamo.capitalPrestado * prestamo.tasa / 100 / 12;
      return isNaN(montoCuota) || !isFinite(montoCuota) ? 0 : montoCuota;
    }
    if (prestamo.capitalPrestado > 0 && prestamo.tasa == 0 && prestamo.cantidadCuotas > 0) {
      montoCuota = prestamo.capitalPrestado / prestamo.cantidadCuotas
      return isNaN(montoCuota) || !isFinite(montoCuota) ? 0 : montoCuota;
    }
    else /* if (prestamo.capitalPrestado > 0 && prestamo.tasa > 0 && prestamo.cantidadCuotas > 0) */ {
      let r = prestamo.tasa / 12 / 100;
      let pv = prestamo.capitalPrestado;
      let n = prestamo.cantidadCuotas * -1
      montoCuota = parseFloat((r * (pv) / (1 - Math.pow((1 + r), n)) * 100 / 100).toFixed(2));
      return isNaN(montoCuota) || !isFinite(montoCuota) ? 0 : montoCuota;

    }
  }

  redondear(value, places) {
    var multiplier = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
  }


  //Retorna los valores calculados de un prestamo
  calcularValoresPrestamo(movimientos: Movimiento[], prestamo: Prestamo): any {
    console.log("calculando valores de prestamo", "movimientos", movimientos)
    if (movimientos.length > 0) {
      let capitalPrestado: number = 0;
      let pagadoCapital: number = 0;
      for (var i = 0; i < movimientos.length; i++) {
        if (movimientos[i].montoPrestado) {
          capitalPrestado = capitalPrestado + movimientos[i].montoPrestado;
        }
        if (movimientos[i].capitalDelPago) {
          pagadoCapital = pagadoCapital + movimientos[i].capitalDelPago;
        }
      }
      let capitalPendiente = capitalPrestado - pagadoCapital;
      return {
        capitalPrestado: capitalPrestado,
        pagadoCapital: pagadoCapital,
        capitalPendiente: capitalPendiente
      }
    }
  }


  imprimir = (divToPrint) => {
    let loader = this.loadingCtrl.create({
      content: "Obteniendo imagen",
    });
    loader.present();
    html2canvas(document.getElementById(divToPrint)).then(canvas => {
      console.log(canvas)
      canvas.toBlob(blob => {
        this.file.writeFile(this.file.externalApplicationStorageDirectory, 'resultado.png', blob, { replace: true })
          .then(fileEntry => {
            this.fileOpener.open(this.file.externalApplicationStorageDirectory + 'resultado.png', 'image/png');
            loader.dismiss();
          }).catch(error => {
            console.log(error)
          })
      });
    });

  }
  presentToast(message, timeMs, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: timeMs,
      position: position
    });
    toast.present();
  }
}
