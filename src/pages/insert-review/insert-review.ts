import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { TitleDTO } from '../../models/title.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReviewDTO } from '../../models/review.dto';
import { UserService } from '../../services/domain/user.service';
import { ReviewService } from '../../services/domain/review.service';

@IonicPage()
@Component({
  selector: 'page-insert-review',
  templateUrl: 'insert-review.html',
})
export class InsertReviewPage {

  title: TitleDTO;
  userId: number;
  formGroup: FormGroup;
  review: ReviewDTO = {
    author: {
      id: null,
      name: null,
      email: null,
      senha: null,
      memberSince: null,
      changePasswordOnLogin: null,
      perfis: null
    },
    text: null,
    date: null,
    authorName: null,
    score: null
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public formBuilder: FormBuilder,
              public userService: UserService,
              public reviewService: ReviewService,
              public alertCtrl: AlertController,
              public loadingControl: LoadingController) {

    this.title = navParams.get("title");
    this.userId = navParams.get("userId");

    this.formGroup = this.formBuilder.group({
      reviewText: ['', [Validators.required]],
      score: ['', [Validators.required]]
    });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  insertReview(){

    let loader = this.presentLoading();
    this.userService.findById(this.userId).subscribe(response =>{
      this.review.author.id = response.id;
      this.review.authorName = response.name;

      this.populateReview();

      this.reviewService.insert(this.review, this.title.id).subscribe(response =>{
        loader.dismiss();
        this.navParams.get("titlePage").findReviews();
        this.dismiss();
      },
      error =>{
        loader.dismiss();
        this.showAlert("Erro","Houve um problema na inserção da review.")
      });
    });
  }

  populateReview(){
    this.review.score = this.formGroup.value.score;
    this.review.text = this.formGroup.value.reviewText;
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

  presentLoading(){
    let loader = this.loadingControl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }
}
