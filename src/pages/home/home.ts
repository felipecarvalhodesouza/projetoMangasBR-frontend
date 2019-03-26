import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { CollectionPage } from '../collection/collection'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }

  login(){
    this.navCtrl.setRoot('CollectionPage')
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

}
