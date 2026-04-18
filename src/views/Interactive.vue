<template>
  <div class="interactive-page">
    <div class="interactive-header">
      <div class="breadcrumb">
        <span class="breadcrumb-item" @click="goHome">🏠 首页</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">平台功能导览</span>
      </div>
      <div class="page-title-area">
        <h1 class="page-title">🖥️ 平台功能导览</h1>
        <p class="page-subtitle">探索宫殿数字孪生的无限可能</p>
      </div>
    </div>

    <div class="interactive-content">
      <aside class="sidebar">
        <nav class="module-nav">
          <div class="nav-section">
            <h3 class="nav-section-title">🕹️ 核心功能</h3>
            <button
              v-for="module in coreModules"
              :key="module.id"
              :class="['nav-item', { active: activeModule === module.id }]"
              @click="setActiveModule(module.id)"
            >
              <span class="module-icon">{{ module.icon }}</span>
              <div class="module-info">
                <span class="module-name">{{ module.name }}</span>
                <span class="module-desc">{{ module.desc }}</span>
              </div>
            </button>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">📊 数据分析</h3>
            <button
              v-for="module in dataModules"
              :key="module.id"
              :class="['nav-item', { active: activeModule === module.id }]"
              @click="setActiveModule(module.id)"
            >
              <span class="module-icon">{{ module.icon }}</span>
              <div class="module-info">
                <span class="module-name">{{ module.name }}</span>
                <span class="module-desc">{{ module.desc }}</span>
              </div>
            </button>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="footer-nav">
            <button class="footer-nav-item" @click="goHome">
              <span>🏠</span> 返回首页
            </button>
            <button class="footer-nav-item" @click="goDataSources">
              <span>📚</span> 数据来源
            </button>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <div class="content-wrapper">
          <ThreeVisualization
            v-if="activeModule === '3d'"
            :data="palaceData.palaces"
            :autoRotate="true"
          />
          <Overview v-else-if="activeModule === 'overview'" />
          <Layout v-else-if="activeModule === 'layout'" />
          <Craft v-else-if="activeModule === 'craft'" />
          <Achievement v-else-if="activeModule === 'achievement'" />
          <Comparison v-else-if="activeModule === 'comparison'" />
          <Timeline v-else-if="activeModule === 'timeline'" />
          <DataVisualization v-else-if="activeModule === 'visualization'" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { palaceData } from "../api/mockData.js";
import ThreeVisualization from "../components/ThreeVisualization.vue";
import Overview from "./Overview.vue";
import Layout from "./Layout.vue";
import Craft from "./Craft.vue";
import Achievement from "./Achievement.vue";
import Comparison from "./Comparison.vue";
import Timeline from "./Timeline.vue";
import DataVisualization from "./DataVisualization.vue";

const router = useRouter();

const coreModules = [
  { id: "3d", name: "3D交互展示", icon: "🏯", desc: "宫殿3D立体模型" },
  { id: "overview", name: "数据总览", icon: "📊", desc: "核心数据总览" },
];

const dataModules = [
  { id: "layout", name: "建筑规制", icon: "🏛️", desc: "建筑规制与布局" },
  { id: "craft", name: "工艺材料", icon: "🔨", desc: "工艺与材料数据" },
  { id: "achievement", name: "成就影响", icon: "🌟", desc: "成就与文化影响" },
  { id: "comparison", name: "宫殿对比", icon: "⚖️", desc: "多维度对比分析" },
  { id: "timeline", name: "历史时间线", icon: "📅", desc: "历史事件时间轴" },
  {
    id: "visualization",
    name: "数据可视化",
    icon: "📈",
    desc: "多维度图表分析",
  },
];

const activeModule = ref("3d");

const setActiveModule = (moduleId) => {
  activeModule.value = moduleId;
};

const goHome = () => {
  router.push("/");
};

const goDataSources = () => {
  router.push("/data-sources");
};
</script>

<style scoped>
.interactive-page {
  min-height: 100vh;
  background: #0a0a0f;
  display: flex;
  flex-direction: column;
}

.interactive-header {
  background: linear-gradient(
    180deg,
    rgba(20, 20, 30, 0.95),
    rgba(10, 10, 15, 0.9)
  );
  border-bottom: 2px solid rgba(218, 165, 32, 0.3);
  padding: 20px 30px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.breadcrumb-item {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: #daa520;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.4);
}

.breadcrumb-current {
  color: #daa520;
  font-size: 14px;
}

.page-title-area {
  text-align: center;
}

.page-title {
  color: #daa520;
  font-size: 28px;
  margin: 0 0 8px 0;
  font-family: "SimSun", "STSong", serif;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0;
}

.interactive-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 300px;
  background: linear-gradient(
    180deg,
    rgba(15, 15, 25, 0.95),
    rgba(10, 10, 15, 0.98)
  );
  border-right: 2px solid rgba(218, 165, 32, 0.2);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.nav-section {
  padding: 20px 15px 10px;
}

.nav-section:not(:last-child) {
  border-bottom: 1px solid rgba(218, 165, 32, 0.1);
}

.nav-section-title {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 12px 8px;
}

.module-nav {
  flex: 1;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(218, 165, 32, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.nav-item:hover {
  background: rgba(218, 165, 32, 0.08);
  border-color: rgba(218, 165, 32, 0.3);
  transform: translateX(5px);
}

.nav-item.active {
  background: linear-gradient(
    135deg,
    rgba(139, 0, 0, 0.3),
    rgba(218, 165, 32, 0.15)
  );
  border-color: #daa520;
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.15);
}

.module-icon {
  font-size: 26px;
  min-width: 36px;
  text-align: center;
}

.module-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.module-name {
  color: #ffd700;
  font-size: 14px;
  font-weight: bold;
  font-family: "SimSun", "STSong", serif;
}

.module-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid rgba(218, 165, 32, 0.2);
}

.footer-nav {
  display: flex;
  gap: 10px;
}

.footer-nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(218, 165, 32, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-nav-item:hover {
  background: rgba(218, 165, 32, 0.1);
  border-color: #daa520;
  color: #ffd700;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 400px;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 260px;
  }

  .module-icon {
    font-size: 22px;
    min-width: 30px;
  }

  .module-name {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .interactive-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 2px solid rgba(218, 165, 32, 0.3);
    max-height: none;
  }

  .module-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .nav-section {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 15px;
    border-bottom: none;
  }

  .nav-section-title {
    width: 100%;
    margin: 0 0 8px 0;
  }

  .nav-item {
    min-width: calc(50% - 5px);
    margin-bottom: 0;
  }

  .sidebar-footer {
    display: none;
  }

  .main-content {
    padding: 15px;
  }
}
</style>
