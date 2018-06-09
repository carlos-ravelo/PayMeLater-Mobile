import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanFilterPopOverPage } from './loan-filter-pop-over';

@NgModule({
  declarations: [
    LoanFilterPopOverPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanFilterPopOverPage),
  ],
})
export class LoanFilterPopOverPageModule {}
