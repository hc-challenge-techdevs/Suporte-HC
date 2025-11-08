import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchTutoriais } from "../../services/apiService";
import type { InfoItem } from "../../types/api";

export default function Tutorial() {

    const [tutoriaisList, setTutoriaisList] = useState<InfoItem[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {

        async function loadTutoriais() {

            setIsLoading(true);

            setApiError(null);

            try {

                const data: InfoItem[] = await fetchTutoriais();

                if (data.length > 0) {

                    setTutoriaisList(data);

                } else {

                    setApiError("Nenhum tutorial encontrado.");

                }

            } catch (error) {

                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao conectar.";

                setApiError(`Falha ao conectar com o servidor para carregar tutoriais: ${errorMessage}`);

                console.error("Erro ao carregar tutoriais:", error);

            } finally {

                setIsLoading(false);

            }

        }

        loadTutoriais();

    }, [])

    if (isLoading) {
        return <main className="main-tutorial loading">Carregando tutoriais...</main>;
    }

    if (apiError) {
        return <main className="main-tutorial error">Erro ao carregar tutoriais: {apiError}</main>;
    }

    return (
        <main className="main-tutorial">
            <h1>Tutoriais</h1>
            <section className="apresentacao">
                <div className="cards">

                    {tutoriaisList.map((tutorial, index) => (
                        <Link

                            to={`/tutorial/${tutorial.titulo}`}

                            key={index}

                            className="card-link"
                        >
                            <div className="card">
                                <h2>{tutorial.titulo}</h2>
                                <p>{tutorial.conteudo?.substring(0, 80)}...</p>
                            </div>
                        </Link>

                    ))}
                </div>
            </section>
        </main>

    );

}
