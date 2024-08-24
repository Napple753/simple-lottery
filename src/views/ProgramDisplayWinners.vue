<script setup lang="ts">
import { Candidate, WinnerLog } from "@/myTypes";
import { DisplayWinner } from "@/Schema";
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
          <tr v-for="winner in prize.selected" :key="winner.id">
            <td v-for="(cell, k) in winner.data" :key="winner.id + '' + k">
              {{ cell }}
            </td>
          </tr>
          <tr v-for="winner in prize.cancelled" :key="winner.id">
            <td v-for="(cell, k) in winner.data" :key="winner.id + '' + k">
              <s>{{ cell }}</s>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="button_wrapper">
      <v-btn @click="nextProgram">{{ $t("next") }}</v-btn>
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
  user-select: all;
}

@media (max-width: 800px) {
  .winners_list {
    column-count: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
