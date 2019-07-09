import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsertReviewPage } from './insert-review';

@NgModule({
  declarations: [
    InsertReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(InsertReviewPage),
  ],
})
export class InsertReviewPageModule {}
