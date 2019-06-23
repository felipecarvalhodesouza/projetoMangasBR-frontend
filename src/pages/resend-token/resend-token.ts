import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-resend-token',
  templateUrl: 'resend-token.html',
})
export class ResendTokenPage {
  
  formGroup: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public menu: MenuController,
              public authService: AuthService,
              public alertCtrl: AlertController,
              public loadingControl: LoadingController) {

    this.formGroup = this.formBuilder.group({
      email: ['felipinho22@gmail.com', [Validators.required, Validators.email]]
    });
  }

  sendNewToken(){

    let loader = this.presentLoading();

    this.authService.resendToken(this.formGroup.value)
    .subscribe(response =>{
      loader.dismiss();
      this.showAlert();
    },
    error => {
      loader.dismiss();
    });
  }

  showAlert(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Caso as informações estiverem corretas, você receberá um email com o token de validação de conta em alguns minutos.',
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

  presentLoading(){
    let loader = this.loadingControl.create({
      content: "Carregando"
    });
    loader.present();
    return loader;
  }

}

