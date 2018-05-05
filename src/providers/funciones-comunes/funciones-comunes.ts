import { Injectable } from '@angular/core';
import { Movimiento } from '../../clases/movimiento'
import { Prestamo } from '../../clases/prestamo'
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener'
import html2canvas from 'html2canvas'
import { LoadingController, ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';



/*
  Generated class for the FuncionesComunesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FuncionesComunesProvider {

  constructor(private file: File, private fileOpener: FileOpener
    , private loadingCtrl: LoadingController, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    console.log('Hello FuncionesComunesProvider Provider');
  }
  calculateAmountOfFee(prestamo: Prestamo) {
    let montoCuota: number
    // let a = prestamo.tipoTasa == "Anual" ? 1 : 12;
    let montlyOrAnualyRate = prestamo.tipoTasa == "Anual" ? 1 : 12;

    if (prestamo.capitalPrestado > 0 && prestamo.tasa > 0 && prestamo.cantidadCuotas == 0) {
      montoCuota = prestamo.capitalPrestado * prestamo.tasa * montlyOrAnualyRate / 100 / 12;
      return isNaN(montoCuota) || !isFinite(montoCuota) ? 0 : montoCuota;
    }
    if (prestamo.capitalPrestado > 0 && prestamo.tasa == 0 && prestamo.cantidadCuotas > 0) {
      montoCuota = prestamo.capitalPrestado / prestamo.cantidadCuotas
      return isNaN(montoCuota) || !isFinite(montoCuota) ? 0 : montoCuota;
    }
    else {
      let r = prestamo.tasa * montlyOrAnualyRate / 12 / 100;
      let pv = prestamo.capitalPrestado;
      let n = prestamo.cantidadCuotas * -1
      montoCuota = parseFloat((r * (pv) / (1 - Math.pow((1 + r), n)) * 100 / 100).toFixed(2));
      return isNaN(montoCuota) || !isFinite(montoCuota) ? 0 : montoCuota;

    }
  }
  NPER(ir: number, per: number, pmt: number, pv: number) {
    /*ir -> Interes anual
    per -> Numero de periodos por año (mensual = 12, quincenal = 24)
    pmt: Pago Fijo Mensual
    pv: Cantidad Prestada
    */
    let fv = 0;
    var nbperiods;
    if (ir != 0)
      ir = ir / (100 * per);
    nbperiods = Math.log((-fv * ir + pmt) / (pmt + ir * pv)) / Math.log(1 + ir)
    return nbperiods;
  }


  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
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
  copyObject(origin: Prestamo, target: Prestamo) {
    for (let i in origin) {
      target[i] = origin[i];
    }
  }

  presenAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Dismiss']
    });
    alert.present();
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

  filterArray(arrayToSearch, val) {
    if (!val) {
      return arrayToSearch
    }

    val = val.toString().toLowerCase();
    var results = [];
    arrayToSearch.map(obj => {

      var props = Object.getOwnPropertyNames(obj);
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (Array.isArray(obj[prop])) {
          var arr = obj[prop];
          if (this.filterArray(arr, val).length) {
            results.push(obj);
            break;
          }
        } else {
          var value = obj[prop];
          if (value.toString().toLowerCase().indexOf(val) > -1) {
            results.push(obj);
            break;
          }
        }
      }
    });
    return results;
  }
}
