import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { TitleDTO } from '../../models/title.dto';
import { API_CONFIG } from '../../config/api.config';
import { TitleService } from '../../services/domain/title.service';
import { ReviewDTO } from '../../models/review.dto';
import { UserService } from '../../services/domain/user.service';
import { DatePipe } from '@angular/common';
import { InsertReviewPage } from '../insert-review/insert-review';
import { StorageService } from '../../services/storage.service';
import { ReviewService } from '../../services/domain/review.service';
import { VolumeUserDTO } from '../../models/volume.user.dto';
import { CollectionService } from '../../services/domain/collection.service';
import { VolumeDTO } from '../../models/volume.dto';

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
  volumes: VolumeUserDTO[] = [];
  lastPage: boolean;
  segments: String;
  totalElements: number;
  status: string;
  reviews: ReviewDTO[];
  page: number = 0;
  admin = false;
  synopsis: String[];

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
        this.titleIndex = this.navParams.get('titleIndex')+1;
        this.segments = "volumes";
        this.title = this.navParams.get('title');
        this.breakLines();
        this.userId = this.navParams.get('userId');
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

    this.isAdmin(); 

    this.titleService.findTitleVolumes(this.userId, this.titleIndex, this.page, 9).
    subscribe(response =>{
      this.volumes = response['content'];
      this.totalElements = response['totalElements'];
      this.sortVolumes();
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
      this.sortVolumes();
      this.lastPage = response['last'];
      loader.dismiss();
    },
    error =>{
      loader.dismiss();
    });
  }

  doInfinite(infiniteScroll: { complete: () => void; }){ 
    if(!this.lastPage){
      this.page++;
      this.loadData();
      setTimeout(() =>{
        infiniteScroll.complete();
      },1000);
    }else{
      setTimeout(() =>{
        infiniteScroll.complete();
      },100);
    }

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

  presentInsertReviewModal() {
    if(!this.verifyIfThereIsReviewFromUser()){
      const modal = this.modalCtrl.create(InsertReviewPage, { userId: this.userId, title: this.title, titlePage: this });
      modal.present();
    }
    else{
      this.showError();
    }
  }

  isAdmin(){
    this.admin = false;
    this.userService.getAccesses(this.userId).
    subscribe(response =>{
      for(var i = 0; i < response.perfis.length; i++){
        if(response.perfis[i]=="ADMIN")
          this.admin = true;
        }
      });
  }

  breakLines(){
    if(this.title.synopsis!=null){
      this.synopsis = this.title.synopsis.split("\n");
    }
  }

  verifyIfThereIsReviewFromUser(): boolean{
    for(var i = 0; i < this.reviews.length; i++){
      if(this.reviews[i].author.id == this.userId.toString()){
        return true;
      }
    }
    return false;
  }

  showError(){
    let alert = this.alertCtrl.create({
      title: 'Erro!',
      message: 'Você já possue uma review nesse título',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  deleteReview(review:ReviewDTO){
    this.showConfirm(review);
  }

  showConfirm(review:ReviewDTO) {

    if(review.author.id==this.userId.toString()){
      const confirm = this.alertCtrl.create({
        title: 'Apagar review?',
        message: 'Você tem certeza que deseja apagar a sua review desse título?',
        buttons: [
          {
            text: 'Sim',
            handler: () => {
              this.reviewService.delete(review, this.userId, this.title.id).subscribe(response =>{
                this.findReviews();
              },
              error =>{
                console.log(error);
              });
            }
          },
          {
            text: 'Não',
            handler: () => {
              
            }
          }
        ]
      });
      confirm.present();
    }
  }

  verifyIndexOfReview(review:ReviewDTO){
    if(this.reviews!=null){
      return this.reviews.indexOf(review);
    }
    return;
  }

  changeVolumeUser(doesHave: boolean, volume: VolumeUserDTO, index: number){
    if(doesHave){
      this.showPrompt(doesHave, volume, index);
    } else{
        this.collectionService.updateVolumeUser(doesHave, this.title.id, volume.id.toString(), 0).
        subscribe(response=>{
          this.volumes[index].paidPrice = 0;
        });
    }
  }

  goToVolumePage(volume: VolumeDTO, titleId: string, paidPrice: number, doesHave: boolean){
    this.navCtrl.push('VolumePage', {
      volume: volume,
      titleId: titleId,
      paidPrice: paidPrice,
      doesHave: doesHave
    });
  }

  sortVolumes(){
    this.volumes.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
  }

  showPrompt(doesHave: boolean, volume: VolumeUserDTO, index: number) {
    const prompt = this.alertCtrl.create({
      title: 'Valor do volume',
      message: "Insira o valor pago pelo volume. Deixe vazio para utilizar o valor de capa.",
      inputs: [
        { 
          type: "number",
          name: 'Valor',
          placeholder: 'Insira o valor aqui'
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if(data.Valor===""){
              data.Valor  = volume.volume.price
            }
            this.collectionService.updateVolumeUser(doesHave,
                                                    this.title.id,
                                                    volume.id.toString(),
                                                    data.Valor)
                                                    .subscribe(response=>{
                                                      this.volumes[index].paidPrice = parseFloat(data.Valor);
                                                    });
          }
        }
      ],
      enableBackdropDismiss: false
    });
    prompt.present();
  }
}
