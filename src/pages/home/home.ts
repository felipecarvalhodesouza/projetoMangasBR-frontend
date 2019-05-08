import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { CollectionPage } from '../collection/collection'
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import { CollectionService } from '../../services/collection.service';
import { StorageService } from '../../services/storage.service';

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
              public storageService: StorageService) {

  }

  login(){
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      this.auth.successfulLogin(response.headers.get('Authorization'));

      this.collectionService.findUser(); // método para encontrar o usuário para carregar sua coleção
      this.waitSeconds(500); // espera padrão para requisição assíncrona (erro de id)

      this.menu.swipeEnable(true); // permite abrir o menu lateral ao sair da tela Home
      
      this.navCtrl.setRoot('CollectionPage');
    },
    error => {});
  }

  signup(){
    this.navCtrl.push('SignUpPage');
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidEnter(){
    if(this.storageService.getLocalUser()!=null){
      this.auth.refreshToken()
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CollectionPage');
      },
      error => {});
    }
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

  forgotPassword(){
    this.navCtrl.setRoot('ForgotPasswordPage');
  }

}
