<template>
  <div class="palace-detail" :class="`palace-theme-${palace?.id || 1}`">
    <div class="nav-bar">
      <button class="back-btn" @click="goBack">← 返回首页</button>
      <h1 class="page-title">{{ palace?.name || "宫殿详情" }}</h1>
    </div>

    <div class="detail-content" v-if="palace">
      <div class="hero-banner">
        <div
          class="banner-image"
          :style="{ backgroundImage: `url(${palace.image || defaultImage})` }"
        >
          <div class="banner-overlay"></div>
        </div>
        <div class="banner-content">
          <div class="banner-badge">{{ palace.dynasty }}</div>
          <h2 class="palace-name">{{ palace.name }}</h2>
          <p class="palace-subtitle">{{ getPalaceTagline(palace.id) }}</p>
        </div>
        <div class="banner-particles"></div>
      </div>

      <div class="stats-row">
        <div
          class="stat-card"
          v-for="stat in getPalaceStats(palace.id)"
          :key="stat.label"
        >
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <div class="main-content">
        <div class="content-left">
          <div class="section-card">
            <h2 class="section-title">
              <span class="title-icon">📜</span>
              历史沿革
            </h2>
            <div class="timeline">
              <div
                class="timeline-item"
                v-for="(event, index) in getPalaceTimeline(palace.id)"
                :key="index"
              >
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-year">{{ event.year }}</div>
                  <div class="timeline-title">{{ event.title }}</div>
                  <div class="timeline-desc">{{ event.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h2 class="section-title">
              <span class="title-icon">🏛️</span>
              建筑规制
            </h2>
            <div class="buildings-grid">
              <div
                class="building-item"
                v-for="building in getPalaceBuildings(palace.id)"
                :key="building.name"
              >
                <div class="building-icon">{{ building.icon }}</div>
                <div class="building-name">{{ building.name }}</div>
                <div class="building-desc">{{ building.desc }}</div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h2 class="section-title">
              <span class="title-icon">🎖️</span>
              精彩看点
            </h2>
            <div class="highlights-list">
              <div
                class="highlight-item"
                v-for="(highlight, index) in palace.highlights"
                :key="index"
              >
                <span class="highlight-bullet">✦</span>
                <span class="highlight-text">{{ highlight }}</span>
              </div>
            </div>
          </div>

          <div class="section-card">
            <h2 class="section-title">
              <span class="title-icon">🏺</span>
              文物珍藏
            </h2>
            <div class="heritage-grid">
              <div
                class="heritage-item"
                v-for="(item, index) in palace.culturalHeritage"
                :key="index"
              >
                <span class="heritage-icon">📿</span>
                <span class="heritage-text">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="content-right">
          <div class="section-card">
            <h2 class="section-title">
              <span class="title-icon">📊</span>
              布局数据
            </h2>
            <div ref="layoutChartRef" class="chart-container"></div>
          </div>

          <div class="section-card">
            <h2 class="section-title">
              <span class="title-icon">📈</span>
              横向对比
            </h2>
            <div ref="compareChartRef" class="chart-container"></div>
          </div>

          <div class="section-card">
            <h2 class="section-title">
              <span class="title-icon">🎯</span>
              历史地位
            </h2>
            <div class="achievement-list">
              <div
                class="achievement-item"
                v-for="achievement in getPalaceAchievements(palace.id)"
                :key="achievement.title"
              >
                <div class="achievement-badge">{{ achievement.badge }}</div>
                <div class="achievement-text">
                  <div class="achievement-title">{{ achievement.title }}</div>
                  <div class="achievement-desc">{{ achievement.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="description-section">
        <div class="section-card full-width">
          <h2 class="section-title">
            <span class="title-icon">📖</span>
            宫殿概述
          </h2>
          <div class="description-content">
            <p>{{ palace.description }}</p>
          </div>
        </div>
      </div>

      <div class="gallery-section">
        <h2 class="section-title">
          <span class="title-icon">🖼️</span>
          宫殿图集
        </h2>
        <div class="gallery-grid">
          <div
            class="gallery-item"
            v-for="(img, index) in getPalaceGallery(palace.id)"
            :key="index"
            :style="{ backgroundImage: `url(${img})` }"
          ></div>
        </div>
      </div>

      <div class="cultural-section">
        <div class="section-card full-width">
          <h2 class="section-title">
            <span class="title-icon">💫</span>
            文化意义
          </h2>
          <div class="cultural-content">
            <p>{{ getPalaceCulturalSignificance(palace.id) }}</p>
          </div>
        </div>
      </div>

      <div class="location-section">
        <h2 class="section-title">
          <span class="title-icon">📍</span>
          地理位置
        </h2>
        <div class="location-cards">
          <div class="location-card">
            <div class="location-icon">🌐</div>
            <div class="location-label">纬度</div>
            <div class="location-value">{{ palace.location.lat }}°N</div>
          </div>
          <div class="location-card">
            <div class="location-icon">🌐</div>
            <div class="location-label">经度</div>
            <div class="location-value">{{ palace.location.lng }}°E</div>
          </div>
          <div class="location-card">
            <div class="location-icon">🏯</div>
            <div class="location-label">今址</div>
            <div class="location-value">{{ getModernLocation(palace.id) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="loading" v-else>
      <div class="loading-spinner"></div>
      <p>正在加载宫殿信息...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as echarts from "echarts";
import { palaceData } from "@/api/mockData";

const router = useRouter();
const route = useRoute();
const layoutChartRef = ref(null);
const compareChartRef = ref(null);
const defaultImage =
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200&q=80";

const palace = computed(() => {
  const id = parseInt(route.params.id);
  return palaceData.palaces.find((p) => p.id === id);
});

const getPalaceTagline = (id) => {
  const taglines = {
    1: "世界现存规模最大、保存最为完整的木质结构古建筑群",
    2: "盛唐文明的象征，中国古代宫殿建筑的巅峰之作",
    3: "蒙汉文化交融的典范，元朝帝国的政治中心",
    4: "繁华市井与皇家园林的完美融合",
    5: "丝绸之路的起点，西汉帝国的政治文化中心",
    6: "隋唐盛世的开端，中国宫殿建筑的重要里程碑",
  };
  return taglines[id] || "";
};

const getPalaceStats = (id) => {
  if (!palace.value) return [];
  const p = palace.value;
  const end = p.endYear < 0 ? Math.abs(p.endYear) : p.endYear;
  const duration = end - p.startYear;
  const durationText =
    duration > 0 ? `${duration}年` : `${Math.abs(duration)}年`;
  return [
    { icon: "📐", value: `${p.area}万`, label: "占地面积" },
    { icon: "🏠", value: p.houses.toLocaleString(), label: "房屋数量" },
    {
      icon: "👑",
      value: getPalaceStatExtra(p.id),
      label: getPalaceStatExtraLabel(p.id),
    },
    { icon: "📅", value: durationText, label: "使用时长" },
  ];
};

const getPalaceStatExtra = (id) => {
  const extras = {
    1: "24位",
    2: "40+",
    3: "元明清",
    4: "御花园",
    5: "丝绸之路",
    6: "2年",
  };
  return extras[id] || "";
};

const getPalaceStatExtraLabel = (id) => {
  const labels = {
    1: "在位皇帝",
    2: "主要殿宇",
    3: "历史沿用",
    4: "园林典范",
    5: "历史地位",
    6: "建造周期",
  };
  return labels[id] || "";
};

const getPalaceTimeline = (id) => {
  const timelines = {
    1: [
      { year: "1406年", title: "开始营建", desc: "明成祖下令开始修建紫禁城" },
      { year: "1420年", title: "正式落成", desc: "历时14年，紫禁城正式竣工" },
      {
        year: "1644年",
        title: "清代入关",
        desc: "清军入关，开始清代使用紫禁城",
      },
      { year: "1912年", title: "宣统退位", desc: "清朝结束，帝王时代终结" },
      { year: "1925年", title: "成立博物院", desc: "故宫博物院正式成立" },
    ],
    2: [
      { year: "634年", title: "始建大明宫", desc: "唐太宗下令修建大明宫" },
      { year: "662年", title: "含元殿建成", desc: "大明宫主体建筑含元殿落成" },
      { year: "670年", title: "太平宫建成", desc: "大明宫建筑群日趋完善" },
      { year: "686年", title: "武则天临朝", desc: "武则天在大明宫处理朝政" },
      { year: "896年", title: "毁于战火", desc: "大明宫在战乱中遭到破坏" },
    ],
    3: [
      { year: "1267年", title: "开始营建", desc: "忽必烈下令建造大都皇宫" },
      { year: "1274年", title: "基本完工", desc: "大都皇宫主体建筑完成" },
      { year: "1368年", title: "元朝灭亡", desc: "元顺帝北逃，大都失守" },
      { year: "1403年", title: "明代重建", desc: "朱棣开始在北京建造新皇宫" },
    ],
    4: [
      { year: "960年", title: "北宋建立", desc: "赵匡胤建立北宋，定都开封" },
      { year: "965年", title: "皇宫竣工", desc: "东京皇宫主体建筑完成" },
      { year: "1004年", title: "澶渊之盟", desc: "北宋鼎盛时期，皇宫规模最大" },
      { year: "1127年", title: "靖康之变", desc: "金军攻破开封，皇宫被毁" },
    ],
    5: [
      { year: "200年", title: "开始营建", desc: "汉高祖开始修建未央宫" },
      { year: "198年", title: "主体建成", desc: "未央宫前殿等主要建筑完工" },
      { year: "200年", title: "正式迁都", desc: "刘邦将皇宫从栎阳迁至长安" },
      { year: "202年", title: "更名为长乐宫", desc: "萧何主持改建未央宫" },
      { year: "公元25年", title: "东汉延续", desc: "东汉继续使用未央宫" },
    ],
    6: [
      { year: "582年", title: "开始营建", desc: "隋文帝下令修建大兴宫" },
      { year: "583年", title: "主体完工", desc: "大兴宫主体建筑完工" },
      { year: "604年", title: "仁寿宫建成", desc: "隋炀帝修建仁寿宫" },
      { year: "618年", title: "隋朝灭亡", desc: "隋炀帝被杀，隋朝结束" },
    ],
  };
  return timelines[id] || [];
};

const getPalaceBuildings = (id) => {
  const buildingsMap = {
    1: [
      { icon: "👑", name: "太和殿", desc: "皇帝举行大典的场所" },
      { icon: "⚖️", name: "中和殿", desc: "皇帝休息和受贺之地" },
      { icon: "📖", name: "保和殿", desc: "科举考试和宴会场所" },
      { icon: "🏯", name: "乾清宫", desc: "皇帝处理政务之所" },
      { icon: "💍", name: "坤宁宫", desc: "皇后寝宫" },
      { icon: "🌸", name: "御花园", desc: "皇家园林景观" },
    ],
    2: [
      { icon: "👑", name: "含元殿", desc: "大明宫正殿，气势恢宏" },
      { icon: "🐉", name: "麟德殿", desc: "皇帝接见外国使节" },
      { icon: "📚", name: "翰林院", desc: "文人学士聚集之地" },
      { icon: "🌿", name: "太液池", desc: "皇家园林水景" },
    ],
    3: [
      { icon: "🏛️", name: "大内", desc: "皇宫核心区域" },
      { icon: "⚔️", name: "武成殿", desc: "军事指挥中心" },
      { icon: "🎭", name: "百戏堂", desc: "歌舞表演场所" },
    ],
    4: [
      { icon: "📜", name: "文德殿", desc: "举行大典和接见" },
      { icon: "🎋", name: "御花园", desc: "皇家园林典范" },
      { icon: "💧", name: "金水河", desc: "宫内水系" },
    ],
    5: [
      { icon: "👑", name: "前殿", desc: "朝会听政之所" },
      { icon: "📚", name: "天禄阁", desc: "皇家藏书楼" },
      { icon: "🛤️", name: "丝绸之路", desc: "起点标志" },
    ],
    6: [
      { icon: "🏛️", name: "大兴殿", desc: "正殿建筑" },
      { icon: "🌸", name: "仁寿宫", desc: "皇家园林" },
      { icon: "⚔️", name: "武备库", desc: "兵器储藏" },
    ],
  };
  return buildingsMap[id] || [];
};

const getPalaceAchievements = (id) => {
  const achievementsMap = {
    1: [
      { badge: "🏆", title: "世界文化遗产", desc: "列入《世界遗产名录》" },
      { badge: "📚", title: "中国传统文化", desc: "明清宫廷文化的代表" },
      { badge: "🏛️", title: "建筑典范", desc: "中国古代建筑的最高成就" },
    ],
    2: [
      { badge: "✨", title: "盛唐象征", desc: "唐朝盛世的重要标志" },
      { badge: "🌍", title: "国际影响", desc: "对日本、朝鲜等建筑影响深远" },
      { badge: "📜", title: "诗词典故", desc: "众多唐诗以此为题" },
    ],
    3: [
      { badge: "🌐", title: "民族交融", desc: "蒙汉文化融合的见证" },
      { badge: "🏛️", title: "都城典范", desc: "元大都规划影响后世" },
    ],
    4: [
      { badge: "🎨", title: "美学典范", desc: "宋代建筑美学的代表" },
      { badge: "📈", title: "商业繁荣", desc: "当时世界上最繁华的城市" },
    ],
    5: [
      { badge: "🛤️", title: "丝路起点", desc: "丝绸之路的重要起点" },
      { badge: "🏛️", title: "建筑规制", desc: "确立了汉代宫殿建筑范式" },
    ],
    6: [
      { badge: "🏗️", title: "建筑先驱", desc: "开创隋唐宫殿建筑先河" },
      { badge: "⚡", title: "短命王朝", desc: "见证隋朝兴衰" },
    ],
  };
  return achievementsMap[id] || [];
};

const getPalaceGallery = (id) => {
  const galleries = {
    1: [
      new URL("../assets/images/明清紫禁城1.jpg", import.meta.url).href,
      new URL("../assets/images/明清紫禁城2.jpg", import.meta.url).href,
      new URL("../assets/images/明清紫禁城3.jpg", import.meta.url).href,
    ],
    2: [
      new URL("../assets/images/唐代大明宫1.jpg", import.meta.url).href,
      new URL("../assets/images/唐代大明宫2.jpg", import.meta.url).href,
      new URL("../assets/images/唐代大明宫3.jpg", import.meta.url).href,
    ],
    3: [
      new URL("../assets/images/元代大都皇宫1.jpg", import.meta.url).href,
      new URL("../assets/images/元代大都皇宫2.jpg", import.meta.url).href,
      new URL("../assets/images/元代大都皇宫3.jpg", import.meta.url).href,
    ],
    4: [
      new URL("../assets/images/宋代东京皇宫1.jpg", import.meta.url).href,
      new URL("../assets/images/宋代东京皇宫2.jpg", import.meta.url).href,
      new URL("../assets/images/宋代东京皇宫3.jpg", import.meta.url).href,
    ],
    5: [
      new URL("../assets/images/未央宫1.jpg", import.meta.url).href,
      new URL("../assets/images/未央宫2.jpg", import.meta.url).href,
      new URL("../assets/images/未央宫3.jpg", import.meta.url).href,
    ],
    6: [
      new URL("../assets/images/隋代大兴宫1.jpg", import.meta.url).href,
      new URL("../assets/images/隋代大兴宫2.jpg", import.meta.url).href,
      new URL("../assets/images/隋代大兴宫3.jpg", import.meta.url).href,
    ],
  };
  return galleries[id] || galleries[1];
};

const getPalaceCulturalSignificance = (id) => {
  const significances = {
    1: '紫禁城作为明清两代24位皇帝的皇宫，是中国古代宫廷文化的巅峰之作。它不仅是一座建筑群，更是中华文明五千年历史的缩影。紫禁城的建筑布局严格遵循"前朝后寝"的礼制原则，其建筑艺术、文物收藏和文化底蕴使之成为研究中国古代政治制度、文化艺术的重要载体。1987年，紫禁城被列入《世界遗产名录》，成为全人类共同的文化瑰宝。',
    2: "大明宫是唐代皇帝处理朝政和生活起居的中心，见证了唐朝近三百年的辉煌。作为盛唐文明的象征，大明宫的规划和建筑设计对后世宫殿建筑产生了深远影响，尤其是对日本平城京和平安京的皇宫规划影响显著。唐代诗人李白、杜甫等都在诗作中描绘了大明宫的雄伟壮观。",
    3: "元代大都皇宫是蒙古族建立的大元帝国的政治中心，其建筑风格融合了汉族、蒙古族、藏族等多民族文化元素，体现了中华文明多元一体的特点。皇宫的规划和建设为后来明清紫禁城的设计提供了重要参考，见证了元朝大一统帝国的强盛国力。",
    4: "宋代东京皇宫位于当时世界上最大的城市开封，其建筑设计精致典雅，融合了南北建筑风格。北宋时期的东京是当时全球最繁华的城市，皇宫的规划和建设体现了宋代高度发达的城市文明和建筑艺术水平。著名的《清明上河图》就是以东京城为背景创作的。",
    5: '未央宫是西汉帝国的政治文化中心，其规模宏大，建筑规制对后世宫殿建筑产生了深远影响。作为丝绸之路的起点，未央宫见证了汉朝与西域各国的交往，是中华文明与世界文明交流的重要窗口。未央宫的建筑布局开创了宫殿建筑"面朝后市"的先河，为后世宫殿设计奠定了基础。',
    6: "大兴宫是隋朝皇宫，开创了隋唐宫殿建筑的先河。虽然使用时间不长，但大兴宫的建筑规制和布局为唐代大明宫提供了重要参考。隋炀帝修建的仁寿宫更是将皇家园林艺术推向了新的高度，为后世皇家园林建设奠定了基础。",
  };
  return significances[id] || "";
};

const getModernLocation = (id) => {
  const locations = {
    1: "北京市",
    2: "陕西省西安市",
    3: "北京市",
    4: "河南省开封市",
    5: "陕西省西安市",
    6: "陕西省西安市",
  };
  return locations[id] || "";
};

const initLayoutChart = () => {
  if (!layoutChartRef.value || !palace.value) return;

  const chart = echarts.init(layoutChartRef.value);
  const layoutData = palace.value.layout;

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}%",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#0a0a0f",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}\n{c}%",
          color: "#FFD700",
          fontSize: 14,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        data: [
          {
            value: layoutData.outerCourt,
            name: "外朝",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#8B0000" },
                { offset: 1, color: "#DAA520" },
              ]),
            },
          },
          {
            value: layoutData.innerCourt,
            name: "内廷",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#DAA520" },
                { offset: 1, color: "#FFD700" },
              ]),
            },
          },
          {
            value: layoutData.garden,
            name: "园林",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#228B22" },
                { offset: 1, color: "#32CD32" },
              ]),
            },
          },
        ],
      },
    ],
  };

  chart.setOption(option);
};

const initCompareChart = () => {
  if (!compareChartRef.value || !palace.value) return;

  const chart = echarts.init(compareChartRef.value);
  const palaces = palaceData.palaces;
  const currentPalace = palace.value;

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["占地面积(万㎡)", "房屋数量(百间)"],
      textStyle: { color: "#FFD700" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: palaces.map((p) => p.name),
      axisLabel: {
        color: "#fff",
        rotate: 30,
        fontSize: 10,
      },
      axisLine: { lineStyle: { color: "#DAA520" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#fff" },
      splitLine: { lineStyle: { color: "rgba(218, 165, 32, 0.2)" } },
    },
    series: [
      {
        name: "占地面积(万㎡)",
        type: "bar",
        data: palaces.map((p) => p.area),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#8B0000" },
            { offset: 1, color: "#DAA520" },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        markPoint: {
          data: [{ type: "max", name: "最大值" }],
          label: { color: "#FFD700" },
        },
      },
      {
        name: "房屋数量(百间)",
        type: "bar",
        data: palaces.map((p) => Math.round(p.houses / 100)),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#DAA520" },
            { offset: 1, color: "#FFD700" },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  chart.setOption(option);
};

const goBack = () => {
  router.push("/");
};

onMounted(() => {
  if (!palace.value) {
    router.push("/");
  } else {
    nextTick(() => {
      initLayoutChart();
      initCompareChart();
    });
  }

  window.addEventListener("resize", () => {
    if (layoutChartRef.value) {
      echarts.getInstanceByDom(layoutChartRef.value)?.resize();
    }
    if (compareChartRef.value) {
      echarts.getInstanceByDom(compareChartRef.value)?.resize();
    }
  });
});
</script>

<style scoped>
.palace-detail {
  min-height: 100vh;
  padding: 20px;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
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

.hero-banner {
  position: relative;
  height: 450px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 30px;
}

.banner-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.hero-banner:hover .banner-image {
  transform: scale(1.05);
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

.banner-content {
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 2;
}

.banner-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(218, 165, 32, 0.9);
  color: #1a1a1a;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
}

.palace-name {
  font-size: 48px;
  color: #ffd700;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.palace-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  max-width: 600px;
}

.banner-particles {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 20% 80%,
      rgba(218, 165, 32, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(circle at 80% 20%, rgba(139, 0, 0, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: #daa520;
  box-shadow: 0 10px 30px rgba(218, 165, 32, 0.2);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 30px;
}

.content-left,
.content-right {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-card {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.2);
  border-radius: 12px;
  padding: 25px;
}

.section-card.full-width {
  grid-column: 1 / -1;
}

.section-title {
  color: #daa520;
  font-size: 20px;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid #8b0000;
  padding-bottom: 10px;
}

.title-icon {
  font-size: 24px;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #daa520, #8b0000);
}

.timeline-item {
  position: relative;
  padding-bottom: 25px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -26px;
  top: 0;
  width: 14px;
  height: 14px;
  background: #daa520;
  border-radius: 50%;
  border: 3px solid #0a0a0f;
}

.timeline-content {
  background: rgba(139, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #daa520;
}

.timeline-year {
  font-size: 14px;
  color: #daa520;
  font-weight: bold;
  margin-bottom: 5px;
}

.timeline-title {
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 5px;
}

.timeline-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.buildings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.building-item {
  background: rgba(139, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.building-item:hover {
  background: rgba(218, 165, 32, 0.2);
  transform: translateY(-3px);
}

.building-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.building-name {
  font-size: 16px;
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 5px;
}

.building-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.highlights-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  background: rgba(139, 0, 0, 0.2);
  border-radius: 8px;
  border-left: 3px solid #daa520;
  transition: all 0.3s ease;
}

.highlight-item:hover {
  background: rgba(218, 165, 32, 0.2);
  transform: translateX(5px);
}

.highlight-bullet {
  color: #daa520;
  font-size: 16px;
}

.highlight-text {
  color: #fff8dc;
  font-size: 14px;
  line-height: 1.5;
}

.heritage-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.heritage-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(139, 0, 0, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.heritage-item:hover {
  background: rgba(218, 165, 32, 0.2);
  transform: scale(1.02);
}

.heritage-icon {
  font-size: 20px;
}

.heritage-text {
  color: #fff8dc;
  font-size: 13px;
}

.description-content {
  background: rgba(139, 0, 0, 0.2);
  padding: 25px;
  border-radius: 12px;
  border-left: 4px solid #daa520;
}

.description-content p {
  color: #fff8dc;
  font-size: 16px;
  line-height: 1.9;
  margin: 0;
  text-align: justify;
}

.chart-container {
  width: 100%;
  height: 280px;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.achievement-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  padding: 12px;
  background: rgba(139, 0, 0, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.achievement-item:hover {
  background: rgba(218, 165, 32, 0.2);
}

.achievement-badge {
  font-size: 24px;
  flex-shrink: 0;
}

.achievement-title {
  font-size: 16px;
  color: #ffd700;
  font-weight: bold;
  margin-bottom: 5px;
}

.achievement-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.gallery-section {
  margin-bottom: 30px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.gallery-item {
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.gallery-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover::before {
  opacity: 1;
}

.gallery-item:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.cultural-section {
  margin-bottom: 30px;
}

.cultural-content {
  background: rgba(139, 0, 0, 0.2);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #daa520;
}

.cultural-content p {
  color: #fff8dc;
  font-size: 16px;
  line-height: 1.8;
  margin: 0;
}

.description-section {
  margin-bottom: 30px;
}

.location-section {
  margin-bottom: 30px;
}

.location-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.location-card {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.2);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
}

.location-card:hover {
  border-color: #daa520;
  transform: translateY(-3px);
}

.location-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.location-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.location-value {
  font-size: 18px;
  color: #ffd700;
  font-weight: bold;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
  color: #daa520;
  font-size: 24px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(218, 165, 32, 0.3);
  border-top-color: #daa520;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .location-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    height: 350px;
  }

  .banner-content {
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  .palace-name {
    font-size: 32px;
  }

  .palace-subtitle {
    font-size: 14px;
  }

  .stats-row {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-value {
    font-size: 22px;
  }

  .buildings-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .nav-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .hero-banner {
    height: 280px;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .palace-name {
    font-size: 28px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
