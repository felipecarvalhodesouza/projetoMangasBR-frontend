import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordCheckService } from '../../services/password.check.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { CredenciaisDTO } from '../../models/credenciais.dto';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  formGroup: FormGroup;

  creds : CredenciaisDTO = {
    email: "",
    senha: ""
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public passwordCheckService: PasswordCheckService,
              public alertCtrl: AlertController,
              public auth: AuthService,
              public storageService: StorageService) {
                
      this.formGroup = this.formBuilder.group({
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmNewPassword: ['', [Validators.required]]
    });

    this.creds.email = this.storageService.getLocalUser().email;
  }

  passwordStrenghtCheck(password: string) : string {
    console.log(this.passwordCheckService.checkPasswordStrength(password));
    return this.passwordCheckService.checkPasswordStrength(password);
  }

  editPassword(){
    this.creds.senha = this.formGroup.value.oldPassword;
    console.log(this.creds);
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      if(this.formGroup.value.newPassword!==this.formGroup.value.confirmNewPassword){
        this.showPasswordFailedAlert("Há informações conflitantes na requisição.");
      } else{
          console.log("Implementar requisição para API de edição de User");
      }
    },
    error => {
      this.navCtrl.pop();
    });
  }

  showPasswordFailedAlert(errorMessage: string){
    let alert = this.alertCtrl.create({
      title: 'Ops... Houve um erro',
      message: errorMessage,
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
