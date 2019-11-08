import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { UserDTO } from '../../models/user.dto';
import { API_CONFIG } from '../../config/api.config';
import { UserService } from '../../services/domain/user.service';
import { CollectionService } from '../../services/domain/collection.service';
import { DatePipe } from '@angular/common';
import { TitleDTO } from '../../models/title.dto';
import { TitleService } from '../../services/domain/title.service';
import { VolumeUserDTO } from '../../models/volume.user.dto';
import { ProfilePictureModalPage } from '../profile-picture-modal/profile-picture-modal';
import { EditUserPage } from '../edit-user/edit-user';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: UserDTO;
  segments: String;

  titles: number = 0 ;
  completedTitles: number = 0 ;
  numberOfVolumes: number = 0 ;
  missingVolumes: number = 0 ;
  valueOfCollection: number = 0.0;
  paidValueOfCollection: number = 0.0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: StorageService,
              public userService: UserService,
              public collectionService: CollectionService,
              public datepipe: DatePipe,
              public titleService: TitleService,
              public modalCtrl: ModalController) {
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
          this.loadCollectionInformation();
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

  loadCollectionInformation(){
    this.collectionService.findCollection(this.user.id).subscribe(response =>{
      let titles: [TitleDTO] = response['titles'];
        for(let i=0; i < titles.length; i++){
          this.titleService.findTitleVolumesWithouthPageable(this.user.id, (i+1).toString()).
          subscribe(response=>{
            let aux=0;
            let volumes: [VolumeUserDTO] = response;
            volumes.forEach(element => {
              if(element.doesHave){
                this.numberOfVolumes++;
                this.valueOfCollection = parseFloat((this.valueOfCollection + element.volume.price).toFixed(2));
                this.paidValueOfCollection = parseFloat((this.paidValueOfCollection + element.paidPrice).toFixed(2));
              }
              else{
                aux++;
                this.missingVolumes++;
              }
            });
            this.titles++;
            if(aux===0) {
              this.completedTitles++;
            }
          });
        }
      });
  }

  presentSendProfilePictureModal() {
      const modal = this.modalCtrl.create(ProfilePictureModalPage, { userImg: this.user.imageUrl });
      modal.present();
  }

  changeData(){
    const modal = this.modalCtrl.create(EditUserPage, { user: this.user });
    modal.present();
  }
}
