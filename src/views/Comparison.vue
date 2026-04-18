<template>
  <div class="comparison-page">
    <div class="nav-bar">
      <button class="back-btn" @click="goBack">← 返回首页</button>
      <h1 class="page-title">宫殿对比分析</h1>
    </div>

    <div class="comparison-controls">
      <div class="palace-selectors">
        <div class="selector-group">
          <label>宫殿 A：</label>
          <select v-model="selectedPalaceA" @change="updateComparison">
            <option value="">请选择宫殿</option>
            <option
              v-for="palace in palaces"
              :key="palace.id"
              :value="palace.id"
            >
              {{ palace.name }}
            </option>
          </select>
        </div>
        <div class="vs-badge">VS</div>
        <div class="selector-group">
          <label>宫殿 B：</label>
          <select v-model="selectedPalaceB" @change="updateComparison">
            <option value="">请选择宫殿</option>
            <option
              v-for="palace in palaces"
              :key="palace.id"
              :value="palace.id"
            >
              {{ palace.name }}
            </option>
          </select>
        </div>
      </div>
      <button class="swap-btn" @click="swapPalaces">交换对比</button>
    </div>

    <div class="comparison-content" v-if="palaceA && palaceB">
      <div class="comparison-header">
        <div class="palace-card-mini">
          <div
            class="palace-image"
            :style="{ backgroundImage: `url(${palaceA.image})` }"
          ></div>
          <h3>{{ palaceA.name }}</h3>
          <p class="dynasty">{{ palaceA.dynasty }}</p>
        </div>
        <div class="vs-indicator">VS</div>
        <div class="palace-card-mini">
          <div
            class="palace-image"
            :style="{ backgroundImage: `url(${palaceB.image})` }"
          ></div>
          <h3>{{ palaceB.name }}</h3>
          <p class="dynasty">{{ palaceB.dynasty }}</p>
        </div>
      </div>

      <div class="comparison-stats">
        <div class="stat-compare-row">
          <div class="stat-label">占地面积</div>
          <div class="stat-bars">
            <div class="bar-container">
              <div
                class="bar-fill palace-a"
                :style="{ width: getAreaWidth(palaceA) + '%' }"
              ></div>
              <span class="bar-value">{{ palaceA.area }}万㎡</span>
            </div>
            <div class="bar-container">
              <div
                class="bar-fill palace-b"
                :style="{ width: getAreaWidth(palaceB) + '%' }"
              ></div>
              <span class="bar-value">{{ palaceB.area }}万㎡</span>
            </div>
          </div>
          <div
            class="stat-winner"
            :class="getWinner('area', palaceA.area, palaceB.area)"
          >
            {{ getWinnerText("area", palaceA.area, palaceB.area) }}
          </div>
        </div>

        <div class="stat-compare-row">
          <div class="stat-label">房屋数量</div>
          <div class="stat-bars">
            <div class="bar-container">
              <div
                class="bar-fill palace-a"
                :style="{ width: getHousesWidth(palaceA) + '%' }"
              ></div>
              <span class="bar-value">{{ palaceA.houses }}间</span>
            </div>
            <div class="bar-container">
              <div
                class="bar-fill palace-b"
                :style="{ width: getHousesWidth(palaceB) + '%' }"
              ></div>
              <span class="bar-value">{{ palaceB.houses }}间</span>
            </div>
          </div>
          <div
            class="stat-winner"
            :class="getWinner('houses', palaceA.houses, palaceB.houses)"
          >
            {{ getWinnerText("houses", palaceA.houses, palaceB.houses) }}
          </div>
        </div>

        <div class="stat-compare-row">
          <div class="stat-label">使用时长</div>
          <div class="stat-bars">
            <div class="bar-container">
              <div
                class="bar-fill palace-a"
                :style="{ width: getDurationWidth(palaceA) + '%' }"
              ></div>
              <span class="bar-value">{{ getDuration(palaceA) }}</span>
            </div>
            <div class="bar-container">
              <div
                class="bar-fill palace-b"
                :style="{ width: getDurationWidth(palaceB) + '%' }"
              ></div>
              <span class="bar-value">{{ getDuration(palaceB) }}</span>
            </div>
          </div>
          <div
            class="stat-winner"
            :class="
              getWinner(
                'duration',
                getDurationYears(palaceA),
                getDurationYears(palaceB),
              )
            "
          >
            {{
              getWinnerText(
                "duration",
                getDurationYears(palaceA),
                getDurationYears(palaceB),
              )
            }}
          </div>
        </div>

        <div class="stat-compare-row">
          <div class="stat-label">建造时长</div>
          <div class="stat-bars">
            <div class="bar-container">
              <div
                class="bar-fill palace-a"
                :style="{ width: getConstructionWidth(palaceA) + '%' }"
              ></div>
              <span class="bar-value">{{ getConstruction(palaceA) }}</span>
            </div>
            <div class="bar-container">
              <div
                class="bar-fill palace-b"
                :style="{ width: getConstructionWidth(palaceB) + '%' }"
              ></div>
              <span class="bar-value">{{ getConstruction(palaceB) }}</span>
            </div>
          </div>
          <div
            class="stat-winner"
            :class="
              getWinner(
                'construction',
                getConstructionYears(palaceA),
                getConstructionYears(palaceB),
              )
            "
          >
            {{
              getWinnerText(
                "construction",
                getConstructionYears(palaceA),
                getConstructionYears(palaceB),
              )
            }}
          </div>
        </div>
      </div>

      <div class="comparison-charts">
        <div class="chart-section">
          <h2 class="section-title">布局对比</h2>
          <div class="layout-comparison">
            <div class="layout-item">
              <h4>外朝</h4>
              <div class="layout-bar-wrapper">
                <div class="layout-bar">
                  <div
                    class="bar palace-a"
                    :style="{ width: palaceA.layout.outerCourt + '%' }"
                  ></div>
                  <span>{{ palaceA.layout.outerCourt }}%</span>
                </div>
                <div class="layout-bar">
                  <div
                    class="bar palace-b"
                    :style="{ width: palaceB.layout.outerCourt + '%' }"
                  ></div>
                  <span>{{ palaceB.layout.outerCourt }}%</span>
                </div>
              </div>
            </div>
            <div class="layout-item">
              <h4>内廷</h4>
              <div class="layout-bar-wrapper">
                <div class="layout-bar">
                  <div
                    class="bar palace-a"
                    :style="{ width: palaceA.layout.innerCourt + '%' }"
                  ></div>
                  <span>{{ palaceA.layout.innerCourt }}%</span>
                </div>
                <div class="layout-bar">
                  <div
                    class="bar palace-b"
                    :style="{ width: palaceB.layout.innerCourt + '%' }"
                  ></div>
                  <span>{{ palaceB.layout.innerCourt }}%</span>
                </div>
              </div>
            </div>
            <div class="layout-item">
              <h4>园林</h4>
              <div class="layout-bar-wrapper">
                <div class="layout-bar">
                  <div
                    class="bar palace-a"
                    :style="{ width: palaceA.layout.garden + '%' }"
                  ></div>
                  <span>{{ palaceA.layout.garden }}%</span>
                </div>
                <div class="layout-bar">
                  <div
                    class="bar palace-b"
                    :style="{ width: palaceB.layout.garden + '%' }"
                  ></div>
                  <span>{{ palaceB.layout.garden }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-section">
          <h2 class="section-title">时间跨度对比</h2>
          <div class="timeline-compare" ref="timelineChartRef"></div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <div class="empty-icon">⚖️</div>
      <h2>选择宫殿进行对比</h2>
      <p>请从上方选择两个不同的宫殿，系统将为您进行全面的对比分析</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import { palaceData } from "@/api/mockData";

const router = useRouter();
const palaces = palaceData.palaces;
const selectedPalaceA = ref(1);
const selectedPalaceB = ref(2);
const timelineChartRef = ref(null);

const palaceA = computed(() =>
  palaces.find((p) => p.id === selectedPalaceA.value),
);
const palaceB = computed(() =>
  palaces.find((p) => p.id === selectedPalaceB.value),
);

const maxArea = computed(() => Math.max(...palaces.map((p) => p.area)));
const maxHouses = computed(() => Math.max(...palaces.map((p) => p.houses)));

const getAreaWidth = (palace) => (palace.area / maxArea.value) * 100;
const getHousesWidth = (palace) => (palace.houses / maxHouses.value) * 100;

const getDuration = (palace) => {
  const years = getDurationYears(palace);
  return years > 0 ? `${years}年` : `${Math.abs(years)}年(BC)`;
};

const getDurationYears = (palace) => {
  if (palace.endYear < 0 && palace.startYear > 0) {
    return palace.startYear - palace.endYear;
  }
  return Math.abs(palace.endYear) - palace.startYear;
};

const getDurationWidth = (palace) => {
  const maxDuration = Math.max(
    ...palaces.map((p) => Math.abs(getDurationYears(p))),
  );
  return (Math.abs(getDurationYears(palace)) / maxDuration) * 100;
};

const getConstruction = (palace) => {
  const years = getConstructionYears(palace);
  return years > 0 ? `${years}年` : `${Math.abs(years)}年(BCE)`;
};

const getConstructionYears = (palace) => {
  if (palace.startYear < 0 && palace.endYear < 0) {
    return Math.abs(palace.startYear) - Math.abs(palace.endYear);
  }
  return Math.abs(palace.endYear) - palace.startYear;
};

const getConstructionWidth = (palace) => {
  const maxConstruction = Math.max(
    ...palaces.map((p) => Math.abs(getConstructionYears(p))),
  );
  return (Math.abs(getConstructionYears(palace)) / maxConstruction) * 100;
};

const getWinner = (type, valA, valB) => {
  if (valA > valB) return "winner-a";
  if (valB > valA) return "winner-b";
  return "winner-tie";
};

const getWinnerText = (type, valA, valB) => {
  if (valA > valB) return "A胜";
  if (valB > valA) return "B胜";
  return "平手";
};

const swapPalaces = () => {
  const temp = selectedPalaceA.value;
  selectedPalaceA.value = selectedPalaceB.value;
  selectedPalaceB.value = temp;
  updateComparison();
};

const updateComparison = () => {
  if (palaceA.value && palaceB.value) {
    nextTick(() => {
      initTimelineChart();
    });
  }
};

const initTimelineChart = () => {
  if (!timelineChartRef.value) return;

  const chart = echarts.init(timelineChartRef.value);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: [palaceA.value.name, palaceB.value.name],
      textStyle: { color: "#FFD700" },
    },
    xAxis: {
      type: "category",
      data: ["建造时长", "使用时长"],
      axisLabel: { color: "#FFF8DC" },
      axisLine: { lineStyle: { color: "#DAA520" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#FFF8DC", formatter: "{value}年" },
      axisLine: { lineStyle: { color: "#DAA520" } },
      splitLine: { lineStyle: { color: "rgba(218, 165, 32, 0.2)" } },
    },
    series: [
      {
        name: palaceA.value.name,
        type: "bar",
        data: [
          {
            value: Math.abs(getConstructionYears(palaceA.value)),
            itemStyle: { color: "#8B0000" },
          },
          {
            value: Math.abs(getDurationYears(palaceA.value)),
            itemStyle: { color: "#8B0000" },
          },
        ],
        barWidth: "30%",
      },
      {
        name: palaceB.value.name,
        type: "bar",
        data: [
          {
            value: Math.abs(getConstructionYears(palaceB.value)),
            itemStyle: { color: "#DAA520" },
          },
          {
            value: Math.abs(getDurationYears(palaceB.value)),
            itemStyle: { color: "#DAA520" },
          },
        ],
        barWidth: "30%",
      },
    ],
    grid: { containLabel: true },
  };

  chart.setOption(option);
};

const goBack = () => {
  router.push("/");
};

onMounted(() => {
  updateComparison();

  window.addEventListener("resize", () => {
    if (timelineChartRef.value) {
      echarts.getInstanceByDom(timelineChartRef.value)?.resize();
    }
  });
});

watch([selectedPalaceA, selectedPalaceB], updateComparison);
</script>

<style scoped>
.comparison-page {
  min-height: 100vh;
  padding: 20px;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
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
}

.page-title {
  color: #daa520;
  font-size: 28px;
  margin: 0;
}

.comparison-controls {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.palace-selectors {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.selector-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selector-group label {
  color: #ffd700;
  font-weight: bold;
}

.selector-group select {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: 2px solid #daa520;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  min-width: 180px;
}

.vs-badge {
  font-size: 24px;
  font-weight: bold;
  color: #daa520;
  padding: 5px 15px;
  background: rgba(139, 0, 0, 0.3);
  border-radius: 20px;
}

.swap-btn {
  background: linear-gradient(90deg, #daa520, #ffd700);
  color: #1a1a1a;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.swap-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
}

.comparison-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comparison-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 30px;
}

.palace-card-mini {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  border: 2px solid rgba(218, 165, 32, 0.3);
  min-width: 200px;
}

.palace-image {
  width: 150px;
  height: 100px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin: 0 auto 15px;
}

.palace-card-mini h3 {
  color: #ffd700;
  margin: 0 0 5px 0;
  font-size: 18px;
}

.dynasty {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 14px;
}

.vs-indicator {
  font-size: 36px;
  font-weight: bold;
  color: #daa520;
  text-shadow: 0 0 20px rgba(218, 165, 32, 0.5);
}

.comparison-stats {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
}

.stat-compare-row {
  display: grid;
  grid-template-columns: 100px 1fr 80px;
  gap: 20px;
  align-items: center;
  margin-bottom: 25px;
}

.stat-label {
  color: #ffd700;
  font-weight: bold;
  font-size: 14px;
}

.stat-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-fill {
  height: 20px;
  border-radius: 10px;
  transition: width 1s ease;
  min-width: 30px;
}

.bar-fill.palace-a {
  background: linear-gradient(90deg, #8b0000, #b22222);
}

.bar-fill.palace-b {
  background: linear-gradient(90deg, #daa520, #ffd700);
}

.bar-value {
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
}

.stat-winner {
  text-align: center;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.winner-a {
  background: rgba(139, 0, 0, 0.5);
  color: #ffd700;
}

.winner-b {
  background: rgba(218, 165, 32, 0.5);
  color: #1a1a1a;
}

.winner-tie {
  background: rgba(128, 128, 128, 0.5);
  color: #fff;
}

.comparison-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 30px;
}

.chart-section {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
  padding: 25px;
}

.section-title {
  color: #daa520;
  font-size: 20px;
  margin: 0 0 20px 0;
  border-bottom: 2px solid #8b0000;
  padding-bottom: 10px;
}

.layout-comparison {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.layout-item h4 {
  color: #ffd700;
  margin: 0 0 10px 0;
  font-size: 14px;
}

.layout-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.layout-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.layout-bar .bar {
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  color: #fff;
  font-size: 12px;
  transition: width 1s ease;
}

.layout-bar .bar.palace-a {
  background: linear-gradient(90deg, #8b0000, #b22222);
}

.layout-bar .bar.palace-b {
  background: linear-gradient(90deg, #daa520, #ffd700);
}

.timeline-compare {
  width: 100%;
  height: 300px;
}

.empty-state {
  text-align: center;
  padding: 100px 20px;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h2 {
  color: #daa520;
  margin: 0 0 15px 0;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

@media (max-width: 1024px) {
  .comparison-charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .comparison-header {
    flex-direction: column;
    gap: 20px;
  }

  .vs-indicator {
    font-size: 24px;
  }

  .stat-compare-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .comparison-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .palace-selectors {
    flex-direction: column;
    width: 100%;
  }

  .selector-group {
    width: 100%;
  }

  .selector-group select {
    flex: 1;
  }
}
</style>
