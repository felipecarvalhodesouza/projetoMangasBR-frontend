import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { TitleDTO } from '../../models/title.dto';

@IonicPage()
@Component({
  selector: 'page-insert-review',
  templateUrl: 'insert-review.html',
})
export class InsertReviewPage {

  title: TitleDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.title = navParams.get("title");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InsertReviewPage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
