import { API_CONFIG } from "../../config/api.config";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class VolumeService {

    constructor(public http: HttpClient,
                public imageUtilService: ImageUtilService){
    }
    
    uploadPicture(picture, titleId, volumeId){
    let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
    let formData: FormData = new FormData();
    
    formData.set('file', pictureBlob, 'file.png');
    return this.http.post(
        `${API_CONFIG.baseUrl}/volumes/${titleId}/${volumeId}/picture`,
        formData,
        {
            observe: 'response',
            responseType: 'text'
        });
    }
}