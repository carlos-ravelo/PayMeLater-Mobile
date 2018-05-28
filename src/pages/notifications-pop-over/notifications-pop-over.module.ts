import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPopOverPage } from './notifications-pop-over';

@NgModule({
  declarations: [
    NotificationsPopOverPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPopOverPage),
  ],
})
export class NotificationsPopOverPageModule {}
