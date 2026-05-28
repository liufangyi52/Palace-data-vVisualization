<template>
  <div class="achievement">
    <div class="nav-bar">
      <button class="back-btn" @click="goHome">← 返回首页</button>
      <h1 class="page-title">成就与影响</h1>
    </div>

    <div class="charts-row">
      <div class="chart-container card">
        <h2 class="section-title">皇宫建筑成就雷达图</h2>
        <div ref="radarChartRef" class="chart"></div>
      </div>
      <div class="chart-container card">
        <h2 class="section-title">建筑影响关系图</h2>
        <div ref="influenceChartRef" class="chart"></div>
      </div>
    </div>

    <div class="achievement-cards">
      <div class="achievement-card card">
        <div
          class="card-image"
          style="
            background-image: url(&quot;https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80&quot;);
          "
        >
          <div class="image-overlay"></div>
        </div>
        <div class="card-icon">🏛️</div>
        <h3>规模宏大</h3>
        <p>紫禁城占地72万平方米，是世界上现存规模最大的宫殿建筑群</p>
      </div>
      <div class="achievement-card card">
        <div
          class="card-image"
          style="
            background-image: url(&quot;https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&q=80&quot;);
          "
        >
          <div class="image-overlay"></div>
        </div>
        <div class="card-icon">🔨</div>
        <h3>工艺精湛</h3>
        <p>斗拱、榫卯等传统工艺达到巅峰，《营造法式》集大成之作</p>
      </div>
      <div class="achievement-card card">
        <div
          class="card-image"
          style="
            background-image: url(&quot;https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80&quot;);
          "
        >
          <div class="image-overlay"></div>
        </div>
        <div class="card-icon">🛡️</div>
        <h3>保存完整</h3>
        <p>历经600余年风雨，紫禁城保存完好度达90%以上</p>
      </div>
      <div class="achievement-card card">
        <div
          class="card-image"
          style="
            background-image: url(&quot;https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&quot;);
          "
        >
          <div class="image-overlay"></div>
        </div>
        <div class="card-icon">🌍</div>
        <h3>影响深远</h3>
        <p>对后世建筑及国际建筑界产生重要影响，是人类文化遗产</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import { palaceData } from "@/api/mockData";

const router = useRouter();
const achievements = ref(null);
const influence = ref(null);
const loading = ref(true);
const radarChartRef = ref(null);
const influenceChartRef = ref(null);
let radarChart = null;
let influenceChart = null;

const fetchData = async () => {
  try {
    loading.value = true;
    achievements.value = palaceData.achievements;
    influence.value = palaceData.influence;
  } catch (error) {
    console.error("获取数据失败:", error);
    achievements.value = palaceData.achievements;
    influence.value = palaceData.influence;
  } finally {
    loading.value = false;
    initAllCharts();
  }
};

const goHome = () => {
  router.push("/");
};

const initRadarChart = () => {
  if (!radarChartRef.value || !achievements.value) return;
  if (radarChart) {
    radarChart.dispose();
  }
  radarChart = echarts.init(radarChartRef.value);

  const achievementsData = achievements.value;
  const palaceEntries = Object.entries(achievementsData).slice(0, 3);

  const radarData = palaceEntries.map(([key, data], index) => {
    const colors = ["#8B0000", "#DAA520", "#4a4a4a"];
    return {
      value: [
        data.scale || 0,
        data.craft || 0,
        data.preservation || 0,
        data.influence || 0,
      ],
      name:
        key === "ForbiddenCity"
          ? "明清紫禁城"
          : key === "Daming"
            ? "唐代大明宫"
            : key === "Weiyang"
              ? "汉代未央宫"
              : key,
      itemStyle: { color: colors[index] },
      areaStyle: { opacity: 0.3 },
    };
  });

  const option = {
    tooltip: {},
    legend: {
      data: radarData.map((p) => p.name),
      textStyle: { color: "#FFD700" },
      bottom: "5%",
    },
    radar: {
      indicator: [
        { name: "建筑规模", max: 100 },
        { name: "工艺水平", max: 100 },
        { name: "保存完整度", max: 100 },
        { name: "文化影响", max: 100 },
      ],
      axisName: {
        color: "#FFD700",
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(139, 0, 0, 0.05)", "rgba(218, 165, 32, 0.05)"],
        },
      },
      axisLine: {
        lineStyle: { color: "#DAA520" },
      },
    },
    series: [
      {
        name: "皇宫成就",
        type: "radar",
        data: radarData,
      },
    ],
  };
  radarChart.setOption(option);
};

const initInfluenceChart = () => {
  if (!influenceChartRef.value || !influence.value) return;
  if (influenceChart) {
    influenceChart.dispose();
  }
  influenceChart = echarts.init(influenceChartRef.value);

  const infData =
    influence.value.palace !== undefined
      ? influence.value
      : { palace: 80, government: 70, international: 40 };
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}%",
    },
    series: [
      {
        type: "graph",
        layout: "force",
        roam: true,
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
          color: "#FFD700",
        },
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 12,
          color: "#FFF8DC",
        },
        data: [
          { name: "皇宫建筑", symbolSize: 50, itemStyle: { color: "#8B0000" } },
          { name: "清代王府", symbolSize: 35, itemStyle: { color: "#DAA520" } },
          { name: "官府建筑", symbolSize: 30, itemStyle: { color: "#DAA520" } },
          { name: "国际建筑", symbolSize: 25, itemStyle: { color: "#4a4a4a" } },
        ],
        links: [
          {
            source: "皇宫建筑",
            target: "清代王府",
            value: infData.palace || 80,
            label: { show: true, formatter: `${infData.palace || 80}%` },
          },
          {
            source: "皇宫建筑",
            target: "官府建筑",
            value: infData.government || 70,
            label: { show: true, formatter: `${infData.government || 70}%` },
          },
          {
            source: "皇宫建筑",
            target: "国际建筑",
            value: infData.international || 40,
            label: { show: true, formatter: `${infData.international || 40}%` },
          },
        ],
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0.2,
          color: "#DAA520",
        },
        force: {
          repulsion: 400,
          edgeLength: 150,
        },
      },
    ],
  };
  influenceChart.setOption(option);
};

const handleResize = () => {
  radarChart?.resize();
  influenceChart?.resize();
};

const initAllCharts = () => {
  nextTick(() => {
    initRadarChart();
    initInfluenceChart();
  });
};

onMounted(() => {
  fetchData();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  radarChart?.dispose();
  influenceChart?.dispose();
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.achievement {
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

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.chart-container {
  padding: 20px;
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

.chart {
  width: 100%;
  height: 400px;
}

.achievement-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.achievement-card {
  text-align: center;
  padding: 30px 20px;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 150px;
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

.achievement-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.achievement-card h3 {
  color: #daa520;
  font-size: 20px;
  margin: 0 0 10px 0;
}

.achievement-card p {
  color: #fff8dc;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}
</style>
