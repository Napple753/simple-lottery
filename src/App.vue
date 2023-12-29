<script setup lang="ts">

import { ref, Ref } from 'vue'
//import DisplayName from './components/DisplayName.vue'
import LoadCSV from './components/LoadCSV.vue'
import ProgramMessage from './components/ProgramMessage.vue'
import ProgramDisplayWinners from './components/ProgramDisplayWinners.vue'
import ProgramPrizes from './components/ProgramPrizes.vue'
import {Person, Program} from './myTypes.ts'
import { wait, shuffleArray, loadMusic } from './util'
import { parse as JSONCParse } from 'jsonc-parser';

const dummy:Ref<Person[]> = ref([]);
let remainingCandidate:Person[] = [];
const winners:Ref<Person[]> = ref([]);

let program_list: Program[] = [];
let program_number = 0;

const programStarted = ref(false);

const program:Ref<Program|null> = ref(null);

fetch("./setting.jsonc").then(res=>res.text()).then(text=>JSONCParse(text)).then(o=>{
  program_list=o.program;
});

function nextPrg(){
  program.value = program_list[program_number];
  if(program.value.type=="PRIZE"){
    const winner_number = program.value.winner_number
    winners.value = winners.value = shuffleArray(remainingCandidate).slice(0,winner_number);
  }
  program_number++;
}

function setCandidates(names:Person[]){
  console.log("setCandidates",names);
  remainingCandidate = shuffleArray(names);
  dummy.value = structuredClone(names);
  programStarted.value = true;

  nextPrg();
}
</script>

<template>
  <LoadCSV @load-names="setCandidates" v-show="!programStarted"></LoadCSV>
  
  
  <ProgramMessage v-if="program && program.type=='MESSAGE'" :program="program" @finish-program="nextPrg"></ProgramMessage>
  <ProgramPrizes  v-if="program && program.type=='PRIZE'"
    :candidates="dummy" :winners="winners" :program="program"
    @finish-program="nextPrg"></ProgramPrizes>
  <ProgramDisplayWinners v-if="program && program.type=='DISPLAY_WINNERS'" :program="program" @finish-program="nextPrg"></ProgramDisplayWinners>

</template>

<style>
html,body,#app{
  height:100%;
  width:100%;
  margin:0;
  padding:0;
  box-sizing: border-box;
}
body{
  padding:1px;
}
h1{
  text-align: center;
}
.program{
  display:flex;
  flex-direction: column;
  height:100%;
  justify-content:flex-start;

  padding:1rem 2rem;
  box-sizing: border-box;
}

.button_wrapper{
  width:80%;
  height: 2rem;
  text-align: right;
  margin-bottom:1rem;
}
</style>
