<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Person } from '../myTypes'
import { wait, shuffleArray, loadMusic } from '../util'
import DisplayName from './DisplayName.vue'
const emit = defineEmits(['finishDraw'])

const props = defineProps<{
  winner: Person|null,
  candidates:Person[]
}>()

const bottom_pos:Ref<number> = ref(0);
const transition_duration:Ref<number> = ref(0);
const isDeciding:Ref<boolean> = ref(false);

const displayWinner:Ref<Person|null> = ref(null);
const displayCandidates:Ref<Person[]> = ref([]);

const decidedMusic =  loadMusic("decided.mp3");



async function moveTo(pos:number, time:number=0){
  console.log(pos)
  transition_duration.value=time;
  bottom_pos.value = pos;
  await wait(Math.max(time,10))
  transition_duration.value=0;
}

async function draw(time=10*1000,teasing:number|undefined=undefined){

  isDeciding.value=false;
  const winner = props.winner;
  if(props.candidates.length<=0 || winner==null){
    return;
  }
  displayCandidates.value = shuffleArray(props.candidates.filter(p=>p.id!==winner.id));
  displayWinner.value = winner;
  const ts = Date.now()
  //const time=10*1000
  const UT = 500//一人あたりの表示時間
  if(teasing===undefined){
    teasing = Math.ceil((Math.random()*2)**2)-1;//一旦停止する人数
  }
  
  await moveTo(-Math.ceil(time/UT*2) * 100, 0);//表示時間をもとにくじに出す人数を決定
  
  await moveTo(-teasing * 95, time - UT*teasing);
  for(let i=(teasing-1);i>=0;i--){
    await moveTo(-i * 95, UT-50);
    await wait(50);
  }
  decidedMusic.play();
  await wait(50);
  isDeciding.value=true;
  
  emit("finishDraw");
}

defineExpose({draw});



</script>

<template>
  <div class="lottery" :class="{isDeciding:isDeciding}">
    <div class="inner" :style="{bottom:bottom_pos+'%', transitionDuration: transition_duration +'ms'}">
      <div v-for="candidate in displayCandidates">
        <DisplayName :person="candidate"></DisplayName>
      </div>
      <div v-if="displayWinner">
        <DisplayName :person="displayWinner"></DisplayName>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .lottery{
    height:10rem;
    width:20rem;
    box-sizing: border-box;
    overflow: hidden;
    position:relative;
    box-shadow: inset .2rem .2rem 1rem rgba(0,0,0,.5);
    border:1px grey solid;
  }
  .inner{
    width:100%;
    height:100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;


    transition-property: bottom;
    /*transition-timing-function: ease-out;*/
  }
  .isDeciding{
    background-color: yellow;
    color:red;
    box-shadow: none;
  }

  .isDeciding .inner{
    transform: scale(1.25);
    transform-origin: center center;
    transition: transform .5s;
  }
</style>
