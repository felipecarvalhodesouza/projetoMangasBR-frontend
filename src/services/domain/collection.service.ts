import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { UserService } from "./user.service";
import { UserDTO } from "../../models/user.dto";
import { StorageService } from "../storage.service";
import { LoadingController } from "ionic-angular";
import { App } from "ionic-angular/components/app/app";
import { TitleDTO } from "../../models/title.dto";
import { VolumeUserDTO } from "../../models/volume.user.dto";

 // para ser um service que possa ser injetado em outras classes
@Injectable()
export class CollectionService {

    user: UserDTO;
    volumeUser: VolumeUserDTO;

    constructor(public http: HttpClient,
                public userService: UserService,
                public storage: StorageService,
                public loadingControl: LoadingController,
                public app: App){
    }

    findAll() : Observable<any> {
        return this.http.get<any>(`${API_CONFIG.baseUrl}/users/${this.user.id}/collection`);  
    }

    findCollection(userId: string) {
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

    insertTitle(titleId: string){
        return this.http.post(`${API_CONFIG.baseUrl}/users/${this.user.id}/collection/${titleId}`,
                    null,
                    {
                        observe: 'response',
                        responseType: 'text'
                    });  
    }

    removeTitle(titleId: string){

        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            //body: obj
        };
      
        return this.http.delete(
            `${API_CONFIG.baseUrl}/users/${this.user.id}/collection/${titleId}`, options)
    }

    updateVolumeUser(doesHave: boolean, titleId: string, volumeUserId: string, paidPrice: number){
        let volumeUser = {
            id: null,
            doesHave: doesHave,
            name: null,
            volume: {
                id: null,
                date: null,
                name: null,
                price: null
            },
            paidPrice: null
        }
        volumeUser.paidPrice = paidPrice;

        return this.http.put(
            `${API_CONFIG.baseUrl}/users/${this.user.id}/collection/${titleId}/${volumeUserId}`,
            volumeUser,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }
}