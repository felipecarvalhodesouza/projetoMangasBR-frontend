import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { CollectionService } from '../../services/collection.service';

import { API_CONFIG } from '../../config/api.config';
import { TitleDTO } from '../../models/title.dto';
import { UserDTO } from '../../models/user.dto';
import { LoadingService } from '../../services/loading.service';
import { Searchbar } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {

  @ViewChild('searchbar') searchbar:Searchbar;
  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: TitleDTO[];
  itemsSearchBar: TitleDTO[];
  userId: number;
  date: Date;

  searchTerm: string = '';
  searching: any = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public collectionService: CollectionService,
              public menu: MenuController,
              public alertCtrl: AlertController,
              public loadingService: LoadingService) {
              this.verifyChangePassword(this.collectionService.returnUser());

  }

  ionViewDidLoad() {
    
    this.collectionService.findAll().subscribe(response => {
      this.items=response.titles;
      this.itemsSearchBar=this.items;
      this.userId = response.id;
      console.log(this.userId);
      },
      error => {
        if(error.status == 403){
          this.navCtrl.setRoot('HomePage');
        }
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

  filteredItems(searchTerm : String){
    return this.items.filter(item =>{
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {

    //var results = this.items;

    //var aux = this.itemsSearchBar
    //aux = this.filteredItems(this.searchTerm.trim());

    //results = this.filteredItems(this.searchTerm.trim());

    //if(results.length != aux.length){

      this.items = this.itemsSearchBar;

      var loader = this.loadingService.initLoader();
      this.items = this.filteredItems(this.searchTerm);
      this.loadingService.dismissLoader(loader);
  
      this.focusButton();
    //}
  }

  focusButton(): void {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 600);
  }

}
