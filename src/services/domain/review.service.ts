import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { ReviewDTO } from "../../models/review.dto";

@Injectable()
export class ReviewService{

    constructor(public http: HttpClient){
    }

    insert(obj: ReviewDTO, titleId: string){
        var userId = obj.author.id;
        return this.http.post(
            `${API_CONFIG.baseUrl}/users/${userId}/collection/${titleId}/reviews`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }


    delete(obj: ReviewDTO, userId: number, titleId: string){

        obj.date = null;
        obj.author.perfis = null;

        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: obj
        };
      
        return this.http.delete(
            `${API_CONFIG.baseUrl}/users/${userId}/collection/${titleId}/reviews`, options)
    }
}