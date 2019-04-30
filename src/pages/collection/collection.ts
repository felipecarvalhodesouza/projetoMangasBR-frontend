import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CollectionService } from '../../services/collection.service';

import { API_CONFIG } from '../../config/api.config';
import { TitleDTO } from '../../models/title.dto';

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: TitleDTO[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public collectionService: CollectionService) {
  }

  ionViewDidLoad() {
    
    this.collectionService.findAll().subscribe(response => {
      this.items=response.titles;
      console.log(this.items);
      },
      error => {
        console.log(error);
      })
  }

}
