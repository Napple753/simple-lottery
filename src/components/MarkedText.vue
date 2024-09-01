<script setup lang="ts">
import { computed } from "vue";
import { marked } from "marked";
import { useMarkdownStore } from "@/store/markdown";

const markdownStore = useMarkdownStore();

marked.setOptions({ breaks: true });

const props = defineProps<{
  markdown: string;
}>();

const parsedHTML = computed(() => marked.parse(props.markdown));
</script>

<template>
  <div
    v-if="markdownStore.markdown"
    v-html="parsedHTML"
    class="markDownWrapper"
  ></div>
  <div v-else>{{ markdown }}</div>
</template>

<style scoped>
div {
  display: contents;
}
</style>
