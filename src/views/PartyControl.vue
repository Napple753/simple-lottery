<script setup lang="ts">
import { computed, onMounted, ref, Ref, provide, onDeactivated } from "vue";
import ProgramMessage from "@/views/ProgramMessage.vue";
import ProgramDisplayWinners from "@/views/ProgramDisplayWinners.vue";
import ProgramPrizes from "@/views/ProgramPrizes.vue";
import ProgramFinale from "@/views/ProgramFinale.vue";
import FullScreenSwitch from "@/components/FullScreenSwitch.vue";
import { Candidate, DisplaySetting, WinnerCandidateLog } from "@/myTypes.ts";
import { PartyPlans } from "@/Schema";
import { LotteryBox } from "@/logic/LotteryBox";
import { SoundUtilities } from "@/logic/SoundUtilities";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  /** パーティーID */
  partyId: string;
  /** 候補者データのヘッダー(保存時に使用) */
  candidateHeader: string[];
  /** 抽選の対象者 */
  candidates: Candidate[];
  /** 抽選会の設定 */
  partyPlans: PartyPlans;
  /** 当選者の表示順設定 */
  displaySetting: DisplaySetting;
}>();

let lotteryBox: LotteryBox | null = null;
const currentWinners: Ref<Candidate[]> = ref([]);
const winnersCandidateLog: Ref<WinnerCandidateLog[] | null> = ref(null);

/**
 * 現在のプログラム番号
 */
const currentProgramId = ref(-1);

onMounted(() => {
  lotteryBox = new LotteryBox(props.candidates);
  next();
  provide("soundUtilities", new SoundUtilities());

  window.addEventListener("beforeunload", confirmSave);
});
onDeactivated(() => {
  window.removeEventListener("beforeunload", confirmSave);
});
/**
 * 現在のプログラム
 */
const currentProgram = computed(
  () => props.partyPlans.program[currentProgramId.value],
);

function next() {
  currentProgramId.value++;
  if (currentProgram.value?.type === "PRIZE") {
    const programId = currentProgramId.value;
    const prize_name = currentProgram.value.prize_name;
    const winner_number = currentProgram.value.winner_number;
    const winners =
      lotteryBox?.draw(programId, prize_name, winner_number) || null;
    currentWinners.value = winners || [];
  } else {
    currentWinners.value = [];
  }

  if (
    !currentProgram.value ||
    currentProgram.value.type === "DISPLAY_WINNERS"
  ) {
    winnersCandidateLog.value = lotteryBox?.winnerLogCandidates || null;
  }
}

function confirmSave(event: BeforeUnloadEvent) {
  if (!confirm(t("before-leave"))) {
    event.preventDefault();
  }
}

function redrawCurrentPrize(winner: Candidate) {
  lotteryBox?.redraw(currentProgramId.value, winner.id);

  currentWinners.value =
    lotteryBox?.winnerLogCandidates
      .find((log) => log.programId === currentProgramId.value)
      ?.selected.map((s) => s.candidate) || [];
}

function redraw(winner: Candidate, programId: number) {
  const newWinner = lotteryBox?.redraw(programId, winner.id);

  winnersCandidateLog.value = lotteryBox?.winnerLogCandidates || null;

  console.log(newWinner);
}
</script>

<template>
  <div class="topRight">
    <FullScreenSwitch></FullScreenSwitch>
  </div>
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
    :party-plans="partyPlans"
    @finish-program="next"
    @redraw="(winner) => redrawCurrentPrize(winner)"
  ></ProgramPrizes>
  <ProgramDisplayWinners
    v-if="currentProgram?.type == 'DISPLAY_WINNERS' && winnersCandidateLog"
    :candidates="candidates"
    :program="currentProgram"
    :key="currentProgramId"
    :winners-log="winnersCandidateLog"
    :display-setting="displaySetting"
    @finish-program="next"
    @redraw="(o) => redraw(o.winner, o.programId)"
  ></ProgramDisplayWinners>
  <ProgramFinale
    v-if="!currentProgram && winnersCandidateLog"
    :key="currentProgramId"
    :party-name="partyPlans.program_name"
    :candidate-header="candidateHeader"
    :winners-log="winnersCandidateLog"
  ></ProgramFinale>
</template>

<style>
.topRight {
  position: absolute;
  top: 0;
  right: 0;
}
.program {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;

  padding: 1rem 2rem;
  box-sizing: border-box;
  align-items: center;

  flex-shrink: 1;
  overflow: hidden;
}
.message {
  margin: auto;
}
</style>
