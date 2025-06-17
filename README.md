# Demonstração: Visualizador de PDF com Busca e Grifo

Este projeto é uma demonstração técnica desenvolvida para um sistema de GED (Gerenciamento Eletrônico de Documentos). O objetivo é validar a implementação de um visualizador de PDF avançado com funcionalidades de busca de texto e anotação (grifo) permanente.

## ✨ Funcionalidades Implementadas

-   **Visualização de PDF:** Renderização de documentos PDF no navegador.
-   **Busca por Texto:** Campo de busca que destaca em tempo real todas as ocorrências de um termo na página visível.
-   **Grifo Manual Permanente:** Permite ao usuário selecionar um trecho de texto com o mouse e aplicar um grifo amarelo que é salvo diretamente no arquivo PDF em memória. Múltiplos grifos podem ser adicionados sequencialmente.
-   **Controles de Navegação:** Paginação (página anterior/próxima) e controle de zoom.

## 🚀 Tecnologias Utilizadas

-   **Next.js:** Framework React para renderização no lado do servidor e do cliente.
-   **React:** Biblioteca para construção da interface de usuário.
-   **TypeScript:** Para um código mais robusto e com tipagem estática.
-   **react-pdf:** Para a renderização e interação com a camada de texto do PDF.
-   **pdf-lib:** Para a manipulação e modificação direta dos bytes do arquivo PDF, permitindo a criação de anotações permanentes.
-   **Tailwind CSS:** Para estilização rápida e responsiva.

## ⚙️ Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITÓRIO_AQUI]
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
4.  Abra [http://localhost:3000/pdf](http://localhost:3000/pdf) no seu navegador para ver o resultado.

---

Desenvolvido por **Helder**.