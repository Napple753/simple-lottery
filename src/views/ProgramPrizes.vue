<script setup lang="ts">
import { ref, Ref, inject } from "vue";
import { Candidate, DisplaySetting } from "@/myTypes";
import { Prize } from "@/Schema";
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
}>();

let lotteries: InstanceType<typeof NameLottery>[] = [];

const soundUtilities = inject<SoundUtilities>("soundUtilities");

const lotteryEls = (el: InstanceType<typeof NameLottery>) => {
  lotteries.push(el);
  return "lotteryEls";
};

const status: Ref<"beforeDraw" | "drawing" | "afterDraw"> = ref("beforeDraw");

let decidedCount = 0;
let rollingSoundSource: AudioBufferSourceNode | undefined;

function draw() {
  decidedCount = 0;
  status.value = "drawing";

  let timing = 5 * 1000;
  lotteries.forEach((lottery) => {
    if (props.winners.length <= 5 && Math.random() < 0.2) {
      timing += 500;
      lottery.draw(timing, 1);
    } else {
      lottery.draw(timing, 0);
    }
    timing += 2 * 1000;
  });
  rollingSoundSource = soundUtilities?.playRolling();
}

function decided() {
  decidedCount++;
  if (decidedCount == props.winners.length) {
    rollingSoundSource?.stop();
    status.value = "afterDraw";
  }
}

function nextProgram() {
  status.value = "beforeDraw";
  lotteries = [];
  emit("finishProgram");
}
</script>

<template>
  <div class="program programPrize">
    <h1>{{ program.prize_name }}</h1>

    <div class="prizeImage" v-show="status == 'beforeDraw'">
      <img v-if="program.img" :src="program.img" />
    </div>

    <div v-show="status == 'beforeDraw'" class="button_wrapper">
      <v-btn @click="draw">{{ $t("start-drawing") }}</v-btn>
    </div>

    <div v-show="status != 'beforeDraw'" class="lotteries">
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
    <div class="button_wrapper" v-show="status != 'beforeDraw'">
      <v-btn @click="nextProgram" v-show="status == 'afterDraw'">{{
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
