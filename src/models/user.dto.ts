export interface UserDTO{
    id: string;
    name: string;
    email: string;
    senha: string;
    //atributo opcional
    imageUrl? : string;
}