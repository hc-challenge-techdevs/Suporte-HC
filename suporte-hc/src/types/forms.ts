import type { UsuarioTO, LoginTO, LembreteTO } from './api';

interface FormUsuarioCampos {
    nome: string;
    telefoneUsuario: UsuarioTO['telefoneUsuario'];
}

interface FormLoginCampos {
    email: LoginTO['email'];
    senha: string;
}

export type CadastroFormData = FormUsuarioCampos & FormLoginCampos;

export interface LembreteFormData {
    hora: string;
    nomeMedico: LembreteTO['nomeMedico'];
    tipo: LembreteTO['tipoConsulta'];
    observacao: LembreteTO['observacao'];
}

export type LoginFormData = {
    email: LoginTO['email'];
    senha: string;
}

export type EdicaoFormData = {
    nomeUsuario: UsuarioTO['nomeUsuario'];
    telefoneUsuario: UsuarioTO['telefoneUsuario'];
    email: string;
    senha: string;
};