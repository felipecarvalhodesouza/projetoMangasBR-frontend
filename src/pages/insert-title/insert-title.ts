import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitleService } from '../../services/domain/title.service';
import { TitleDTO } from '../../models/title.dto';
import { PublisherService } from '../../services/domain/publisher.service';
import { PublisherDTO } from '../../models/publisher.dto';

@IonicPage()
@Component({
  selector: 'page-insert-title',
  templateUrl: 'insert-title.html',
})
export class InsertTitlePage {

  formGroup: FormGroup;
  picture: string;
  cameraOn: boolean = false;
  titleId: String;
  publishers: PublisherDTO[] = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public formBuilder: FormBuilder,
              public titleService: TitleService,
              public alertCtrl: AlertController,
              public loadingControl: LoadingController,
              public camera: Camera,
              public publisherService: PublisherService) {
    this.publisherService.findPublishers().subscribe(response =>{
      this.publishers = response;
    })


    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: [''],
      status: ['', [Validators.required]],
      publisher: ['', [Validators.required]],
      author: ['', [Validators.required]],
      synopsis: ['', [Validators.required]]
    });
  }

  presentLoading(){
    let loader = this.loadingControl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  insertTitle(){

    let loader = this.presentLoading();
    if(this.picture == null || this.canUpload(this.verifySizeOfImg(this.picture))){
      let newTitle:TitleDTO = {
        id: null,
        name: this.formGroup.value.name.trim(),
        score: null,
        finished: this.formGroup.value.status,
        publisher: {
          id: "",
          name: "",
          history: ""
        },
        synopsis: this.formGroup.value.synopsis,
        start: this.formGroup.value.startDate,
        end: this.formGroup.value.endDate
      }
      newTitle.publisher = this.findPublisher(this.formGroup.value.publisher);
      this.titleService.insertTitle({ obj: newTitle}).subscribe(
        response =>{
          this.titleService.findTitles().subscribe(response=>{
            this.titleId = response['content'].pop().id
            this.sendPicture(this.titleId);
            this.navParams.get("TitleDatabasePage").ionViewDidLoad();
          },
          error=>{
            console.log(error);
          })
          loader.dismiss();
          this.showAlert("Sucesso","Título adicionado com sucesso.")
        },
        error =>{
          loader.dismiss();
          this.showAlert("Erro","Houve um problema na inserção do título.")
        }
      )
    } else {
        loader.dismiss();
        this.showAlert("Erro", "Imagem muito grande para ser enviada.");
        this.picture = null;
    }
  }

  showAlert(title: string, text: string){
    let alert = this.alertCtrl.create({
      title: title,
      message: text,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  getGalleryPicture(){

      const options: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {
        this.picture = 'data:image/png;base64,' + imageData;
        this.cameraOn = false;
      }, (err) => {});
  }

  cancel(){
    this.picture = null;
  }

  sendPicture(titleId){
    if(this.picture){
      this.titleService.uploadPicture(this.picture, titleId)
        .subscribe(response => {
          this.picture = null;
        },
        error =>{});
    }
  }

  verifySizeOfImg(img:String){
    if(img.endsWith('=')){
      return (img.length * (3/4)) - 1
    }else{
      return (img.length * (3/4)) - 2
    }
  }

  canUpload(size){
    if(size < 500000)
      return true;
    else return false;
  }

  findPublisher(id){
    for(let i = 0; i < this.publishers.length; i++){
      if(this.publishers[i].id === id)
        return this.publishers[i];
    }
  }

}
