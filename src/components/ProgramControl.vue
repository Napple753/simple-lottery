<script setup lang="ts">
import { computed, ComputedRef } from "vue";
//import DisplayName from './components/DisplayName.vue'
import ProgramMessage from "../components/ProgramMessage.vue";
import ProgramDisplayWinners from "../components/ProgramDisplayWinners.vue";
import ProgramPrizes from "../components/ProgramPrizes.vue";
import { Candidate, DisplaySetting, EventPlans } from "../myTypes.ts";
import { LotteryParty } from "../LotteryParty";

let lotteryParty: LotteryParty | undefined;

function startParty(
  candidates: Candidate[],
  eventPlans: EventPlans,
  displaySetting: DisplaySetting,
) {
  lotteryParty = new LotteryParty(candidates, eventPlans, displaySetting);
  lotteryParty.next();
}

const currentProgramNumber = computed(() => lotteryParty?.currentProgramNumber);
const currentProgram = computed(() => lotteryParty?.currentProgram);
const displaySetting = computed(() => lotteryParty?.displaySetting);
const candidates = computed(() => lotteryParty?.candidates) as ComputedRef<
  Candidate[]
>;
const winners = computed(() => lotteryParty?.currentWinners) as ComputedRef<
  Candidate[]
>;

function next() {
  lotteryParty?.next();
}

defineExpose({ startParty });
</script>

<template>
  <ProgramMessage
    v-if="currentProgram?.type === 'MESSAGE'"
    :program="currentProgram"
    :key="currentProgramNumber"
    @finish-program="next"
  ></ProgramMessage>
  <ProgramPrizes
    v-if="currentProgram?.type === 'PRIZE' && displaySetting"
    :candidates="candidates"
    :winners="winners"
    :program="currentProgram"
    :key="currentProgramNumber"
    :display-setting="displaySetting"
    @finish-program="next"
  ></ProgramPrizes>
  <ProgramDisplayWinners
    v-if="currentProgram?.type == 'DISPLAY_WINNERS'"
    :program="currentProgram"
    :key="currentProgramNumber"
    :winners-log="[]"
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
