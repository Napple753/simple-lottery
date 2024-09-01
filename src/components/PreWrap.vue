<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text: string;
}>();

const parsedText = computed(() => {
  const rows = props.text.split("\n").map((row) => row.trim());
  return rows.join("<br>");
});
</script>

<template>
  <div v-html="parsedText"></div>
</template>

<style scoped>
div {
  display: contents;
}
</style>
