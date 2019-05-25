import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { CollectionService } from '../../services/collection.service';

import { API_CONFIG } from '../../config/api.config';
import { TitleDTO } from '../../models/title.dto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserDTO } from '../../models/user.dto';

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: TitleDTO[];
  userId: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public collectionService: CollectionService,
              public menu: MenuController,
              public alertCtrl: AlertController) {
              this.verifyChangePassword(this.collectionService.returnUser());
  }

  ionViewDidLoad() {
    
    this.collectionService.findAll().subscribe(response => {
      this.items=response.titles;
      this.userId = response.id;
      console.log(this.userId);
      },
      error => {
        console.log(error);
      })
  }

  enterTitlePage(obj: TitleDTO, index: any) {
    this.navCtrl.push('TitlePage', {
      title: obj,
      userId: this.userId,
      titleIndex: index
    });
  }

  verifyChangePassword(user: UserDTO){
    if(user.changePasswordOnLogin===true){
      this.showAlert("Você deve mudar sua senha agora.");
    }
  }

  showAlert(message: string){
    let alert = this.alertCtrl.create({
      title: 'Aviso',
      message: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.menu.swipeEnable(false);
            this.navCtrl.setRoot('ChangePasswordPage');
          }
        }
      ]
    });
    alert.present();
  }

}
