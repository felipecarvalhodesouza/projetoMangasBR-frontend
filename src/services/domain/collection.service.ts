import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { UserService } from "./user.service";
import { UserDTO } from "../../models/user.dto";
import { StorageService } from "../storage.service";
import { LoadingController } from "ionic-angular";
import { App } from "ionic-angular/components/app/app";

 // para ser um service que possa ser injetado em outras classes
@Injectable()
export class CollectionService {

    user: UserDTO;

    constructor(public http: HttpClient,
                public userService: UserService,
                public storage: StorageService,
                public loadingControl: LoadingController,
                public app: App){
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
                    this.app.getActiveNav().setRoot('HomePage');
                });
            }
        return this.user;
    }

    presentLoading(){
        let loader = this.loadingControl.create({
          content: "Carregando"
        });
        loader.present();
        return loader;
    }

    returnUser():UserDTO{
        return this.user;
    }
}