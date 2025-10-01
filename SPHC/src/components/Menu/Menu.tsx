import { useState, useEffect } from "react";


export default function Menu() {

    const [isOpen, setIsOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });


    const [fontSize, setFontSize] = useState(() => {
        const savedSize = localStorage.getItem("fontSize");
        return savedSize ? parseInt(savedSize, 10) : 16;
    });


    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    }, [isDarkMode]);


    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`;
        localStorage.setItem("fontSize", fontSize.toString());
    }, [fontSize]);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const increaseFontSize = () => {
        setFontSize(currentSize => Math.min(currentSize + 2, 20));
    };

    const decreaseFontSize = () => {
        setFontSize(currentSize => Math.max(currentSize - 2, 12));
    };

    return (
        <nav className="menu-container">

            <div className="hidden md:flex justify-between items-center w-full max-w-7xl mx-auto">
                <a href="/" className="menu-logo">
                    <img src="/img/logo-hc.png" alt="Logo do HC" />
                </a>

                <div className="flex-grow flex justify-center space-x-4">
                    <a href="/" className="menu-link"> Início </a>
                    <a href="/integrantes" className="menu-link"> Integrantes </a>
                    <a href="/faq" className="menu-link"> FAQ </a>
                    <a href="/contato" className="menu-link"> Contato </a>
                </div>

                <div className="flex space-x-2">
                    <button aria-label="Ativar leitor de voz" className="acc-button">
                        <img src="/img/icone-leitor-voz.png" alt="Leitor de voz" className="h-6 w-6" />
                    </button>
                    <button onClick={increaseFontSize} aria-label="Aumentar fonte" className="acc-button">A+</button>
                    <button onClick={decreaseFontSize} aria-label="Diminuir fonte" className="acc-button">A-</button>
                    <button onClick={toggleDarkMode} aria-label="Ativar modo escuro" className="acc-button">●</button>
                </div>
            </div>

            <div className="md:hidden w-full text-amber-300">
                <div className="flex justify-between items-center p-4">
                    <a href="/" className="menu-logo" onClick={closeMenu}>
                        <img src="/img/logo-hc.png" alt="Logo do HC" />
                    </a>

                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        aria-label="Abrir menu"
                    >
                        <svg className="h-6 w-6 text-[#007b7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                <div className={`transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col items-center p-4 space-y-4">
                        <div className="flex flex-col items-center">
                            <a href="/" className="menu-link-mobile" onClick={closeMenu}> Início </a>
                            <a href="/integrantes" className="menu-link-mobile" onClick={closeMenu}> Integrantes </a>
                            <a href="/faq" className="menu-link-mobile" onClick={closeMenu}> FAQ </a>
                            <a href="/contato" className="menu-link-mobile" onClick={closeMenu}> Contato </a>
                        </div>
                        <div className="flex space-x-2">
                            <button aria-label="Ativar leitor de voz" className="acc-button">
                                <img src="/img/icone-leitor-voz.png" alt="Leitor de voz" className="h-6 w-6" />
                            </button>
                            <button onClick={increaseFontSize} aria-label="Aumentar fonte" className="acc-button">A+</button>
                            <button onClick={decreaseFontSize} aria-label="Diminuir fonte" className="acc-button">A-</button>
                            <button onClick={toggleDarkMode} aria-label="Ativar modo escuro" className="acc-button">●</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
