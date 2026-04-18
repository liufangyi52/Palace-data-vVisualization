<template>
  <div
    class="carousel-container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="carousel-track" :style="trackStyle">
      <div v-for="(slide, index) in slides" :key="index" class="carousel-slide">
        <div class="slide-content" :style="{ background: slide.background }">
          <div class="slide-overlay"></div>
          <div class="slide-text">
            <h2 class="slide-title">{{ slide.title }}</h2>
            <p class="slide-description">{{ slide.description }}</p>
            <button class="slide-button" @click="emit('action', currentIndex)">
              {{ slide.buttonText }}
            </button>
          </div>
          <div class="slide-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-circle"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-nav">
      <button
        class="nav-button prev"
        @click="prevSlide"
        :disabled="isAnimating"
      >
        <span class="nav-icon">‹</span>
      </button>
      <div class="carousel-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          :class="['indicator', { active: currentIndex === index }]"
          @click="goToSlide(index)"
        ></button>
      </div>
      <button
        class="nav-button next"
        @click="nextSlide"
        :disabled="isAnimating"
      >
        <span class="nav-icon">›</span>
      </button>
    </div>

    <div class="carousel-progress">
      <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
    </div>

    <div class="slide-counter">
      <span class="current">{{
        String(currentIndex + 1).padStart(2, "0")
      }}</span>
      <span class="separator">/</span>
      <span class="total">{{ String(slides.length).padStart(2, "0") }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => [],
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 5000,
  },
  duration: {
    type: Number,
    default: 800,
  },
});

const emit = defineEmits(["slide-change", "action"]);

const currentIndex = ref(0);
const isAnimating = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
const progressWidth = ref(0);
let autoplayTimer = null;
let progressTimer = null;

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transitionDuration: `${props.duration}ms`,
}));

const nextSlide = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  currentIndex.value = (currentIndex.value + 1) % props.slides.length;
  emit("slide-change", currentIndex.value);
  resetAutoplay();
  setTimeout(() => {
    isAnimating.value = false;
  }, props.duration);
};

const prevSlide = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  currentIndex.value =
    (currentIndex.value - 1 + props.slides.length) % props.slides.length;
  emit("slide-change", currentIndex.value);
  resetAutoplay();
  setTimeout(() => {
    isAnimating.value = false;
  }, props.duration);
};

const goToSlide = (index) => {
  if (isAnimating.value || index === currentIndex.value) return;
  isAnimating.value = true;
  currentIndex.value = index;
  emit("slide-change", currentIndex.value);
  resetAutoplay();
  setTimeout(() => {
    isAnimating.value = false;
  }, props.duration);
};

const handleAction = (action) => {
  emit("action", action);
};

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  stopAutoplay();
};

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX;
  const diff = touchStartX.value - touchEndX.value;
  const threshold = 50;
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
};

const handleTouchEnd = () => {
  startAutoplay();
};

const startAutoplay = () => {
  if (!props.autoplay) return;
  stopAutoplay();

  let elapsed = 0;
  const step = 50;

  progressTimer = setInterval(() => {
    elapsed += step;
    progressWidth.value = (elapsed / props.interval) * 100;
  }, step);

  autoplayTimer = setInterval(() => {
    nextSlide();
    progressWidth.value = 0;
    elapsed = 0;
  }, props.interval);
};

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progressWidth.value = 0;
};

const resetAutoplay = () => {
  stopAutoplay();
  startAutoplay();
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.carousel-track {
  display: flex;
  height: 100%;
  will-change: transform;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.slide-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.slide-text {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
}

.slide-title {
  font-size: 48px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s ease forwards;
}

.slide-description {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 30px 0;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s ease 0.2s forwards;
}

.slide-button {
  padding: 15px 40px;
  font-size: 18px;
  background: linear-gradient(135deg, #daa520 0%, #ffd700 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s ease 0.4s forwards;
}

.slide-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(218, 165, 32, 0.5);
}

.slide-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-line {
  position: absolute;
  top: 50%;
  left: -100px;
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #daa520, transparent);
  animation: moveLine 3s ease-in-out infinite;
}

.decoration-circle {
  position: absolute;
  bottom: 20%;
  right: 10%;
  width: 150px;
  height: 150px;
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes moveLine {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(100px);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

.carousel-nav {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 10;
}

.nav-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(218, 165, 32, 0.5);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover:not(:disabled) {
  background: rgba(218, 165, 32, 0.3);
  transform: scale(1.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-indicators {
  display: flex;
  gap: 12px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #daa520;
  border-color: #fff;
  transform: scale(1.2);
}

.indicator:hover:not(.active) {
  background: rgba(255, 255, 255, 0.6);
}

.carousel-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #daa520, #ffd700);
  transition: width 0.05s linear;
}

.slide-counter {
  position: absolute;
  top: 30px;
  right: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  z-index: 10;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid rgba(218, 165, 32, 0.3);
}

.slide-counter .current {
  color: #daa520;
}

.slide-counter .separator {
  color: rgba(255, 255, 255, 0.5);
  margin: 0 8px;
}

.slide-counter .total {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .carousel-container {
    min-height: 400px;
  }

  .slide-content {
    padding: 30px 20px;
  }

  .slide-title {
    font-size: 28px;
  }

  .slide-description {
    font-size: 16px;
  }

  .slide-button {
    padding: 12px 30px;
    font-size: 16px;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .slide-counter {
    font-size: 18px;
    padding: 8px 16px;
  }
}

@media (max-width: 480px) {
  .carousel-nav {
    bottom: 20px;
    gap: 15px;
  }

  .indicator {
    width: 10px;
    height: 10px;
  }
}
</style>
