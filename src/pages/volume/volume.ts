import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VolumeDTO } from '../../models/volume.dto';

@IonicPage()
@Component({
  selector: 'page-volume',
  templateUrl: 'volume.html',
})
export class VolumePage {

  volume: VolumeDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
                this.volume = this.navParams.get('volume');
  }

  ionViewDidLoad() {
  }

}
