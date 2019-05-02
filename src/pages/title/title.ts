import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TitleDTO } from '../../models/title.dto';
import { API_CONFIG } from '../../config/api.config';
import { TitleService } from '../../services/title.service';

@IonicPage()
@Component({
  selector: 'page-title',
  templateUrl: 'title.html',
})
export class TitlePage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  title: TitleDTO;
  userId: number;
  titleIndex: number;
  volumes: any[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public titleService: TitleService) {

   this.title = this.navParams.get('title');
   this.userId = this.navParams.get('userId');
   this.titleIndex = this.navParams.get('titleIndex')+1;
  }

  ionViewDidLoad() {
    this.titleService.findTitleVolumes(this.userId, this.titleIndex).subscribe(response => {
      this.volumes=response
      },
      error => {
        console.log(error);
      })
  }





}
