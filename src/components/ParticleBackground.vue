<template>
  <div class="particle-container" ref="containerRef">
    <canvas ref="canvasRef"></canvas>
    <div class="parallax-layers">
      <div
        class="parallax-layer layer-1"
        :style="{
          transform: `translate(${parallax.x * 0.2}px, ${parallax.y * 0.2}px)`,
        }"
      ></div>
      <div
        class="parallax-layer layer-2"
        :style="{
          transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)`,
        }"
      ></div>
      <div
        class="parallax-layer layer-3"
        :style="{
          transform: `translate(${parallax.x * 0.6}px, ${parallax.y * 0.6}px)`,
        }"
      ></div>
    </div>
    <div class="gradient-overlay"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const containerRef = ref(null);
const canvasRef = ref(null);
const parallax = ref({ x: 0, y: 0 });

let animationId = null;
let particles = [];
let ctx = null;

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.color = this.getRandomColor();
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }

  getRandomColor() {
    const colors = [
      "rgba(218, 165, 32, ", // 金色
      "rgba(255, 215, 0, ", // 明黄
      "rgba(139, 0, 0, ", // 朱红
      "rgba(255, 255, 255, ", // 白色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;

    if (this.life > this.maxLife) {
      this.reset();
    }

    this.opacity = 0.3 + Math.sin((this.life / this.maxLife) * Math.PI) * 0.5;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color + this.opacity + ")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color + "0.5)";
    ctx.fill();
    ctx.restore();
  }
}

const initParticles = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  ctx = canvas.getContext("2d");

  const particleCount = Math.min(
    100,
    Math.floor((canvas.width * canvas.height) / 15000),
  );

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas));
  }
};

const animate = () => {
  if (!ctx) return;

  const canvas = canvasRef.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw(ctx);
  });

  drawConnections();

  animationId = requestAnimationFrame(animate);
};

const drawConnections = () => {
  const maxDistance = 80;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.08;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(218, 165, 32, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
};

const handleMouseMove = (event) => {
  const container = containerRef.value;
  const rect = container.getBoundingClientRect();

  parallax.value.x = event.clientX - rect.left - rect.width / 2;
  parallax.value.y = event.clientY - rect.top - rect.height / 2;
};

const handleResize = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;

  if (!canvas || !container) return;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
};

onMounted(() => {
  initParticles();
  animate();

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.particle-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #1a1512 0%,
    #2a1f18 40%,
    #1a1512 60%,
    #0f0a08 100%
  );
}

.particle-container canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.6;
}

.parallax-layers {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.parallax-layer {
  position: absolute;
  inset: -50px;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease-out;
}

.layer-1 {
  background: radial-gradient(
    ellipse 80% 60% at 50% 30%,
    rgba(218, 165, 32, 0.08) 0%,
    transparent 60%
  );
  filter: blur(60px);
}

.layer-2 {
  background: radial-gradient(
    ellipse 60% 80% at 30% 60%,
    rgba(139, 0, 0, 0.06) 0%,
    transparent 50%
  );
  filter: blur(80px);
}

.layer-3 {
  background: radial-gradient(
    ellipse 100% 40% at 70% 80%,
    rgba(218, 165, 32, 0.05) 0%,
    transparent 50%
  );
  filter: blur(100px);
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 120% 100% at 50% 50%,
    transparent 0%,
    rgba(15, 10, 8, 0.5) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.parallax-layers :deep(*) {
  position: absolute;
  inset: 0;
}
</style>
