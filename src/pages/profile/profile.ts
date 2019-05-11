import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { UserDTO } from '../../models/user.dto';
import { API_CONFIG } from '../../config/api.config';
import { UserService } from '../../services/domain/user.service';
import { CollectionService } from '../../services/collection.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: UserDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: StorageService,
              public userService: UserService,
              public collectionService: CollectionService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
      if(localUser && localUser.email){
        this.userService.findByEmail(localUser.email)
        .subscribe(response => {
          this.user = response;
          this.getImageIfExists();
        },
        error => {
          if(error.status == 403){
          this.navCtrl.setRoot('HomePage');
        }
      });
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists(){
    this.userService.getImageFromBucket(this.user.id)
    .subscribe(response => {
      this.user.imageUrl = `${API_CONFIG.bucketBaseUrl}/user-profile${this.user.id}.jpg`;
    },
    error => {});
  }

  ionViewDidLeave() {
    this.collectionService.findUser();
  }

  changePassword(){
    this.navCtrl.push('ChangePasswordPage');
  }

}
