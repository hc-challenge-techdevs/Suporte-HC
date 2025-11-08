import { useNavigate } from "react-router-dom";

export default function PaginaInicial() {
    const navigate = useNavigate();

    return (
        <main className="pagina-inicial">
            <section>
                <h1>Suporte HC</h1>
                <div className="cards">
                    <button className="card" onClick={() => navigate("/tutorial")}>
                        <p className="titulo-card">Como usar o App</p>
                        <p>Saiba como navegar no aplicativo passo a passo</p>
                    </button>
                    <button className="card" onClick={() => navigate("/lembretes")}>
                        <p className="titulo-card">Lembre da sua Consulta</p>
                        <p>Adicione uma data e receba um lembrete no dia certo</p>
                    </button>
                    <button className="card" onClick={() => navigate("/faq")}>
                        <p className="titulo-card">Perguntas Frequentes</p>
                        <p>Respostas para as dúvidas mais comuns</p>
                    </button>
                </div>
            </section>
        </main>
    );
}