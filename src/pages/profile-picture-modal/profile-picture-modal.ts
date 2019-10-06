import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UserService } from '../../services/domain/user.service';
import { isTrueProperty } from 'ionic-angular/util/util';

@IonicPage()
@Component({
  selector: 'page-profile-picture-modal',
  templateUrl: 'profile-picture-modal.html',
})
export class ProfilePictureModalPage {

  userImg: string;
  picture: string;
  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public camera: Camera,
              public viewCtrl: ViewController,
              public userService: UserService,
              public alertCtrl: AlertController) {

    this.userImg = navParams.get("userImg");
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  getCameraPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
      targetHeight: 150,
      targetWidth: 150,
      saveToPhotoAlbum: true

    }

    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, 
    (err) => {
      this.cameraOn = false;
    });
  }

  getGalleryPicture(){

      const options: CameraOptions = {
        quality: 10,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true,
        targetHeight: 150,
        targetWidth: 150
      }

      this.camera.getPicture(options).then((imageData) => {
        this.picture = 'data:image/png;base64,' + imageData;
        this.cameraOn = false;
      }, (err) => {});
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

  sendPicture(){
    if(this.canUpload(this.verifySizeOfImg(this.picture))){
      this.userService.uploadPicture(this.picture)
      .subscribe(response => {
        this.picture = null;
        this.dismiss();
      },
      error =>{
      });
    } else{
      this.showAlert("Erro", "Tamanho da imagem superior ao permitido. Favor, selecione uma foto de até 500Kb.")
    }
  }

  cancel(){
    this.picture = null;
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
            this.dismiss();
          }
        }
      ]
    });
    alert.present();
  }
}
