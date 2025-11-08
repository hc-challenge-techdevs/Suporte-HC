import { useState, useEffect } from "react";
import type { InfoItem } from "../../types/api";
import { fetchFaq } from "../../services/apiService";

export default function FAQ() {
    const [faqList, setFaqList] = useState<InfoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        async function loadFaq() {
            setIsLoading(true);
            setApiError(null);
            try {
                const data: InfoItem[] = await fetchFaq();
                if (data.length > 0) {
                    setFaqList(data.map(item => ({ pergunta: item.pergunta, resposta: item.resposta })));
                } else {
                    setApiError("Nenhuma pergunta frequente encontrada.");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao conectar.";
                setApiError(`Falha ao carregar a FAQ: ${errorMessage}`);
                console.error("Erro ao carregar FAQ:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadFaq();
    }, []);

    if (isLoading) {
        return (
            <main className="main-faq p-6">
                <h1 className="text-3xl font-bold mb-6">Perguntas Frequentes</h1>
                <p>Carregando conteúdo da API...</p>
            </main>
        );
    }

    if (apiError) {
        return <main className="main-faq p-6">Erro ao carregar a FAQ: {apiError}</main>;
    }

    return (
        <main className="main-faq p-6">
            <section className="faq">
                <h1 className="text-3xl font-bold mb-6">Perguntas Frequentes</h1>
                {faqList.map((item, index) => (
                    <div key={index} className="mb-4 border-b pb-3">
                        <h3 className="text-xl font-semibold text-teal-700">
                            {item.pergunta}
                        </h3>
                        <p className="text-gray-700 whitespace-pre-line">
                            {item.resposta}
                        </p>
                    </div>
                ))}
            </section>
        </main>
    );
}