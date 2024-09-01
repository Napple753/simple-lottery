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
        <img src="/sederhana.svg" />
        <h1>{{ $t("app-short-name") }}</h1>
        <h2>{{ $t("app-description") }}</h2>
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
hgroup img {
  height: 400px;
}
h1 {
  width: 100%;
  font-size: 60px;
  font-weight: bold;
}
h1::first-letter {
  font-size: 120%;
  color: #ff5555;
}
h2 {
  width: 100%;
  font-size: 18px;
  font-weight: normal;
}
</style>
