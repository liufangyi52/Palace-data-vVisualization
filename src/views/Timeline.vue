<template>
  <div class="timeline-page">
    <div class="nav-bar">
      <button class="back-btn" @click="goBack">← 返回首页</button>
      <h1 class="page-title">宫殿历史时间线</h1>
    </div>

    <div class="timeline-controls">
      <div class="view-toggle">
        <button
          :class="['toggle-btn', { active: viewMode === 'combined' }]"
          @click="viewMode = 'combined'"
        >
          📅 综合时间线
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'individual' }]"
          @click="viewMode = 'individual'"
        >
          🏯 单独宫殿
        </button>
      </div>

      <div class="filter-controls">
        <label>筛选朝代：</label>
        <div class="dynasty-filters">
          <button
            v-for="dynasty in dynasties"
            :key="dynasty"
            :class="['filter-btn', { active: selectedDynasty === dynasty }]"
            @click="toggleDynasty(dynasty)"
          >
            {{ dynasty }}
          </button>
        </div>
      </div>
    </div>

    <div class="timeline-container" v-if="viewMode === 'combined'">
      <div class="timeline-axis">
        <div
          v-for="(event, index) in combinedTimeline"
          :key="index"
          class="timeline-event"
          :class="[event.type, { visible: isEventVisible(event) }]"
          @click="selectEvent(event)"
        >
          <div class="event-marker">
            <div class="marker-dot"></div>
            <div class="marker-line"></div>
          </div>
          <div class="event-content">
            <div class="event-year">{{ formatYear(event.year) }}</div>
            <div class="event-card">
              <div class="event-header">
                <span class="event-dynasty">{{ event.dynasty }}</span>
                <span class="event-type-badge">{{ event.typeLabel }}</span>
              </div>
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-palace">
                <span class="palace-icon">🏯</span>
                {{ event.palaceName }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="timeline-legend">
        <div class="legend-item">
          <span class="legend-color construction"></span>
          <span>建造事件</span>
        </div>
        <div class="legend-item">
          <span class="legend-color political"></span>
          <span>政治事件</span>
        </div>
        <div class="legend-item">
          <span class="legend-color cultural"></span>
          <span>文化事件</span>
        </div>
        <div class="legend-item">
          <span class="legend-color decline"></span>
          <span>衰落/终结</span>
        </div>
      </div>
    </div>

    <div class="individual-timelines" v-else>
      <div class="palace-tabs">
        <button
          v-for="palace in palaces"
          :key="palace.id"
          :class="['palace-tab', { active: selectedPalaceId === palace.id }]"
          @click="selectedPalaceId = palace.id"
        >
          {{ palace.name }}
        </button>
      </div>

      <div class="palace-timeline" v-if="selectedPalace">
        <div class="palace-header">
          <div
            class="palace-banner"
            :style="{ backgroundImage: `url(${selectedPalace.image})` }"
          >
            <div class="banner-overlay"></div>
            <div class="banner-content">
              <h2>{{ selectedPalace.name }}</h2>
              <p>{{ selectedPalace.dynasty }}</p>
            </div>
          </div>
        </div>

        <div class="palace-events">
          <div
            v-for="(event, index) in getPalaceTimeline(selectedPalace.id)"
            :key="index"
            class="palace-event"
            :class="event.type"
          >
            <div class="event-marker-circle">
              <div class="marker-inner"></div>
            </div>
            <div class="event-details">
              <div class="event-year-badge">{{ formatYear(event.year) }}</div>
              <div class="event-card-expanded">
                <span class="event-type-badge">{{ event.typeLabel }}</span>
                <h3>{{ event.title }}</h3>
                <p>{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="palace-summary">
          <div class="summary-item">
            <span class="summary-icon">⏱️</span>
            <span class="summary-label">存续时间</span>
            <span class="summary-value">{{
              getPalaceDuration(selectedPalace)
            }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-icon">📅</span>
            <span class="summary-label">重要事件</span>
            <span class="summary-value"
              >{{ getPalaceTimeline(selectedPalace.id).length }}件</span
            >
          </div>
          <div class="summary-item">
            <span class="summary-icon">🏗️</span>
            <span class="summary-label">建造时长</span>
            <span class="summary-value">{{
              getConstructionDuration(selectedPalace)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="event-modal"
      v-if="selectedEvent"
      @click.self="selectedEvent = null"
    >
      <div class="modal-content">
        <button class="modal-close" @click="selectedEvent = null">✕</button>
        <div class="modal-header">
          <span class="event-dynasty">{{ selectedEvent.dynasty }}</span>
          <span class="event-type-badge">{{ selectedEvent.typeLabel }}</span>
        </div>
        <h2 class="modal-title">{{ selectedEvent.title }}</h2>
        <div class="modal-year">{{ formatYear(selectedEvent.year) }}</div>
        <p class="modal-description">{{ selectedEvent.description }}</p>
        <div class="modal-palace">
          <span class="palace-icon">🏯</span>
          关联宫殿：{{ selectedEvent.palaceName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { palaceData } from "@/api/mockData";

const router = useRouter();
const palaces = palaceData.palaces;

const viewMode = ref("combined");
const selectedDynasty = ref("全部");
const selectedPalaceId = ref(1);
const selectedEvent = ref(null);

const dynasties = ["全部", "明", "清", "唐", "元", "宋", "汉", "隋"];

const combinedTimeline = computed(() => {
  const events = [];

  palaces.forEach((palace) => {
    const timelineEvents = generatePalaceEvents(palace);
    events.push(...timelineEvents);
  });

  return events.sort((a, b) => a.year - b.year);
});

const selectedPalace = computed(() =>
  palaces.find((p) => p.id === selectedPalaceId.value),
);

const generatePalaceEvents = (palace) => {
  const events = [];
  const startYear = palace.startYear;
  const endYear = palace.endYear;

  events.push({
    year: startYear,
    title: `${palace.name}开始建造`,
    description: `根据历史记载，${palace.name}于${Math.abs(startYear)}${startYear < 0 ? "公元前" : "年"}开始动工修建。`,
    dynasty: palace.dynasty,
    palaceName: palace.name,
    palaceId: palace.id,
    type: "construction",
    typeLabel: "建造",
  });

  if (endYear !== startYear) {
    events.push({
      year: endYear,
      title: `${palace.name}主体完工`,
      description: `经过多年建设，${palace.name}主体建筑于${Math.abs(endYear)}${endYear < 0 ? "公元前" : "年"}基本完工。`,
      dynasty: palace.dynasty,
      palaceName: palace.name,
      palaceId: palace.id,
      type: "construction",
      typeLabel: "完工",
    });
  }

  const midYear = Math.floor((startYear + endYear) / 2);
  if (Math.abs(endYear - startYear) > 50) {
    events.push({
      year: midYear,
      title: `${palace.name}鼎盛时期`,
      description: `${palace.name}在这一时期达到鼎盛，成为当时最重要的宫殿建筑群。`,
      dynasty: palace.dynasty,
      palaceName: palace.name,
      palaceId: palace.id,
      type: "cultural",
      typeLabel: "鼎盛",
    });
  }

  if (endYear > 0 && endYear < 1000) {
    events.push({
      year: endYear + 100,
      title: `${palace.name}衰落`,
      description: `随着朝代更替，${palace.name}逐渐失去往日辉煌，建筑也开始破败。`,
      dynasty: palace.dynasty,
      palaceName: palace.name,
      palaceId: palace.id,
      type: "decline",
      typeLabel: "衰落",
    });
  }

  return events;
};

const getPalaceTimeline = (palaceId) => {
  const palace = palaces.find((p) => p.id === palaceId);
  if (!palace) return [];
  return generatePalaceEvents(palace).sort((a, b) => a.year - b.year);
};

const getPalaceDuration = (palace) => {
  if (palace.startYear < 0 && palace.endYear < 0) {
    return `${Math.abs(palace.startYear) - Math.abs(palace.endYear)}年`;
  } else if (palace.startYear < 0 && palace.endYear > 0) {
    return `${palace.startYear + Math.abs(palace.endYear)}年`;
  } else {
    return `${palace.endYear - palace.startYear}年`;
  }
};

const getConstructionDuration = (palace) => {
  if (palace.startYear < 0 && palace.endYear < 0) {
    return `${Math.abs(palace.startYear) - Math.abs(palace.endYear)}年`;
  } else {
    return `${palace.endYear - palace.startYear}年`;
  }
};

const formatYear = (year) => {
  if (year < 0) {
    return `${Math.abs(year)} BC`;
  }
  return `${year} AD`;
};

const toggleDynasty = (dynasty) => {
  selectedDynasty.value = dynasty;
};

const isEventVisible = (event) => {
  if (selectedDynasty.value === "全部") return true;
  return event.dynasty.includes(selectedDynasty.value);
};

const selectEvent = (event) => {
  selectedEvent.value = event;
};

const goBack = () => {
  router.push("/");
};
</script>

<style scoped>
.timeline-page {
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

.timeline-controls {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.view-toggle {
  display: flex;
  gap: 10px;
}

.toggle-btn {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: 2px solid rgba(218, 165, 32, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: rgba(139, 0, 0, 0.5);
  border-color: #daa520;
  color: #ffd700;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-controls label {
  color: #ffd700;
  font-weight: bold;
}

.dynasty-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  border: 1px solid rgba(218, 165, 32, 0.3);
  padding: 6px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: rgba(218, 165, 32, 0.3);
  border-color: #daa520;
  color: #ffd700;
}

.timeline-container {
  position: relative;
  padding: 20px 0;
}

.timeline-axis {
  position: relative;
  padding-left: 100px;
}

.timeline-axis::before {
  content: "";
  position: absolute;
  left: 90px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #8b0000, #daa520, #ffd700);
}

.timeline-event {
  position: relative;
  padding: 20px 0 40px 50px;
  opacity: 0.3;
  transition: all 0.3s ease;
  cursor: pointer;
}

.timeline-event.visible {
  opacity: 1;
}

.timeline-event:hover {
  transform: translateX(10px);
}

.event-marker {
  position: absolute;
  left: -12px;
  top: 20px;
}

.marker-dot {
  width: 24px;
  height: 24px;
  background: #daa520;
  border: 4px solid #0a0a0f;
  border-radius: 50%;
  z-index: 2;
}

.timeline-event.construction .marker-dot {
  background: #8b0000;
}

.timeline-event.political .marker-dot {
  background: #daa520;
}

.timeline-event.cultural .marker-dot {
  background: #4a90d9;
}

.timeline-event.decline .marker-dot {
  background: #666;
}

.marker-line {
  position: absolute;
  left: 10px;
  top: 24px;
  width: 2px;
  height: 100%;
  background: rgba(218, 165, 32, 0.3);
}

.event-content {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.timeline-event:hover .event-content {
  border-color: #daa520;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.event-year {
  position: absolute;
  left: -90px;
  top: 20px;
  width: 80px;
  text-align: right;
  color: #daa520;
  font-weight: bold;
  font-size: 14px;
}

.event-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.event-dynasty {
  background: rgba(139, 0, 0, 0.5);
  color: #ffd700;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
}

.event-type-badge {
  background: rgba(218, 165, 32, 0.3);
  color: #ffd700;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
}

.event-title {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 18px;
}

.event-description {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 15px 0;
  font-size: 14px;
  line-height: 1.6;
}

.event-palace {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #daa520;
  font-size: 13px;
}

.palace-icon {
  font-size: 16px;
}

.timeline-legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 13px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-color.construction {
  background: #8b0000;
}

.legend-color.political {
  background: #daa520;
}

.legend-color.cultural {
  background: #4a90d9;
}

.legend-color.decline {
  background: #666;
}

.individual-timelines {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.palace-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.palace-tab {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: 2px solid rgba(218, 165, 32, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.palace-tab.active {
  background: rgba(139, 0, 0, 0.5);
  border-color: #daa520;
  color: #ffd700;
}

.palace-banner {
  height: 250px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
  margin-bottom: 30px;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.8) 100%);
  border-radius: 12px;
}

.banner-content {
  position: absolute;
  bottom: 30px;
  left: 30px;
}

.banner-content h2 {
  color: #ffd700;
  margin: 0 0 10px 0;
  font-size: 36px;
}

.banner-content p {
  color: #fff;
  margin: 0;
  font-size: 18px;
}

.palace-events {
  position: relative;
  padding-left: 40px;
}

.palace-events::before {
  content: "";
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #8b0000, #daa520);
}

.palace-event {
  position: relative;
  padding: 0 0 30px 40px;
}

.event-marker-circle {
  position: absolute;
  left: -28px;
  top: 0;
  width: 26px;
  height: 26px;
  background: #daa520;
  border: 4px solid #0a0a0f;
  border-radius: 50%;
}

.palace-event.construction .event-marker-circle {
  background: #8b0000;
}

.palace-event.cultural .event-marker-circle {
  background: #4a90d9;
}

.palace-event.decline .event-marker-circle {
  background: #666;
}

.marker-inner {
  width: 100%;
  height: 100%;
  background: #0a0a0f;
  border-radius: 50%;
}

.event-details {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
  padding: 20px;
}

.event-year-badge {
  display: inline-block;
  background: #daa520;
  color: #1a1a1a;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 15px;
}

.event-card-expanded {
  padding: 0;
}

.event-card-expanded h3 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 18px;
}

.event-card-expanded p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.event-card-expanded .event-type-badge {
  margin-bottom: 10px;
}

.palace-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.summary-item {
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
}

.summary-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 10px;
}

.summary-label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 5px;
}

.summary-value {
  display: block;
  color: #ffd700;
  font-size: 24px;
  font-weight: bold;
}

.event-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 30, 0.95),
    rgba(20, 20, 20, 0.95)
  );
  border: 2px solid #daa520;
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #daa520;
}

.modal-header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.modal-title {
  color: #ffd700;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.modal-year {
  color: #daa520;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.modal-description {
  color: #fff8dc;
  font-size: 16px;
  line-height: 1.8;
  margin: 0 0 20px 0;
}

.modal-palace {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #daa520;
  font-size: 14px;
  padding-top: 15px;
  border-top: 1px solid rgba(218, 165, 32, 0.3);
}

@media (max-width: 768px) {
  .timeline-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .dynasty-filters {
    flex-wrap: wrap;
  }

  .timeline-axis {
    padding-left: 60px;
  }

  .timeline-axis::before {
    left: 50px;
  }

  .event-year {
    left: -55px;
    width: 50px;
    font-size: 11px;
  }

  .palace-summary {
    grid-template-columns: 1fr;
  }

  .palace-tabs {
    flex-direction: column;
  }
}
</style>
