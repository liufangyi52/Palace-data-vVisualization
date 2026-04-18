import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Overview from "@/views/Overview.vue";
import Layout from "@/views/Layout.vue";
import Craft from "@/views/Craft.vue";
import Achievement from "@/views/Achievement.vue";
import PalaceDetail from "@/views/PalaceDetail.vue";
import Comparison from "@/views/Comparison.vue";
import Timeline from "@/views/Timeline.vue";
import DataVisualization from "@/views/DataVisualization.vue";
import Interactive from "@/views/Interactive.vue";
import DataSources from "@/views/DataSources.vue";
import PalaceMapPage from "@/views/PalaceMapPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "首页概览" },
  },
  {
    path: "/interactive",
    name: "Interactive",
    component: Interactive,
    meta: { title: "交互界面" },
  },
  {
    path: "/data-sources",
    name: "DataSources",
    component: DataSources,
    meta: { title: "数据来源" },
  },
  {
    path: "/overview",
    name: "Overview",
    component: Overview,
    meta: { title: "数据总览" },
  },
  {
    path: "/layout",
    name: "Layout",
    component: Layout,
    meta: { title: "建筑规制" },
  },
  {
    path: "/craft",
    name: "Craft",
    component: Craft,
    meta: { title: "工艺材料" },
  },
  {
    path: "/achievement",
    name: "Achievement",
    component: Achievement,
    meta: { title: "成就影响" },
  },
  {
    path: "/palace/:id",
    name: "PalaceDetail",
    component: PalaceDetail,
    meta: { title: "宫殿详情" },
  },
  {
    path: "/comparison",
    name: "Comparison",
    component: Comparison,
    meta: { title: "宫殿对比" },
  },
  {
    path: "/timeline",
    name: "Timeline",
    component: Timeline,
    meta: { title: "历史时间线" },
  },
  {
    path: "/visualization",
    name: "DataVisualization",
    component: DataVisualization,
    meta: { title: "数据可视化" },
  },
  {
    path: "/palace-map",
    name: "PalaceMapPage",
    component: PalaceMapPage,
    meta: { title: "宫殿地图" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? `${to.meta.title} - 中华宫殿`
    : "中华宫殿数字孪生平台";
  next();
});

export default router;
