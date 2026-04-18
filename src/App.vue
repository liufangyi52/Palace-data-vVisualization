<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup></script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap");
@import "@/assets/styles/icons.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
  position: relative;
}

#app::before {
  content: "";
  position: fixed;
  inset: 0;
  background:
    radial-gradient(
      ellipse at 20% 20%,
      rgba(218, 165, 32, 0.05) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      rgba(139, 0, 0, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
  z-index: 0;
}

.card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(218, 165, 32, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(218, 165, 32, 0.4);
  box-shadow: 0 8px 32px rgba(218, 165, 32, 0.15);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

::-webkit-scrollbar-thumb {
  background: rgba(218, 165, 32, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(218, 165, 32, 0.5);
}
</style>
