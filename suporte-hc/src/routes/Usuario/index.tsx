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
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [apiMessage, setApiMessage] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // NOVO ESTADO DE SUBMISSÃO
    
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

    const handleExcluirConta = () => {
        if (!idUsuarioLogado) return;
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        setIsSubmitting(true); // ATIVAR AGUARDE
        
        try {
            const sucesso = await excluirUsuario(idUsuarioLogado as number);

            if (sucesso) {
                clearLocalSession();
                console.log("Sua conta foi excluída com sucesso.");
                navigate("/login");
            } else {
                setApiMessage("Falha ao excluir a conta. Tente novamente.");
            }
        } finally {
            setIsSubmitting(false); // DESATIVAR AGUARDE
        }
    };

    const onSubmit: SubmitHandler<EdicaoFormData> = async (data) => {
        setApiMessage(null);
        setIsSubmitting(true); // ATIVAR AGUARDE

        if (!idUsuarioLogado || !usuarioData) {
            clearLocalSession();
            setApiMessage("Sessão expirada. Redirecionando.");
            navigate("/login");
            setIsSubmitting(false);
            return;
        }

        const emailParaEnviar = data.email.trim() === "" ? usuarioData.email : data.email;
        const senhaParaEnviar = data.senha || "DEIXAR_INALTERADA";
        
        const payload: CadastroPayload = {
            usuario: {
                nomeUsuario: data.nomeUsuario,
                telefoneUsuario: data.telefoneUsuario,
            },
            login: {
                email: emailParaEnviar,
                senhaLogin: senhaParaEnviar,
            },
        };

        try {
            const userAtualizado = await atualizarUsuario(
                idUsuarioLogado as number,
                payload
            );

            if (userAtualizado) {
                setApiMessage("Dados alterados com sucesso!");
                localStorage.setItem(
                    "session_user_data",
                    JSON.stringify({
                        idUsuario: idUsuarioLogado,
                        nomeUsuario: userAtualizado.nomeUsuario,
                        email: userAtualizado.email,
                    })
                );
                setMode("view");
                setUsuarioData(userAtualizado);
            } else {
                setApiMessage(
                    "Falha ao atualizar. Verifique a validade dos dados ou se o email já está em uso."
                );
            }
        } catch (error) {
            setApiMessage("Falha ao comunicar com a API.");
        } finally {
            setIsSubmitting(false); // DESATIVAR AGUARDE
        }
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
                                disabled={isSubmitting} // Desabilita
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn-danger"
                                disabled={isSubmitting} // Desabilita
                            >
                                {isSubmitting ? "Aguarde..." : "Excluir"}
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
                            disabled={isSubmitting} // Desabilita
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
                        <input
                            type="text"
                            {...register("nomeUsuario", { required: "O nome é obrigatório." })}
                            className="form-input"
                            disabled={isSubmitting}
                        />
                        {errors.nomeUsuario && (
                            <p className="error-message">{errors.nomeUsuario.message}</p>
                        )}
                    </div>

                    <div>
                        <label>Telefone:</label>
                        <input
                            type="text"
                            {...register("telefoneUsuario")}
                            className="form-input"
                            disabled={isSubmitting}
                        />
                        {errors.telefoneUsuario && (
                            <p className="error-message">{errors.telefoneUsuario.message}</p>
                        )}
                    </div>

                    <div>
                        <label>Novo Email (Atual: {usuarioData.email}):</label>
                        <input
                            type="email"
                            {...register("email", {
                                validate: (value) =>
                                    !value ||
                                    /^\S+@\S+$/i.test(value) ||
                                    "Formato de email inválido.",
                            })}
                            className="form-input"
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="error-message">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label>Nova Senha:</label>
                        <input
                            type="password"
                            {...register("senha")}
                            className="form-input"
                            disabled={isSubmitting}
                        />
                        <p className="form-helper-text">
                            Preencha apenas se desejar alterar a senha.
                        </p>
                        {errors.senha && (
                            <p className="error-message">{errors.senha.message}</p>
                        )}
                    </div>
                    
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? "Aguarde..." : "Salvar Alterações"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("view")}
                        className="btn-cancel"
                        disabled={isSubmitting} // Desabilita o botão Cancelar durante o envio
                    >
                        Cancelar
                    </button>
                </form>
            )}
        </main>
    );
}