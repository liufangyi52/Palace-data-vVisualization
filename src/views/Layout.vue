<template>
  <div class="layout">
    <div class="nav-bar">
      <button class="back-btn" @click="goHome">← 返回首页</button>
      <h1 class="page-title">建筑规制与布局</h1>
    </div>

    <div class="charts-row">
      <div class="chart-container card">
        <h2 class="section-title">紫禁城功能分区占比</h2>
        <div ref="ringChartRef" class="chart"></div>
      </div>
      <div class="chart-container card">
        <h2 class="section-title">宫殿等级对比</h2>
        <div ref="rankChartRef" class="chart"></div>
      </div>
    </div>

    <div class="layout-diagram card">
      <h2 class="section-title">紫禁城简化布局示意图</h2>
      <div class="diagram-container">
        <div class="layout-svg">
          <svg viewBox="0 0 600 400">
            <rect x="50" y="30" width="500" height="340" fill="none" stroke="#DAA520" stroke-width="2"/>
            
            <rect x="70" y="50" width="460" height="180" fill="#8B0000" opacity="0.3"/>
            <text x="300" y="140" text-anchor="middle" fill="#FFD700" font-size="16">外朝 (60%)</text>
            <text x="300" y="170" text-anchor="middle" fill="#FFF8DC" font-size="12">太和殿 · 中和殿 · 保和殿</text>
            
            <rect x="70" y="240" width="460" height="100" fill="#DAA520" opacity="0.3"/>
            <text x="300" y="295" text-anchor="middle" fill="#8B0000" font-size="16">内廷 (30%)</text>
            <text x="300" y="320" text-anchor="middle" fill="#FFF8DC" font-size="12">乾清宫 · 交泰殿 · 坤宁宫</text>
            
            <rect x="70" y="350" width="460" height="50" fill="#4a4a4a" opacity="0.5"/>
            <text x="300" y="380" text-anchor="middle" fill="#FFF8DC" font-size="14">御花园 (10%)</text>
            
            <line x1="300" y1="30" x2="300" y2="400" stroke="#DAA520" stroke-width="1" stroke-dasharray="5,5"/>
            <text x="310" y="220" fill="#FFD700" font-size="12">中轴线</text>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { palaceData } from '@/api/mockData'

const router = useRouter()
const ringChartRef = ref(null)
const rankChartRef = ref(null)
let ringChart = null
let rankChart = null

const goHome = () => {
  router.push('/')
}

const initRingChart = () => {
  if (!ringChartRef.value) return
  if (ringChart) {
    ringChart.dispose()
  }
  ringChart = echarts.init(ringChartRef.value)
  const forbiddenCity = palaceData.palaces[0]
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: { color: '#FFD700' }
    },
    series: [{
      name: '功能分区',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#1a1a1a',
        borderWidth: 2
      },
      label: {
        show: true,
        color: '#FFF8DC'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      data: [
        { value: forbiddenCity.layout.outerCourt, name: '外朝', itemStyle: { color: '#8B0000' } },
        { value: forbiddenCity.layout.innerCourt, name: '内廷', itemStyle: { color: '#DAA520' } },
        { value: forbiddenCity.layout.garden, name: '御花园', itemStyle: { color: '#4a4a4a' } }
      ]
    }]
  }
  ringChart.setOption(option)
}

const initRankChart = () => {
  if (!rankChartRef.value) return
  if (rankChart) {
    rankChart.dispose()
  }
  rankChart = echarts.init(rankChartRef.value)
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['开间数量', '屋顶等级'],
      textStyle: { color: '#FFD700' },
      top: '5%'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['太和殿', '中和殿', '保和殿', '乾清宫'],
      axisLabel: { color: '#FFD700' },
      axisLine: { lineStyle: { color: '#DAA520' } }
    },
    yAxis: [
      {
        type: 'value',
        name: '开间数量',
        axisLabel: { color: '#FFD700' },
        axisLine: { lineStyle: { color: '#DAA520' } }
      },
      {
        type: 'value',
        name: '屋顶等级',
        max: 5,
        axisLabel: { color: '#FFD700' },
        axisLine: { lineStyle: { color: '#DAA520' } }
      }
    ],
    series: [
      {
        name: '开间数量',
        type: 'bar',
        data: [11, 5, 9, 9],
        itemStyle: { color: '#8B0000' }
      },
      {
        name: '屋顶等级',
        type: 'line',
        yAxisIndex: 1,
        data: [5, 4, 5, 4],
        itemStyle: { color: '#DAA520' },
        lineStyle: { width: 3 }
      }
    ]
  }
  rankChart.setOption(option)
}

const handleResize = () => {
  ringChart?.resize()
  rankChart?.resize()
}

const initAllCharts = () => {
  nextTick(() => {
    initRingChart()
    initRankChart()
  })
}

onMounted(() => {
  initAllCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  ringChart?.dispose()
  rankChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.layout {
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
  background: linear-gradient(90deg, #8B0000, #B22222);
  color: #FFD700;
  border: 2px solid #DAA520;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: linear-gradient(90deg, #B22222, #8B0000);
  box-shadow: 0 4px 15px rgba(139, 0, 0, 0.4);
  transform: translateX(-3px);
}

.page-title {
  color: #DAA520;
  font-size: 28px;
  margin: 0;
  font-family: 'SimSun', 'STSong', serif;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.chart-container {
  padding: 20px;
}

.chart {
  width: 100%;
  height: 400px;
}

.section-title {
  color: var(--color-yellow-light);
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid var(--color-red);
  padding-bottom: 10px;
  font-family: 'SimSun', 'STSong', serif;
}

.layout-diagram {
  padding: 20px;
}

.diagram-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-svg {
  width: 100%;
  max-width: 700px;
}
</style>
