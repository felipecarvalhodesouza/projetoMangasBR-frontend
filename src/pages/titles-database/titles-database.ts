import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { TitleDTO } from '../../models/title.dto';
import { TitleService } from '../../services/title.service';
import { LoadingService } from '../../services/loading.service';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public titleService: TitleService,
              public loadingService: LoadingService) {
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

  enterTitlePage(obj: TitleDTO, index: any) {
    this.navCtrl.push('AddTitlePage', {
      titleIndex: index
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

}
