import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";

@Injectable()
export class LoadingService {

    constructor(public loadingControl: LoadingController) {}
    

    presentLoading(){
        let loader = this.loadingControl.create({
          content: "Carregando"
        });
        loader.present();
        return loader;
      }

    initLoader(){
        let loader = this.presentLoading();
        return loader;
    }

    dismissLoader(loader: any){
        loader.dismiss();
    }

}