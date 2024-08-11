<script setup lang="ts">
import { WinnerLog, Candidate } from "@/myTypes";
import WinnerSaver from "@/components/WinnerSaver.vue";

defineEmits<{
  (e: "finishProgram"): void;
}>();

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
    <p class="message">{{ $t("end") }}</p>
    <div class="button_wrapper">
      <input type="button" :value="$t('another-party')" @click="nextProgram" />
    </div>
  </div>
</template>

<style scoped></style>
