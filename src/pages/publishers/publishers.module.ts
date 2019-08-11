import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublishersPage } from './publishers';

@NgModule({
  declarations: [
    PublishersPage,
  ],
  imports: [
    IonicPageModule.forChild(PublishersPage),
  ],
})
export class PublishersPageModule {}
