import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


//Providers
import { ProvidersDataProvider } from '../providers/providers-data/providers-data';

//Pages Modules
import { LoginPageModule } from '../pages/login/login.module'
import { DetallePrestamoPageModule } from '../pages/detalle-prestamo/detalle-prestamo.module'
import { ListaPrestamosPageModule } from '../pages/lista-prestamos/lista-prestamos.module'
import { ListaClientesPageModule } from '../pages/lista-clientes/lista-clientes.module'
import { DetalleClientePageModule } from '../pages/detalle-cliente/detalle-cliente.module'
import { FormClientesPageModule } from '../pages/form-clientes/form-clientes.module'
import { FormPrestamosPageModule } from '../pages/form-prestamos/form-prestamos.module'
import { FormMovimientoPageModule } from '../pages/form-movimiento/form-movimiento.module'
import { AmortizacionesPageModule } from '../pages/amortizaciones/amortizaciones.module'
import { ReportesPageModule } from '../pages/reportes/reportes.module'
import { NotificationsPopOverPageModule } from '../pages/notifications-pop-over/notifications-pop-over.module'
import { ReportesPorClientePageModule } from '../pages/reportes-por-cliente/reportes-por-cliente.module'
import { ConfigurationsPageModule } from '../pages/configurations/configurations.module'
import { NotificationsPageModule } from '../pages/notifications/notifications.module'
import { LoanFilterPopOverPageModule } from '../pages/loan-filter-pop-over/loan-filter-pop-over.module'




//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebaseConfig } from '../environment';

//Material Desing
import { FuncionesComunesProvider } from '../providers/funciones-comunes/funciones-comunes';

//Modulo de Componentes
import { ComponentsModule } from '../components/components.module'


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Clipboard } from '@ionic-native/clipboard';
import { CallNumber } from '@ionic-native/call-number';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Contacts } from '@ionic-native/contacts'
import { SocialSharing } from '@ionic-native/social-sharing'
import { EmailComposer } from '@ionic-native/email-composer'
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';

import { IonicStorageModule } from '@ionic/storage';
import { ChartsModule } from 'ng2-charts';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DatePicker } from '@ionic-native/date-picker';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    ListaPrestamosPageModule,
    DetallePrestamoPageModule,
    ComponentsModule,
    LoginPageModule,
    ListaClientesPageModule,
    DetalleClientePageModule,
    FormClientesPageModule,
    FormPrestamosPageModule,
    FormMovimientoPageModule, ReportesPageModule, AmortizacionesPageModule,
    ChartsModule, NotificationsPopOverPageModule, ReportesPorClientePageModule,
    ConfigurationsPageModule, NotificationsPageModule, LoanFilterPopOverPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ProvidersDataProvider,
    AngularFireAuth,
    FuncionesComunesProvider,
    File,
    FileOpener,
    Clipboard,
    CallNumber,
    BackgroundMode,
    Contacts, SocialSharing, EmailComposer, DatePipe, CurrencyPipe, LocalNotifications, TitleCasePipe, DatePicker,

  ]
})
export class AppModule { }
