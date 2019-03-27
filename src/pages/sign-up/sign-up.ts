import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  formGroup: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder) {

              this.formGroup = this.formBuilder.group({
                name: ['Felipe Carvalho de Souza', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]], 
                email: ['desouzafelipecarvalho@gmail.com', [Validators.required, Validators.email]]
              });
  }

  signupUser(){
    console.log("Usuário registrado");
  }
}
