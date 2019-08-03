import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { UserDTO } from "../../models/user.dto";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class UserService{

    constructor(public http: HttpClient,
                public storage: StorageService,
                public imageUtilService: ImageUtilService){

    }

    // recebe um email string e retorna um Observable cliente DTO
    findByEmail(email: string) : Observable<UserDTO>{
        return this.http.get<UserDTO>(`${API_CONFIG.baseUrl}/users/email?value=${email}`);
    }

    getImageFromBucket(id: string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/user-profile${id}.jpg`
        //blob quer dizer que a resposta será uma imagem e não um json
        return this.http.get(url, {responseType: 'blob'});
    }

    insert(obj: UserDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/users`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

    update(obj: UserDTO){
        return this.http.put(
            `${API_CONFIG.baseUrl}/users/${obj.id}`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

    getAccesses(id: number): Observable<UserDTO>{
       return this.http.get<UserDTO>(`${API_CONFIG.baseUrl}/users/${id}`);
    }

    uploadPicture(picture){
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        //linha pra fazer programaticamente o que fizemos no postman
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/users/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}