import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/domain/user.service';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  formGroup: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public userService: UserService,
              public alertCtrl: AlertController) {

              this.formGroup = this.formBuilder.group({
                name: ['Felipe Carvalho de Souza', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]], 
                email: ['desouzafelipecarvalho@gmail.com', [Validators.required, Validators.email]]
              });
  }

  signupUser(){
    this.userService.insert(this.formGroup.value)
    .subscribe(response =>{
      this.showInsertOk();
    },
    error => {});
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //desempilha a página
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }
}
