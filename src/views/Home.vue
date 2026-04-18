<template>
  <div class="home">
    <ParticleBackground>
      <div class="hero-section">
        <div class="hero-content">
          <div class="brand-badge">Palace Vista</div>
          <h1 class="hero-title">
            <span class="title-line">中华宫殿</span>
            <span class="title-accent">数字孪生</span>
            <span class="title-line">可视化平台</span>
          </h1>
          <p class="hero-description">
            融合AI智能与数据可视化技术，呈现中国古代宫殿文明的辉煌与沧桑
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-value">6</span>
              <span class="stat-label">历史宫殿</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">5000+</span>
              <span class="stat-label">历史年份</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">7</span>
              <span class="stat-label">可视化模块</span>
            </div>
          </div>
        </div>
      </div>

      <div class="carousel-section">
        <Carousel
          :slides="carouselSlides"
          :autoplay="true"
          :interval="6000"
          @slide-change="handleCarouselSlideChange"
          @action="handleCarouselAction"
        />
      </div>

      <div class="platform-section">
        <div class="section-header">
          <h2 class="section-title">🗺️ 平台核心模块</h2>
          <p class="section-subtitle">选择您想要探索的内容</p>
        </div>

        <div class="platform-grid">
          <div
            class="platform-card card"
            :class="{ active: activeCard === 0 }"
            @click="navigateTo('/interactive')"
            @mouseenter="activeCard = 0"
          >
            <div class="card-bg-icon">🖥️</div>
            <div class="card-content">
              <h3 class="card-title">平台功能导览</h3>
              <p class="card-desc">7大可视化模块与3D交互展示</p>
              <ul class="card-features">
               
                <li>🏛️ 建筑规制</li>
                <li>🔨 工艺材料</li>
                <li>🌟 成就影响</li>
                 <li>📈 数据可视化</li>
              </ul>
            </div>
            <div class="card-footer">
              <span class="card-tag blue">功能丰富</span>
              <span class="card-enter">进入 →</span>
            </div>
          </div>

          <div
            class="platform-card card map-card"
            :class="{ active: activeCard === 1 }"
            @mouseenter="activeCard = 1"
          >
            <PalaceMapCard @enter="navigateTo('/palace-map')" />
          </div>

          <div
            class="platform-card card"
            :class="{ active: activeCard === 2 }"
            @click="navigateTo('/data-sources')"
            @mouseenter="activeCard = 2"
          >
            <div class="card-bg-icon">📚</div>
            <div class="card-content">
              <h3 class="card-title">数据来源</h3>
              <p class="card-desc">了解数据采集与研究方法</p>
              <ul class="card-features">
                <li>📖 正史文献</li>
                <li>🏛️ 考古报告</li>
                <li>💾 文物档案</li>
                <li>🤝 合作机构</li>
              </ul>
            </div>
            <div class="card-footer">
              <span class="card-tag green">学术权威</span>
              <span class="card-enter">进入 →</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-section">
        <p class="footer-text">
          © 2026 中华宫殿数字孪生可视化平台 | 技术支持：AI +
          数据可视化
        </p>
      </div>
    </ParticleBackground>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ParticleBackground from "../components/ParticleBackground.vue";
import Carousel from "../components/Carousel.vue";
import PalaceMapCard from "../components/PalaceMapCard.vue";
import { palaceData } from "../api/mockData.js";

const router = useRouter();
const route = useRoute();
const activeCard = ref(0);

const carouselSlides = ref([
  {
    id: 1,
    title: "明清紫禁城",
    description:
      "世界现存规模最大、保存最为完整的木质结构古建筑群，是中国古代宫廷文化的巅峰之作。",
    buttonText: "探索详情",
    palaceId: 1,
    background:
      "linear-gradient(135deg, rgba(139, 0, 0, 0.8), rgba(0, 0, 0, 0.8))",
    icon: "🏯",
  },
  {
    id: 2,
    title: "唐代大明宫",
    description:
      "盛唐时期的皇宫典范，中国古代宫殿建筑的巅峰之作，见证了唐朝的繁荣与辉煌。",
    buttonText: "探索详情",
    palaceId: 2,
    background:
      "linear-gradient(135deg, rgba(218, 165, 32, 0.8), rgba(0, 0, 0, 0.8))",
    icon: "⛩️",
  },
  {
    id: 3,
    title: "隋代大兴宫",
    description: "隋唐盛世的开端，中国古代宫殿建筑从秦汉向盛唐过渡的重要见证。",
    buttonText: "探索详情",
    palaceId: 6,
    background:
      "linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(0, 0, 0, 0.8))",
    icon: "🏛️",
  },
  {
    id: 4,
    title: "汉代未央宫",
    description:
      "丝绸之路的起点，西汉帝国的政治文化中心，中国古代宫殿的典范之作。",
    buttonText: "探索详情",
    palaceId: 5,
    background:
      "linear-gradient(135deg, rgba(75, 0, 130, 0.8), rgba(0, 0, 0, 0.8))",
    icon: "🎋",
  },
  {
    id: 5,
    title: "宋代东京皇宫",
    description: "繁华市井与皇家园林的完美融合，展现了宋代高度发达的城市文明。",
    buttonText: "探索详情",
    palaceId: 4,
    background:
      "linear-gradient(135deg, rgba(0, 100, 0, 0.8), rgba(0, 0, 0, 0.8))",
    icon: "🏮",
  },
  {
    id: 6,
    title: "元代大都皇宫",
    description:
      "元朝帝国的政治中心，展现了蒙古族与汉族文化交融的独特建筑风格。",
    buttonText: "探索详情",
    palaceId: 3,
    background:
      "linear-gradient(135deg, rgba(0, 0, 139, 0.8), rgba(0, 0, 0, 0.8))",
    icon: "🎎",
  },
]);

const currentCarouselIndex = ref(0);

const handleCarouselAction = (index) => {
  currentCarouselIndex.value = index;
  const palaceId = carouselSlides.value[index].palaceId;
  router.push(`/palace/${palaceId}`);
};

const handleCarouselSlideChange = (index) => {
  currentCarouselIndex.value = index;
};

const navigateTo = (path) => {
  router.push(path);
};

onMounted(() => {
  if (route.path === "/interactive") {
    activeCard.value = 0;
  } else if (route.path === "/data-sources") {
    activeCard.value = 2;
  }
});
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #1a1512;
}

.hero-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  position: relative;
}

.hero-content {
  text-align: center;
  max-width: 900px;
  z-index: 10;
}

.brand-badge {
  display: inline-block;
  padding: 10px 28px;
  background: linear-gradient(
    135deg,
    rgba(139, 0, 0, 0.3),
    rgba(218, 165, 32, 0.2)
  );
  border: 2px solid #daa520;
  border-radius: 4px;
  color: #daa520;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 4px;
  margin-bottom: 40px;
  font-family: "Noto Serif SC", serif;
  text-transform: uppercase;
  animation: fadeInDown 1s ease;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 0 40px 0;
  font-size: 52px;
  line-height: 1.3;
  font-family: "Noto Serif SC", "SimSun", serif;
}

.title-line {
  color: #f5f0e8;
  opacity: 0;
  animation: fadeInUp 1s ease forwards;
}

.title-accent {
  color: #daa520;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(218, 165, 32, 0.3);
  opacity: 0;
  animation: fadeInUp 1s ease 0.3s forwards;
}

.title-line:nth-child(3) {
  animation-delay: 0.6s;
}

.hero-description {
  color: rgba(245, 240, 232, 0.75);
  font-size: 18px;
  line-height: 1.9;
  margin: 0 0 50px 0;
  opacity: 0;
  animation: fadeInUp 1s ease 0.9s forwards;
  font-family: "Noto Serif SC", serif;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 80px;
  opacity: 0;
  animation: fadeInUp 1s ease 1.2s forwards;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stat-value {
  font-size: 44px;
  font-weight: bold;
  color: #daa520;
  font-family: "Noto Serif SC", serif;
  text-shadow: 0 2px 6px rgba(218, 165, 32, 0.2);
}

.stat-label {
  font-size: 14px;
  color: rgba(245, 240, 232, 0.6);
  letter-spacing: 3px;
  font-family: "Noto Serif SC", serif;
}

.carousel-section {
  padding: 0 40px 60px;
  position: relative;
  z-index: 10;
}

.platform-section {
  padding: 80px 40px;
  position: relative;
  z-index: 10;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  color: #daa520;
  font-size: 32px;
  margin: 0 0 15px 0;
  font-weight: bold;
  font-family: "Noto Serif SC", serif;
  letter-spacing: 6px;
}

.section-subtitle {
  color: rgba(245, 240, 232, 0.65);
  font-size: 16px;
  margin: 0;
  font-family: "Noto Serif SC", serif;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.platform-card {
  position: relative;
  padding: 30px;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.4s ease;
  overflow: hidden;
  background: rgba(30, 25, 20, 0.95);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 8px;
}

.platform-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(139, 0, 0, 0.08),
    rgba(218, 165, 32, 0.05)
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.platform-card:hover::before,
.platform-card.active::before {
  opacity: 1;
}

.platform-card:hover,
.platform-card.active {
  transform: translateY(-8px);
  border-color: rgba(218, 165, 32, 0.6);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.card-bg-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 70px;
  opacity: 0.12;
  transition: all 0.4s ease;
}

.platform-card:hover .card-bg-icon {
  opacity: 0.2;
  transform: scale(1.05);
}

.card-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.card-title {
  color: #daa520;
  font-size: 22px;
  margin: 0 0 14px 0;
  font-family: "Noto Serif SC", "SimSun", serif;
  letter-spacing: 2px;
}

.card-desc {
  color: rgba(245, 240, 232, 0.7);
  font-size: 14px;
  line-height: 1.7;
  margin: 0 0 20px 0;
  font-family: "Noto Serif SC", serif;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-features li {
  color: rgba(245, 240, 232, 0.75);
  font-size: 13px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(218, 165, 32, 0.1);
  font-family: "Noto Serif SC", serif;
}

.card-features li:last-child {
  border-bottom: none;
}

.map-preview {
  width: 100%;
  height: 280px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(218, 165, 32, 0.25);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(218, 165, 32, 0.15);
  position: relative;
  z-index: 2;
}

.card-tag {
  padding: 5px 14px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  font-family: "Noto Serif SC", serif;
  letter-spacing: 1px;
}

.card-tag.blue {
  background: rgba(65, 105, 225, 0.25);
  color: #a8b4f0;
  border: 1px solid rgba(65, 105, 225, 0.4);
}

.card-tag.gold {
  background: rgba(218, 165, 32, 0.25);
  color: #ffd700;
  border: 1px solid rgba(218, 165, 32, 0.4);
}

.card-tag.green {
  background: rgba(76, 109, 68, 0.25);
  color: #b8c9a8;
  border: 1px solid rgba(76, 109, 68, 0.4);
}

.card-enter {
  color: #daa520;
  font-size: 14px;
  font-weight: bold;
  transition: transform 0.3s ease;
  font-family: "Noto Serif SC", serif;
}

.platform-card:hover .card-enter {
  transform: translateX(4px);
}

.map-card {
  background: linear-gradient(
    180deg,
    rgba(26, 21, 18, 0.95),
    rgba(20, 16, 12, 0.98)
  );
  border-color: rgba(218, 165, 32, 0.35);
}

.footer-section {
  text-align: center;
  padding: 50px 40px;
  border-top: 1px solid rgba(218, 165, 32, 0.15);
  margin-top: 40px;
}

.footer-text {
  color: rgba(245, 240, 232, 0.45);
  font-size: 13px;
  margin: 0;
  font-family: "Noto Serif SC", serif;
  letter-spacing: 1px;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .platform-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
  }

  .hero-title {
    font-size: 40px;
  }

  .hero-stats {
    gap: 50px;
  }

  .stat-value {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 20px;
    min-height: 50vh;
  }

  .hero-title {
    font-size: 30px;
  }

  .hero-description {
    font-size: 15px;
  }

  .hero-stats {
    flex-direction: column;
    gap: 30px;
  }

  .carousel-section,
  .platform-section {
    padding: 40px 20px;
  }

  .platform-card {
    min-height: 300px;
  }

  .card-bg-icon {
    font-size: 60px;
  }
}
</style>
