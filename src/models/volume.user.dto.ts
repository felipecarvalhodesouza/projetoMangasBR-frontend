import { VolumeDTO } from "./volume.dto";

export interface VolumeUserDTO {
    id: number;
    volume: VolumeDTO;
    doesHave: boolean;
    name: string;
} 