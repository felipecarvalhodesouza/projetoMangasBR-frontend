import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordCheckService } from '../../services/password.check.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { UserService } from '../../services/domain/user.service';
import { UserDTO } from '../../models/user.dto';
import { Observable } from 'rxjs';

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

  user: UserDTO = {
    id: null,
    email: null,
    name: null,
    senha: null,
    changePasswordOnLogin: null
    };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public passwordCheckService: PasswordCheckService,
              public alertCtrl: AlertController,
              public auth: AuthService,
              public userService: UserService,
              public storageService: StorageService) {
                
      this.formGroup = this.formBuilder.group({
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmNewPassword: ['', [Validators.required]]
    });

    this.creds.email = this.storageService.getLocalUser().email;

    this.userService.findByEmail(this.creds.email)
    .subscribe(response => {
        this.waitSeconds(1000);
        this.user.id = response.id;
        this.user.name = response.name;
        this.user.email = response.email;
      },
      error => {});
  }

  passwordStrenghtCheck(password: string) : string {
    console.log(this.passwordCheckService.checkPasswordStrength(password));
    return this.passwordCheckService.checkPasswordStrength(password);
  }

  editPassword(){
    this.creds.senha = this.formGroup.value.oldPassword;
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      if(this.formGroup.value.newPassword!==this.formGroup.value.confirmNewPassword){
        this.showPasswordFailedAlert("Há informações conflitantes na requisição.");
      } else{
          this.user.senha = this.formGroup.value.newPassword;
          this.user.changePasswordOnLogin = false;
          console.log(this.user);
          this.userService.update(this.user)
        .subscribe(response =>{
          this.showInsertOk();
        },
        error => {});
      }
    },
    error => {
      this.return();
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
            this.return();
          }
        }
      ]
    });
    alert.present();
  }
  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Senha atualizada com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.return();
          }
        }
      ]
    });
    alert.present();
  }

  waitSeconds(iMilliSeconds) {
    var counter= 0
        , start = new Date().getTime()
        , end = 0;
    while (counter < iMilliSeconds) {
        end = new Date().getTime();
        counter = end - start;
    }
  }

  return(){
    this.auth.logout();
    this.navCtrl.setRoot('HomePage');
  }

}
