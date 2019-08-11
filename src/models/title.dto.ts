import { PublisherDTO } from "./publisher.dto";

export interface TitleDTO {
    id: string;
    name: string;
    score: number;
    finished: boolean;
    publisher: PublisherDTO
    synopsis: string;
    start: string;
    end: string;
} 