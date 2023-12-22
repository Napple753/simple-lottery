<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Person } from '../myTypes'
import PrizeLottery from './PrizeLottery.vue'

const props = defineProps<{
  
}>()

const prizeElements:InstanceType<typeof PrizeLottery>[] = [];

const prizeEls = (el:InstanceType<typeof PrizeLottery>) => {
  prizeElements.push(el)
}

const prizes = [
    {prizeName:"頑張ったで賞",num:1},
    {prizeName:"運がいいで賞",num:5},
    {prizeName:"けっこう運がいいで賞",num:3},
    {prizeName:"すごく運がいいで賞",num:1},
];


</script>

<template>
  <h1>{{ prizeName }}</h1>
  <div class="lotteries">
    <template v-for="winner in winners">
      <PrizeLottery :ref="prizeEls"></PrizeLottery>
    </template>
  </div>
</template>

<style scoped>
.lotteries{
  display: flex;
}
</style>
