<template>
  <div class="data-visualization">
    <div class="viz-header">
      <h2 class="viz-title">
        <span class="title-icon">📊</span>
        数据可视化中心
      </h2>
      <div class="viz-controls">
        <div class="control-group">
          <label>宫殿选择：</label>
          <select v-model="selectedPalace" @change="updateChartData">
            <option value="all">全部宫殿</option>
            <option
              v-for="palace in palaces"
              :key="palace.id"
              :value="palace.id"
            >
              {{ palace.name }}
            </option>
          </select>
        </div>
        <div class="control-group">
          <label>图表类型：</label>
          <div class="chart-type-buttons">
            <button
              :class="['type-btn', { active: chartType === 'bar' }]"
              @click="chartType = 'bar'"
            >
              📊 柱状图
            </button>
            <button
              :class="['type-btn', { active: chartType === 'line' }]"
              @click="chartType = 'line'"
            >
              📈 折线图
            </button>
            <button
              :class="['type-btn', { active: chartType === 'pie' }]"
              @click="chartType = 'pie'"
            >
              🥧 饼图
            </button>
          </div>
        </div>
        <div class="control-group">
          <label>数据指标：</label>
          <select v-model="dataMetric" @change="updateChartData">
            <option value="area">占地面积</option>
            <option value="houses">房屋数量</option>
            <option value="duration">存续时间</option>
          </select>
        </div>
      </div>
    </div>

    <div class="viz-content">
      <div class="main-chart-container">
        <div ref="mainChartRef" class="main-chart"></div>
      </div>

      <div class="secondary-charts">
        <div class="chart-card">
          <h3 class="card-title">数据趋势</h3>
          <div ref="lineChartRef" class="line-chart"></div>
        </div>
      </div>
    </div>

    <div class="viz-footer">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏯</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalPalaces }}</div>
            <div class="stat-label">宫殿总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📐</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalArea }}</div>
            <div class="stat-label">总面积(万㎡)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏠</div>
          <div class="stat-info">
            <div class="stat-value">{{ totalHouses }}</div>
            <div class="stat-label">房屋总数(间)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <div class="stat-value">{{ avgDuration }}</div>
            <div class="stat-label">平均存续(年)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import * as echarts from "echarts";
import { palaceData } from "../api/mockData.js";

echarts.registerTheme("palace", {
  textStyle: {
    fontFamily: '"Noto Serif SC", "SimSun", "Microsoft YaHei", sans-serif',
  },
});

const palaces = palaceData.palaces;

const selectedPalace = ref("all");
const chartType = ref("bar");
const dataMetric = ref("area");

const mainChartRef = ref(null);
const lineChartRef = ref(null);

let mainChart = null;
let lineChart = null;

const totalPalaces = computed(() => palaces.length);

const totalArea = computed(() => {
  return palaces.reduce((sum, p) => sum + p.area, 0);
});

const totalHouses = computed(() => {
  return palaces.reduce((sum, p) => sum + p.houses, 0);
});

const avgDuration = computed(() => {
  const durations = palaces.map((p) => {
    const end = p.endYear < 0 ? Math.abs(p.endYear) : p.endYear;
    return end - p.startYear;
  });
  return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
});

const filteredPalaces = computed(() => {
  if (selectedPalace.value === "all") {
    return palaces;
  }
  return palaces.filter((p) => p.id === selectedPalace.value);
});

const getChartData = () => {
  const data = filteredPalaces.value.map((p) => {
    switch (dataMetric.value) {
      case "area":
        return p.area;
      case "houses":
        return p.houses;
      case "duration":
        const end = p.endYear < 0 ? Math.abs(p.endYear) : p.endYear;
        return end - p.startYear;
      default:
        return p.area;
    }
  });

  const labels = filteredPalaces.value.map((p) => p.name);
  const colors = [
    ["#8B0000", "#B22222"],
    ["#DAA520", "#FFD700"],
    ["#228B22", "#32CD32"],
    ["#4169E1", "#6495ED"],
    ["#9932CC", "#BA55D3"],
    ["#FF6347", "#FFA07A"],
  ];

  return { data, labels, colors };
};

const textStyle = {
  fontFamily: '"Noto Serif SC", "SimSun", "Microsoft YaHei", sans-serif',
};

const getMetricLabel = () => {
  switch (dataMetric.value) {
    case "area":
      return "占地面积(万㎡)";
    case "houses":
      return "房屋数量(间)";
    case "duration":
      return "存续时间(年)";
    default:
      return "数值";
  }
};

const initMainChart = () => {
  if (!mainChartRef.value) return;

  mainChart = echarts.init(mainChartRef.value, "palace");
  updateMainChart();
};

const updateMainChart = () => {
  if (!mainChart) return;

  const { data, labels, colors } = getChartData();
  const metricLabel = getMetricLabel();

  let option;

  if (chartType.value === "bar") {
    option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: `{b}: {c} ${metricLabel.replace(/[()]/g, "")}`,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: {
          color: "#FFD700",
          rotate: 30,
          fontSize: 12,
          ...textStyle,
        },
        axisLine: { lineStyle: { color: "#DAA520" } },
      },
      yAxis: {
        type: "value",
        name: metricLabel,
        nameTextStyle: { color: "#FFD700", ...textStyle },
        axisLabel: { color: "#fff", ...textStyle },
        splitLine: { lineStyle: { color: "rgba(218, 165, 32, 0.2)" } },
      },
      series: [
        {
          name: metricLabel,
          type: "bar",
          data: data.map((val, idx) => ({
            value: val,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[idx % colors.length][0] },
                { offset: 1, color: colors[idx % colors.length][1] },
              ]),
              borderRadius: [4, 4, 0, 0],
            },
          })),
          barWidth: "50%",
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(218, 165, 32, 0.5)",
            },
          },
          animationDuration: 1500,
          animationEasing: "elasticOut",
        },
      ],
    };
  } else if (chartType.value === "line") {
    option = {
      tooltip: {
        trigger: "axis",
        formatter: `{b}: {c} ${metricLabel.replace(/[()]/g, "")}`,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { color: "#FFD700", rotate: 30, ...textStyle },
        axisLine: { lineStyle: { color: "#DAA520" } },
      },
      yAxis: {
        type: "value",
        name: metricLabel,
        nameTextStyle: { color: "#FFD700", ...textStyle },
        axisLabel: { color: "#fff", ...textStyle },
        splitLine: { lineStyle: { color: "rgba(218, 165, 32, 0.2)" } },
      },
      series: [
        {
          name: metricLabel,
          type: "line",
          data: data,
          smooth: true,
          lineStyle: {
            color: "#DAA520",
            width: 3,
          },
          itemStyle: {
            color: "#FFD700",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(218, 165, 32, 0.5)" },
              { offset: 1, color: "rgba(218, 165, 32, 0.1)" },
            ]),
          },
          animationDuration: 1500,
        },
      ],
    };
  } else if (chartType.value === "pie") {
    option = {
      tooltip: {
        trigger: "item",
        formatter: `{b}: {c} ${metricLabel.replace(/[()]/g, "")} ({d}%)`,
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "center",
        textStyle: { color: "#FFD700", ...textStyle },
      },
      series: [
        {
          name: metricLabel,
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#0a0a0f",
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: "{b}\n{c}",
            color: "#FFD700",
            ...textStyle,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(218, 165, 32, 0.5)",
            },
          },
          data: data.map((val, idx) => ({
            value: val,
            name: labels[idx],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: colors[idx % colors.length][0] },
                { offset: 1, color: colors[idx % colors.length][1] },
              ]),
            },
          })),
          animationType: "scale",
          animationDuration: 1500,
        },
      ],
    };
  }

  mainChart.setOption(option, true);
};

const initLineChart = () => {
  if (!lineChartRef.value) return;

  lineChart = echarts.init(lineChartRef.value, "palace");

  const sortedPalaces = [...palaces].sort((a, b) => a.startYear - b.startYear);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const p = params[0];
        return `${p.name}<br/>始建: ${p.data.startYear < 0 ? Math.abs(p.data.startYear) + "BC" : p.data.startYear + "年"}<br/>结束: ${p.data.endYear < 0 ? Math.abs(p.data.endYear) + "BC" : p.data.endYear + "年"}<br/>存续: ${p.data.duration}年`;
      },
      textStyle: { color: "#f5f0e8", ...textStyle },
    },
    grid: {
      left: "3%",
      right: "15%",
      bottom: "3%",
      top: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        color: "#FFD700",
        formatter: (value) => {
          if (value < 0) return Math.abs(value) + "BC";
          return value + "年";
        },
        ...textStyle,
      },
      axisLine: { lineStyle: { color: "#DAA520" } },
      splitLine: { lineStyle: { color: "rgba(218, 165, 32, 0.1)" } },
    },
    yAxis: {
      type: "category",
      data: sortedPalaces.map((p) => p.name),
      axisLabel: { color: "#FFD700", fontSize: 11, ...textStyle },
      axisLine: { lineStyle: { color: "#DAA520" } },
    },
    series: [
      {
        type: "bar",
        data: sortedPalaces.map((p) => {
          const end = p.endYear < 0 ? Math.abs(p.endYear) : p.endYear;
          const duration = end - p.startYear;
          return {
            value: duration,
            startYear: p.startYear,
            endYear: p.endYear,
            duration: duration,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#8B0000" },
                { offset: 1, color: "#DAA520" },
              ]),
              borderRadius: [0, 4, 4, 0],
            },
          };
        }),
        barWidth: "60%",
        label: {
          show: true,
          position: "right",
          formatter: (params) => `${params.data.duration}年`,
          color: "#FFD700",
          fontSize: 11,
          textStyle: { ...textStyle },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(218, 165, 32, 0.5)",
          },
        },
        animationDuration: 1500,
        animationEasing: "elasticOut",
      },
    ],
  };

  lineChart.setOption(option);
};

const updateChartData = () => {
  updateMainChart();
};

const handleResize = () => {
  if (mainChart) mainChart.resize();
  if (lineChart) lineChart.resize();
};

watch([chartType, dataMetric], () => {
  updateMainChart();
});

onMounted(() => {
  nextTick(() => {
    initMainChart();
    initLineChart();
  });

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);

  if (mainChart) mainChart.dispose();
  if (lineChart) lineChart.dispose();
});
</script>

<style scoped>
.data-visualization {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  min-height: calc(100vh - 120px);
}

.viz-header {
  margin-bottom: 25px;
}

.viz-title {
  color: #ffd700;
  font-size: 28px;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
}

.viz-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  background: rgba(139, 0, 0, 0.2);
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid rgba(218, 165, 32, 0.3);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  color: #ffd700;
  font-size: 14px;
  white-space: nowrap;
}

.control-group select {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: 2px solid rgba(218, 165, 32, 0.5);
  border-radius: 8px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-group select:hover {
  border-color: #daa520;
}

.control-group select:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(218, 165, 32, 0.3);
}

.chart-type-buttons {
  display: flex;
  gap: 8px;
}

.type-btn {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: 2px solid rgba(218, 165, 32, 0.5);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-btn:hover {
  background: rgba(218, 165, 32, 0.2);
}

.type-btn.active {
  background: rgba(218, 165, 32, 0.3);
  border-color: #ffd700;
  color: #ffd700;
}

.viz-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  margin-bottom: 25px;
}

@media (min-width: 1200px) {
  .viz-content {
    grid-template-columns: 2fr 1fr;
  }
}

.main-chart-container {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(218, 165, 32, 0.2);
}

.main-chart {
  width: 100%;
  height: 400px;
}

.secondary-charts {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.chart-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(218, 165, 32, 0.2);
  flex: 1;
}

.card-title {
  color: #ffd700;
  font-size: 16px;
  margin: 0 0 15px 0;
  text-align: center;
}

.line-chart {
  width: 100%;
  height: 280px;
}

.viz-footer {
  margin-top: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(139, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(218, 165, 32, 0.3);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #daa520;
}

.stat-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(218, 165, 32, 0.1);
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #ffd700;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .data-visualization {
    padding: 15px;
  }

  .viz-title {
    font-size: 22px;
  }

  .viz-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .control-group {
    width: 100%;
    flex-wrap: wrap;
  }

  .control-group select {
    flex: 1;
    min-width: 120px;
  }

  .chart-type-buttons {
    flex-wrap: wrap;
  }

  .main-chart {
    height: 300px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card {
    padding: 15px;
  }

  .stat-value {
    font-size: 22px;
  }

  .stat-icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
  }
}
</style>
