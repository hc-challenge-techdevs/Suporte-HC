import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { LoginFormData } from "../../types/forms";
import type { LoginTO } from "../../types/api";
import { autenticarUsuario, buscarUsuarioPorId } from "../../services/apiService";

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    mode: "onSubmit",
  });

  const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
    setApiError(null);
    setIsLoading(true);

    try {
      const payload: LoginTO = {
        email: data.email,
        senhaLogin: data.senha,
      };

      const { auth, error } = await autenticarUsuario(payload);

      if (auth && auth.idUsuario !== -1) {
        const idUsuario = auth.idUsuario;
        const userFullData = await buscarUsuarioPorId(idUsuario);

        if (userFullData) {
          localStorage.setItem(
            "session_user_data",
            JSON.stringify({
              idUsuario: idUsuario,
              nomeUsuario: userFullData.nomeUsuario,
              email: userFullData.email
            })
          );
          reset();
          navigate("/lembretes");
          return;
        } else {
          setApiError("Login realizado, mas houve falha ao carregar os dados completos do usuário.");
        }

      } else if (error) {
        setApiError(error);
      }
    } catch (error) {
      setApiError("Não foi possível conectar ao servidor. Verifique o status da API.");
      console.error("Erro na requisição:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-container">
      <div className="form-container">
        <h1 className="form-title">Login de Usuário</h1>
        {apiError && (
          <div className="api-message api-message--error" role="alert">
            <span>{apiError}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
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
                  value: 3,
                  message: "A senha deve ter no mínimo 3 caracteres.",
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
              {isLoading ? "Aguarde..." : "Entrar"}
            </button>
          </div>
        </form>

        <p className="login-prompt">
          Não tem uma conta?
          <Link to="/Cadastro" className="login-link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}