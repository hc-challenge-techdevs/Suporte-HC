import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Integrantes() {

    return (
        <main className="main-integrantes">
            <section className="cardsintegrante">
                <h2>Andrei de Paiva Gibbini</h2>
                <img src="/img/foto-andrei.jpeg" alt="Foto do Andrei" />
                <p>RM - 563061</p>
                <p>Turma - 1TDSPH</p>
                <div className="icons">
                    <a

                        href="https://github.com/Andrei-Gibbini"

                        target="_blank"

                        rel="noopener noreferrer"
                    >
                        <FaGithub className="iconegit" size={40} />
                    </a>
                    <a

                        href="https://www.linkedin.com/in/andrei-de-paiva-gibbini-777475218/"

                        target="_blank"

                        rel="noopener noreferrer"
                    >
                        <FaLinkedin size={40} color="#0A66C2" />
                    </a>
                </div>
            </section>
            <section className="cardsintegrante">
                <h2>Isabela dos Santos Pinto</h2>
                <img src="/img/foto-isabela.jpeg" alt="Foto da Isabela" />
                <p>RM - 563422</p>
                <p>Turma - 1TDSPH</p>
                <div className="icons">
                    <a

                        href="https://github.com/devbelasp"

                        target="_blank"

                        rel="noopener noreferrer"
                    >
                        <FaGithub className="iconegit" size={40} />
                    </a>
                    <a

                        href="https://www.linkedin.com/in/isabela-dos-santos-pinto-31268b353/?locale=pt_BR"

                        target="_blank"

                        rel="noopener noreferrer"
                    >
                        <FaLinkedin size={40} color="#0A66C2" />
                    </a>
                </div>
            </section>
            <section className="cardsintegrante">
                <h2>Manuela de Lacerda Soares</h2>
                <img src="/img/foto-manuela.jpg" alt="Foto da Manuela" />
                <p>RM - 564887</p>
                <p>Turma - 1TDSPH</p>
                <div className="icons">
                    <a

                        href="https://github.com/manuelalacerda"

                        target="_blank"

                        rel="noopener noreferrer"
                    >
                        <FaGithub className="iconegit" size={40} />
                    </a>
                    <a

                        href="https://www.linkedin.com/in/manuela-lacerda-2a6194200/"

                        target="_blank"

                        rel="noopener noreferrer"
                    >
                        <FaLinkedin size={40} color="#0A66C2" />
                    </a>
                </div>
            </section>
        </main>

    );

}
