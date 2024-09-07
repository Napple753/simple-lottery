<script setup lang="ts">
import { ref, Ref, inject, computed } from "vue";
import { Candidate, DisplaySetting } from "@/myTypes";
import { Prize, PartyPlans } from "@/Schema";
import NameLottery from "@/components/NameLottery.vue";
import MarkedText from "@/components/MarkedText.vue";
import { useMarkdownStore } from "@/store/markdown";
const markdownStore = useMarkdownStore();
const emit = defineEmits<{
  (e: "finishProgram"): void;
  (e: "redraw", winner: Candidate): void;
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

const redrawing = ref(false);
function redraw(winner: Candidate) {
  emit("redraw", winner);
  if (decidedCount.value === props.winners.length) {
    rollingSoundSource = soundUtilities?.playRolling();
  }
  decidedCount.value--;
  redrawing.value = true;
}

/**
 * 横に並べる抽選機の数
 */
const winnersPerRow = computed(() =>
  Math.ceil(props.winners.length / Math.ceil(props.winners.length / 5)),
);

const prizeNameFontSize = computed(() =>
  markdownStore.markdown ? "1.2rem" : "2rem",
);
const prizeNameFontWeight = computed(() =>
  markdownStore.markdown ? "normal" : "bold",
);

const winner_prize = computed(() =>
  props.winners.map((winner, i) => ({
    winner,
    sub_prize_name: props.program.sub_prize_names?.[i] ?? undefined,
  })),
);

const LotterySize = computed(() => {
  switch (props.winners.length) {
    case 1:
      return 60;
    case 2:
      return 45;
    default:
      return 30;
  }
});
</script>

<template>
  <div class="program programPrize">
    <h1 v-show="beforeDraw || !program.sub_prize_names">
      <MarkedText :markdown="program.prize_name"></MarkedText>
    </h1>

    <div class="prizeImage" v-show="beforeDraw">
      <img v-if="program.img" :src="program.img" />
    </div>

    <div v-show="beforeDraw" class="button_wrapper">
      <v-btn @click="draw">{{ $t("start-drawing") }}</v-btn>
    </div>

    <div v-show="!beforeDraw" class="lotteries">
      <template
        v-for="{ winner, sub_prize_name } in winner_prize"
        :key="winner.id"
      >
        <NameLottery
          :subPrizeName="sub_prize_name"
          :winner="winner"
          :candidates="candidates"
          :isSimple="winners.length > 5"
          :displaySetting="displaySetting"
          :ref="lotteryEls"
          :immediate="redrawing"
          :lotterySize="LotterySize"
          @finish-draw="decided"
          @redraw="(winner) => redraw(winner)"
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
h1 {
  text-align: center;
  font-size: v-bind(prizeNameFontSize);
  font-weight: v-bind(prizeNameFontWeight);
}
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
  --length: v-bind(winnersPerRow);
  margin: auto 0.5rem;
  width: calc(calc(100% / var(--length)) - 1rem);
}
</style>
