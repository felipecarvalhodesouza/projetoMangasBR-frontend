export interface UserDTO{
    id: string;
    name: string;
    email: string;
    senha: string;
    memberSince: any
    changePasswordOnLogin: boolean;
    //atributo opcional
    imageUrl? : string;
}