import { Link } from 'react-router-dom';
import { tutoriaisData } from '../../data/tutoriasData';




export default function Tutorial() {
    return (
        <main className="main-tutorial">
            <h1>Tutoriais</h1>
            <section className="apresentacao">
                <div className="cards">
                    {tutoriaisData.map(tutorial => (
                        <Link to={`/tutorial/${tutorial.titulo}`} key={tutorial.titulo}>
                            <div className="card">
                                <h2 className="dark:text-white">{tutorial.nome}</h2>
                                <p className="texto-detalhe">{tutorial.descricao}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}