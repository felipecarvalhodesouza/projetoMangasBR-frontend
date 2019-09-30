import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, ModalController } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { TitleDTO } from '../../models/title.dto';
import { TitleService } from '../../services/domain/title.service';
import { LoadingService } from '../../services/loading.service';
import { UserService } from '../../services/domain/user.service';
import { UserDTO } from '../../models/user.dto';
import { StorageService } from '../../services/storage.service';
import { InsertTitlePage } from '../insert-title/insert-title';

@IonicPage()
@Component({
  selector: 'page-titles-database',
  templateUrl: 'titles-database.html',
})
export class TitlesDatabasePage {

  @ViewChild('searchbar') searchbar:Searchbar;
  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: TitleDTO[] = [];
  itemsSearchBar: TitleDTO[];

  searchTerm: string = '';
  searching: any = false;

  admin = false;
  user: UserDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public titleService: TitleService,
              public loadingService: LoadingService,
              public userService: UserService,
              public storageService: StorageService,
              public modalCtrl: ModalController) {
    this.userService.findByEmail(this.storageService.getLocalUser().email).subscribe(response=>{
      this.user = response;
      this.isAdmin(); 
    });
  }

  ionViewDidLoad() {
    this.titleService.findTitles().subscribe(response => {
      this.items = response['content'];
      this.items.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
    });
      this.itemsSearchBar = this.items
    },
    error => {
        if(error.status == 403){
          this.navCtrl.setRoot('HomePage');
        }
    })
  }

  enterTitlePage(obj: TitleDTO) {
    this.navCtrl.push('AddTitleToCollectionPage', {
      title: obj
    });
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

  isAdmin(){
    this.admin = false;
    this.userService.getAccesses(+this.user.id).
    subscribe(response =>{
      for(var i = 0; i < response.perfis.length; i++){
        if(response.perfis[i]=="ADMIN")
          this.admin = true;
        }
      });
  }

  presentInsertTitleModal(){
    const modal = this.modalCtrl.create(InsertTitlePage, { TitleDatabasePage: this });
    modal.present();
}

}
