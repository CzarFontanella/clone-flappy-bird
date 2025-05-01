// =================== CONFIGURAÇÃO ===================
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// =================== IMAGENS ===================
var bird = new Image();
bird.src = "images/bird.png";

var bg = new Image();
bg.src = "images/bg.png";

var chao = new Image();
chao.src = "images/chao.png";

var canocima = new Image();
canocima.src = "images/canocima.png";

var canobaixo = new Image();
canobaixo.src = "images/canobaixo.png";

// =================== SONS ===================
var fly = new Audio();
fly.src = "sounds/fly.mp3";

var scor = new Audio();
scor.src = "sounds/score.mp3";

var hit = new Audio();
hit.src = "sounds/hit.mp3";

// =================== VARIÁVEIS ===================
var eec = 100;
var constant;
var bX = 33;
var bY = 200;
var velocityY = 0;
var gravity = 0.35;
var jump = -6.5;
var maxFallSpeed = 10;
var score = 0;
var rotation = 0;
var jogoAtivo = true;
var terminouQueda = false; // Controle da queda após o fim do jogo

var cano = [];
cano[0] = {
	x: canvas.width,
	y: 0
};

// =================== EVENTOS ===================
document.addEventListener("keydown", function () {
	if (jogoAtivo) voa();
});
canvas.addEventListener("click", function (e) {
	if (!jogoAtivo) {
		var rect = canvas.getBoundingClientRect();
		var clickX = e.clientX - rect.left;
		var clickY = e.clientY - rect.top;

		// Botão de recomeçar
		if (clickX >= canvas.width / 2 - 60 &&
			clickX <= canvas.width / 2 + 60 &&
			clickY >= canvas.height / 2 + 30 &&
			clickY <= canvas.height / 2 + 70) {
			reiniciarJogo();
		}
	}
});

// Função para fazer o pássaro voar
function voa() {
	velocityY = jump;
	fly.play();
}

// =================== LOOP DO JOGO ===================
function jogo() {
	// Limpa o canvas antes de desenhar novamente
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Fundo
	ctx.drawImage(bg, 0, 0);

	// Lógica dos canos
	for (let i = 0; i < cano.length; i++) {
		constant = canocima.height + eec;

		// Desenha os canos
		ctx.drawImage(canocima, cano[i].x, cano[i].y);
		ctx.drawImage(canobaixo, cano[i].x, cano[i].y + constant);
		cano[i].x--; // Move os canos para a esquerda

		// Gera novo cano quando o atual chega na posição X 125
		if (cano[i].x === 125) {
			cano.push({
				x: canvas.width,
				y: Math.floor(Math.random() * canocima.height) - canocima.height
			});
		}

		// ======= COLISÃO MELHORADA COM MARGEM =======
		var margem = 5; // Reduz a área de colisão para mais justiça
		var birdLeft = bX + margem;
		var birdRight = bX + bird.width - margem;
		var birdTop = bY + margem;
		var birdBottom = bY + bird.height - margem;

		var canoBottomY = cano[i].y + constant;

		// Colisão com canos
		if (
			birdRight >= cano[i].x &&
			birdLeft <= cano[i].x + canocima.width &&
			(birdTop <= cano[i].y + canocima.height ||
				birdBottom >= canoBottomY)
		) {
			jogoAtivo = false;
			hit.play(); // Reproduz som de colisão
		}

		// Pontuação ao passar por um cano
		if (cano[i].x === 5) {
			score++;
			scor.play();
		}
	}

	// Colisão com o chão
	if (bY + bird.height >= canvas.height - chao.height) {
		jogoAtivo = false;
		hit.play(); // Reproduz som de colisão
	}

	// Desenha o chão
	ctx.drawImage(chao, 0, canvas.height - chao.height);

	// Se o jogo estiver ativo, aplica a física do pássaro
	if (jogoAtivo) {
		velocityY += gravity; // Aplica gravidade
		if (velocityY > maxFallSpeed) velocityY = maxFallSpeed;
		bY += velocityY; // Atualiza posição
	} else {
		// Se o jogo acabou, o pássaro vai cair abruptamente
		if (!terminouQueda) {
			velocityY = 12; // Velocidade de queda mais rápida após o fim do jogo
			bY += velocityY; // Atualiza a posição para cair abruptamente
			// Se o pássaro ultrapassar o limite do chão
			if (bY > canvas.height) {
				terminouQueda = true; // Indica que o pássaro já passou do chão e pode mostrar Game Over
			}
		}
	}

	// Inclinação do pássaro de acordo com a velocidade
	rotation = Math.min(Math.PI / 4, velocityY / 10);

	// Desenha o pássaro com rotação
	ctx.save(); // Salva o estado atual do canvas
	ctx.translate(bX + bird.width / 2, bY + bird.height / 2); // Move a origem para o centro do pássaro
	ctx.rotate(rotation); // Aplica rotação
	ctx.drawImage(bird, -bird.width / 2, -bird.height / 2); // Desenha o pássaro rotacionado
	ctx.restore(); // Restaura o estado original

	// =================== DESENHAR O PLACAR ===================
	// Desenha o texto do placar dentro do painel
	ctx.fillStyle = "#ffffff"; // Cor do texto
	ctx.font = "20px Verdana";
	ctx.textAlign = "left";
	ctx.fillText("Placar: " + score, 20, 35); // Exibe o placar

	// =================== GAME OVER ===================
	if (!jogoAtivo && terminouQueda) {
		// Tela escura
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Texto "Game Over"
		ctx.fillStyle = "#fff";
		ctx.font = "30px Verdana";
		ctx.textAlign = "center";
		ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);

		// Texto de pontuação final
		ctx.font = "20px Verdana";
		ctx.fillText("Pontuação: " + score, canvas.width / 2, canvas.height / 2 + 5);

		// Botão azul de recomeçar
		ctx.fillStyle = "#00f";
		ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2 + 30, 120, 40);

		// Texto dentro do botão
		ctx.fillStyle = "#fff";
		ctx.font = "18px Verdana";
		ctx.fillText("Recomeçar", canvas.width / 2, canvas.height / 2 + 57);
	} else {
		// Continua o jogo se ainda estiver ativo
		requestAnimationFrame(jogo);
	}
}

// =================== REINICIAR JOGO ===================

// Reseta todas as variáveis e reinicia o loop
function reiniciarJogo() {
	// Reinicia variáveis do jogo
	bY = 200;
	velocityY = 0;
	score = 0;
	rotation = 0;
	cano = [];
	cano[0] = {
		x: canvas.width,
		y: 0
	};
	jogoAtivo = true;
	terminouQueda = false; // Reseta o estado de queda

	// Limpa o canvas antes de iniciar o jogo
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Começa o loop de animação novamente
	requestAnimationFrame(jogo);
}

// =================== INICIA JOGO ===================
jogo();
