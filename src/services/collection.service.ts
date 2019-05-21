import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../config/api.config";
import { TitleDTO } from "../models/title.dto";
import { UserService } from "./domain/user.service";
import { UserDTO } from "../models/user.dto";
import { StorageService } from "./storage.service";
import { NavController, NavParams, LoadingController } from "ionic-angular";

 // para ser um service que possa ser injetado em outras classes
@Injectable()
export class CollectionService {

    user: UserDTO;

    constructor(public http: HttpClient,
                public userService: UserService,
                public storage: StorageService,
                public loadingControl: LoadingController){
        this.findUser();
    }

    findAll() : Observable<any> {
        return this.http.get<any>(`${API_CONFIG.baseUrl}/users/${this.user.id}/collection`);  
    }

    findUser() : UserDTO{
        let localUser = this.storage.getLocalUser();
            if(localUser){
                let loader = this.presentLoading();
                this.userService.findByEmail(localUser.email)
                .subscribe(response => {
                    this.user = response;
                    loader.dismiss();
                },
                error => {
                    loader.dismiss();
                });
            }
        return this.user;
    }

    presentLoading(){
        let loader = this.loadingControl.create({
          content: "Aguarde..."
        });
        loader.present();
        return loader;
      }
}