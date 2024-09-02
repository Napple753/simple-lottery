<script setup lang="ts">
import { WinnerCandidateLog } from "@/myTypes";
import WinnerSaver from "@/components/WinnerSaver.vue";

defineEmits<{
  (e: "finishProgram"): void;
}>();

defineProps<{
  partyName: string;
  candidateHeader: string[];
  winnersLog: WinnerCandidateLog[];
}>();

function nextProgram() {
  window.location.reload();
}
</script>

<template>
  <div class="program">
    <div class="main">
      <hgroup>
        <img src="/sederhana.svg" class="app_icon" />
        <h1>
          <img src="/logo_with_text.svg" alt="SEDERHANA" />
        </h1>
      </hgroup>
      <div>
        <WinnerSaver
          :party-name="partyName"
          :winners-log="winnersLog"
          :candidate-header="candidateHeader"
        ></WinnerSaver>
      </div>
    </div>
    <div class="button_wrapper">
      <v-btn @click="nextProgram">{{ $t("another-party") }}</v-btn>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
hgroup {
  width: 100%;
  height: 80%;
  padding-left: 1rem;
  padding-bottom: 1rem;
  text-align: center;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.main div {
  height: 20%;
}
img.app_icon {
  height: 400px;
  user-select: none;
  pointer-events: none;
}
h1 img {
  height: 100px;
  user-select: none;
  pointer-events: none;
}
</style>
