import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PublisherService } from '../../services/domain/publisher.service';
import { PublisherDTO } from '../../models/publisher.dto';
import { PublisherInformationPage } from '../publisher-information/publisher-information';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/domain/user.service';
import { InsertPublisherModalPage } from '../insert-publisher-modal/insert-publisher-modal';

@IonicPage()
@Component({
  selector: 'page-publishers',
  templateUrl: 'publishers.html',
})
export class PublishersPage {

  publishers: PublisherDTO[] = [];
  admin: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public publisherService: PublisherService,
              public modalCtrl: ModalController,
              public localStorage: StorageService,
              public userService: UserService) {
    this.isAdmin();
  }

  ionViewDidLoad() {
    this.publisherService.findPublishers().subscribe(response=>{
      this.publishers = response;
    },
    error =>{});
  }

  presentPublisherInformationModal(publisher: PublisherDTO) {
      const modal = this.modalCtrl.create(PublisherInformationPage, { publisher: publisher });
      modal.present();
  }

  isAdmin(){
    this.userService.findByEmail(this.localStorage.getLocalUser().email).subscribe(response =>{
      for(var i = 0; i < response.perfis.length; i++){
        if(response.perfis[i]=="ADMIN")
          this.admin = true;
        }
      });
  }

  presentInsertPublisherModal(){
    const modal = this.modalCtrl.create(InsertPublisherModalPage, { publishersPage: this});
    modal.present();
  }
}
