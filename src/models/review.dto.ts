import { UserDTO } from "./user.dto";
export interface ReviewDTO {
    author: UserDTO;
    text: string;
    date: string;
    authorName: string;
    score: number;
    imageUrl? : string;
} 