export interface IUser {
    id: number;
    login: string;
    password: string;
}

export interface IMessage {
    user: string;
    text: string;
}

export interface INote {
    id: number;
    title: string;
    content: string;
    tags?: string[]
}

export interface INoteWithUserId {
    [key: string]: INote[];
}

export interface AIResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}