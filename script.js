let show = true;
const menuContent = document.querySelector('.content');
const menuToggle = menuContent.querySelector('.menu-toggle');

// Função para adicionar um item ao carrinho
function adicionarAoCarrinho(nomeProduto, preco) {
    // Recupera o carrinho da localStorage ou cria um novo se não existir
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Adiciona o item ao carrinho
    carrinho.push({ nome: nomeProduto, preco: preco });

    // Atualiza o carrinho na localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Exibe uma mensagem confirmando que o item foi adicionado ao carrinho
    alert('Item adicionado ao carrinho!');
}

// Função para adicionar os hambúrgueres aos botões "Pedir agora"
function adicionarPedidosAoCarrinho() {
    // Seleciona todos os botões com a classe "pedir"
    let botoesPedir = document.querySelectorAll('.pedir');

    // Adiciona um evento de clique a cada botão "Pedir agora"
    botoesPedir.forEach(function(botao) {
        // Adiciona um ouvinte de evento de clique a cada botão
        botao.addEventListener('click', function() {
            // Obtém o nome e o preço do produto a partir dos elementos HTML
            let nomeProduto = botao.parentElement.querySelector('h3').innerText;
            let precoProduto = botao.parentElement.querySelector('h4 span').innerText;
            
            // Remove o símbolo "R$" e converte o preço para número
            let preco = parseFloat(precoProduto.replace('R$', '').replace(',', '.'));

            // Adiciona o produto ao carrinho
            adicionarAoCarrinho(nomeProduto, preco);
        });
    });
}

// Chama a função para adicionar os pedidos ao carrinho quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    adicionarPedidosAoCarrinho();

    // Adiciona funcionalidade de toggle ao menu
    menuToggle.addEventListener('click', () => {
        menuContent.classList.toggle('on', show);
        show = !show;
    });
});
