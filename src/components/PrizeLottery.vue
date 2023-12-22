<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Person } from '../myTypes'
import NameLottery from './NameLottery.vue'

const props = defineProps<{
  prizeName:String,
  winners:Person[],
  candidates:Person[]
}>()

const lotteries:InstanceType<typeof NameLottery>[] = []

const lotteryEls = (el:InstanceType<typeof NameLottery>) => {
  lotteries.push(el)
}

function draw(){
  console.log(lotteries);

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


</script>

<template>
  <h1>{{ prizeName }}</h1>
  <button @click="draw">抽選スタート</button>
  <div class="lotteries">
    <template v-for="winner in winners">
      <NameLottery :winner="winner" :candidates="candidates" :ref="lotteryEls"></NameLottery>
    </template>
  </div>
</template>

<style scoped>
.lotteries{
  display: flex;
}
</style>
