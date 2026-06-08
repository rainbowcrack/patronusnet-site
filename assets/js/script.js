// animacao de grafos 
const canvas = document.getElementById('canvas-grafos');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let pontos = [];
    const maxPontos = 45; 

    function redimensionar() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', redimensionar);
    redimensionar();

    class Ponto {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.raio = Math.random() * 2 + 1;
        }
        atualizar() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        desenhar() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
            ctx.fill();
        }
    }

    for (let i = 0; i < maxPontos; i++) {
        pontos.push(new Ponto());
    }

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // desenha as arestas
        for (let i = 0; i < pontos.length; i++) {
            for (let j = i + 1; j < pontos.length; j++) {
                const dist = Math.hypot(pontos[i].x - pontos[j].x, pontos[i].y - pontos[j].y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(pontos[i].x, pontos[i].y);
                    ctx.lineTo(pontos[j].x, pontos[j].y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 - (dist / 120) * 0.15})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            pontos[i].atualizar();
            pontos[i].desenhar();
        }
        requestAnimationFrame(animar);
    }
    animar();
}

// dinamica do carrossel automatico 
const trilha = document.querySelector('.carrossel-trilha');
if (trilha) {
    const cardsOriginais = Array.from(trilha.children);
    cardsOriginais.forEach(card => {
        const duble = card.cloneNode(true);
        trilha.appendChild(duble);
    });
}