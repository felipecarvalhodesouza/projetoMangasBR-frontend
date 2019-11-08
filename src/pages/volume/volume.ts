import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VolumeDTO } from '../../models/volume.dto';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-volume',
  templateUrl: 'volume.html',
})
export class VolumePage {

  volume: VolumeDTO;
  titleId: string;
  paidPrice: number;
  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
                this.volume = this.navParams.get('volume');
                this.titleId = this.navParams.get('titleId');
                this.paidPrice = this.navParams.get('paidPrice');
  }

  ionViewDidLoad() {
  }

}
