import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../services/domain/user.service';
import { TitleDTO } from '../../models/title.dto';
import { VolumeDTO } from '../../models/volume.dto';
import { TitleService } from '../../services/domain/title.service';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { VolumeService } from '../../services/domain/volume.service';

@IonicPage()
@Component({
  selector: 'page-insert-volume',
  templateUrl: 'insert-volume.html',
})
export class InsertVolumePage {

  title: TitleDTO;
  formGroup: FormGroup;
  nextVolume: String;

  picture: string;
  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public formBuilder: FormBuilder,
              public userService: UserService,
              public titleService: TitleService,
              public alertCtrl: AlertController,
              public loadingControl: LoadingController,
              public camera: Camera,
              public volumeService: VolumeService) {

    this.title = navParams.get("title");

    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });
  }

  presentLoading(){
    let loader = this.loadingControl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  insertVolume(){

    let loader = this.presentLoading();
    if(this.picture == null || this.canUpload(this.verifySizeOfImg(this.picture))){
      let newVolume:VolumeDTO = {
        id: null,
        name: this.formGroup.value.name.trim(),
        date: this.formGroup.value.date,
        price: this.formGroup.value.price
      }
      newVolume.date = newVolume.date.replace("-","/");
      newVolume.date = this.formataStringData(newVolume.date);
      this.titleService.insertVolumesOnTitle({ obj: newVolume, titleId: this.title.id }).subscribe(
        response =>{
          this.titleService.findVolumesByTitleId(this.title.id).subscribe(response=>{
            this.nextVolume = response[response.length-1].id;
            this.sendPicture();
            loader.dismiss();
            this.navParams.get("AddTitleToCollectionPage").ionViewDidLoad();
            this.showAlert("Sucesso","Volume adicionado com sucesso.")
          },
          error => {
            loader.dismiss();
            this.showAlert("Erro","Houve um problema na inserção da imagem do volume.");
          })
        },
        error =>{
          loader.dismiss();
          this.showAlert("Erro","Houve um problema na inserção do volume.")
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

  sendPicture(){
    if(this.picture){
      this.volumeService.uploadPicture(this.picture, this.title.id, this.nextVolume)
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

  formataStringData(data) {
  var ano  = data.split("/")[0];
  var mes  = data.split("/")[1];

  return mes + '/' + ano;
  }
}
