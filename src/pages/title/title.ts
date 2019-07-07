import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
  volumes: any[] = [];
  segments: String;
  totalElements: number;
  status: string;

  page: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public titleService: TitleService, public loadingControl: LoadingController) {
        this.titleIndex = this.navParams.get('titleIndex')+1;
        this.segments = "volumes";
        this.title = this.navParams.get('title');
        this.userId = this.navParams.get('userId');
        if(this.title.finished){
          this.status = "Completo";
        } else {
          this.status = "Em andamento";
        }
  }

  ionViewDidLoad() {
    let loader = this.presentLoading();

    this.titleService.findTitleVolumes(this.userId, this.titleIndex, this.page, 9).
    subscribe(response =>{
      this.volumes = response['content'];
      this.totalElements = response['totalElements'];
      loader.dismiss();
    },
    error =>{
      loader.dismiss();
    });
  }

  loadData(){
    let loader = this.presentLoading();
    this.titleService.findTitleVolumes(this.userId, this.titleIndex, this.page, 9).
    subscribe(response =>{
      this.volumes = this.volumes.concat(response['content']);
      loader.dismiss();
    },
    error =>{
      loader.dismiss();
    });
  }

  doInfinite(infiniteScroll){
    this.page++;
    this.loadData();
    setTimeout(() =>{
      infiniteScroll.complete();
    },1000);
  }

  presentLoading(){
    let loader = this.loadingControl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }
}
