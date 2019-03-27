import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../config/api.config";
import { TitleDTO } from "../models/title.dto";

 // para ser um service que possa ser injetado em outras classes
@Injectable()
export class CollectionService {

    constructor(public http: HttpClient){
    }

    findAll() : Observable<TitleDTO[]> {
        return this.http.get<TitleDTO[]>(`${API_CONFIG.baseUrl}/titles`); 
    }
} 