<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Candidate, DisplaySetting } from '../myTypes'
import { wait, shuffleArray, loadMusic, getDummyList } from '../util'
import CandidateViewer from './CandidateViewer.vue'
const emit = defineEmits(['finishDraw'])

const props = defineProps<{
  winner: Candidate|null,
  candidates:Candidate[],
  isSimple?:Boolean //表示を省略するかどうか
  displaySetting:DisplaySetting
}>()

const bottom_pos:Ref<number> = ref(0);
const transition_duration:Ref<number> = ref(0);
const isDeciding:Ref<boolean> = ref(false);

const displayWinner:Ref<Candidate|null> = ref(null);
const displayCandidates:Ref<Candidate[]> = ref([]);

const decidedMusic =  loadMusic("decided.mp3");

const uniqueID = ref(Date.now())



async function moveTo(pos:number, time:number=0){
  transition_duration.value=time;
  bottom_pos.value = pos;
  await wait(Math.max(time,10))
  transition_duration.value=0;
}

async function draw(drawingTime=10*1000,teasing:number|undefined=undefined){
  //const targetTS = Date.now() + drawingTime;
  const unitTime = 500//一人あたりの表示時間
  const simpleDrawingTime = 6000;

  isDeciding.value=false;
  const winner = props.winner;
  if(props.candidates.length<=0 || winner==null){
    return;
  }

  const isSimple = props.isSimple && (drawingTime > simpleDrawingTime);

  const waitingTime = isSimple?simpleDrawingTime:drawingTime;

  const displayCandidateCount = Math.ceil(waitingTime/unitTime*2);
  await moveTo(-displayCandidateCount * 100, 0);//表示時間をもとにくじに出す人数を決定
  if(isSimple){
   await wait(drawingTime - simpleDrawingTime);
  }
  
  displayCandidates.value = getDummyList(props.candidates,displayCandidateCount,winner);
  displayWinner.value = winner;
  if(teasing===undefined){
    teasing = Math.ceil((Math.random()*2)**2)-1;//一旦停止する人数
  }
  
  await moveTo(-teasing * 95, waitingTime - unitTime*teasing);
  for(let i=(teasing-1);i>=0;i--){
    await moveTo(-i * 95, unitTime-50);
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
      <div v-for="candidate in displayCandidates" :key="uniqueID+candidate.id">
        <CandidateViewer :candidate="candidate" :display-setting="displaySetting" :key="uniqueID+candidate.id"></CandidateViewer>
      </div>
      <div v-if="displayWinner">
        <CandidateViewer :candidate="displayWinner" :display-setting="displaySetting" :key="uniqueID+displayWinner.id"></CandidateViewer>
      </div>
    </div>
    <div class="loader" v-show="displayCandidates.length===0"></div>
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

  /* HTML: <div class="loader"></div> */
  .loader {
    width: 60px;
    height: 100%;
    aspect-ratio: 4;
    background: radial-gradient(circle closest-side,#888 90%,#8880) 0/calc(100%/3) 100% space;
    clip-path: inset(0 100% 0 0);
    animation: l1 1s steps(4) infinite;
    margin:auto;
    vertical-align: middle;
  }
  @keyframes l1 {to{clip-path: inset(0 -34% 0 0)}}
</style>
