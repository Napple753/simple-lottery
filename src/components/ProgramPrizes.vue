<script setup lang="ts">
import { ref, Ref } from "vue";
import { Candidate, DisplaySetting, Prize } from "../myTypes";
import NameLottery from "./NameLottery.vue";
const emit = defineEmits(["finishProgram"]);

const props = defineProps<{
  program: Prize;
  winners: Candidate[];
  candidates: Candidate[];
  displaySetting: DisplaySetting;
}>();

let lotteries: InstanceType<typeof NameLottery>[] = [];

const lotteryEls = (el: InstanceType<typeof NameLottery>) => {
  lotteries.push(el);
  return "lotteryEls";
};

const status: Ref<"beforeDraw" | "drawing" | "afterDraw"> = ref("beforeDraw");

let decidedCount = 0;
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
}

function decided() {
  decidedCount++;
  if (decidedCount == props.winners.length) {
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
      <input type="button" value="抽選スタート" @click="draw" />
    </div>

    <div v-show="status != 'beforeDraw'" class="lotteries">
      <template v-for="winner in winners">
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
      <input
        v-show="status == 'afterDraw'"
        type="button"
        value="次へ"
        @click="nextProgram"
      />
    </div>
  </div>
</template>

<style scoped>
.prizeImage {
  height: 100%;
  text-align: center;
}

.prizeImage img {
  height: 100%;
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
  margin: auto;
  width: calc(calc(100% / var(--length)) - 1rem);
}
</style>
