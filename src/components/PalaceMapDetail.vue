<template>
  <div class="palace-map-detail">
    <div class="detail-header">
      <button class="back-btn" @click="$emit('close')">← 返回</button>
      <h1 class="detail-title">地域分布</h1>
      <div class="header-actions">
        <button class="action-btn" @click="toggleList" title="宫殿列表">
          📋
        </button>
      </div>
    </div>

    <div class="detail-content">
      <div ref="chartRef" class="chart-container"></div>

      <div class="map-legend">
        <div class="legend-title">数值范围</div>
        <div class="legend-gradient"></div>
        <div class="legend-labels">
          <span>0</span>
          <span>575</span>
          <span>1150</span>
          <span>1725</span>
          <span>2300</span>
        </div>
      </div>

      <div class="map-controls">
        <button class="control-btn" @click="zoomIn" title="放大">➕</button>
        <button class="control-btn" @click="zoomOut" title="缩小">➖</button>
        <button class="control-btn" @click="resetView" title="重置">🏠</button>
      </div>

      <div class="palace-list-panel" v-if="showPalaceList">
        <div class="panel-header">
          <h3>🏛️ 宫殿列表</h3>
          <button class="panel-close" @click="showPalaceList = false">×</button>
        </div>
        <div class="palace-list">
          <div
            v-for="palace in palacesWithData"
            :key="palace.id"
            class="palace-list-item"
            :class="{ active: selectedPalace?.id === palace.id }"
            @click="selectPalace(palace)"
          >
            <div class="palace-list-icon">
              {{ getPalaceIcon(palace.dynasty) }}
            </div>
            <div class="palace-list-info">
              <h4>{{ palace.name }}</h4>
              <p>{{ palace.dynasty }}</p>
            </div>
            <div class="palace-value">{{ palace.numericValue }}</div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="popup">
      <div
        v-if="selectedPalace"
        class="detail-popup"
        :style="popupStyle"
        :class="{ visible: popupVisible }"
      >
        <div class="popup-header">
          <h3>🏛️ {{ selectedPalace.name }}</h3>
          <button class="popup-close" @click="closePopup">×</button>
        </div>
        <div class="popup-content">
          <div class="popup-row">
            <span class="label">所属朝代</span>
            <span class="value dynasty">{{ selectedPalace.dynasty }}</span>
          </div>
          <div class="popup-row">
            <span class="label">经度</span>
            <span class="value">{{ selectedPalace.value[0] }}°E</span>
          </div>
          <div class="popup-row">
            <span class="label">纬度</span>
            <span class="value">{{ selectedPalace.value[1] }}°N</span>
          </div>
          <div class="popup-row">
            <span class="label">占地面积</span>
            <span class="value">{{ selectedPalace.area }}万㎡</span>
          </div>
          <div class="popup-row">
            <span class="label">房屋数量</span>
            <span class="value">{{ selectedPalace.houses }}间</span>
          </div>
          <div class="popup-row highlight">
            <span class="label">综合数值</span>
            <span class="value numeric">{{ selectedPalace.numericValue }}</span>
          </div>
        </div>
        <div class="popup-footer">
          <div
            class="value-bar"
            :style="{ width: (selectedPalace.numericValue / 2300) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";
import chinaGeoJSON from "../assets/china.json";

const palacesWithData = [
  {
    id: 1,
    name: "咸阳宫",
    value: [108.75, 34.37, 1800],
    area: 370,
    houses: 2700,
    dynasty: "秦",
  },
  {
    id: 2,
    name: "阿房宫",
    value: [108.81, 34.26, 1600],
    area: 150,
    houses: 1000,
    dynasty: "秦",
  },
  {
    id: 3,
    name: "未央宫",
    value: [108.86, 34.31, 2100],
    area: 480,
    houses: 4000,
    dynasty: "西汉",
  },
  {
    id: 4,
    name: "太极宫",
    value: [108.94, 34.27, 2000],
    area: 420,
    houses: 3500,
    dynasty: "隋唐",
  },
  {
    id: 5,
    name: "紫微城",
    value: [112.46, 34.68, 1950],
    area: 410,
    houses: 3200,
    dynasty: "隋唐武周",
  },
  {
    id: 6,
    name: "大明宫",
    value: [108.96, 34.3, 2250],
    area: 520,
    houses: 4500,
    dynasty: "唐",
  },
  {
    id: 7,
    name: "北宋宫城",
    value: [114.35, 34.8, 1700],
    area: 290,
    houses: 2300,
    dynasty: "北宋",
  },
  {
    id: 8,
    name: "南宋宫城",
    value: [120.17, 30.23, 1650],
    area: 250,
    houses: 2000,
    dynasty: "南宋",
  },
  {
    id: 9,
    name: "元大都",
    value: [116.4, 39.92, 1900],
    area: 360,
    houses: 3100,
    dynasty: "元",
  },
  {
    id: 10,
    name: "南京故宫",
    value: [118.81, 32.04, 1850],
    area: 330,
    houses: 2800,
    dynasty: "明",
  },
  {
    id: 11,
    name: "北京故宫",
    value: [116.4, 39.91, 2300],
    area: 72,
    houses: 9371,
    dynasty: "明清",
  },
  {
    id: 12,
    name: "沈阳故宫",
    value: [123.45, 41.8, 1500],
    area: 16,
    houses: 300,
    dynasty: "清",
  },
  {
    id: 13,
    name: "长乐宫",
    value: [108.87, 34.3, 1980],
    area: 460,
    houses: 3800,
    dynasty: "西汉",
  },
  {
    id: 14,
    name: "建章宫",
    value: [108.85, 34.29, 1920],
    area: 390,
    houses: 3300,
    dynasty: "西汉",
  },
].map((p) => ({ ...p, numericValue: p.value[2] }));

const chartRef = ref(null);
const selectedPalace = ref(null);
const popupVisible = ref(false);
const showPalaceList = ref(false);
const popupStyle = ref({});
let chartInstance = null;

const iconMap = {
  秦: "🏯",
  明: "🏯",
  清: "🏯",
  唐: "⛩️",
  宋: "🏮",
  元: "🎎",
  汉: "🎋",
  隋: "🏛️",
};
const getPalaceIcon = (dynasty) => iconMap[dynasty.charAt(0)] || "🏛️";

const getColor = (value) => {
  const ratio = value / 2300;
  const r = Math.floor(218 - ratio * 100);
  const g = Math.floor(165 - ratio * 80);
  const b = Math.floor(32 - ratio * 20);
  return `rgb(${r}, ${g}, ${b})`;
};

const getSymbolSize = (value) => {
  return Math.sqrt(value) * 1.2 + 8;
};

const initChart = () => {
  if (!chartRef.value) return;

  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartRef.value);
  echarts.registerMap("china", chinaGeoJSON);

  const scatterData = palacesWithData.map((p) => ({
    name: p.name,
    value: [p.value[0], p.value[1], p.value[2]],
  }));

  const option = {
    backgroundColor: "#0a0a0f",
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(10, 10, 15, 0.95)",
      borderColor: "#DAA520",
      borderWidth: 1,
      padding: [12, 16],
      textStyle: { color: "#fff8dc", fontSize: 13 },
      formatter: (params) => {
        if (params.seriesType === "scatter") {
          const p = palacesWithData.find((x) => x.name === params.data.name);
          return `<div style="font-weight: bold; color: #DAA520; font-size: 14px; margin-bottom: 8px;">${params.data.name}</div>
                  <div style="color: #888; font-size: 11px; margin-bottom: 4px;">${p?.dynasty}</div>
                  <div>📍 ${p?.value[1].toFixed(2)}°N, ${p?.value[0].toFixed(2)}°E</div>
                  <div>📊 数值: <span style="color: #DAA520; font-weight: bold;">${p?.numericValue}</span></div>
                  <div style="margin-top: 4px; color: #666; font-size: 10px;">点击查看详情</div>`;
        }
        if (params.name) {
          return `<div style="color: #DAA520;">${params.name}</div>`;
        }
        return "";
      },
    },
    geo: {
      map: "china",
      roam: true,
      zoom: 1.0,
      center: [105, 36],
      scaleLimit: { min: 0.8, max: 5 },
      itemStyle: {
        areaColor: "#1a1a2e",
        borderColor: "#DAA520",
        borderWidth: 1.5,
        shadowBlur: 15,
        shadowColor: "rgba(218, 165, 32, 0.4)",
      },
      emphasis: {
        itemStyle: {
          areaColor: "#2d2d4a",
          borderColor: "#FFD700",
          borderWidth: 2,
        },
        label: { show: false },
      },
      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "#0d0d1a",
            borderColor: "#DAA520",
          },
          label: { show: true, color: "#DAA520", fontSize: 9 },
        },
      ],
    },
    series: [
      {
        name: "宫殿分布",
        type: "scatter",
        coordinateSystem: "geo",
        data: scatterData,
        symbol: "circle",
        symbolSize: (val) => getSymbolSize(val[2]),
        itemStyle: {
          color: (params) => getColor(params.data.value[2]),
          borderColor: "#fff",
          borderWidth: 2,
          shadowBlur: 12,
          shadowColor: "rgba(218, 165, 32, 0.6)",
        },
        emphasis: {
          scale: 1.4,
          itemStyle: {
            borderColor: "#FFD700",
            borderWidth: 3,
            shadowBlur: 20,
            shadowColor: "rgba(255, 215, 0, 0.8)",
          },
        },
        label: {
          show: true,
          position: "right",
          formatter: (params) => params.data.name.substring(0, 2),
          fontSize: 11,
          color: "#fff8dc",
          fontWeight: "bold",
          backgroundColor: "rgba(10, 10, 15, 0.8)",
          padding: [4, 8],
          borderRadius: 4,
          borderColor: "rgba(218, 165, 32, 0.5)",
          borderWidth: 1,
        },
      },
    ],
  };

  chartInstance.setOption(option);

  chartInstance.on("click", (params) => {
    if (params.seriesType === "scatter") {
      const palace = palacesWithData.find((p) => p.name === params.data.name);
      if (palace) {
        selectedPalace.value = palace;
        popupVisible.value = false;
        nextTick(() => {
          adjustPopupPosition(params.event);
          setTimeout(() => {
            popupVisible.value = true;
          }, 50);
        });
      }
    }
  });

  chartInstance.getZr().on("click", () => {
    popupVisible.value = false;
    setTimeout(() => {
      selectedPalace.value = null;
    }, 300);
  });
};

const adjustPopupPosition = (event) => {
  const container = chartRef.value?.parentElement;
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  let left = event.offsetX + 20;
  let top = event.offsetY - 120;

  if (left + 300 > containerRect.width) {
    left = event.offsetX - 300;
  }
  if (top < 10) top = 10;
  if (top + 300 > containerRect.height) {
    top = containerRect.height - 320;
  }

  popupStyle.value = { left: left + "px", top: top + "px" };
};

const selectPalace = (palace) => {
  selectedPalace.value = palace;
  showPalaceList.value = false;
  popupVisible.value = false;

  if (chartInstance) {
    chartInstance.setOption({
      geo: { center: [palace.value[0], palace.value[1]], zoom: 3 },
    });

    setTimeout(() => {
      const event = {
        offsetX: chartRef.value?.offsetWidth / 2 || 300,
        offsetY: chartRef.value?.offsetHeight / 2 || 300,
      };
      adjustPopupPosition(event);
      popupVisible.value = true;
    }, 400);
  }
};

const closePopup = () => {
  popupVisible.value = false;
  setTimeout(() => {
    selectedPalace.value = null;
  }, 300);
};

const toggleList = () => {
  showPalaceList.value = !showPalaceList.value;
};

const zoomIn = () => {
  if (chartInstance) {
    const zoom = chartInstance.getOption().geo[0].zoom;
    chartInstance.setOption({ geo: { zoom: Math.min(zoom + 0.5, 5) } });
  }
};

const zoomOut = () => {
  if (chartInstance) {
    const zoom = chartInstance.getOption().geo[0].zoom;
    chartInstance.setOption({ geo: { zoom: Math.max(zoom - 0.5, 0.5) } });
  }
};

const resetView = () => {
  if (chartInstance) {
    chartInstance.setOption({ geo: { center: [105, 36], zoom: 1.0 } });
  }
};

onMounted(() => {
  nextTick(() => {
    setTimeout(initChart, 100);
  });
  window.addEventListener("resize", () => chartInstance?.resize());
});

onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener("resize", () => chartInstance?.resize());
});
</script>

<style scoped>
.palace-map-detail {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.detail-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(10, 10, 15, 0.9);
  border-bottom: 2px solid rgba(218, 165, 32, 0.4);
}
.back-btn {
  padding: 10px 24px;
  background: rgba(218, 165, 32, 0.15);
  border: 2px solid rgba(218, 165, 32, 0.5);
  border-radius: 8px;
  color: #daa520;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}
.back-btn:hover {
  background: rgba(218, 165, 32, 0.3);
  box-shadow: 0 0 20px rgba(218, 165, 32, 0.4);
}
.detail-title {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #daa520;
  letter-spacing: 6px;
  text-shadow: 0 0 30px rgba(218, 165, 32, 0.6);
}
.header-actions {
  display: flex;
  gap: 10px;
}
.action-btn {
  width: 40px;
  height: 40px;
  background: rgba(218, 165, 32, 0.15);
  border: 2px solid rgba(218, 165, 32, 0.4);
  border-radius: 8px;
  color: #daa520;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.action-btn:hover {
  background: rgba(218, 165, 32, 0.3);
}
.detail-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.chart-container {
  width: 100%;
  height: 100%;
}
.map-legend {
  position: absolute;
  left: 30px;
  bottom: 30px;
  background: rgba(10, 10, 15, 0.92);
  border: 2px solid rgba(218, 165, 32, 0.5);
  border-radius: 12px;
  padding: 15px 20px;
  z-index: 10;
  box-shadow: 0 0 30px rgba(218, 165, 32, 0.3);
}
.legend-title {
  color: #daa520;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: 2px;
}
.legend-gradient {
  width: 200px;
  height: 14px;
  background: linear-gradient(
    to right,
    rgb(139, 0, 0),
    rgb(180, 50, 0),
    rgb(218, 165, 32),
    rgb(255, 215, 0)
  );
  border-radius: 7px;
  border: 1px solid rgba(218, 165, 32, 0.4);
  box-shadow: 0 0 10px rgba(218, 165, 32, 0.3);
}
.legend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 11px;
  color: rgba(255, 248, 220, 0.9);
  font-weight: 500;
}
.map-controls {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}
.control-btn {
  width: 48px;
  height: 48px;
  background: rgba(10, 10, 15, 0.9);
  border: 2px solid rgba(218, 165, 32, 0.4);
  border-radius: 12px;
  color: #daa520;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}
.control-btn:hover {
  background: rgba(218, 165, 32, 0.25);
  border-color: #daa520;
  transform: scale(1.05);
}
.palace-list-panel {
  position: absolute;
  right: 100px;
  top: 20px;
  width: 340px;
  max-height: calc(100% - 40px);
  background: rgba(10, 10, 15, 0.95);
  border: 2px solid rgba(218, 165, 32, 0.5);
  border-radius: 16px;
  z-index: 20;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(218, 165, 32, 0.3);
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(
    135deg,
    rgba(218, 165, 32, 0.25),
    rgba(139, 0, 0, 0.2)
  );
  border-bottom: 1px solid rgba(218, 165, 32, 0.3);
}
.panel-header h3 {
  margin: 0;
  color: #daa520;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
}
.panel-close {
  background: none;
  border: none;
  color: rgba(255, 248, 220, 0.7);
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
}
.panel-close:hover {
  color: #ffd700;
}
.palace-list {
  max-height: 500px;
  overflow-y: auto;
}
.palace-list::-webkit-scrollbar {
  width: 6px;
}
.palace-list::-webkit-scrollbar-track {
  background: rgba(218, 165, 32, 0.1);
}
.palace-list::-webkit-scrollbar-thumb {
  background: rgba(218, 165, 32, 0.4);
  border-radius: 3px;
}
.palace-list-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(218, 165, 32, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}
.palace-list-item:hover {
  background: rgba(218, 165, 32, 0.15);
}
.palace-list-item.active {
  background: rgba(218, 165, 32, 0.25);
  border-left: 3px solid #daa520;
}
.palace-list-item:last-child {
  border-bottom: none;
}
.palace-list-icon {
  font-size: 28px;
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(218, 165, 32, 0.2);
  border-radius: 10px;
  border: 1px solid rgba(218, 165, 32, 0.3);
}
.palace-list-info {
  flex: 1;
}
.palace-list-info h4 {
  margin: 0 0 6px 0;
  color: #fff8dc;
  font-size: 14px;
  font-weight: bold;
}
.palace-list-info p {
  margin: 0;
  color: rgba(255, 248, 220, 0.6);
  font-size: 12px;
}
.palace-value {
  padding: 6px 12px;
  background: rgba(218, 165, 32, 0.2);
  border-radius: 8px;
  color: #daa520;
  font-size: 14px;
  font-weight: bold;
}
.detail-popup {
  position: absolute;
  min-width: 300px;
  background: rgba(10, 10, 15, 0.98);
  border: 2px solid #daa520;
  border-radius: 16px;
  z-index: 100;
  box-shadow: 0 0 50px rgba(218, 165, 32, 0.5);
  overflow: hidden;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}
.detail-popup.visible {
  opacity: 1;
  transform: translateY(0);
}
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(
    135deg,
    rgba(218, 165, 32, 0.3),
    rgba(139, 0, 0, 0.25)
  );
  border-bottom: 1px solid rgba(218, 165, 32, 0.3);
}
.popup-header h3 {
  margin: 0;
  color: #daa520;
  font-size: 18px;
  font-weight: bold;
}
.popup-close {
  background: none;
  border: none;
  color: rgba(255, 248, 220, 0.8);
  font-size: 28px;
  cursor: pointer;
  transition: color 0.3s ease;
}
.popup-close:hover {
  color: #ffd700;
}
.popup-content {
  padding: 18px 20px;
}
.popup-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(218, 165, 32, 0.1);
}
.popup-row:last-child {
  border-bottom: none;
}
.popup-row .label {
  color: rgba(255, 248, 220, 0.7);
  font-size: 13px;
}
.popup-row .value {
  color: #fff8dc;
  font-size: 14px;
  font-weight: 500;
}
.popup-row .value.dynasty {
  padding: 4px 10px;
  background: rgba(218, 165, 32, 0.2);
  border-radius: 6px;
  color: #daa520;
}
.popup-row .value.numeric {
  font-size: 22px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.popup-row.highlight {
  margin-top: 8px;
  padding-top: 14px;
  border-top: 2px solid rgba(218, 165, 32, 0.3);
}
.popup-footer {
  height: 4px;
  background: rgba(218, 165, 32, 0.2);
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}
.value-bar {
  height: 100%;
  background: linear-gradient(to right, rgb(139, 0, 0), rgb(218, 165, 32));
  transition: width 0.5s ease;
}
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
@media (max-width: 1200px) {
  .palace-list-panel {
    right: 90px;
    width: 300px;
  }
  .map-controls {
    right: 20px;
  }
  .map-legend {
    left: 20px;
    bottom: 20px;
    padding: 12px 15px;
  }
}
@media (max-width: 768px) {
  .detail-header {
    padding: 10px 15px;
  }
  .detail-title {
    font-size: 18px;
    letter-spacing: 2px;
  }
  .back-btn {
    padding: 8px 14px;
    font-size: 12px;
  }
  .palace-list-panel {
    right: 10px;
    left: 10px;
    width: auto;
    top: 60px;
    max-height: 300px;
  }
  .map-legend {
    left: 10px;
    bottom: 10px;
  }
  .legend-gradient {
    width: 120px;
  }
  .map-controls {
    flex-direction: row;
    right: 10px;
    top: auto;
    bottom: 80px;
    transform: none;
  }
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>
