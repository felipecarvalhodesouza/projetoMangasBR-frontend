export interface UserDTO{
    id: string;
    name: string;
    email: string;
    senha: string;
    changePasswordOnLogin: boolean;
    //atributo opcional
    imageUrl? : string;
}