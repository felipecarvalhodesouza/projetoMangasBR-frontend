import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VolumePage } from './volume';

@NgModule({
  declarations: [
    VolumePage,
  ],
  imports: [
    IonicPageModule.forChild(VolumePage),
  ],
})
export class VolumePageModule {}
