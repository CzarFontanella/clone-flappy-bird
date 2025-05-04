// =================== CONFIGURAÇÃO DO CANVAS ===================

// Obtemos o canvas e o contexto de renderização 2D
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Configurações de tamanho do canvas
canvas.width = 360;
canvas.height = 640;

// Razão de aspecto (9:16 para dispositivos móveis)
const aspectRatio = 9 / 16;

// Função para ajustar o tamanho do canvas de acordo com o tamanho da tela
function ajustarCanvas() {
	const alturaTela = window.innerHeight;
	const larguraTela = window.innerWidth;

	// Calcula a nova altura e largura proporcionalmente à razão de aspecto
	let novaAltura = alturaTela;
	let novaLargura = novaAltura * aspectRatio;

	// Se a largura exceder o limite da tela, ajustamos a largura e recalculamos a altura
	if (novaLargura > larguraTela) {
		novaLargura = larguraTela;
		novaAltura = novaLargura / aspectRatio;
	}

	// Aplica as novas dimensões ao canvas e centraliza na tela
	canvas.style.width = novaLargura + "px";
	canvas.style.height = novaAltura + "px";
	canvas.style.position = "absolute";
	canvas.style.left = ((larguraTela - novaLargura) / 2) + "px";
	canvas.style.top = ((alturaTela - novaAltura) / 2) + "px";

	// Atualiza o botão de reiniciar
	atualizarBotao();
}

// Eventos para ajustar o canvas quando a página carrega ou a tela é redimensionada
window.addEventListener("load", ajustarCanvas);
window.addEventListener("resize", ajustarCanvas);

// =================== CRIAÇÃO DO BOTÃO DE REINICIAR ===================

// Criamos o botão de reiniciar e o estilizamos
const restartButton = document.createElement("button");
restartButton.textContent = "Recomeçar";
restartButton.style.position = "absolute";
restartButton.style.display = "none";  // Inicialmente o botão está invisível
restartButton.style.zIndex = "10";
restartButton.style.background = "#00f";
restartButton.style.color = "#fff";
restartButton.style.border = "none";
restartButton.style.borderRadius = "12px";
restartButton.style.cursor = "pointer";
document.body.appendChild(restartButton);

// Função para atualizar o tamanho e a posição do botão com base no canvas
function atualizarBotao() {
	const rect = canvas.getBoundingClientRect();
	const botaoLargura = rect.width * 0.4;
	const botaoAltura = rect.height * 0.07;
	const fonteTamanho = rect.height * 0.025;

	restartButton.style.width = `${botaoLargura}px`;
	restartButton.style.height = `${botaoAltura}px`;
	restartButton.style.left = `${rect.left + rect.width / 2 - botaoLargura / 2}px`;
	restartButton.style.top = `${rect.top + rect.height / 2 + rect.height * 0.1}px`;
	restartButton.style.font = `${fonteTamanho}px Verdana`;
}

// Evento para reiniciar o jogo quando o botão for clicado
restartButton.addEventListener("click", () => {
	reiniciarJogo();
	restartButton.style.display = "none";
});

// =================== ESCALAS ===================

// Função para escalar valores conforme o tamanho do canvas
const baseWidth = 360;
const baseHeight = 640;
function escalar(valor, base, alvo) {
	return valor * (alvo / base);
}

// =================== IMAGENS ===================

// Carregamento das imagens usadas no jogo (passaro, fundo, chão, canos)
var bird = new Image();
bird.src = "images/bird.png";

var bg = new Image();
bg.src = "images/bg.png";

var chao = new Image();
chao.src = "images/chao.png";

var cano = new Image();
cano.src = "images/canobaixo.png";

// =================== SONS ===================

// Carregamento dos sons do jogo (voo, pontuação, colisão)
var som_voo = new Audio();
som_voo.src = "sounds/fly.mp3";

var som_score = new Audio();
som_score.src = "sounds/score.mp3";

var som_colisao = new Audio();
som_colisao.src = "sounds/hit.mp3";

// =================== VARIÁVEIS ===================

// Definindo valores de variáveis importantes para o jogo, escaladas conforme a altura do canvas
var eec = escalar(100, baseHeight, canvas.height);
var constant;
var bX = escalar(33, baseWidth, canvas.width);  // Posição X do pássaro
var bY = escalar(200, baseHeight, canvas.height);  // Posição Y do pássaro
var velocityY = 0;  // Velocidade vertical do pássaro
var gravity = escalar(0.3, baseHeight, canvas.height);  // Gravidade
var jump = escalar(-6 , baseHeight, canvas.height);  // Força do pulo
var maxFallSpeed = escalar(10, baseHeight, canvas.height);  // Velocidade máxima de queda
var score = 0;  // Pontuação
var rotation = 0;  // Rotação do pássaro
var jogoAtivo = true;  // Controle do estado do jogo
var terminouQueda = false;  // Controle de término da queda
var alturaMinimaCano = escalar(-350, baseHeight, canvas.height);  // Altura mínima dos canos
var alturaMaximaCano = escalar(-50, baseHeight, canvas.height);  // Altura máxima dos canos
var gap = escalar(20, baseHeight, canvas.height);  // Distância entre os canos

var canos = [];

// =================== INICIALIZA O PRIMEIRO CANO ===================
// Adicionamos o primeiro cano com uma altura aleatória
let posY = Math.floor(Math.random() * (alturaMaximaCano - alturaMinimaCano + 1)) + alturaMinimaCano;

canos.push({
	x: canvas.width,  // Posição X do cano
	y: posY  // Posição Y do cano
});

// =================== EVENTOS ===================

// Eventos para detectar o voo (tecla pressionada ou clique do mouse)
document.addEventListener("keydown", function () {
	if (jogoAtivo) voa();
});

document.addEventListener("click", function () {
	if (jogoAtivo) voa();
});

// Função de voo: reseta a velocidade vertical do pássaro
function voa() {
	velocityY = jump;
	som_voo.play();
}

// =================== LOOP DO JOGO ===================
// Função principal que desenha o jogo e atualiza os elementos a cada frame
function jogo() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpa a tela

	// Desenha o fundo
	ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

	// Desenha os canos
	for (let i = 0; i < canos.length; i++) {
		let canoWidth = escalar(cano.width, baseWidth, canvas.width);
		let canoHeight = escalar(cano.height, baseHeight, canvas.height);
		constant = canoHeight + eec + gap;

		// Desenha o cano de cima (invertido)
		ctx.save();
		ctx.translate(canos[i].x + canoWidth / 2, canos[i].y + canoHeight / 2);
		ctx.scale(1, -1);
		ctx.drawImage(cano, -canoWidth / 2, -canoHeight / 2, canoWidth, canoHeight);
		ctx.restore();

		// Desenha o cano de baixo
		ctx.drawImage(cano, canos[i].x, canos[i].y + constant, canoWidth, canoHeight);

		canos[i].x--;  // Movimento do cano para a esquerda

		// Se o cano passou da posição X, adicionamos um novo cano
		if (canos[i].x === 125) {
			let posY = Math.floor(Math.random() * (alturaMaximaCano - alturaMinimaCano + 1)) + alturaMinimaCano;
			canos.push({
				x: canvas.width,
				y: posY
			});
		}

		// Verifica colisões entre o pássaro e os canos
		let margem = escalar(5, baseWidth, canvas.width);
		let birdW = escalar(bird.width, baseWidth, canvas.width);
		let birdH = escalar(bird.height, baseHeight, canvas.height);

		let birdLeft = bX + margem;
		let birdRight = bX + birdW - margem;
		let birdTop = bY + margem;
		let birdBottom = bY + birdH - margem;
		let canoBottomY = canos[i].y + constant;

		if (
			birdRight >= canos[i].x &&
			birdLeft <= canos[i].x + canoWidth &&
			(birdTop <= canos[i].y + canoHeight ||
				birdBottom >= canoBottomY)
		) {
			jogoAtivo = false;
			som_colisao.play();
		}

		// Incrementa a pontuação quando o pássaro passa pelos canos
		if (canos[i].x === 5) {
			score++;
			som_score.play();
		}
	}

	// Verifica se o pássaro colidiu com o chão
	let chaoAltura = escalar(chao.height, baseHeight, canvas.height);
	let birdH = escalar(bird.height, baseHeight, canvas.height);
	if (bY + birdH >= canvas.height - chaoAltura) {
		jogoAtivo = false;
		som_colisao.play();
	}

	// Desenha o chão
	ctx.drawImage(chao, 0, canvas.height - chaoAltura, canvas.width, chaoAltura);

	// Atualiza a posição do pássaro
	if (jogoAtivo) {
		velocityY += gravity;
		if (velocityY > maxFallSpeed) velocityY = maxFallSpeed;
		bY += velocityY;
	} else {
		// Se o jogo não estiver ativo, realiza a animação de queda
		if (!terminouQueda) {
			velocityY = escalar(12, baseHeight, canvas.height);
			bY += velocityY;
			if (bY > canvas.height) {
				terminouQueda = true;
				restartButton.style.display = "block";  // Exibe o botão de reiniciar
			}
		}
	}

	// Rotação do pássaro baseada na velocidade de queda
	rotation = Math.min(Math.PI / 4, velocityY / 10);

	let birdW = escalar(bird.width, baseWidth, canvas.width);
	birdH = escalar(bird.height, baseHeight, canvas.height);

	// Desenha o pássaro no canvas com a rotação
	ctx.save();
	ctx.translate(bX + birdW / 2, bY + birdH / 2);
	ctx.rotate(rotation);
	ctx.drawImage(bird, -birdW / 2, -birdH / 2, birdW, birdH);
	ctx.restore();

	// Exibe o placar na tela
	ctx.fillStyle = "#ffffff";
	ctx.font = escalar(20, baseHeight, canvas.height) + "px Verdana";
	ctx.textAlign = "left";
	ctx.fillText("Placar: " + score, escalar(20, baseWidth, canvas.width), escalar(35, baseHeight, canvas.height));

	// Exibe a tela de Game Over
	if (!jogoAtivo && terminouQueda) {
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "#fff";
		ctx.font = escalar(30, baseHeight, canvas.height) + "px Verdana";
		ctx.textAlign = "center";
		ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - escalar(60, baseHeight, canvas.height));

		ctx.font = escalar(20, baseHeight, canvas.height) + "px Verdana";
		ctx.fillText("Pontuação: " + score, canvas.width / 2, canvas.height / 2 - escalar(25, baseHeight, canvas.height));
	} else {
		// Continua o loop do jogo se o jogo estiver ativo
		requestAnimationFrame(jogo);
	}
}

// =================== REINICIAR JOGO ===================
// Função para reiniciar o jogo
function reiniciarJogo() {
	bY = escalar(200, baseHeight, canvas.height);
	velocityY = 0;
	score = 0;
	rotation = 0;
	canos = [];

	// Adiciona um novo cano
	let posY = Math.floor(Math.random() * (alturaMaximaCano - alturaMinimaCano + 1)) + alturaMinimaCano;

	canos.push({
		x: canvas.width,
		y: posY
	});
	jogoAtivo = true;
	terminouQueda = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	requestAnimationFrame(jogo);
}

// =================== INICIA JOGO ===================
// Inicia o loop do jogo
jogo();
