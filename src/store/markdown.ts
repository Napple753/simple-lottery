import { defineStore } from "pinia";
import { ref } from "vue";

export const useMarkdownStore = defineStore("markdown", () => {
  const markdown = ref(false);
  function enableMarkdown() {
    markdown.value = true;
  }
  function disableMarkdown() {
    markdown.value = false;
  }
  return {
    markdown,
    enableMarkdown,
    disableMarkdown,
  };
});
