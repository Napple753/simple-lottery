<script setup lang="ts">
import { ref } from 'vue'
import { DisplaySetting } from '../myTypes'

const emit = defineEmits(['changeSetting']);
const props = defineProps<{
  displaySetting: DisplaySetting,
  header: string[]
 }>()

 const top_pos = ref(props.displaySetting.top_pos)
 const main_pos = ref(props.displaySetting.main_pos)
 const bottom_pos = ref(props.displaySetting.bottom_pos)

function updateDisplaySetting(){
  emit("changeSetting",{
    top_pos:top_pos.value,
    main_pos:main_pos.value,
    bottom_pos:bottom_pos.value
  })
}

</script>

<template>
  <div class="candidate_wrapper">
    <div class="candidate">
      <p class="top_info">
        <select v-model="top_pos" @change="updateDisplaySetting">
          <option value="-1"></option>
          <option v-for="(item,i) in header" 
            :value="i">
          {{ item }}
          </option>
        </select>
      </p>
      <p class="main_info">
        <select v-model="main_pos" @change="updateDisplaySetting">
          <option value="-1"></option>
          <option v-for="(item,i) in header" 
            v-bind:value="i" 
            v-bind:key="i">
          {{ item }}
          </option>
        </select>
      </p>
      <p class="bottom_info">
        <select v-model="bottom_pos" @change="updateDisplaySetting">
          <option value="-1"></option>
          <option v-for="(item,i) in header" 
            v-bind:value="i" 
            v-bind:key="i">
          {{ item }}
          </option>
        </select>
      </p>
    </div>
  </div>
</template>

<style scoped>
.candidate_wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  padding:0;
  user-select: all;
  break-inside: avoid;
}
</style>
