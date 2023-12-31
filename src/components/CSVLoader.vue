<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import { Candidate, DisplaySetting } from '../myTypes'
import { readAnyEncoding } from '../util'
import CandidateViewer from './CandidateViewer.vue'
import CandidateViewSetting from './CandidateViewSetting.vue'
import Papa from 'papaparse';

const emit = defineEmits(['loadCandidates']);
const candidates:Ref<Candidate[]> = ref([]);
const displaySetting:Ref<DisplaySetting> = ref({
  top_pos:0,
  main_pos:1,
  bottom_pos:2,
});

function loadSampleCSV(){
  fetch("/sample.csv").then(res=>res.text()).then(res=>loadCSVText(res));
}

function loadCSVText(csvText:string){
  const rawData = Papa.parse(csvText).data as string[][];

  candidates.value = rawData.map((d,i)=>({
    id:i,
    data:d
  }));
}
async function loadCSVFile(e:Event){
  const [file] = (e.target as any).files;

  if (file===null) { return; }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const res = readAnyEncoding(reader)

    loadCSVText(res as string)
  });
  reader.readAsArrayBuffer(file);
}
function nextProgram(){
  emit("loadCandidates",{
    candidates:candidatesBody.value,
    displaySetting:displaySetting.value
  })
}

const useHeader = ref(true);

const candidatesHeader = computed(()=>{
  if(candidates.value.length<2){return []}
  const bodyFitstRow = candidates.value[1]
  return useHeader.value
    ? candidates.value.slice(0,1)[0].data
    : ['A','B','C','D','E','F','G'].slice(0,bodyFitstRow.data.length)
})
const candidatesBody = computed(()=>{
  return useHeader.value
    ? candidates.value.slice(1)
    : candidates.value
})

function updateDisplaySetting(newDisplaySetting:DisplaySetting){
  displaySetting.value = newDisplaySetting;
}
</script>

<template>
  <div class="program">
    <div class="loadingForm">
      <h1>抽選対象の読み込み</h1>
      <p><input type="file" accept="csv" @change="loadCSVFile"></p>
      <p>または<input type="button" value="サンプルを使う" @click="loadSampleCSV"></p>
    </div>
    <div class="previewWrapper">
      <div class="candidatesPreview">
        <label><input type="checkbox" v-model="useHeader">CSVファイルの見出し行を利用</label>
        <table>
          <tr>
            <th v-for="cell in candidatesHeader">{{ cell }}</th>
          </tr>
          <tr v-for="candidate in candidatesBody" :key="candidate.id">
            <td v-for="cell in candidate.data">{{ cell }}</td>
          </tr>
        </table>
      </div>
      <div class="displayPreview">
        <template v-if="candidatesBody && candidatesBody[0]">
          <p>表示順</p>
          <CandidateViewSetting :header="candidatesHeader" :display-setting="displaySetting" @change-setting="updateDisplaySetting"></CandidateViewSetting>
          <p>表示サンプル</p>
          <CandidateViewer :candidate="candidatesBody[0]" :display-setting="displaySetting"></CandidateViewer>
        </template>
      </div>
    </div>
    <div class="button_wrapper">
      <input type="button" value="次へ" @click="nextProgram" v-show="candidates.length>1">
    </div>
  </div>
</template>

<style scoped>
.loadingForm{
  width:100vw;
  padding:1rem 2rem;
  box-sizing: border-box;
  flex-shrink: 0;
}
.previewWrapper{
  width:100vw;
  height:100%;
  overflow-y:hidden;
  box-sizing: border-box;
  padding:0;
  display: flex;
  flex-direction:row;
  flex-shrink: 1;
}
.candidatesPreview{
  width:50vw;
  height:100%;
  box-sizing: border-box;
  overflow-y: scroll;
  padding:1rem 2rem;
}
.candidatesPreview tr:first-child{
  background: white;
  position: sticky;
  top: -1rem;
}
.candidatesPreview td, .candidatesPreview th{
  padding:0 1em;
}

.displayPreview{
  width:50vw;
  height:100%;
  box-sizing: border-box;
  overflow-y: scroll;
  padding:1rem 2rem;
}
</style>
