import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { TitleDTO } from "../../models/title.dto";
import { VolumeDTO } from "../../models/volume.dto";
import { VolumeUserDTO } from "../../models/volume.user.dto";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class TitleService {

    constructor(public http: HttpClient,
                public imageUtilService: ImageUtilService){
    }

    findTitleVolumes(userId: number, titleIndex: number, page: number=0, linesPerPage: number=9){
        return this.http.get<VolumeUserDTO>(`${API_CONFIG.baseUrl}/users/${userId}/collection/${titleIndex}?page=${page}&linesPerPage=${linesPerPage}`); 
    }

    findTitleVolumesWithouthPageable(userId: String, titleIndex: String){
        return this.http.get<[VolumeUserDTO]>(`${API_CONFIG.baseUrl}/users/${userId}/collection/${titleIndex}/all`); 
    }

    findReviews(titleIndex: string){
        return this.http.get(`${API_CONFIG.baseUrl}/titles/${titleIndex}/reviews`);
    }

    findTitles(){
        return this.http.get<TitleDTO[]>(`${API_CONFIG.baseUrl}/titles`); 
    }

    findTitleById(titleId: string){
        return this.http.get<TitleDTO>(`${API_CONFIG.baseUrl}/titles/${titleId}`); 
    }

    findVolumesByTitleId(titleId: string){
        return this.http.get<VolumeDTO[]>(`${API_CONFIG.baseUrl}/titles/${titleId}/volumes`); 
    }

    insertTitle({obj}: { obj: TitleDTO}){
        return this.http.post(
            `${API_CONFIG.baseUrl}/titles`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }
 
    insertVolumesOnTitle({ obj, titleId }: { obj: VolumeDTO; titleId: string; }){
        return this.http.post(
            `${API_CONFIG.baseUrl}/titles/${titleId}`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

    uploadPicture(picture, titleId){
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/titles/${titleId}/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            });
        }
}