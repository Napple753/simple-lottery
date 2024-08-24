<script setup lang="ts">
import { ref, Ref, inject } from "vue";
import { Candidate, DisplaySetting } from "@/myTypes";
import { Prize, PartyPlans } from "@/Schema";
import NameLottery from "@/components/NameLottery.vue";
const emit = defineEmits<{
  (e: "finishProgram"): void;
}>();
import { SoundUtilities } from "@/logic/SoundUtilities";

const props = defineProps<{
  program: Prize;
  winners: Candidate[];
  candidates: Candidate[];
  displaySetting: DisplaySetting;
  partyPlans: PartyPlans;
}>();

let lotteries: InstanceType<typeof NameLottery>[] = [];

const soundUtilities = inject<SoundUtilities>("soundUtilities");

const lotteryEls = (el: InstanceType<typeof NameLottery>) => {
  lotteries.push(el);
  return "lotteryEls";
};

const beforeDraw: Ref<boolean> = ref(true);

const decidedCount = ref(0);
let rollingSoundSource: AudioBufferSourceNode | undefined;

function draw() {
  decidedCount.value = 0;
  beforeDraw.value = false;

  const time_before_first_winner =
    props.program.time_before_first_winner ??
    props.partyPlans.time_before_first_winner;
  const time_between_winners =
    props.program.time_between_winners ?? props.partyPlans.time_between_winners;

  let timing = time_before_first_winner;
  lotteries.forEach((lottery) => {
    if (props.winners.length <= 5 && Math.random() < 0.2) {
      timing += 500;
      lottery.draw(timing, 1);
    } else {
      lottery.draw(timing, 0);
    }
    timing += time_between_winners;
  });
  rollingSoundSource = soundUtilities?.playRolling();
}

function decided() {
  decidedCount.value++;
  if (decidedCount.value === props.winners.length) {
    rollingSoundSource?.stop();
  }
}

function nextProgram() {
  beforeDraw.value = true;
  lotteries = [];
  emit("finishProgram");
}
</script>

<template>
  <div class="program programPrize">
    <h1>{{ program.prize_name }}</h1>

    <div class="prizeImage" v-show="beforeDraw">
      <img v-if="program.img" :src="program.img" />
    </div>

    <div v-show="beforeDraw" class="button_wrapper">
      <v-btn @click="draw">{{ $t("start-drawing") }}</v-btn>
    </div>

    <div v-show="!beforeDraw" class="lotteries">
      <template v-for="winner in winners" :key="winner.id">
        <NameLottery
          :winner="winner"
          :candidates="candidates"
          :is-simple="winners.length > 5"
          :displaySetting="displaySetting"
          :ref="lotteryEls"
          @finish-draw="decided"
        ></NameLottery>
      </template>
    </div>
    <div class="button_wrapper" v-show="!beforeDraw">
      <v-btn @click="nextProgram" v-show="decidedCount === winners.length">{{
        $t("next")
      }}</v-btn>
    </div>
  </div>
</template>

<style scoped>
.prizeImage {
  height: 100%;
  text-align: center;
  overflow: hidden;
}

.prizeImage img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}
.lotteries {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100%;
  row-gap: 2rem;
  width: 100vw;
  overflow-y: scroll;
}

.lotteries div {
  --length: v-bind(Math.min(winners.length, 5));
  margin: auto 0.5rem;
  width: calc(calc(100% / var(--length)) - 1rem);
}
</style>
