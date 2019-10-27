import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsertPublisherModalPage } from './insert-publisher-modal';

@NgModule({
  declarations: [
    InsertPublisherModalPage,
  ],
  imports: [
    IonicPageModule.forChild(InsertPublisherModalPage),
  ],
})
export class InsertPublisherModalPageModule {}
