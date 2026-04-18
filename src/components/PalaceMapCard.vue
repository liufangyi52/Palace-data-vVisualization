<template>
  <div class="palace-map-card" @click="$emit('enter')">
    <div class="card-bg-pattern">
      <div class="pattern-line line-1"></div>
      <div class="pattern-line line-2"></div>
      <div class="pattern-line line-3"></div>
      <div class="pattern-circle circle-1"></div>
      <div class="pattern-circle circle-2"></div>
    </div>

    <div class="card-header">
      <div class="header-content">
        <h2 class="card-title">宫殿地图</h2>
        <p class="card-subtitle">地理分布与历史变迁</p>
      </div>
      <div class="header-icons">
        <div class="icon-btn" title="文档">
          <span>📄</span>
        </div>
        <div class="icon-btn" title="首页">
          <span>🏠</span>
        </div>
        <div class="icon-btn" title="放大">
          <span>🔍+</span>
        </div>
        <div class="icon-btn" title="缩小">
          <span>🔍-</span>
        </div>
      </div>
    </div>

    <div class="card-map-area">
      <div class="map-placeholder">
        <div class="placeholder-grid">
          <div class="grid-line horizontal" v-for="i in 5" :key="'h' + i"></div>
          <div class="grid-line vertical" v-for="i in 5" :key="'v' + i"></div>
        </div>
        <div class="placeholder-china">
          <svg viewBox="0 0 400 300" class="china-silhouette">
            <path
              d="M180,50 L200,40 L220,45 L240,35 L260,45 L280,55 L290,70 L300,80 L310,75 L320,90 L330,100 L325,120 L335,140 L330,160 L320,170 L310,180 L300,175 L290,185 L280,190 L270,200 L260,210 L250,220 L240,230 L230,235 L220,240 L210,235 L200,225 L190,215 L180,205 L170,195 L165,180 L170,165 L175,150 L180,140 L175,125 L180,110 L185,95 L180,80 L175,65 L180,50 Z"
              fill="none"
              stroke="rgba(218, 165, 32, 0.3)"
              stroke-width="1.5"
            />
            <circle
              cx="200"
              cy="100"
              r="4"
              fill="rgba(218, 165, 32, 0.6)"
              class="pulse-dot"
            />
            <circle
              cx="240"
              cy="120"
              r="4"
              fill="rgba(218, 165, 32, 0.6)"
              class="pulse-dot"
            />
            <circle
              cx="280"
              cy="90"
              r="4"
              fill="rgba(218, 165, 32, 0.6)"
              class="pulse-dot"
            />
            <circle
              cx="180"
              cy="150"
              r="4"
              fill="rgba(218, 165, 32, 0.6)"
              class="pulse-dot"
            />
            <circle
              cx="260"
              cy="160"
              r="4"
              fill="rgba(218, 165, 32, 0.6)"
              class="pulse-dot"
            />
          </svg>
        </div>
        <div class="placeholder-label">中国地图轮廓</div>
      </div>
    </div>

    <div class="card-footer">
      <div class="footer-left">
        <span class="tag hot">热力分布</span>
      </div>
      <button class="view-btn" @click.stop="$emit('enter')">查看 →</button>
    </div>
  </div>
</template>

<script setup>
defineEmits(["enter"]);
</script>

<style scoped>
.palace-map-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(218, 165, 32, 0.2);
}

.palace-map-card:hover {
  border-color: rgba(218, 165, 32, 0.5);
  box-shadow: 0 0 30px rgba(218, 165, 32, 0.2);
}

.card-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.4;
}

.pattern-line {
  position: absolute;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(218, 165, 32, 0.3),
    transparent
  );
  height: 1px;
}

.line-1 {
  top: 20%;
  left: 0;
  width: 100%;
}

.line-2 {
  top: 50%;
  left: 0;
  width: 80%;
}

.line-3 {
  top: 80%;
  left: 20%;
  width: 100%;
}

.pattern-circle {
  position: absolute;
  border: 1px solid rgba(218, 165, 32, 0.2);
  border-radius: 50%;
}

.circle-1 {
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
}

.circle-2 {
  bottom: -80px;
  left: -80px;
  width: 250px;
  height: 250px;
}

.card-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px 20px;
  z-index: 2;
}

.header-content {
  flex: 1;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #daa520;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
}

.card-subtitle {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: rgba(255, 248, 220, 0.6);
}

.header-icons {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(218, 165, 32, 0.1);
  border: 1px solid rgba(218, 165, 32, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: rgba(255, 248, 220, 0.7);
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: rgba(218, 165, 32, 0.2);
  border-color: #daa520;
}

.card-map-area {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  z-index: 2;
}

.map-placeholder {
  position: relative;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 4/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.placeholder-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.grid-line {
  position: absolute;
  background: rgba(218, 165, 32, 0.3);
}

.grid-line.horizontal {
  left: 0;
  width: 100%;
  height: 1px;
}

.grid-line.horizontal:nth-child(1) {
  top: 0%;
}
.grid-line.horizontal:nth-child(2) {
  top: 25%;
}
.grid-line.horizontal:nth-child(3) {
  top: 50%;
}
.grid-line.horizontal:nth-child(4) {
  top: 75%;
}
.grid-line.horizontal:nth-child(5) {
  top: 100%;
}

.grid-line.vertical {
  top: 0;
  height: 100%;
  width: 1px;
}

.grid-line.vertical:nth-child(6) {
  left: 0%;
}
.grid-line.vertical:nth-child(7) {
  left: 25%;
}
.grid-line.vertical:nth-child(8) {
  left: 50%;
}
.grid-line.vertical:nth-child(9) {
  left: 75%;
}
.grid-line.vertical:nth-child(10) {
  left: 100%;
}

.china-silhouette {
  width: 80%;
  max-width: 200px;
  opacity: 0.6;
}

.pulse-dot {
  animation: pulse 2s infinite;
}

.pulse-dot:nth-child(2) {
  animation-delay: 0.3s;
}
.pulse-dot:nth-child(3) {
  animation-delay: 0.6s;
}
.pulse-dot:nth-child(4) {
  animation-delay: 0.9s;
}
.pulse-dot:nth-child(5) {
  animation-delay: 1.2s;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.placeholder-label {
  margin-top: 10px;
  font-size: 11px;
  color: rgba(255, 248, 220, 0.4);
  letter-spacing: 1px;
}

.card-footer {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  z-index: 2;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
}

.tag.hot {
  background: rgba(218, 165, 32, 0.2);
  border: 1px solid rgba(218, 165, 32, 0.4);
  color: #daa520;
}

.view-btn {
  padding: 8px 20px;
  background: rgba(218, 165, 32, 0.15);
  border: 2px solid #daa520;
  border-radius: 20px;
  color: #daa520;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: rgba(218, 165, 32, 0.3);
  box-shadow: 0 0 20px rgba(218, 165, 32, 0.4);
}

@media (max-width: 768px) {
  .card-header {
    padding: 12px 15px;
  }

  .card-title {
    font-size: 16px;
  }

  .header-icons {
    display: none;
  }

  .card-map-area {
    padding: 5px 15px;
  }

  .card-footer {
    padding: 10px 15px;
  }

  .tag {
    font-size: 10px;
    padding: 3px 10px;
  }

  .view-btn {
    padding: 6px 16px;
    font-size: 12px;
  }
}
</style>
