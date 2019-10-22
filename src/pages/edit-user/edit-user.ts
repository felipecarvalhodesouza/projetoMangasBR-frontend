import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDTO } from '../../models/user.dto';
import { UserService } from '../../services/domain/user.service';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {

  formGroup: FormGroup;
  user: UserDTO;
  dateAux: string;
  emailAux: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public loadingControl: LoadingController,
              public formBuilder: FormBuilder,
              public alertCtrl: AlertController,
              public userService: UserService,
              public authService: AuthService) {

      this.user = this.navParams.get('user');
      this.emailAux = this.user.email;

      this.formGroup = this.formBuilder.group({
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required]]
    });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  showAlert(){
    let alert = this.alertCtrl.create({
      title: "Cuidado",
      message: "Tem certeza que deseja alterar suas informações pessoais?",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.save();
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            this.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  showAlertMethod(title: string, text: string, loader: any, logout: boolean){
    let alert = this.alertCtrl.create({
      title: title,
      message: text,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            loader.dismiss();
            this.dismiss();
            if(logout){
              this.authService.logout();
              this.navCtrl.push('HomePage');
            }
          }
        }
      ]
    });
    alert.present();
  }

  updateUser(){
    this.user.email = this.formGroup.value.email;
    this.user.name = this.formGroup.value.name;
    this.dateAux = this.user.memberSince;
    this.convertDate();
  }

  convertDate(){
    this.user.memberSince = new Date(this.user.memberSince);
  }

  save(){
    let loader = this.loadingControl.create();
    this.updateUser();
    this.userService.update(this.user).subscribe(response=>{
      this.user.memberSince = this.dateAux;
      if(this.emailAux != this.user.email){
        this.showAlertMethod("Você será deslogado", "É necessário refazer o login.", loader, true);
      } else{
        this.showAlertMethod("Sucesso", "Alterações salvas com sucesso", loader, false);
      }
    },
    error =>{
      console.log(error);
      this.user.memberSince = this.dateAux;
      loader.dismiss();
      this.dismiss();
    });
  }

}
