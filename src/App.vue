<script setup lang="ts">

import { ref, Ref } from 'vue'
//import DisplayName from './components/DisplayName.vue'
import LoadCSV from './components/LoadCSV.vue'
import LoadProgram from './components/LoadProgram.vue'
import ProgramMessage from './components/ProgramMessage.vue'
import ProgramDisplayWinners from './components/ProgramDisplayWinners.vue'
import ProgramPrizes from './components/ProgramPrizes.vue'
import { Person, Program, Log, Settings } from './myTypes.ts'
import { wait, shuffleArray, loadMusic, LotteryBox } from './util'

let lotteryBox:LotteryBox<Person>;
const winners_log:Ref<Log<Person>> = ref([]);

const dummy:Ref<Person[]> = ref([]);
const winners:Ref<Person[]> = ref([]);

let program_list: Program[] = [];
const program_number = ref(0);

const programLoaded = ref(false);
const programStarted = ref(false);

const program:Ref<Program|null> = ref(null);

function loadSetting(settings:Settings){
  window.document.title = settings.program_name;
  program_list = settings.program;
  programLoaded.value = true;
}

function setCandidates(names:Person[]){
  console.log("setCandidates",names);
  dummy.value = structuredClone(names);
  programStarted.value = true;

  lotteryBox = new LotteryBox<Person>(names)

  nextPrg();
}

function nextPrg(){
  if(lotteryBox===null){ return; }
  program.value = program_list[program_number.value];
  if(program.value.type==="PRIZE"){
    const prize_name = program.value.prize_name;
    const winner_number = program.value.winner_number;
    winners.value = lotteryBox.draw(prize_name, winner_number)
  }else if(program.value.type==="DISPLAY_WINNERS"){
    winners_log.value = lotteryBox.log;
  }
  program_number.value = Math.min(program_number.value+1,program_list.length-1);
}

</script>

<template>
  <LoadProgram @load-settings="loadSetting" v-show="!programLoaded"></LoadProgram>
  <LoadCSV @load-names="setCandidates" v-show="programLoaded && !programStarted"></LoadCSV>
  
  
  <ProgramMessage v-if="program && program.type=='MESSAGE'" :program="program" :key="program_number" @finish-program="nextPrg"></ProgramMessage>
  <ProgramPrizes  v-if="program && program.type=='PRIZE'"
    :candidates="dummy" :winners="winners" :program="program" :key="program_number" 
    @finish-program="nextPrg"></ProgramPrizes>
  <ProgramDisplayWinners v-if="program && program.type=='DISPLAY_WINNERS'"
    :program="program" :key="program_number"
    :winners-log="winners_log"
    @finish-program="nextPrg"></ProgramDisplayWinners>

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
  align-items: center;
}

.button_wrapper{
  width:80%;
  height: 2rem;
  text-align: right;
  margin-bottom:1rem;
}
</style>
