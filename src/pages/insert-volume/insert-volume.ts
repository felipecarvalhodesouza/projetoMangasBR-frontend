import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../services/domain/user.service';
import { TitleDTO } from '../../models/title.dto';
import { VolumeDTO } from '../../models/volume.dto';
import { TitleService } from '../../services/domain/title.service';

@IonicPage()
@Component({
  selector: 'page-insert-volume',
  templateUrl: 'insert-volume.html',
})
export class InsertVolumePage {

  title: TitleDTO;
  userId: number;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public formBuilder: FormBuilder,
              public userService: UserService,
              public titleService: TitleService,
              public alertCtrl: AlertController,
              public loadingControl: LoadingController) {

    this.title = navParams.get("title");
    this.userId = navParams.get("userId");

    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });
  }

  ionViewDidLoad() {
    
  }

  presentLoading(){
    let loader = this.loadingControl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  insertVolume(){

    let loader = this.presentLoading();

    let newVolume:VolumeDTO = {
      name: this.formGroup.value.name.trim(),
      date: this.formGroup.value.date,
      price: this.formGroup.value.price
    }
    newVolume.date = newVolume.date.replace("-","/");
    this.titleService.insertVolumesOnTitle({ obj: newVolume, titleId: this.title.id }).subscribe(
      response =>{
        loader.dismiss();
        this.navParams.get("AddTitleToCollectionPage").ionViewDidLoad();
        this.dismiss();
      },
      error =>{
        loader.dismiss();
        this.showAlert("Erro","Houve um problema na inserção do volume.")
      }
    )
  }

  showAlert(title: string, text: string){
    let alert = this.alertCtrl.create({
      title: title,
      message: text,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
