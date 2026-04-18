<template>
  <div class="palace-map-page">
    <PalaceMapDetail @close="handleClose" />
  </div>
</template>

<script setup>
import PalaceMapDetail from "@/components/PalaceMapDetail.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleClose = () => {
  router.push("/");
};
</script>

<style scoped>
.palace-map-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
