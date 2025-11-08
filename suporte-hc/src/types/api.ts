export const API_URL = import.meta.env.VITE_API_BASE_URL;

export interface LembreteTO {
    idLembrete?: number;
    idUsuario: number;
    dateConsulta: string | Date;
    nomeMedico: string;
    tipoConsulta: string;
    observacao: string;
}

export interface UsuarioTO {
    idUsuario: number;
    nomeUsuario: string;
    telefoneUsuario: string;
    email: string;
}

export interface LoginTO {
    email: string;
    senhaLogin: string;
    idLogin?: number;
    idUsuario?: number;
}

export interface CadastroPayload {
    usuario: { nomeUsuario: string; telefoneUsuario: string; };
    login: { email: string; senhaLogin: string; };
}

export interface InfoItem {
    titulo?: string;
    conteudo?: string;
    pergunta?: string;
    resposta?: string;
}