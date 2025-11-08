import {
    type LembreteTO,
    type CadastroPayload,
    type UsuarioTO,
    type LoginTO,
    type InfoItem,
    API_URL
} from '../types/api';

const JSON_HEADERS = {
    'Content-Type': 'application/json',
};

type AuthResult = { idUsuario: number; mensagem: string };

export async function cadastrarUsuario(payload: CadastroPayload): Promise<{ user: UsuarioTO | null; error: string | null }> {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(payload),
        });

        if (response.status === 201) {
            const user = (await response.json()) as UsuarioTO;
            return { user, error: null };
        } else if (response.status === 400) {
            const errorBody = await response.json();
            return { user: null, error: errorBody.message || 'Erro de validação ou email já cadastrado.' };
        }

        return { user: null, error: `Erro ${response.status} ao cadastrar.` };
    } catch (e) {
        console.error(e);
        return { user: null, error: 'Falha na conexão com o servidor.' };
    }
}

export async function autenticarUsuario(credentials: LoginTO): Promise<{ auth: AuthResult | null; error: string | null }> {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(credentials),
        });

        if (response.status === 200) {
            const auth = (await response.json()) as AuthResult;
            return { auth, error: null };
        } else if (response.status === 401) {
            return { auth: null, error: 'Email ou senha inválidos.' };
        }

        return { auth: null, error: `Erro ${response.status} ao autenticar.` };
    } catch (e) {
        console.error(e);
        return { auth: null, error: 'Falha na conexão com o servidor.' };
    }
}

