<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import ProgramMessage from "../components/ProgramMessage.vue";
import ProgramDisplayWinners from "../components/ProgramDisplayWinners.vue";
import ProgramPrizes from "../components/ProgramPrizes.vue";
import { Candidate, DisplaySetting, PartyPlans, WinnerLog } from "../myTypes.ts";
import { LotteryBox } from "../logic/LotteryBox";

const props = defineProps<{
  /**
   * 抽選の対象者
   */
  candidates: Candidate[];
  /**
   * 抽選会の設定
   */
  partyPlans: PartyPlans;
  /**
   * 当選者の表示順設定
   */
  displaySetting: DisplaySetting;
}>();

let lotteryBox: LotteryBox | null = null;
const winnerIdList: Ref<(number[] | null)[]> = ref([]);
const currentWinners: Ref<Candidate[]> = ref([]);
const winnersLogs: Ref<WinnerLog<Candidate>[] | null> = ref(null);

/**
 * 現在のプログラム番号
 */
const currentProgramId = ref(-1);

onMounted(() => {
  lotteryBox = new LotteryBox(props.candidates);
  next();
});

/**
 * 現在のプログラム
 */
const currentProgram = computed(
  () => props.partyPlans.program[currentProgramId.value],
);

function next() {
  currentProgramId.value = Math.min(
    currentProgramId.value + 1,
    props.partyPlans.program.length - 1,
  );
  if (currentProgram.value.type === "PRIZE") {
    const programId = currentProgramId.value;
    const prize_name = currentProgram.value.prize_name;
    const winner_number = currentProgram.value.winner_number;
    const winners = lotteryBox?.draw(programId,prize_name, winner_number) || null;
    currentWinners.value = winners || [];
    winnerIdList.value[currentProgramId.value] =
      winners?.map((c) => c.id) || null;
  } else {
    currentWinners.value = [];
    winnerIdList.value[currentProgramId.value] = null;
  }

  if (currentProgram.value.type === "DISPLAY_WINNERS") {
    winnersLogs.value = lotteryBox?.winnerLogCandidates || null;
  }
}
</script>

<template>
  <ProgramMessage
    v-if="currentProgram?.type === 'MESSAGE'"
    :program="currentProgram"
    :key="currentProgramId"
    @finish-program="next"
  ></ProgramMessage>
  <ProgramPrizes
    v-if="currentProgram?.type === 'PRIZE' && displaySetting"
    :candidates="candidates"
    :winners="currentWinners"
    :program="currentProgram"
    :key="currentProgramId"
    :display-setting="displaySetting"
    @finish-program="next"
  ></ProgramPrizes>
  <ProgramDisplayWinners
    v-if="currentProgram?.type == 'DISPLAY_WINNERS' && winnersLogs"
    :program="currentProgram"
    :key="currentProgramId"
    :winners-log="winnersLogs"
    @finish-program="next"
  ></ProgramDisplayWinners>
</template>

<style>
.program {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;

  padding: 1rem 2rem;
  box-sizing: border-box;
  align-items: center;
}

.button_wrapper {
  width: 80%;
  height: 2rem;
  text-align: right;
  margin-bottom: 1rem;
}
</style>
