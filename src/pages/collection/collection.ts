import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { CollectionService } from '../../services/domain/collection.service';

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
      
      var results = this.items.length;

      this.items = this.itemsSearchBar;
      
      this.items = this.filteredItems(this.searchTerm);

      if(this.items.length != results){
        var loader = this.loadingService.initLoader();
        this.loadingService.dismissLoader(loader);
        this.focusButton();
      } 
  }

  focusButton(): void {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 600);
  }

  removeTitle(obj: TitleDTO){
    var loader = this.loadingService.initLoader();

    this.collectionService.removeTitle(obj.id).subscribe(response=>{
      this.collectionService.findCollection(this.userId.toString()).subscribe(response=>{
        this.items = response['titles'];
      })
    })

    this.loadingService.dismissLoader(loader);
  }

  confirmAlert(obj: TitleDTO){
    let alert = this.alertCtrl.create({
      title: 'Deseja remover o título da sua coleção?',
      message: "Atenção! Todos os dados referentes aos volumes desse título serão perdidos.",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.removeTitle(obj);
          }
        },
        {
          text: 'Cancelar',

        }
      ]
    });
    alert.present();
  }
}
