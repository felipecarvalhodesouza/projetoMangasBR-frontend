import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { PublisherDTO } from "../../models/publisher.dto";

@Injectable()
export class PublisherService {

    constructor(public http: HttpClient){   
             
    }

    findPublishers(){
        return this.http.get<PublisherDTO[]>(`${API_CONFIG.baseUrl}/publishers`); 
    }
}