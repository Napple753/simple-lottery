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
        <h1>
          <img src="/logo_icon.svg" alt="SEDERHANA" />
        </h1>
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
  overflow: hidden;
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
  overflow: hidden;
  color: #333333;
}
h1 {
  height: 100%;
  display: flex;
  justify-content: end;
  flex-direction: column;
}
h1 img {
  width: 420px;
  max-width: 100%;
  max-height: 100%;
  user-select: none;
  pointer-events: none;
}
h2 {
  font-size: 12px;
}

.main div {
  height: 20%;
}
img.app_icon {
  height: 400px;
  user-select: none;
  pointer-events: none;
}
</style>
