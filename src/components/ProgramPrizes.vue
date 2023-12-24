<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Person, Prize } from '../myTypes'
import NameLottery from './NameLottery.vue'
const emit = defineEmits(['finishProgram'])

const props = defineProps<{
  program:Prize,
  winners:Person[],
  candidates:Person[]
}>()

let lotteries:InstanceType<typeof NameLottery>[] = []

const lotteryEls = (el:InstanceType<typeof NameLottery>) => {
  lotteries.push(el)
}

const status: Ref<"beforeDraw"|"drawing"|"afterDraw"> = ref("beforeDraw")


let decidedCount = 0;
function draw(){
  decidedCount = 0;
  status.value = "drawing";

  let timing = 5*1000;
  lotteries.forEach((lottery)=>{
    if(Math.random()<0.2){
      timing += 500;
      lottery.draw(timing,1);
    }else{
      lottery.draw(timing,0);
    }
    timing += 2*1000;
  })
}

function decided(){
  decidedCount++;
  if(decidedCount==props.winners.length){
    status.value = "afterDraw"
  }
}

function nextProgram(){
  status.value = "beforeDraw";
  lotteries= [];
  emit("finishProgram");
}

</script>

<template>
  <h1>{{ program.prize_name }}</h1>
  <img v-if="program.img" v-show="status=='beforeDraw'" :src="program.img">
  <button v-show="status=='beforeDraw'" @click="draw">抽選スタート</button>

  <div v-show="status!='beforeDraw'" class="lotteries">
    <template v-for="winner in winners">
      <NameLottery :winner="winner" :candidates="candidates" :ref="lotteryEls" @finish-draw="decided"></NameLottery>
    </template>
  </div>

  <input v-show="status=='afterDraw'" type="button" value="次へ" @click="nextProgram">
</template>

<style scoped>
.lotteries{
  display: flex;
}
</style>
