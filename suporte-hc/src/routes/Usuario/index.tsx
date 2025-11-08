import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { UsuarioTO, CadastroPayload } from "../../types/api";
import type { EdicaoFormData } from "../../types/forms";
import {
    atualizarUsuario,
    buscarUsuarioPorId,
    excluirUsuario,
} from "../../services/apiService";

const getLocalSessionData = (): UsuarioTO | null => {
    const storedData = localStorage.getItem("session_user_data");
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            if (data.idUsuario && typeof data.idUsuario === "number") {
                return data as UsuarioTO;
            }
        } catch (error) {
            console.error("Erro ao fazer parse dos dados da sessão:", error);
        }
    }
    return null;
};

const clearLocalSession = () => {
    localStorage.removeItem("session_user_data");
};

export default function Usuario() {
    const navigate = useNavigate();
    const [usuarioData, setUsuarioData] = useState<UsuarioTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<"view" | "edit">("view"); // Estado para alternar visualização/edição
    const [apiMessage, setApiMessage] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const idUsuarioLogado = getLocalSessionData()?.idUsuario;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EdicaoFormData>({
        mode: "onChange",
    });

    useEffect(() => {
        if (idUsuarioLogado && idUsuarioLogado > 0) {
            async function fetchUserData() {
                setIsLoading(true);
                setApiMessage(null);
                const idValidado = idUsuarioLogado as number;
                const user = await buscarUsuarioPorId(idValidado);

                if (user) {
                    setUsuarioData(user);
                    reset({
                        nomeUsuario: user.nomeUsuario,
                        telefoneUsuario: user.telefoneUsuario,
                        email: user.email,
                        senha: "",
                    });
                } else {
                    console.error("Falha ao carregar dados do usuário. Faça login novamente.");
                    clearLocalSession();
                    navigate("/login");
                }
                setIsLoading(false);
            }
            fetchUserData();
        } else {
            console.error("Você precisa estar logado para acessar esta página.");
            navigate("/login");
        }
    }, [idUsuarioLogado, navigate, reset]);

    const handleExcluirConta = async () => {
        if (!idUsuarioLogado) return;
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        const sucesso = await excluirUsuario(idUsuarioLogado as number);

        if (sucesso) {
            clearLocalSession();
            console.log("Sua conta foi excluída com sucesso.");
            navigate("/login");
        } else {
            setApiMessage("Falha ao excluir a conta. Tente novamente.");
        }
    };

    const onSubmit: SubmitHandler<EdicaoFormData> = async (data) => {
        setApiMessage("Lógica de edição em desenvolvimento. Aguarde.");
    };

    if (isLoading) {
        return <main className="usuario-container">Carregando dados do usuário...</main>;
    }

    if (!usuarioData) {
        return <main className="usuario-container">Nenhum dado encontrado.</main>;
    }

    return (
        <main className="usuario-container">
            <h1 className="titulo-perfil">Meu Perfil</h1>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="card-perfil">
                        <h2 className="text-xl font-bold mb-4 text-red-600">
                            Confirmação de Exclusão
                        </h2>
                        <p className="mb-6">
                            Tem certeza que deseja EXCLUIR sua conta? Esta ação é irreversível e
                            removerá todos os seus dados.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn-cancel"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn-danger"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {apiMessage && (
                <div
                    className={`api-message ${apiMessage.includes("Falha")
                        ? "api-message--error"
                        : "api-message--success"
                        }`}
                >
                    {apiMessage}
                </div>
            )}

            {mode === "view" && (
                <div className="usuario-card-view">
                    <p>
                        <strong>ID Usuário:</strong> {idUsuarioLogado}
                    </p>
                    <p>
                        <strong>Email Atual:</strong>
                        <span className="email-destaque">{usuarioData.email}</span>
                    </p>
                    <p>
                        <strong>Nome:</strong> {usuarioData.nomeUsuario}
                    </p>
                    <p>
                        <strong>Telefone:</strong> {usuarioData.telefoneUsuario}
                    </p>

                    <div className="btn-perfil">
                        <button
                            onClick={() => setMode("edit")}
                            className="btn-perfil-editar"
                        >
                            Editar
                        </button>
                        <button
                            onClick={handleExcluirConta}
                            className="btn-perfil-excluir"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            )}

            {mode === "edit" && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="usuario-card-form"
                >
                    <h2>Alterando dados do Usuário</h2>
                    <p>
                        Deixe a <strong>Nova Senha</strong> e/ou o <strong>Novo Email</strong>{" "}
                        vazios para manter os valores atuais.
                    </p>
                    
                    <div>
                        <label>Nome Completo:</label>
                        <input type="text" className="form-input" disabled /> 
                    </div>
                    
                    <button type="submit" className="btn-submit" disabled>
                        Salvar Alterações
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("view")}
                        className="btn-cancel"
                    >
                        Cancelar
                    </button>
                </form>
            )}
        </main>
    );
}