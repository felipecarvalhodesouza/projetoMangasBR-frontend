import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController, LoadingController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import { CollectionService } from '../../services/collection.service';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/domain/user.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds : CredenciaisDTO = {
    email: "",
    senha: ""
  }

  constructor(public navCtrl: NavController,
              public menu: MenuController,
              public auth: AuthService,
              public collectionService: CollectionService,
              public userService: UserService,
              public storageService: StorageService,
              public loadingControl: LoadingController) {

  }

  login(){

    let loader = this.presentLoading();

    this.auth.authenticate(this.creds)
    .subscribe(response => {
      this.auth.successfulLogin(response.headers.get('Authorization'));

      this.collectionService.findUser();
      loader.dismiss();

      this.menu.swipeEnable(true);
      this.navCtrl.setRoot('InfoPage');
    },
    error => {
      loader.dismiss();
    });
  }

  signup(){
    this.navCtrl.push('SignUpPage');
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave(){
    
  }

  ionViewDidEnter(){
    if(this.storageService.getLocalUser()!=null){
      this.auth.refreshToken()
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('InfoPage');
      },
      error => {});
    }
  }

  forgotPassword(){
    this.navCtrl.push('ForgotPasswordPage');
  }

  presentLoading(){
    let loader = this.loadingControl.create({
      content: "Carregando"
    });
    loader.present();
    return loader;
  }

  resendToken(){
    this.navCtrl.push('ResendTokenPage');
  }

}
