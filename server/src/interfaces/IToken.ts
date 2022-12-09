import { IUser } from "./IUser";

export interface IToken{
    userId: IUser['_id'];
    email: IUser['email'];
    role: IUser['role'];
    exp?: number;
    iat?: number;
}