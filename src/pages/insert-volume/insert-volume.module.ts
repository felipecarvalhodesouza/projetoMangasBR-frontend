import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsertVolumePage } from './insert-volume';

@NgModule({
  declarations: [
    InsertVolumePage,
  ],
  imports: [
    IonicPageModule.forChild(InsertVolumePage),
  ],
})
export class InsertVolumePageModule {}
