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
  nextVolume: Number;

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

  ionViewDidLoad() {
    this.titleService.findVolumesByTitleId(this.title.id).subscribe(response=>{
      this.nextVolume = (response.length) +1 ;
    })
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

    let newVolume:VolumeDTO = {
      name: this.formGroup.value.name.trim(),
      date: this.formGroup.value.date,
      price: this.formGroup.value.price
    }
    newVolume.date = newVolume.date.replace("-","/");
    this.titleService.insertVolumesOnTitle({ obj: newVolume, titleId: this.title.id }).subscribe(
      response =>{
        this.sendPicture();
        loader.dismiss();
        this.navParams.get("AddTitleToCollectionPage").ionViewDidLoad();
        this.dismiss();
      },
      error =>{
        loader.dismiss();
        this.showAlert("Erro","Houve um problema na inserção do volume.")
      }
    )
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
      error =>{
      });
    }
  }

}
