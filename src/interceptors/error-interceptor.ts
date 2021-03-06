import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { AlertController, NavController } from "ionic-angular";
import { FieldMessage } from "../models/fieldmessage";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public storage: StorageService,
                public alertCtrl: AlertController){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        return next.handle(req)
        .catch((error, caught) => {

            let errorObj = error;
            if(errorObj.error){
                errorObj = errorObj.error;
            }
            if(!errorObj.status){
                errorObj = JSON.parse(errorObj);
            }
            console.log("Erro detectado pelo Interceptor");
            console.log(errorObj);
                
                switch(error.status){
                    case 400:
                        this.handle400(errorObj);
                        break;
                    case 401:
                        this.handle401();
                        break;
                    case 403: 
                        this.handle403();
                        break;
                    case 404:
                        this.handle404();
                        break
                    case 422:
                        this.handle422(errorObj);
                        break;
                    case 503:
                        this.handle503();
                        break;
                    default:
                        this.handleDefaultError(errorObj);
                }
            return Observable.throw(errorObj);
        }) as any;
    }

    handle400(errorObj){
        let alert = this.alertCtrl.create({
            title: 'Validação',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
       });
       alert.present();
    }

    handle401(){
        let alert = this.alertCtrl.create({
             title: 'Falha de autenticação',
             message: 'Dados incorretos',
             enableBackdropDismiss: false,
             buttons: [
                 {
                     text: 'Ok'
                 }
             ]
        });
        alert.present();
    }

    handle403(){
        this.storage.setLocalUser(null);
    }

    handle404(){

    }

    handle422(errorObj){
        let alert = this.alertCtrl.create({
            title: 'Validação',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
       });
       alert.present();
    }

    handle503(){
        let alert = this.alertCtrl.create({
             title: 'Serviço indisponível',
             message: 'Tente novamente mais tarde',
             enableBackdropDismiss: false,
             buttons: [
                 {
                     text: 'Ok'
                 }
             ]
        });
        alert.present();
    }

    handleDefaultError(errorObj){
        if(errorObj.message=="Could not roll back JPA transaction; nested exception is org.hibernate.TransactionException: Unable to rollback against JDBC Connection"){
            let alert = this.alertCtrl.create({
                title: 'Conexões excedidas',
                message: "Infelizmente, o limite de conexões por hora foi excedido. Tente novamente mais tarde",
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: 'Ok'
                    }
                ]
        });
        alert.present();

        } else{
            let alert = this.alertCtrl.create({
                title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
                message: errorObj.message,
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: 'Ok'
                    }
                ]
        });
        alert.present();
        }
    }
    
    private listErrors(messages: FieldMessage[]) : string {
        let s : string = '';
        for(var i = 0; i<messages.length; i++){
            s = s + '<p><strong>' + messages[i].fieldName + "</strong>: " + messages[i].message + '</p>';
        }
        return s;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};