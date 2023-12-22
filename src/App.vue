<script setup lang="ts">

import { ref, Ref } from 'vue'
//import DisplayName from './components/DisplayName.vue'
import LoadCSV from './components/LoadCSV.vue'
import {Person} from './myTypes.ts'
import { wait, shuffleArray, loadMusic } from './util'
import PrizeLottery from './components/PrizeLottery.vue'

const candidates:Ref<Person[]> = ref([]);
const winners:Ref<Person[]> = ref([])

function setNames(names:Person[]){
  winners.value = shuffleArray(names).slice(0,5);
  candidates.value = names;
}
</script>

<template>
  <LoadCSV @load-names="setNames"></LoadCSV>
  <PrizeLottery :candidates="candidates" :winners="winners" prizeName="Hell Word賞"></PrizeLottery>
</template>

<style scoped>
</style>
