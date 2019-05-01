import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TitleDTO } from '../../models/title.dto';

@IonicPage()
@Component({
  selector: 'page-title',
  templateUrl: 'title.html',
})
export class TitlePage {

  title: TitleDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
   this.title = this.navParams.get('title');
  }

  ionViewDidLoad() {
   }

}
