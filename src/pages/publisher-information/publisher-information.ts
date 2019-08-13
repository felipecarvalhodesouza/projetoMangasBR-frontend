import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PublisherDTO } from '../../models/publisher.dto';
import { API_CONFIG } from '../../config/api.config';
import { TitleDTO } from '../../models/title.dto';
import { TitleService } from '../../services/domain/title.service';

@IonicPage()
@Component({
  selector: 'page-publisher-information',
  templateUrl: 'publisher-information.html',
})
export class PublisherInformationPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  publisher: PublisherDTO = {
    id: null,
    name: null,
    history: null
  }
  segments: any = 'titles';
  paragraphs: String[];
  titles: TitleDTO[] = new Array();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public titlesService: TitleService) {

      this.publisher = navParams.get('publisher');
      this.getListOfTitles();
      this.breakLines();
  }

  ionViewDidLoad() {
    
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  breakLines(){
    if(this.publisher.history!=null){
      this.paragraphs = this.publisher.history.split("\n");
    }
  }

  getListOfTitles(){
    
    this.titlesService.findTitles().subscribe(response =>{
      var allTitles: TitleDTO[] = response['content'];
      for(var i=0; i<allTitles.length; i++){
        if(allTitles[i].publisher.id === this.publisher.id){
            this.titles.push(allTitles[i]);
          }
        }
      console.log(this.titles);
    });
  }

  toTitlePage(obj: TitleDTO){
    this.navCtrl.push('AddTitleToCollectionPage', {
      title: obj
    });
  }

}
