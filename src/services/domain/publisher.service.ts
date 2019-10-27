import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { PublisherDTO } from "../../models/publisher.dto";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class PublisherService {

    constructor(public http: HttpClient,
                public imageUtilService: ImageUtilService){   
             
    }

    findPublishers(){
        return this.http.get<PublisherDTO[]>(`${API_CONFIG.baseUrl}/publishers`); 
    }

    insertPublisher({obj}: { obj: PublisherDTO}){
        return this.http.post(
            `${API_CONFIG.baseUrl}/publishers`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

    uploadPicture(picture: string, publisherId: any) {
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/publishers/${publisherId}/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            });
    }
}