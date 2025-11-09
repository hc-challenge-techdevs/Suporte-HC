# Suporte HC
 
O Suporte HC é uma ferramenta simples e acessível desenvolvida para ajudar pacientes, em especial os idosos, a gerenciar suas consultas médicas e a navegar pelo aplicativo oficial do Hospital das Clínicas. O projeto visa combater as altas taxas de absenteísmo, causadas principalmente pela dificuldade de uso de plataformas digitais e esquecimento de compromissos.
 
---
 
## Informações Técnicas e de Desenvolvimento
 
### Tecnologias Utilizadas
 
O projeto foi desenvolvido como uma **Single Page Application (SPA)** utilizando **React, Vite, e TypeScript**, com uma arquitetura modular. A estilização é realizada exclusivamente com **Tailwind CSS**. A aplicação promove a integração com o backend via consumo de APIs.
 
| Categoria              | Tecnologia           | Uso no Projeto                                                                                                                                              |
| :--------------------- | :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework/Ambiente** | **React**            | Biblioteca principal para a construção da UI.                                                                                                               |
| **Linguagem/Tipagem**  | **TypeScript**       | Garante tipagem estática e define interfaces como `UsuarioTO`, `LembreteTO`, e tipos compostos como `CadastroFormData` (Intersection Type).                 |
| **Build Tool**         | **Vite**             | Ambiente de desenvolvimento e _bundler_.                                                                                                                    |
| **Estilização**        | **Tailwind CSS**     | Única ferramenta de CSS utilizada, implementando **responsividade** e **Dark Mode**.                                                                        |
| **Roteamento**         | **React Router DOM** | Gerencia rotas estáticas e a rota dinâmica `/tutorial/:titulo`.                                                                                             |
| **Formulários**        | **React Hook Form**  | Utilizado para gestão e validação de formulários (Cadastro, Login, Lembretes, Usuário).                                                                     |
| **Biblioteca**         | **React Calendar**   | A biblioteca de calendário é importada e utilizada no componente Lembretes/index.tsx para a funcionalidade de criar lembretes de agendamento das consultas. |
| **Integração**         | **API Remota**       | Consumo de endpoints para CRUD (GET/POST/PUT/DELETE) em `apiService.ts`.                                                                                    |
 
---
 
### Estrutura de Pastas
 
A estrutura segue uma arquitetura modular por tipo de arquivo (`components`, `routes`, `services`, `types`) e uma pasta para arquivos públicos (`public`) contendo imagens e vídeos.
 
```
├─ SPHC/
├── public/
│   ├── img/
│   │    ├── foto-andrei.jpeg
│   │    ├── foto-isabela.jpeg
│   │    ├── foto-manuela.jpg
│   │    └── logo-hc.png
│   ├── tutorial-primeiro-acesso.mp4
│   └── tutorial-teleconsulta.mp4
├── src/
│   ├── components/
│   │   ├── Cabecalho/
│   │   │   └── Cabecalho.tsx
│   │   ├── Calendario/
│   │   │   └── Calendario.tsx
│   │   ├── DetalheTutorial/
│   │   │   └── DetalheTutorial.tsx
│   │   ├── Menu/
│   │   │   └── Menu.tsx
│   │   ├── Rodape/
│   │   │   └── Rodape.tsx
│   │   ├── ThemeContext/
│   │   │   ├── ThemeContext.tsx
│   │   │   └── useTheme.ts
│   ├── routes/
│   │   ├── Cadastro/
│   │   │   └── index.tsx
│   │   ├── Contato/
│   │   │   └── index.tsx
│   │   ├── Error/
│   │   │   └── index.tsx
│   │   ├── FAQ/
│   │   │   └── index.tsx
│   │   ├── Integrantes/
│   │   │   └── index.tsx
│   │   ├── Lembretes/
│   │   │   └── index.tsx
│   │   ├── Login/
│   │   │   └── index.tsx
│   │   ├── PaginaInicial/
│   │   │   └── index.tsx
│   │   ├── Tutorial/
│   │   │   └── index.tsx
│   │   └── Usuario/
│   │       └── index.tsx
│   ├── services/
│   │   └── apiService.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── forms.ts
│   │   └── themeContextType.ts
│   ├── App.tsx
│   ├── globals.css
│   └── main.tsx
├── .env
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
 
---
 
### Imagens e Ícones
 
| Tipo                     | Descrição                                                                  | Uso no Projeto                                                       |
| :----------------------- | :------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| **Imagens**              | `logo-hc.png`, `foto-andrei.jpeg`, `foto-isabela.jpeg`, `foto-manuela.jpg` | Identificação visual do projeto e dos integrantes.                   |
| **Vídeos**               | `tutorial-primeiro-acesso.mp4`, `tutorial-teleconsulta.mp4`                | Conteúdo dos tutoriais acessados pela rota dinâmica.                 |
| **Ícones (React Icons)** | `FaSun`, `FaMoon`, `FaSearchPlus`, `FaSearchMinus`                         | Funcionalidades de acessibilidade (Modo Escuro e Controle de Fonte). |
| **Ícones (React Icons)** | `FaUser`, `FaArrowRightFromBracket`                                        | Navegação de Autenticação e Logout.                                  |
| **Ícones (React Icons)** | `FaEnvelope`, `FaPhoneAlt`, `FaWhatsapp`, `FaGithub`, `FaLinkedin`         | Links e informações de contato dos integrantes.                      |
 
---
 
## Links do Projeto
 
| Plataforma           | Link                                                                                                               |
| :------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **GitHub**           | [https://github.com/hc-challenge-techdevs/Suporte-HC.git](https://github.com/hc-challenge-techdevs/Suporte-HC.git) |
| **Vídeo no YouTube** | [https://youtu.be/sOvbkOXPoDc](https://youtu.be/sOvbkOXPoDc)                                                       |
| **Link do deploy na Vercel** | [https://suporte-hc.vercel.app/](https://suporte-hc.vercel.app/)
---
 
## Integrantes
 
| Nome                      | RM     | Turma  |
| :------------------------ | :----- | :----- |
| Andrei de Paiva Gibbini   | 563061 | 1TDSPH |
| Isabela dos Santos Pinto  | 563422 | 1TDSPH |
| Manuela de Lacerda Soares | 564887 | 1TDSPH |