import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { TitleDTO } from "../models/title.dto";

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

    findTitles(){
        return this.http.get<TitleDTO[]>(`${API_CONFIG.baseUrl}/titles`); 
    }
}