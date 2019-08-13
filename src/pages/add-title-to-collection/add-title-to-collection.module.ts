import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTitleToCollectionPage } from './add-title-to-collection';

@NgModule({
  declarations: [
    AddTitleToCollectionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTitleToCollectionPage),
  ],
})
export class AddTitleToCollectionPageModule {}
