<template>
  <div class="overview">
    <div class="nav-bar">
      <button class="back-btn" @click="goHome">← 返回首页</button>
      <h1 class="page-title">皇宫核心数据总览</h1>
    </div>

    <div class="carousel-wrapper">
      <div class="carousel-container">
        <div class="carousel-track" :style="trackStyle">
          <div
            v-for="palace in palaces"
            :key="palace.id"
            class="carousel-slide"
          >
            <div class="data-card">
              <div
                class="card-image"
                :style="{
                  backgroundImage: `url(${getPalaceImage(palace.name)})`,
                }"
              >
                <div class="image-overlay"></div>
              </div>
              <h3 class="card-title">{{ palace.name }}</h3>
              <div class="card-content">
                <p><span class="label">朝代：</span>{{ palace.dynasty }}</p>
                <p>
                  <span class="label">占地面积：</span
                  >{{ palace.area }} 万平方米
                </p>
                <p>
                  <span class="label">房屋数量：</span>{{ palace.houses }} 间
                </p>
                <p>
                  <span class="label">始建：</span
                  >{{ Math.abs(palace.startYear)
                  }}{{ palace.startYear < 0 ? "BC" : "" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          class="carousel-btn prev-btn"
          @click="prevSlide"
          :disabled="isAnimating"
        >
          <span class="btn-icon">‹</span>
        </button>

        <button
          class="carousel-btn next-btn"
          @click="nextSlide"
          :disabled="isAnimating"
        >
          <span class="btn-icon">›</span>
        </button>

        <div class="carousel-indicators">
          <button
            v-for="(palace, index) in palaces"
            :key="palace.id"
            :class="['indicator', { active: currentIndex === index }]"
            @click="goToSlide(index)"
          ></button>
        </div>

        <div class="slide-counter">
          <span class="current">{{
            String(currentIndex + 1).padStart(2, "0")
          }}</span>
          <span class="separator">/</span>
          <span class="total">{{
            String(palaces.length).padStart(2, "0")
          }}</span>
        </div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-container card">
        <h2 class="section-title">皇宫占地面积对比</h2>
        <div ref="barChartRef" class="chart"></div>
      </div>
      <div class="chart-container card">
        <h2 class="section-title">皇宫房屋数量对比</h2>
        <div ref="houseChartRef" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import { palaceApi } from "@/api";

const router = useRouter();
const palaces = ref([]);
const loading = ref(true);
const defaultImage =
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80";
const barChartRef = ref(null);
const houseChartRef = ref(null);
let barChart = null;
let houseChart = null;

const palaceImageMap = {
  明清紫禁城: new URL("../assets/images/明清紫禁城1.jpg", import.meta.url).href,
  唐代大明宫: new URL("../assets/images/唐代大明宫1.jpg", import.meta.url).href,
  元代大都皇宫: new URL("../assets/images/元代大都皇宫1.jpg", import.meta.url)
    .href,
  宋代东京皇宫: new URL("../assets/images/宋代东京皇宫1.jpg", import.meta.url)
    .href,
  汉代未央宫: new URL("../assets/images/未央宫1.jpg", import.meta.url).href,
  隋代大兴宫: new URL("../assets/images/隋代大兴宫1.jpg", import.meta.url).href,
};

const getPalaceImage = (palaceName) => {
  return palaceImageMap[palaceName] || defaultImage;
};

const currentIndex = ref(0);
const isAnimating = ref(false);
const transitionDuration = 400;

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transitionDuration: `${transitionDuration}ms`,
}));

const nextSlide = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  currentIndex.value = (currentIndex.value + 1) % palaces.value.length;
  setTimeout(() => {
    isAnimating.value = false;
  }, transitionDuration);
};

const prevSlide = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  currentIndex.value =
    (currentIndex.value - 1 + palaces.value.length) % palaces.value.length;
  setTimeout(() => {
    isAnimating.value = false;
  }, transitionDuration);
};

const goToSlide = (index) => {
  if (isAnimating.value || index === currentIndex.value) return;
  isAnimating.value = true;
  currentIndex.value = index;
  setTimeout(() => {
    isAnimating.value = false;
  }, transitionDuration);
};

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await palaceApi.getPalaces();

    if (
      response?.data?.code === 200 &&
      response?.data?.data?.palaces?.length > 0
    ) {
      palaces.value = response.data.data.palaces;
    } else {
      const { palaceData } = await import("@/api/mockData.js");
      palaces.value = palaceData.palaces;
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    try {
      const { palaceData } = await import("@/api/mockData.js");
      palaces.value = palaceData.palaces;
    } catch (e) {
      console.error("加载mock数据失败:", e);
    }
  } finally {
    loading.value = false;
    nextTick(() => {
      initBarChart();
      initHouseChart();
    });
  }
};

const goHome = () => {
  router.push("/");
};

const initBarChart = () => {
  if (!barChartRef.value) return;
  if (palaces.value.length === 0) return;

  if (barChart) {
    barChart.dispose();
  }

  try {
    barChart = echarts.init(barChartRef.value);
    const option = {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "value",
        axisLabel: {
          color: "#FFD700",
          fontFamily: '"Noto Serif SC", "SimSun", sans-serif',
        },
        axisLine: { lineStyle: { color: "#DAA520" } },
      },
      yAxis: {
        type: "category",
        data: palaces.value.map((p) => p.name),
        axisLabel: {
          color: "#FFD700",
          fontFamily: '"Noto Serif SC", "SimSun", sans-serif',
        },
        axisLine: { lineStyle: { color: "#DAA520" } },
      },
      series: [
        {
          name: "占地面积",
          type: "bar",
          data: palaces.value.map((p) => p.area),
          label: {
            show: true,
            color: "#FFD700",
            fontFamily: '"Noto Serif SC", "SimSun", sans-serif',
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#8B0000" },
              { offset: 1, color: "#DAA520" },
            ]),
          },
        },
      ],
    };
    barChart.setOption(option);
  } catch (e) {
    console.error("初始化barChart失败:", e);
  }
};

const initHouseChart = () => {
  if (!houseChartRef.value) return;
  if (palaces.value.length === 0) return;

  if (houseChart) {
    houseChart.dispose();
  }

  try {
    houseChart = echarts.init(houseChartRef.value);
    const option = {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: {
        type: "value",
        axisLabel: {
          color: "#FFD700",
          fontFamily: '"Noto Serif SC", "SimSun", sans-serif',
        },
        axisLine: { lineStyle: { color: "#DAA520" } },
      },
      yAxis: {
        type: "category",
        data: palaces.value.map((p) => p.name),
        axisLabel: {
          color: "#FFD700",
          fontFamily: '"Noto Serif SC", "SimSun", sans-serif',
        },
        axisLine: { lineStyle: { color: "#DAA520" } },
      },
      series: [
        {
          name: "房屋数量",
          type: "bar",
          data: palaces.value.map((p) => p.houses),
          label: {
            show: true,
            color: "#FFD700",
            fontFamily: '"Noto Serif SC", "SimSun", sans-serif',
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#DAA520" },
              { offset: 1, color: "#FFD700" },
            ]),
          },
        },
      ],
    };
    houseChart.setOption(option);
  } catch (e) {
    console.error("初始化houseChart失败:", e);
  }
};

const handleResize = () => {
  barChart?.resize();
  houseChart?.resize();
};

onMounted(() => {
  fetchData();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  barChart?.dispose();
  houseChart?.dispose();
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 25px;
  min-height: 100vh;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.back-btn {
  background: linear-gradient(90deg, #8b0000, #b22222);
  color: #ffd700;
  border: 2px solid #daa520;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: linear-gradient(90deg, #b22222, #8b0000);
  box-shadow: 0 4px 15px rgba(139, 0, 0, 0.4);
  transform: translateX(-3px);
}

.page-title {
  color: #daa520;
  font-size: 28px;
  margin: 0;
  font-family: "SimSun", "STSong", serif;
}

.data-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.carousel-wrapper {
  width: 100%;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
}

.carousel-track {
  display: flex;
  will-change: transform;
}

.carousel-slide {
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.carousel-slide .data-card {
  max-width: 600px;
  width: 100%;
  padding: 30px;
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
  border: 2px solid #daa520;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.carousel-slide .card-image {
  width: 100%;
  height: 250px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(139, 0, 0, 0.8);
  border: 2px solid #daa520;
  color: #ffd700;
  font-size: 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(218, 165, 32, 0.9);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 20px rgba(218, 165, 32, 0.5);
}

.carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
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

.slide-counter {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
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

.data-card {
  padding: 20px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid transparent;
  border-radius: 12px;
}

.card-image {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.6) 100%);
  border-radius: 8px;
}

.card-title {
  color: #daa520;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
  border-bottom: 1px solid #8b0000;
  padding-bottom: 8px;
}

.card-content p {
  color: #fff8dc;
  margin: 8px 0;
  font-size: 14px;
}

.label {
  color: #ffd700;
  font-weight: bold;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  width: 100%;
}

.chart-container {
  padding: 20px;
  background: rgba(30, 25, 20, 0.95);
  border: 2px solid rgba(218, 165, 32, 0.4);
  border-radius: 12px;
  min-height: 450px;
  display: flex;
  flex-direction: column;
}

.chart {
  width: 100%;
  height: 400px;
  min-width: 300px;
  flex: 1;
}

.section-title {
  color: var(--color-yellow-light);
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid var(--color-red);
  padding-bottom: 10px;
  font-family: "SimSun", "STSong", serif;
}

@media (max-width: 768px) {
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }

  .carousel-slide {
    padding: 20px;
  }

  .carousel-slide .data-card {
    padding: 20px;
    margin: 0 40px;
  }

  .carousel-slide .card-image {
    height: 180px;
  }

  .slide-counter {
    font-size: 14px;
    padding: 6px 12px;
  }

  .carousel-indicators {
    gap: 8px;
    bottom: 15px;
  }

  .indicator {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  .carousel-btn {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }

  .carousel-slide .data-card {
    margin: 0 30px;
  }

  .carousel-slide .card-image {
    height: 150px;
  }
}
</style>
