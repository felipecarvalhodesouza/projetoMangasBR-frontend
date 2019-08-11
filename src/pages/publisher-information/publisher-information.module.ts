import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublisherInformationPage } from './publisher-information';

@NgModule({
  declarations: [
    PublisherInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(PublisherInformationPage),
  ],
})
export class PublisherInformationPageModule {}
