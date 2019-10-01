import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePictureModalPage } from './profile-picture-modal';

@NgModule({
  declarations: [
    ProfilePictureModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePictureModalPage),
  ],
})
export class ProfilePictureModalPageModule {}
