# Jogo Flappy Bird - Versão em JavaScript

Este projeto é uma implementação do jogo **Flappy Bird** utilizando **HTML**, **JavaScript** e **Canvas API**. O objetivo do jogo é controlar um pássaro para evitar obstáculos (canos) e sobreviver o máximo de tempo possível enquanto coleta pontos.

Acesse o jogo aqui: https://czarfontanella.github.io/clone-flappy-bird/

## Funcionalidades
- **Canvas responsivo:** Adaptação automática da resolução para qualquer tamanho de tela, com razão 9:16.
- **Movimento realista do pássaro:** Pulo suave com gravidade, velocidade máxima de queda e rotação animada.
- **Obstáculos (canos):** Os canos se movem da direita para a esquerda da tela e têm uma altura aleatória.
- **Detecção de colisão precisa:** Baseada em "bounding boxes" ajustadas com margens.
- **Pontuação:** A cada vez que o pássaro passa entre dois canos, o jogador ganha 1 ponto. A pontuação é exibida na tela em tempo real.
- **Colisão:** O jogo termina quando o pássaro colide com um cano ou com o chão.
- **Tela de Game Over:** Quando o jogo termina, uma tela de "Game Over" é exibida, juntamente com a pontuação final e um botão para reiniciar o jogo.

## Como jogar

1. **Inicie o jogo**: O jogo começa automaticamente ao carregar a página.
2. **Controle o pássaro**: Clique na tela ou pressione qualquer tecla para fazer o pássaro subir. A gravidade faz o pássaro cair quando ele não é controlado.
3. **Evite os canos**: O objetivo é passar entre os canos sem colidir com eles. A cada passagem bem-sucedida, o jogador ganha pontos.
4. **Game Over**: Se o pássaro colidir com um cano ou com o chão, o jogo termina. Você pode reiniciar clicando no botão "Recomeçar".

## Estrutura do Projeto

A estrutura do projeto é simples e contém os seguintes arquivos:

- **index.html**: O arquivo HTML que contém a estrutura básica do jogo.
- **script.js**: O arquivo JavaScript que contém toda a lógica do jogo, incluindo a movimentação do pássaro, a criação e movimentação dos canos, e a detecção de colisões.
- **images/**: Pasta contendo as imagens necessárias para o jogo, como o pássaro, o fundo, os canos e o chão.
- **sounds/**: Pasta contendo os arquivos de som, como o som de voo, colisão e pontuação.

## Tecnologias Utilizadas

- **HTML5**: Utilizado para estruturar a página e criar o canvas onde o jogo é renderizado.
- **CSS**: Estilização simples para centralizar o canvas na página.
- **JavaScript**: A lógica do jogo é implementada em JavaScript, utilizando o contexto do canvas para desenhar e animar o jogo.
- **Canvas API**: Usado para desenhar o pássaro, os canos, o fundo e os outros elementos do jogo no navegador.

## Aprendizado Durante o Desenvolvimento

### 1. **Manipulação do Canvas:**
   - Aprendi como usar a API do Canvas do HTML5 para desenhar imagens, formas e texto de forma dinâmica no navegador. Isso inclui como manipular o contexto do canvas para criar animações e interações visuais.
   - Aplicação da razão de aspecto 9:16 para adaptação em diferentes telas.
   - Através do `getBoundingClientRect()`, aprendi como posicionar elementos (como o botão) com base no canvas renderizado.

### 2. **Controle de Animações:**
   - Através do `requestAnimationFrame()`, aprendi como criar loops de animação eficientes e sincronizados com a taxa de atualização do navegador, o que torna o jogo mais fluido e melhora o desempenho.

### 3. **Interatividade com o Usuário:**
   - Aprendi a capturar eventos de teclado e de clique no mouse para interagir com o jogo. No caso do **Flappy Bird**, a interação é usada para fazer o pássaro subir ao pressionar uma tecla ou clicar na tela.

### 4. **Física Simples de Jogo:**
   - Aprendi como implementar a física básica de queda livre (gravidade) no jogo. A aceleração da queda é controlada por uma constante que aplica gravidade sobre a posição vertical do pássaro, criando uma sensação de movimento realista.

### 5. **Detecção de Colisões:**
   - O código faz uso de cálculos de colisão para verificar quando o pássaro colide com um cano ou com o chão. Aprendi como usar limites de bounding box para verificar as colisões entre os objetos.

### 6. **Lógica de Jogo:**
   - Desenvolver o fluxo do jogo, incluindo as verificações de colisão, a pontuação e a exibição da tela de **Game Over**, me ensinou como estruturar a lógica de um jogo interativo.

### 7. **Gerenciamento de Estado do Jogo:**
   - O conceito de gerenciar diferentes estados do jogo (jogo ativo, game over) e alternar entre esses estados para atualizar o que é mostrado na tela foi uma parte crucial do desenvolvimento do jogo.

### 8. **Reinício do Jogo:**
   - Aprendi como resetar o estado do jogo (como as posições e variáveis) e como reutilizar o loop de animação para reiniciar o jogo sem recarregar a página.

## Conclusão

Este projeto foi uma ótima maneira de aprender sobre como desenvolver um jogo simples usando **JavaScript** e a **Canvas API**. Durante o desenvolvimento, consegui adquirir uma compreensão sólida de como funciona a lógica básica de um jogo, além de aprender sobre animações, interatividade, e como lidar com eventos de usuário em tempo real.

Conecte-se comigo no LinkedIn: https://www.linkedin.com/in/cesar-fontanella/
