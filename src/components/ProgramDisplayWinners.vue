<script setup lang="ts">
import { ref } from 'vue'
import { DisplayWinner } from '../myTypes'
const emit = defineEmits(['finishProgram'])

defineProps<{ program: DisplayWinner }>()

function nextProgram(){
  emit("finishProgram");
}

</script>

<template>
  <div class="program">
    <p>Display Winners[ToDo]</p>
    <div class="button_wrapper">
      <input type="button" value="次へ" @click="nextProgram">
    </div>
  </div>
</template>

<style scoped>

</style>
