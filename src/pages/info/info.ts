import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CollectionService } from '../../services/domain/collection.service';


@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public collectionService: CollectionService) {
      if(this.collectionService.user==null){
        this.collectionService.findUser();
      }
  }

  goToCollection(){
    this.navCtrl.setRoot('CollectionPage');
  }

}
