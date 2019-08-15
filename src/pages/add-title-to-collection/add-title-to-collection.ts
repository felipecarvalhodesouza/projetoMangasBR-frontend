import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { TitleDTO } from '../../models/title.dto';
import { ReviewDTO } from '../../models/review.dto';
import { TitleService } from '../../services/domain/title.service';
import { UserService } from '../../services/domain/user.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { ReviewService } from '../../services/domain/review.service';
import { VolumeDTO } from '../../models/volume.dto';
import { CollectionService } from '../../services/domain/collection.service';


@IonicPage()
@Component({
  selector: 'page-add-title-to-collection',
  templateUrl: 'add-title-to-collection.html',
})
export class AddTitleToCollectionPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  title: TitleDTO;
  volumes: VolumeDTO[] = [];
  userId: string;
  lastPage: boolean;
  segments: String;
  totalElements: number;
  status: string;
  reviews: ReviewDTO[];
  page: number = 0;
  synopsis: String[];
  inCollection: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public titleService: TitleService,
    public loadingControl: LoadingController,
    public userService: UserService,
    public datePipe: DatePipe,
    public modalCtrl: ModalController,
    public storageService: StorageService,
    public alertCtrl: AlertController,
    public datepipe: DatePipe,
    public reviewService: ReviewService,
    public collectionService: CollectionService) {
        this.title = this.navParams.get('title');
        this.userId = this.collectionService.returnUser().id;
        this.segments = "volumes";
        this.breakLines();
        if(this.title.finished){
          this.status = "Completo";
        } else {
          this.status = "Em andamento";
        }
        if(this.title.start!=null && this.title.start.length!=7){
          this.title.start = this.datepipe.transform(this.title.start, 'MM/yyyy');
        }
        if(this.title.end!=null && this.title.end.length!=7){
          this.title.end = this.datepipe.transform(this.title.end, 'MM/yyyy');
        }
        this.findReviews();
        
  }

  ionViewDidLoad() {
    let loader = this.presentLoading();
    this.isInCollection();
    this.titleService.findVolumesByTitleId(this.title.id).
    subscribe(response =>{
      this.volumes = response;
      loader.dismiss();
    },
    error =>{
      loader.dismiss();
    });
  }

  loadData(){
    let loader = this.presentLoading();
    this.titleService.findVolumesByTitleId(this.title.id).
    subscribe(response =>{
      this.volumes = response;

      this.volumes.sort(function(a, b){
        if(a.date < b.date) { return -1; }
        if(a.date > b.date) { return 1; }
        return 0;
    });
      loader.dismiss();
    },
    error =>{
      loader.dismiss();
    });
  }

  presentLoading(){
    let loader = this.loadingControl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  findReviews(){
    this.titleService.findReviews(this.title.id).
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
      },
      error => {});
    })
  }

  breakLines(){
    if(this.title.synopsis!=null){
      this.synopsis = this.title.synopsis.split("\n");
    }
  }

  verifyIndexOfReview(review:ReviewDTO){
    if(this.reviews!=null){
      return this.reviews.indexOf(review);
    }
    return;
  }

  isInCollection(){
    this.collectionService.findCollection(this.userId).subscribe(response =>{
      var titles = response['titles'];
      for(var i=0; i < titles.length; i++){
        if(titles[i].id === this.title.id){
          this.inCollection = true;
        }
      }
    });
  }

  addTitleToCollection(){
    let loader = this.presentLoading();
    this.collectionService.insertTitle(this.title.id).subscribe(response=>{
      
      loader.dismiss();
      this.showInsertOk();
  },
    error =>{
      loader.dismiss();
    })
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Título adicionado com sucesso.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.collectionService.findAll();
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}