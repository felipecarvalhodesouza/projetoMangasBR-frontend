import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { PublisherService } from '../../services/domain/publisher.service';
import { LoadingService } from '../../services/loading.service';
import { PublisherDTO } from '../../models/publisher.dto';

@IonicPage()
@Component({
  selector: 'page-insert-publisher-modal',
  templateUrl: 'insert-publisher-modal.html',
})

export class InsertPublisherModalPage {

  formGroup: FormGroup;
  picture: string;
  cameraOn: boolean = false;
  publisherId: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public formBuilder: FormBuilder,
              public camera: Camera,
              public publisherService: PublisherService,
              public loadingService: LoadingService) {

    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      history: ['', [Validators.required]]
    });
  }

  ionViewDidLoad() {
    
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
      }, (err) => {
        console.log(err);
      });
  }

  cancel(){
    this.picture = null;
  }

  sendPicture(){
    if(this.picture){
      this.publisherService.uploadPicture(this.picture, this.publisherId)
        .subscribe(response => {
          this.picture = null;
        },
        error =>{
          console.log(error);
        });
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

  insertPublisher(){

    let loader = this.loadingService.initLoader();
    if(this.picture == null || this.canUpload(this.verifySizeOfImg(this.picture))){
      let newPublisher: PublisherDTO = {
        id: null,
        name: this.formGroup.value.name.trim(),
        history: this.formGroup.value.history,
      }
      this.publisherService.insertPublisher({ obj: newPublisher}).subscribe(
        response =>{
          this.publisherService.findPublishers().subscribe(response=>{
            response.sort(function(a, b){
              if(a.id < b.id) { return -1; }
              if(a.id > b.id) { return 1; }
              return 0;
            });
            this.publisherId = response.pop().id
            this.sendPicture();
            this.navParams.get("publishersPage").ionViewDidLoad();
          },
          error=>{
            console.log(error);
          })
          loader.dismiss();
          this.showAlert("Sucesso","Editora adicionada com sucesso.")
        },
        error =>{
          loader.dismiss();
          this.showAlert("Erro","Houve um problema na inserção de Editora.")
        }
      )
    } else {
        loader.dismiss();
        this.showAlert("Erro", "Imagem muito grande para ser enviada.");
        this.picture = null;
    }
  }
}
