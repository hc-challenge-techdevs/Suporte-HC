import { useNavigate } from "react-router-dom";

export default function PaginaInicial() {
    const navigate = useNavigate();

    return (
        <main className="pagina-inicial">
            <section>
                <h1>Suporte HC</h1>
                <div className="cards">
                    <button className="card" onClick={() => navigate("/tutorial")}>
                        <h2>Como usar o App</h2>
                        <p>Saiba como navegar no aplicativo passo a passo</p>
                    </button>
                    <button className="card" onClick={() => navigate("/lembretes")}>
                        <h2>Lembre da sua Consulta</h2>
                        <p>Adicione uma data e receba um lembrete no dia certo</p>
                    </button>
                    <button className="card" onClick={() => navigate("/faq")}>
                        <h2>Perguntas Frequentes</h2>
                        <p>Respostas para as dúvidas mais comuns</p>
                    </button>
                </div>
            </section>
        </main>
    );
}