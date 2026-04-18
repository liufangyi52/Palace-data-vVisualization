<template>
  <div class="craft">
    <div class="nav-bar">
      <button class="back-btn" @click="goHome">← 返回首页</button>
      <h1 class="page-title">工艺与材料</h1>
    </div>

    <div class="charts-row">
      <div class="chart-container card">
        <h2 class="section-title">紫禁城建筑材料使用量</h2>
        <div ref="materialChartRef" class="chart"></div>
      </div>
      <div class="chart-container card">
        <h2 class="section-title">材料使用占比</h2>
        <div ref="materialPieRef" class="chart"></div>
      </div>
    </div>

    <div class="timeline-container card">
      <h2 class="section-title">工艺演变时间轴</h2>
      <div class="timeline">
        <div
          v-for="(item, index) in timelineData"
          :key="index"
          class="timeline-item"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4 class="timeline-year">
              {{ Math.abs(item.year) }}{{ item.year < 0 ? " BC" : "" }}
            </h4>
            <p class="timeline-dynasty">{{ item.dynasty }}</p>
            <p class="timeline-craft">{{ item.craft }}: {{ item.event }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import { palaceApi } from "@/api";

const router = useRouter();
const timelineData = ref([]);
const materials = ref(null);
const loading = ref(true);
const materialChartRef = ref(null);
const materialPieRef = ref(null);
let materialChart = null;
let materialPie = null;

const fetchData = async () => {
  try {
    loading.value = true;
    const [materialsRes, timelineRes] = await Promise.all([
      palaceApi.getMaterials(),
      palaceApi.getCraftTimeline(),
    ]);

    if (materialsRes.data.code === 200) {
      materials.value = materialsRes.data.data;
    }
    if (timelineRes.data.code === 200) {
      timelineData.value = timelineRes.data.data;
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    const { palaceData: mockData } = await import("@/api/mockData.js");
    materials.value = mockData.palaceData.materials;
    timelineData.value = mockData.palaceData.craftTimeline;
  } finally {
    loading.value = false;
    initAllCharts();
  }
};

const goHome = () => {
  router.push("/");
};

const initMaterialChart = () => {
  if (!materialChartRef.value || !materials.value) return;
  if (materialChart) {
    materialChart.dispose();
  }
  materialChart = echarts.init(materialChartRef.value);

  const matsData = Array.isArray(materials.value)
    ? materials.value.find((m) => m.palaceName === "明清紫禁城")?.materials
    : materials.value?.ForbiddenCity;

  if (!matsData) return;

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: ["木材", "砖石", "琉璃瓦"],
      axisLabel: { color: "#FFD700" },
      axisLine: { lineStyle: { color: "#DAA520" } },
    },
    yAxis: {
      type: "value",
      name: "数量",
      axisLabel: { color: "#FFD700" },
      axisLine: { lineStyle: { color: "#DAA520" } },
    },
    series: [
      {
        name: "使用量",
        type: "bar",
        data: [matsData.wood, matsData.brick, matsData.tile],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#8B0000" },
            { offset: 1, color: "#DAA520" },
          ]),
        },
        label: {
          show: true,
          position: "top",
          color: "#FFF8DC",
        },
      },
    ],
  };
  materialChart.setOption(option);
};

const initMaterialPie = () => {
  if (!materialPieRef.value || !materials.value) return;
  if (materialPie) {
    materialPie.dispose();
  }
  materialPie = echarts.init(materialPieRef.value);

  const matsData = Array.isArray(materials.value)
    ? materials.value.find((m) => m.palaceName === "明清紫禁城")?.materials
    : materials.value?.ForbiddenCity;

  if (!matsData) return;

  const option = {
    tooltip: { trigger: "item", formatter: "{b}: {d}%" },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: { color: "#FFD700" },
    },
    series: [
      {
        name: "材料占比",
        type: "pie",
        radius: "60%",
        center: ["60%", "50%"],
        data: [
          {
            value: matsData.wood,
            name: "木材",
            itemStyle: { color: "#8B4513" },
          },
          {
            value: matsData.brick,
            name: "砖石",
            itemStyle: { color: "#696969" },
          },
          {
            value: matsData.tile,
            name: "琉璃瓦",
            itemStyle: { color: "#DAA520" },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  materialPie.setOption(option);
};

const handleResize = () => {
  materialChart?.resize();
  materialPie?.resize();
};

const initAllCharts = () => {
  nextTick(() => {
    initMaterialChart();
    initMaterialPie();
  });
};

onMounted(() => {
  fetchData();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  materialChart?.dispose();
  materialPie?.dispose();
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.craft {
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

.timeline-container {
  padding: 20px;
}

.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #8b0000, #daa520);
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.timeline-dot {
  width: 20px;
  height: 20px;
  background: #daa520;
  border: 3px solid #8b0000;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 10px;
  transform: translateX(-50%);
  z-index: 1;
}

.timeline-content {
  width: 40%;
  padding: 15px 20px;
  background: rgba(139, 0, 0, 0.1);
  border: 1px solid #daa520;
  border-radius: 8px;
  text-align: center;
}

.timeline-item:nth-child(odd) .timeline-content {
  margin-right: 55%;
}

.timeline-item:nth-child(even) .timeline-content {
  margin-left: 55%;
}

.timeline-year {
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.timeline-dynasty {
  color: #daa520;
  font-size: 14px;
  margin: 0 0 8px 0;
}

.timeline-craft {
  color: #fff8dc;
  font-size: 14px;
  margin: 0;
}
</style>
