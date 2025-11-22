// Seletores de elementos do DOM
let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("header input");
// Array para armazenar todos os dados do JSON
let dados = [];
// Constante que define quantos itens serão carregados na visualização inicial
const ITENS_INICIAIS = 5;

/**
 * Função para buscar os dados do arquivo JSON (se ainda não carregados) e iniciar a busca.
 * Esta função agora lida com a busca e o carregamento inicial.
 */
async function iniciarBusca() {
    // 1. Carrega todos os dados do JSON se ainda não estiverem na memória
    if (dados.length === 0) {
        try {
            // Assume que 'data.json' está disponível com a lista completa de livros
            let resposta = await fetch("data.json");
            dados = await resposta.json();
            
            // Após carregar, renderiza o subconjunto inicial (os 5 primeiros)
            renderizarCards(dados.slice(0, ITENS_INICIAIS));
            return; // Interrompe para que a busca completa só ocorra ao digitar
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            // Exibe mensagem de erro na tela para o usuário
            cardContainer.innerHTML = "<p>Erro ao carregar a base de dados de livros. Verifique o arquivo 'data.json'.</p>";
            // NOVO: Limpa ou exibe erro no contador
            if (totalItemsDisplay) {
                totalItemsDisplay.textContent = "Erro ao carregar dados";
            }
            return; 
        }
    }

    // 2. Lógica de Busca (só é executada após a primeira interação do usuário no input)
    const termoBusca = campoBusca.value.toLowerCase();

    // Se o termo de busca estiver vazio, retorna aos itens iniciais para manter a visualização padrão.
    if (termoBusca.trim() === "") {
        renderizarCards(dados.slice(0, ITENS_INICIAIS));
        // NOVO: Atualiza a mensagem quando a visualização retorna ao estado inicial
        if (totalItemsDisplay) {
             totalItemsDisplay.textContent = `Total de livros na base: ${dados.length}. Exibindo ${ITENS_INICIAIS} para o início.`;
        }
        return;
    }

    // Filtra todos os dados carregados do JSON
    const dadosFiltrados = dados.filter(dado => 
        dado.titulo.toLowerCase().includes(termoBusca) || 
        dado.descricao.toLowerCase().includes(termoBusca) ||
        dado.autor.toLowerCase().includes(termoBusca) ||
        dado.editora.toLowerCase().includes(termoBusca) ||
        dado.tag.toLowerCase().includes(termoBusca)
    );

    renderizarCards(dadosFiltrados);
}

/**
 * Função responsável por criar e exibir os cards na página.
 * @param {Array<Object>} dados - Lista de objetos (livros) a serem renderizados.
 */
function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar
    
    if (dados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum livro encontrado com o termo de busca.</p>";
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.titulo}</h2>
        <p class="descricao">${dado.descricao}</p>
        <p class="tag">#${dado.tag}</p>
        <h3>Informações da Publicação:</h3>
        <ul>
            <li>Autor: ${dado.autor}</li>
            <li>Editora: ${dado.editora}</li>
            <li>Ano: ${dado.ano_publicacao}</li>
        </ul>
        <BR/>
        <!-- Usando um ícone SVG inline como placeholder, pois o caminho /img/... pode não funcionar no ambiente -->
        <a href="${dado.link}" target="_blank">
          <svg style="display:inline-block; width: 1.2em; height: 1.2em; vertical-align: middle; margin-right: 0.5em;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          COMPRAR ESTE LIVRO</a>
        `;
        cardContainer.appendChild(article);
    }
}

/**
 * Garante que o script só inicie a busca depois que o HTML da página for completamente carregado.
 * Note que agora ele chama iniciarBusca, que por sua vez, carrega todos os dados
 * e renderiza apenas os ITENS_INICIAIS.
 */
document.addEventListener("DOMContentLoaded", () => {
    iniciarBusca();
    // Adiciona o listener para o campo de busca, garantindo que a busca completa seja acionada ao digitar.
    campoBusca.addEventListener("input", iniciarBusca);
});