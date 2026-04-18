<template>
  <div class="three-container" ref="containerRef">
    <canvas ref="canvasRef"></canvas>
    <div class="controls-overlay">
      <button
        class="control-btn"
        @click="toggleRotation"
        :class="{ active: isRotating }"
      >
        <span class="btn-icon">⟳</span>
        <span class="btn-text">旋转</span>
      </button>
      <button class="control-btn" @click="resetCamera">
        <span class="btn-icon">⌂</span>
        <span class="btn-text">重置</span>
      </button>
      <div class="zoom-controls">
        <button class="zoom-btn" @click="zoomIn">+</button>
        <button class="zoom-btn" @click="zoomOut">−</button>
      </div>
    </div>
    <div class="info-panel" v-if="selectedObject">
      <h3 class="info-title">{{ selectedObject.name }}</h3>
      <p class="info-desc">{{ selectedObject.description }}</p>
    </div>
    <div class="loading-overlay" v-if="isLoading">
      <div class="loader"></div>
      <p class="loading-text">加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as THREE from "three";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  autoRotate: {
    type: Boolean,
    default: true,
  },
});

const containerRef = ref(null);
const canvasRef = ref(null);
const isLoading = ref(true);
const isRotating = ref(true);
const selectedObject = ref(null);

let scene, camera, renderer, controls;
let palaceGroup, particleSystem;
let animationId = null;
let mouseX = 0,
  mouseY = 0;
let targetRotationX = 0,
  targetRotationY = 0;

const initThreeJS = () => {
  const container = containerRef.value;
  const canvas = canvasRef.value;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);
  scene.fog = new THREE.Fog(0x0a0a0f, 50, 150);

  camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 15, 30);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xdaa520, 1);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  const pointLight1 = new THREE.PointLight(0xdaa520, 2, 50);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xff6b6b, 1, 50);
  pointLight2.position.set(-10, 5, -10);
  scene.add(pointLight2);

  createPalace();
  createParticles();
  createGrid();
  createStars();

  isLoading.value = false;
};

const createPalace = () => {
  palaceGroup = new THREE.Group();

  props.data.forEach((palace, index) => {
    const baseGeometry = new THREE.BoxGeometry(4, 2, 4);
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b0000,
      emissive: 0x330000,
      specular: 0xdaa520,
      shininess: 30,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1;
    base.castShadow = true;
    base.receiveShadow = true;

    const roofGeometry = new THREE.ConeGeometry(3.5, 2, 4);
    const roofMaterial = new THREE.MeshPhongMaterial({
      color: 0xdaa520,
      emissive: 0x332200,
      specular: 0xffd700,
      shininess: 50,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 3;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;

    const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
    const pillarMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a0000,
      specular: 0x8b0000,
      shininess: 20,
    });

    const positions = [
      [-1.5, 1.5, -1.5],
      [1.5, 1.5, -1.5],
      [-1.5, 1.5, 1.5],
      [1.5, 1.5, 1.5],
    ];

    positions.forEach((pos) => {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(...pos);
      pillar.castShadow = true;
      palaceGroup.add(pillar);
    });

    const palaceMesh = new THREE.Group();
    palaceMesh.add(base);
    palaceMesh.add(roof);
    palaceMesh.userData = {
      name: palace.name,
      description: `朝代: ${palace.dynasty} | 面积: ${palace.area}万平方米 | 房屋: ${palace.houses}间`,
      originalIndex: index,
    };

    const angle = (index / props.data.length) * Math.PI * 2;
    const radius = 12;
    palaceMesh.position.x = Math.cos(angle) * radius;
    palaceMesh.position.z = Math.sin(angle) * radius;
    palaceMesh.scale.set(
      0.5 + (palace.area / 500) * 0.5,
      0.5 + (palace.houses / 10000) * 0.5,
      0.5 + (palace.area / 500) * 0.5,
    );

    palaceGroup.add(palaceMesh);
  });

  const centerGeometry = new THREE.CylinderGeometry(3, 4, 1, 6);
  const centerMaterial = new THREE.MeshPhongMaterial({
    color: 0xdaa520,
    emissive: 0x553300,
    transparent: true,
    opacity: 0.8,
  });
  const center = new THREE.Mesh(centerGeometry, centerMaterial);
  center.position.y = 0.5;
  center.userData = {
    name: "中华宫殿文明",
    description: "六大中国古代宫殿文明的核心展示",
  };
  palaceGroup.add(center);

  palaceGroup.position.y = 0;
  scene.add(palaceGroup);
};

const createParticles = () => {
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = Math.random() * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    const color = new THREE.Color();
    color.setHSL(0.1 + Math.random() * 0.1, 0.8, 0.6);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
};

const createGrid = () => {
  const gridHelper = new THREE.GridHelper(100, 50, 0x333333, 0x222222);
  gridHelper.position.y = -0.5;
  scene.add(gridHelper);
};

const createStars = () => {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const radius = 150 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );

  const starMaterial = new THREE.PointsMaterial({
    size: 0.5,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);

  if (palaceGroup && isRotating.value) {
    palaceGroup.rotation.y += 0.005;
  }

  if (particleSystem) {
    particleSystem.rotation.y += 0.0005;
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  if (camera) {
    camera.position.y = 15 + Math.sin(Date.now() * 0.0005) * 2;
  }

  renderer.render(scene, camera);
};

const toggleRotation = () => {
  isRotating.value = !isRotating.value;
};

const resetCamera = () => {
  if (camera) {
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);
  }
};

const zoomIn = () => {
  if (camera) {
    camera.position.multiplyScalar(0.9);
  }
};

const zoomOut = () => {
  if (camera) {
    camera.position.multiplyScalar(1.1);
  }
};

const handleResize = () => {
  if (!containerRef.value || !camera || !renderer) return;

  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
};

const handleMouseMove = (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  if (camera) {
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 5 + 15 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  }
};

const handleClick = (event) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  mouse.x = (event.clientX / containerRef.value.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / containerRef.value.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(palaceGroup.children, true);

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj.parent && !obj.userData.name) {
      obj = obj.parent;
    }
    if (obj.userData.name) {
      selectedObject.value = obj.userData;
    }
  }
};

onMounted(() => {
  initThreeJS();
  animate();

  window.addEventListener("resize", handleResize);
  containerRef.value?.addEventListener("mousemove", handleMouseMove);
  containerRef.value?.addEventListener("click", handleClick);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  if (renderer) {
    renderer.dispose();
  }

  window.removeEventListener("resize", handleResize);
  containerRef.value?.removeEventListener("mousemove", handleMouseMove);
  containerRef.value?.removeEventListener("click", handleClick);
});

watch(
  () => props.data,
  () => {
    if (palaceGroup) {
      scene.remove(palaceGroup);
      createPalace();
    }
  },
  { deep: true },
);
</script>

<style scoped>
.three-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
  border-radius: 12px;
  background: #0a0a0f;
}

.three-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.controls-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(218, 165, 32, 0.5);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.control-btn:hover {
  background: rgba(218, 165, 32, 0.2);
  border-color: #daa520;
}

.control-btn.active {
  background: rgba(218, 165, 32, 0.3);
  border-color: #ffd700;
}

.btn-icon {
  font-size: 18px;
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(218, 165, 32, 0.5);
  border-radius: 8px;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-btn:hover {
  background: rgba(218, 165, 32, 0.2);
  border-color: #daa520;
}

.info-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(218, 165, 32, 0.5);
  border-radius: 12px;
  padding: 20px;
  z-index: 10;
}

.info-title {
  color: #daa520;
  font-size: 24px;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.info-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 15, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.loader {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(218, 165, 32, 0.2);
  border-top-color: #daa520;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #daa520;
  margin-top: 20px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .controls-overlay {
    top: 10px;
    left: 10px;
  }

  .control-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  .zoom-btn {
    width: 35px;
    height: 35px;
    font-size: 20px;
  }

  .info-panel {
    bottom: 10px;
    left: 10px;
    right: 10px;
    padding: 15px;
  }

  .info-title {
    font-size: 18px;
  }

  .info-desc {
    font-size: 12px;
  }
}
</style>
