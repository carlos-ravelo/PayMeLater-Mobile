import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  notificationList: any;
  currentNotification: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private localNotifications: LocalNotifications) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
    this.currentNotification = this.navParams.get("notification");
    this.getNotifications();
    this.localNotifications.on("add").subscribe(() => this.getNotifications());
    this.localNotifications.on("cancel").subscribe(() => this.getNotifications());

  }
  deleteNotification(notif) {
    this.localNotifications.cancel(notif).then(a => {
      this.getNotifications();
    })
  }
  getNotifications() {
    this.localNotifications.getAll().then((notificationList) => {
      this.notificationList = notificationList;
    })
  }

  getNotifTime(ms) {
    return new Date(ms)
  }

}
