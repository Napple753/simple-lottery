<script setup lang="ts">
import { WinnerLog, Candidate } from "@/myTypes";
import WinnerSaver from "@/components/WinnerSaver.vue";
const emit = defineEmits(["finishProgram"]);

defineProps<{
  partyName: string;
  candidateHeader: string[];
  winnersLog: WinnerLog<Candidate>[];
}>();

function nextProgram() {
  window.location.reload();
}
</script>

<template>
  <div class="program">
    <WinnerSaver
      :party-name="partyName"
      :winners-log="winnersLog"
      :candidate-header="candidateHeader"
    ></WinnerSaver>
    <p class="message">終了</p>
    <div class="button_wrapper">
      <input type="button" value="もう一度" @click="nextProgram" />
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
