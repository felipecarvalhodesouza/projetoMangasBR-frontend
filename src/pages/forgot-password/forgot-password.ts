import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  formGroup: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public menu: MenuController,
              public authService: AuthService,
              public alertCtrl: AlertController) {

    this.formGroup = this.formBuilder.group({
      email: ['desouzafelipecarvalho@gmail.com', [Validators.required, Validators.email]]
    });
  }

  sendNewPassword(){
    console.log(this.formGroup.value);
    this.authService.forgotPassword(this.formGroup.value)
    .subscribe(response =>{
      this.showAlert();
    },
    error => {});
  }

  showAlert(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Caso as informações estiverem corretas, você receberá um email com sua nova senha em alguns minutos.',
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

}
