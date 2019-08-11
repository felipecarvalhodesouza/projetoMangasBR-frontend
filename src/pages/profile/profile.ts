import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { UserDTO } from '../../models/user.dto';
import { API_CONFIG } from '../../config/api.config';
import { UserService } from '../../services/domain/user.service';
import { CollectionService } from '../../services/domain/collection.service';
import { DatePipe } from '@angular/common';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: UserDTO;
  segments: String;

  picture: string;
  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: StorageService,
              public userService: UserService,
              public collectionService: CollectionService,
              public datepipe: DatePipe,
              public camera: Camera) {
              this.segments = "data";
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let localUser = this.storage.getLocalUser();
      if(localUser && localUser.email){
        this.userService.findByEmail(localUser.email)
        .subscribe(response => {
          this.user = response;
          this.getImageIfExists();
          this.user.memberSince = this.datepipe.transform(this.user.memberSince, 'dd-MM-yyyy');
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

  getCameraPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, 
    (err) => {
    });
  }

  sendPicture(){
    this.userService.uploadPicture(this.picture)
    .subscribe(response => {
      this.picture = null;
      this.loadData();
    },
    error =>{
    });
  }

  cancel(){
    this.picture = null;
  }

}
