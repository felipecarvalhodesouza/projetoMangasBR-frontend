import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";

 // para ser um service que possa ser injetado em outras classes
@Injectable()
export class TitleService {

    constructor(public http: HttpClient){   
             
    }

    findTitleVolumes(userId: number, titleIndex: number, page: number=0, linesPerPage: number=9){
        return this.http.get(`${API_CONFIG.baseUrl}/users/${userId}/collection/${titleIndex}?page=${page}&linesPerPage=${linesPerPage}`); 
    }

    findReviews(titleIndex: number){
        return this.http.get(`${API_CONFIG.baseUrl}/titles/${titleIndex}/reviews`);
    }
}