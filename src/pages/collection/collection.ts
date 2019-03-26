import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CollectionService } from '../../services/collection.service';
import { TitleDTO } from '../../models/title.dto';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: TitleDTO[];
  grid: TitleDTO[][];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public collectionService: CollectionService) {

  }

  ionViewDidLoad() {
    this.collectionService.findAll().subscribe(response => {
      this.items=response;
      this.grid = Array(Math.ceil(this.items.content.length/3)); //MATHS!
      this.rearrangeGrid();
      console.log(this.grid);
      console.log(this.items.content);
      },
      error => {
        console.log(error);
      })
  }

  rearrangeGrid(){
    let rowNum = 0; //counter to iterate over the rows in the grid

    for (let i = 0; i < this.items.content.length; i+=3) { //iterate items
  
      if (this.items.content[i]) { //check file URI exists
        this.grid[rowNum][0] = this.items.content[i]
      }
  
      if (this.items.content[i+1]) { //repeat for the second item
        this.grid[rowNum][1] = this.items.content[i+1]
      }

      if (this.items.content[i+2]) { //repeat for the second item
        this.grid[rowNum][2] = this.items.content[i+2]
      }
  
      rowNum++; //go on to the next row
    }
  }

}
