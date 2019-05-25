import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';
import { UserDTO } from "../models/user.dto";
import { CollectionService } from "./collection.service";

@Injectable()
export class AuthService{

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(public http: HttpClient,
        public collectionService: CollectionService,
        public storage: StorageService){

    }

    authenticate(creds: CredenciaisDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response',
                //evitar erro de parse de Json (o responsebody vem vazio)
                responseType: 'text'
            });
    }

    successfulLogin(authorizationValue: string){
        let tok = authorizationValue.substring(7);
        let user : LocalUser = { 
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub
        };
        this.storage.setLocalUser(user);
    }

    logout(){
        this.storage.setLocalUser(null);
    }

    refreshToken(){
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`,
            {},
            {
                observe: 'response',
                //evitar erro de parse de Json (o responsebody vem vazio)
                responseType: 'text'
            });
    }

    forgotPassword(obj: UserDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/forgot`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

    resendToken(obj: UserDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/resend_token`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }
}