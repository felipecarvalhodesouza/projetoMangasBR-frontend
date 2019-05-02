import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CollectionService } from '../../services/collection.service';

import { API_CONFIG } from '../../config/api.config';
import { TitleDTO } from '../../models/title.dto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: TitleDTO[];
  userId: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public collectionService: CollectionService) {
  }

  ionViewDidLoad() {
    
    this.collectionService.findAll().subscribe(response => {
      this.items=response.titles;
      this.userId = response.id;
      console.log(this.userId);
      },
      error => {
        console.log(error);
      })
  }

  enterTitlePage(obj: TitleDTO, index: any) {
    this.navCtrl.push('TitlePage', {
      title: obj,
      userId: this.userId,
      titleIndex: index
    });
  }

}
