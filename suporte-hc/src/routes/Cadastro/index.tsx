import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import type { CadastroPayload } from "../../types/api";
import { cadastrarUsuario } from "../../services/apiService";
import type { CadastroFormData } from "../../types/forms";

export default function Cadastro() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const successDialogRef = useRef<HTMLDialogElement>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CadastroFormData>({
    mode: "onSubmit",
  });

  const handleCloseModal = () => {
    successDialogRef.current?.close();
    navigate("/login");
  };

  const handleSuccessAndRedirect = (userNome: string, userId: number) => {
    setSuccessMessage(`Cadastro de ${userNome} feito com sucesso! ID: ${userId}`);
    successDialogRef.current?.showModal();
    reset();
  };

  const handleCadastro: SubmitHandler<CadastroFormData> = async (data) => {
    setApiError(null);
    setIsLoading(true);

    try {
      const payload: CadastroPayload = {
        usuario: {
          nomeUsuario: data.nome,
          telefoneUsuario: data.telefoneUsuario,
        },
        login: {
          email: data.email,
          senhaLogin: data.senha,
        },
      };

      const { user, error } = await cadastrarUsuario(payload);

      if (user) {
        handleSuccessAndRedirect(user.nomeUsuario, user.idUsuario);
        return;
      } else if (error) {
        setApiError(error);
        console.error("Erro da API:", error);
      }

    } catch (error) {
      setApiError("Erro ao comunicar com a API! Verifique a conexão.");
      console.error("Erro na requisição:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-container">
      <dialog
        ref={successDialogRef}
        className="p-6 rounded-lg shadow-xl max-w-md w-full mx-auto bg-[#1f1f1f] dark:bg-[#fff]"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#00a6a6] mb-4">Sucesso!</h2>
          <p className="mb-6 text-white dark:text-[#1f1f1f] ">{successMessage}</p>
          <button
            onClick={handleCloseModal}
            className="bg-[#00a6a6] text-white p-2 rounded hover:bg-[#007979]"
          >
            Fazer Login
          </button>
        </div>
      </dialog>
      
      <div className="form-container">
        <h1 className="form-title">Cadastro de Usuário</h1>
        {apiError && <p className="error-message bg-red-100 p-2 rounded">{apiError}</p>}

        <form className="space-y-6" onSubmit={handleSubmit(handleCadastro)}>
          <div>
            <label className="form-label" htmlFor="nome">Nome Completo:</label>
            <input
              type="text"
              id="nome"
              className="form-input"
              {...register("nome", {
                required: "O nome é obrigatório.",
                minLength: {
                  value: 3,
                  message: "O nome deve ter no mínimo 3 caracteres.",
                },
              })}
              disabled={isLoading}
            />
            {errors.nome && (
              <p className="error-message">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="telefone">Telefone (11 dígitos):</label>
            <input
              type="text"
              id="telefone"
              className="form-input"
              {...register("telefoneUsuario", {
                required: "O telefone é obrigatório.",
                pattern: {
                  value: /^\d{11}$/,
                  message: "Deve ter exatamente 11 dígitos (DDD+Número).",
                }
              })}
              disabled={isLoading}
            />
            {errors.telefoneUsuario && (
              <p className="error-message">{errors.telefoneUsuario.message}</p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="form-input"
              {...register("email", {
                required: "O e-mail é obrigatório.",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Formato de e-mail inválido.",
                },
              })}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              className="form-input"
              {...register("senha", {
                required: "A senha é obrigatória.",
                minLength: {
                  value: 6,
                  message: "A senha deve ter no mínimo 6 caracteres.",
                },
              })}
              disabled={isLoading}
            />
            {errors.senha && (
              <p className="error-message">{errors.senha.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Aguarde..." : "Cadastrar"}
            </button>
          </div>
        </form>

        <p className="login-prompt">
          Já tem uma conta?
          <Link to="/Login" className="login-link">
            Faça Login
          </Link>
        </p>
      </div>
    </main>
  );
}