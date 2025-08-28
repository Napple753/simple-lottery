<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { Message } from "@/Schema";
import MarkedText from "@/components/MarkedText.vue";
import { useMarkdownStore } from "@/store/markdown";
const markdownStore = useMarkdownStore();
const emit = defineEmits<{
  (e: "finishProgram"): void;
}>();

defineProps<{ program: Message }>();

function nextProgram() {
  emit("finishProgram");
}

const messageFontSize = computed(() =>
  markdownStore.markdown ? "1.2rem" : "2rem",
);
const messageFontWeight = computed(() =>
  markdownStore.markdown ? "normal" : "bold",
);
</script>

<template>
  <div class="program">
    <p class="message">
      <MarkedText :markdown="program.message"></MarkedText>
    </p>
    <div class="prizeImage" v-if="program.img">
      <img :src="program.img" />
    </div>
    <div class="button_wrapper">
      <v-btn @click="nextProgram">{{ $t("next") }}</v-btn>
    </div>
  </div>
</template>

<style scoped>
.message {
  text-align: center;
  font-size: v-bind(messageFontSize);
  font-weight: v-bind(messageFontWeight);
}
.prizeImage {
  height: 100%;
  text-align: center;
  overflow: hidden;
}

.prizeImage img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}
</style>
