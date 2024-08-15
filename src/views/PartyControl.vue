<script setup lang="ts">
import { computed, onMounted, ref, Ref, provide } from "vue";
import ProgramMessage from "@/views/ProgramMessage.vue";
import ProgramDisplayWinners from "@/views/ProgramDisplayWinners.vue";
import ProgramPrizes from "@/views/ProgramPrizes.vue";
import ProgramFinale from "@/views/ProgramFinale.vue";
import FullScreenSwitch from "@/components/FullScreenSwitch.vue";
import { Candidate, DisplaySetting, WinnerLog } from "@/myTypes.ts";
import { PartyPlans } from "@/Schema";
import { LotteryBox } from "@/logic/LotteryBox";
import { PartyLogControl } from "@/logic/PartyLogControl";
import { SoundUtilities } from "@/logic/SoundUtilities";

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
let partyLogControl: PartyLogControl | null = null;
const currentWinners: Ref<Candidate[]> = ref([]);
const winnersLogs: Ref<WinnerLog<Candidate>[] | null> = ref(null);

/**
 * 現在のプログラム番号
 */
const currentProgramId = ref(-1);

onMounted(() => {
  lotteryBox = new LotteryBox(props.candidates);
  updatePartyLog();
  next();
  provide("soundUtilities", new SoundUtilities());
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
    winnersLogs.value = lotteryBox?.winnerLogCandidates || null;
  }
  updatePartyLog();
}

async function updatePartyLog() {
  if (partyLogControl === null) {
    partyLogControl = new PartyLogControl(
      props.partyId,
      props.partyPlans,
      props.candidates,
      props.displaySetting,
    );
  } else {
    partyLogControl.winnerIds = lotteryBox!.winnerLogIds;
    partyLogControl.currentProgramId = currentProgramId.value;
    partyLogControl.saveToLocalStorage();
  }
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
  ></ProgramPrizes>
  <ProgramDisplayWinners
    v-if="currentProgram?.type == 'DISPLAY_WINNERS' && winnersLogs"
    :program="currentProgram"
    :key="currentProgramId"
    :winners-log="winnersLogs"
    @finish-program="next"
  ></ProgramDisplayWinners>
  <ProgramFinale
    v-if="!currentProgram && winnersLogs"
    :key="currentProgramId"
    :party-name="partyPlans.program_name"
    :candidate-header="candidateHeader"
    :winners-log="winnersLogs"
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
  font-size: 200%;
  font-weight: bold;
  margin: auto;
}
</style>
