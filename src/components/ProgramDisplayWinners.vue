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
  <div>
    <p>Display Winners[ToDo]</p>
    <input type="button" value="次へ" @click="nextProgram">
  </div>
</template>

<style scoped>

</style>
