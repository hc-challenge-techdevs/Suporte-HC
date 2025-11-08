import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchTutoriais } from "../../services/apiService";
import type { InfoItem } from "../../types/api";

const VIDEO_MAP: { [key: string]: string } = {
    "Primeiro Acesso ao Aplicativo": "/tutorial-primeiro-acesso.mp4",
    "Teleconsulta": "/tutorial-teleconsulta.mp4",
};

export default function DetalheTutorial() {
    const { titulo } = useParams<{ titulo: string }>();
    const navigate = useNavigate();
    const [tutorial, setTutorial] = useState<InfoItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mostrarExplicacao, setMostrarExplicacao] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTutorial() {
            setIsLoading(true);
            setApiError(null);

            try {
                const tutoriaisList: InfoItem[] = await fetchTutoriais();
                const foundTutorial = tutoriaisList.find(t => t.titulo?.toLocaleLowerCase() === titulo?.toLocaleLowerCase());
                if (foundTutorial) {
                    setTutorial(foundTutorial);
                } else {
                    setApiError(`Tutorial com título "${titulo}" não encontrado.`);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao conectar.";
                setApiError(`Falha ao conectar para carregar o tutorial: ${errorMessage}`);
                console.error("Erro ao carregar tutorial:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (titulo) {
            loadTutorial();
        } else {
            setIsLoading(false);
            setApiError("Título do tutorial inválido.");
        }
    }, [titulo, navigate]);

    const videoSrc = tutorial ? VIDEO_MAP[tutorial.titulo || ""] : "";

    if (isLoading) {
        return <main className="main-tutorial-dois">Carregando tutorial...</main>;
    }

    if (!tutorial) {
        return (
            <main className="main-tutorial-dois">
                <h1>404 - Tutorial não encontrado!</h1>
                <p>{apiError || "O recurso não está disponível."}</p>
                <button onClick={() => navigate("/tutorial")} className="back-button">
                    Voltar
                </button>
            </main>
        );
    }

    return (
        <main className="main-tutorial-dois">
            <div className="apresentacao_tutorial">
                <h1 className="titulo-detalhe">{tutorial.titulo}</h1>
                <video
                    height="100"
                    width="100"
                    controls
                    aria-label={`Vídeo tutorial de ${tutorial.titulo}`}
                >
                    <source src={videoSrc || "/fallback-video.mp4"} type="video/mp4" />
                    Seu navegador não suporta vídeos.
                </video>
                <button
                    onClick={() => setMostrarExplicacao(!mostrarExplicacao)}
                    className="btn-explicacao"
                >
                    {mostrarExplicacao ? "Esconder Explicação" : "Ver Explicação em Texto"}
                </button>
                {mostrarExplicacao && (
                    <div className="explanation-text">
                        <h2 className="explanation-titulo">Instruções:</h2>
                        <p className="texto-detalhe">
                            {tutorial.conteudo}
                        </p>
                    </div>
                )}
            </div>
            <button onClick={() => navigate("/tutorial")} className="back-button">
                Voltar
            </button>
        </main>
    );
}
