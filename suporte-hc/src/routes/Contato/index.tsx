import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

export default function Contato() {
    return (
        <main className="main-contato">
            <h1>Contato</h1>
            <section className="contato">
                <h2>Entre em contato conosco</h2>
                <p>Horário de atendimento: das 8:00 às 18:00</p>
                <p>De segunda à sexta-feira</p>
                <div className="icone-contato">
                    <a
                        href="mailto:hc.suporte.oficial@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contato"
                    >
                        <FaEnvelope size={50} color="#0077FF" />
                    </a>
                    <a href="tel:11990145697" className="btn-contato">
                        <FaPhoneAlt size={50} color="#0077FF" />
                    </a>
                    <a
                        href="https://wa.me/5511990145697"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contato"
                    >
                        <FaWhatsapp size={50} color="#25D366" />
                    </a>
                </div>
            </section>
        </main>
    );
}