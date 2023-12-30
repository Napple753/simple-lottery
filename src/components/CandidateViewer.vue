<script setup lang="ts">
import { ref } from 'vue'
import { Candidate, DisplaySetting } from '../myTypes'

defineProps<{ 
  candidate: Candidate,
  displaySetting: DisplaySetting
 }>()


</script>

<template>
  <div class="candidate_wrapper">
    <div class="candidate">
      <p class="top_info">{{ candidate.data[displaySetting.top_pos] }}</p>
      <p class="main_info">{{ candidate.data[displaySetting.main_pos] }}</p>
      <p class="bottom_info">{{ candidate.data[displaySetting.bottom_pos] }}</p>
    </div>
  </div>
</template>

<style scoped>
.candidate_wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:10rem;
  width:100%;
  box-sizing: border-box;
  border:1px solid grey;
}
.candidate{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:100%;
  width:80%;
  box-sizing: border-box;
  margin:0;
  padding:0;
  flex-shrink: 0;
}
.candidate p{
  margin:0;
  user-select: all;
  break-inside: avoid;
}

.top_info{
  font-size: 1rem;
}
.main_info{
  font-size: 2rem;
  font-weight: 800;
}
.bottom_info{
  font-size:1rem;
}
</style>
