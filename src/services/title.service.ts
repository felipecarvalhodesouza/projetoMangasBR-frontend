import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../config/api.config";
import { UserDTO } from "../models/user.dto";

 // para ser um service que possa ser injetado em outras classes
@Injectable()
export class TitleService {

    user: UserDTO;

    constructor(public http: HttpClient){
             
    }

    findTitleVolumes(userId: number, titleIndex: number) : Observable<any> {
        return this.http.get<any>(`${API_CONFIG.baseUrl}/users/${userId}/collection/${titleIndex}`); 
    }

}