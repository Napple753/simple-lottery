<script setup lang="ts">
import { ref } from "vue";

function switchFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    isFullScreen.value = false;
  } else {
    document.body.requestFullscreen();
    isFullScreen.value = true;
  }
}
const isFullScreen = ref(false);

document.addEventListener("fullscreenchange", () => {
  isFullScreen.value = !!document.fullscreenElement;
});
</script>
<template>
  <v-btn icon flat @click="switchFullScreen">
    <v-icon size="x-large" v-if="!isFullScreen" icon="mdi-fullscreen"></v-icon>
    <v-icon size="x-large" v-else icon="mdi-fullscreen-exit"></v-icon>
  </v-btn>
</template>

<style scoped></style>
