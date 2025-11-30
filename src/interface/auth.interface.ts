export interface LoginRequest{
    email: string;
    password: string;
}

export interface CurrentUser{
    id: string;
    name: string;
    username: string;
    email: string;
    roleName: string;
    nickname: string;
}
