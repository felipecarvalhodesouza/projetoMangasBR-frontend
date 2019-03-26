import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CollectionService } from '../../services/collection.service';

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public collectionService: CollectionService) {
  }

  ionViewDidLoad() {
    this.collectionService.findAll().subscribe(response => {
      console.log(response);
      },
      error => {
        console.log(error);
      })
  }

}
