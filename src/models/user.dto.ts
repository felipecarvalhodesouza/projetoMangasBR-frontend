export interface UserDTO{
    id: string;
    name: string;
    email: string;
    senha: string;
    memberSince: any
    changePasswordOnLogin: boolean;
    perfis: string[];
    //atributo opcional
    imageUrl? : string;
}