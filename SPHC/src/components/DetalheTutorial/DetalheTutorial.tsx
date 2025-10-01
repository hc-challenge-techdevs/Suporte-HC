import { useNavigate, useParams } from "react-router-dom";
import { tutoriaisData } from "../../data/tutoriasData";

export default function DetalheTutorial() {
  const { titulo } = useParams();
  const tutorial = tutoriaisData.find((t) => t.titulo === titulo);
  const navigate = useNavigate();

  if (!tutorial) {
    return <h1>404 - Tutorial não encontrado!</h1>;
  }

  return (
    <main className="main-detalhe-tutorial">
      <div className="cards-detalhe">
        <div className="apresentacao">
          <h1 className="titulo-detalhe">{tutorial.nome}</h1>
          <video
            width="100"
            height="100"
            controls
            aria-label={`Vídeo tutorial de ${tutorial.nome}`}
          >
            <source src={tutorial.src} type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
          <p className="texto-detalhe">{tutorial.descricao}</p>
        </div>
      </div>
      <button onClick={() => navigate("/tutorial")} className="back-button">
        Voltar{" "}
      </button>
    </main>
  );
}
