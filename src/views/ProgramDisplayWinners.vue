<script setup lang="ts">
import { DisplayWinner, Candidate, WinnerLog } from "@/myTypes";
const emit = defineEmits<{
  (e: "finishProgram"): void;
}>();

defineProps<{
  program: DisplayWinner;
  winnersLog: WinnerLog<Candidate>[];
}>();

function nextProgram() {
  emit("finishProgram");
}
</script>

<template>
  <div class="program">
    <h1>{{ $t("winners-so-far") }}</h1>
    <div class="winners_list">
      <div v-for="(prize, i) in winnersLog" :key="i" class="prize">
        <h2>{{ prize.prizeName }}</h2>
        <table>
          <tr v-for="(winner, j) in prize.selected" :key="j">
            <td v-for="(cell, k) in winner.data" :key="k">{{ cell }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="button_wrapper">
      <input type="button" :value="$t('next')" @click="nextProgram" />
    </div>
  </div>
</template>

<style scoped>
.winners_list {
  height: 100%;
  overflow-y: scroll;
  width: 100vw;
  column-count: 2;
  padding: 1rem 2rem;
  box-sizing: border-box;
}
.prize {
  break-inside: avoid;
}
table,
tr,
td {
  border: none;
}
td {
  padding: 0 1em;
}
</style>
