import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { TitleDTO } from '../../models/title.dto';
import { API_CONFIG } from '../../config/api.config';
import { TitleService } from '../../services/title.service';
import { ReviewDTO } from '../../models/review.dto';
import { UserService } from '../../services/domain/user.service';
import { DatePipe } from '@angular/common';
import { InsertReviewPage } from '../insert-review/insert-review';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-title',
  templateUrl: 'title.html'
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
  reviews: ReviewDTO[];
  page: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public titleService: TitleService,
    public loadingControl: LoadingController,
    public userService: UserService,
    public datePipe: DatePipe,
    public modalCtrl: ModalController,
    public storageService: StorageService) {
        this.titleIndex = this.navParams.get('titleIndex')+1;
        this.segments = "volumes";
        this.title = this.navParams.get('title');
        this.userId = this.navParams.get('userId');
        if(this.title.finished){
          this.status = "Completo";
        } else {
          this.status = "Em andamento";
        }        
    this.findReviews();
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

  findReviews(){
    this.titleService.findReviews(this.titleIndex).
    subscribe((response: ReviewDTO[]) =>{
      this.reviews = response;
      this.getImageIfExists();
    });
  }

  getImageIfExists(){
    this.reviews.forEach(element => {
      element.date = this.datePipe.transform(element.date, 'dd-MM-yyyy');
      this.userService.getImageFromBucket(element.author.id).subscribe(
        response => {
          element.imageUrl = `${API_CONFIG.bucketBaseUrl}/user-profile${element.author.id}.jpg`;
      });
    })
  }

  presentModal() {
    const modal = this.modalCtrl.create(InsertReviewPage, { user: this.userService, title: this.title });
    modal.present();
  }
}
