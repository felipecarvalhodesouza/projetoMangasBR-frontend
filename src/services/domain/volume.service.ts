import { API_CONFIG } from "../../config/api.config";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ImageUtilService } from "../image-util.service";
import { VolumeDTO } from "../../models/volume.dto";

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

    
    removeVolume(volume: VolumeDTO){

        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            //body: obj
        };
      
        return this.http.delete(
            `${API_CONFIG.baseUrl}/volumes/${volume.id}`, options)
    }
}