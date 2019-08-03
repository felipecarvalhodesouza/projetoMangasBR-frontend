import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage_keys.config";

@Injectable()
export class StorageService{

    // o local storage armazena strings, dessa forma, ao fazer um get, é necessário
    // converter para JSON. Ao fazer um set, é necessário fazer o stringfy
    getLocalUser(): LocalUser{

        let user = localStorage.getItem(STORAGE_KEYS.localUser);
        if(user==null){
            return null;
        }
        else{
            return JSON.parse(user);
        }
    }

    setLocalUser(obj : LocalUser){
        if(obj == null){
            localStorage.removeItem(STORAGE_KEYS.localUser)
        }
        else{
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }
    }
}