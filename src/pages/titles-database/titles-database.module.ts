import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitlesDatabasePage } from './titles-database';

@NgModule({
  declarations: [
    TitlesDatabasePage,
  ],
  imports: [
    IonicPageModule.forChild(TitlesDatabasePage),
  ],
})
export class TitlesDatabasePageModule {}
