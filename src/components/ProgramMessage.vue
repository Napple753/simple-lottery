<script setup lang="ts">
import { Message } from "@/myTypes";
const emit = defineEmits(["finishProgram"]);

defineProps<{ program: Message }>();

function nextProgram() {
  emit("finishProgram");
}
</script>

<template>
  <div class="program">
    <p class="message">{{ program.message }}</p>
    <div class="button_wrapper">
      <input type="button" value="次へ" @click="nextProgram" />
    </div>
  </div>
</template>

<style scoped>
.message {
  font-size: 200%;
  font-weight: bold;
  margin: auto;
}
</style>
